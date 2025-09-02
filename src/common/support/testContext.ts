/**
 * Test Context Management Module
 * 
 * This module provides centralized test context management for the BDD framework.
 * It handles browser instances, test data storage, screenshots, and attachments
 * across test scenarios with proper lifecycle management.
 * 
 * Key Features:
 * - Singleton pattern for global context management
 * - Browser and page lifecycle management
 * - Test data storage and retrieval
 * - Screenshot and attachment handling
 * - Automatic cleanup and resource management
 * - Event listeners for browser debugging
 * - Context isolation between test scenarios
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Browser, BrowserContext, Page } from '@playwright/test';
import { loadConfig } from '../../../config';
import { logger } from '../../utils/logger';
import type { Config } from '../../../config/schema';

/**
 * Interface defining the structure of a test context
 * Contains all resources and data needed for a test scenario
 */
export interface TestContext {
  /** Playwright browser instance */
  browser: Browser | null;
  /** Browser context for isolation */
  context: BrowserContext | null;
  /** Active page instance */
  page: Page | null;
  
  /** Environment configuration */
  config: Config;
  
  /** Key-value storage for test data */
  testData: Map<string, any>;
  
  /** Collection of captured screenshots */
  screenshots: Buffer[];
  /** Collection of test attachments */
  attachments: Array<{ name: string; contentType: string; body: Buffer }>;
}

/**
 * Singleton class for managing multiple test contexts
 * Provides centralized control over browser resources and test data
 */
export class TestContextManager {
  private static instance: TestContextManager;
  private contexts: Map<string, TestContext> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of TestContextManager
   * @returns The singleton TestContextManager instance
   */
  static getInstance(): TestContextManager {
    if (!TestContextManager.instance) {
      TestContextManager.instance = new TestContextManager();
    }
    return TestContextManager.instance;
  }

  /**
   * Creates a new test context with the specified ID
   * @param contextId - Unique identifier for the test context
   * @returns Newly created TestContext instance
   */
  createContext(contextId: string): TestContext {
    const config = loadConfig();
    
    const context: TestContext = {
      browser: null,
      context: null,
      page: null,
      config,
      testData: new Map(),
      screenshots: [],
      attachments: [],
    };

    this.contexts.set(contextId, context);
    logger.debug(`Created test context: ${contextId}`);
    
    return context;
  }

  /**
   * Retrieves an existing test context by ID
   * @param contextId - Unique identifier for the test context
   * @returns TestContext instance or null if not found
   */
  getContext(contextId: string): TestContext | null {
    return this.contexts.get(contextId) || null;
  }

  /**
   * Initializes browser resources for a test context
   * Sets up browser context, page, and event listeners
   * @param contextId - Unique identifier for the test context
   * @param browser - Playwright browser instance to use
   */
  async initializeBrowser(contextId: string, browser: Browser): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.browser = browser;
    
    // Create browser context with standard settings
    testContext.context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: false,
      acceptDownloads: true,
    });

    // Create page instance
    testContext.page = await testContext.context.newPage();
    
    // Set up comprehensive event listeners for debugging
    testContext.page.on('console', msg => {
      logger.debug(`Browser console [${msg.type()}]: ${msg.text()}`);
    });

    testContext.page.on('pageerror', error => {
      logger.error(`Browser page error: ${error.message}`);
    });

    testContext.page.on('requestfailed', request => {
      logger.warn(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    logger.info(`Browser initialized for context: ${contextId}`);
  }

  /**
   * Captures a screenshot of the current page
   * @param contextId - Unique identifier for the test context
   * @param name - Optional name for the screenshot attachment
   * @returns Screenshot buffer or null if capture fails
   */
  async captureScreenshot(contextId: string, name?: string): Promise<Buffer | null> {
    const testContext = this.getContext(contextId);
    if (!testContext?.page) {
      logger.warn(`Cannot capture screenshot: no page available for context ${contextId}`);
      return null;
    }

    try {
      const screenshot = await testContext.page.screenshot({
        fullPage: true,
        type: 'png',
      });

      testContext.screenshots.push(screenshot);
      
      if (name) {
        testContext.attachments.push({
          name: `${name}.png`,
          contentType: 'image/png',
          body: screenshot,
        });
      }

      logger.debug(`Screenshot captured for context: ${contextId}`);
      return screenshot;
    } catch (error) {
      logger.error(`Failed to capture screenshot for context ${contextId}: ${error}`);
      return null;
    }
  }

  /**
   * Adds an attachment to the test context
   * @param contextId - Unique identifier for the test context
   * @param name - Name of the attachment
   * @param contentType - MIME type of the attachment
   * @param body - Binary content of the attachment
   */
  async addAttachment(contextId: string, name: string, contentType: string, body: Buffer): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.attachments.push({ name, contentType, body });
    logger.debug(`Attachment added to context ${contextId}: ${name}`);
  }

  /**
   * Stores test data in the context
   * @param contextId - Unique identifier for the test context
   * @param key - Data key
   * @param value - Data value
   */
  setTestData(contextId: string, key: string, value: any): void {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.testData.set(key, value);
    logger.debug(`Test data set for context ${contextId}: ${key}`);
  }

  /**
   * Retrieves test data from the context
   * @param contextId - Unique identifier for the test context
   * @param key - Data key to retrieve
   * @returns Stored data value or undefined if not found
   */
  getTestData<T = any>(contextId: string, key: string): T | undefined {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    return testContext.testData.get(key) as T;
  }

  /**
   * Cleans up a specific test context and releases all resources
   * @param contextId - Unique identifier for the test context to cleanup
   */
  async cleanupContext(contextId: string): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      return;
    }

    logger.info(`Cleaning up test context: ${contextId}`);

    // Close browser resources gracefully
    if (testContext.page) {
      try {
        await testContext.page.close();
      } catch (error) {
        logger.warn(`Failed to close page for context ${contextId}: ${error}`);
      }
    }

    if (testContext.context) {
      try {
        await testContext.context.close();
      } catch (error) {
        logger.warn(`Failed to close browser context for context ${contextId}: ${error}`);
      }
    }

    // Clear all stored data
    testContext.testData.clear();
    testContext.screenshots.length = 0;
    testContext.attachments.length = 0;

    this.contexts.delete(contextId);
    logger.info(`Test context cleaned up: ${contextId}`);
  }

  /**
   * Cleans up all active test contexts
   * Used for global cleanup at test suite completion
   */
  async cleanupAllContexts(): Promise<void> {
    logger.info('Cleaning up all test contexts');
    
    const cleanupPromises = Array.from(this.contexts.keys()).map(contextId => 
      this.cleanupContext(contextId)
    );
    
    await Promise.all(cleanupPromises);
    
    logger.info('All test contexts cleaned up');
  }

  /**
   * Gets a list of all active context IDs
   * @returns Array of active context identifiers
   */
  getActiveContexts(): string[] {
    return Array.from(this.contexts.keys());
  }

  /**
   * Gets the number of active contexts
   * @returns Count of active test contexts
   */
  getContextCount(): number {
    return this.contexts.size;
  }
}

// Global current context management for convenience
let currentContextId: string | null = null;

/**
 * Sets the current active context ID for convenience functions
 * @param contextId - Context ID to set as current
 */
export function setCurrentContext(contextId: string): void {
  currentContextId = contextId;
}

/**
 * Gets the current active test context
 * @returns Current TestContext instance or null
 */
export function getCurrentContext(): TestContext | null {
  if (!currentContextId) {
    return null;
  }
  return TestContextManager.getInstance().getContext(currentContextId);
}

/**
 * Gets the current active page instance
 * @returns Current Page instance or null
 */
export function getCurrentPage(): Page | null {
  const context = getCurrentContext();
  return context?.page || null;
}

/**
 * Gets the current configuration
 * @returns Current Config instance or null
 */
export function getCurrentConfig(): Config | null {
  const context = getCurrentContext();
  return context?.config || null;
}
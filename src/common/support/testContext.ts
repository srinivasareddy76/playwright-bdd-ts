import { Browser, BrowserContext, Page } from '@playwright/test';
import { loadConfig } from '../../../config';
import { logger } from '../../utils/logger';
import type { Config } from '../../../config/schema';

export interface TestContext {
  // Browser-related
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  
  // Configuration
  config: Config;
  
  // Test data storage
  testData: Map<string, any>;
  
  // Screenshots and attachments
  screenshots: Buffer[];
  attachments: Array<{ name: string; contentType: string; body: Buffer }>;
}

export class TestContextManager {
  private static instance: TestContextManager;
  private contexts: Map<string, TestContext> = new Map();

  private constructor() {}

  static getInstance(): TestContextManager {
    if (!TestContextManager.instance) {
      TestContextManager.instance = new TestContextManager();
    }
    return TestContextManager.instance;
  }

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

  getContext(contextId: string): TestContext | null {
    return this.contexts.get(contextId) || null;
  }

  async initializeBrowser(contextId: string, browser: Browser): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.browser = browser;
    
    // Create browser context
    testContext.context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: false,
      acceptDownloads: true,
    });

    // Create page
    testContext.page = await testContext.context.newPage();
    
    // Set up page event listeners
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

  async addAttachment(contextId: string, name: string, contentType: string, body: Buffer): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.attachments.push({ name, contentType, body });
    logger.debug(`Attachment added to context ${contextId}: ${name}`);
  }

  setTestData(contextId: string, key: string, value: any): void {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    testContext.testData.set(key, value);
    logger.debug(`Test data set for context ${contextId}: ${key}`);
  }

  getTestData<T = any>(contextId: string, key: string): T | undefined {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      throw new Error(`Test context not found: ${contextId}`);
    }

    return testContext.testData.get(key) as T;
  }

  async cleanupContext(contextId: string): Promise<void> {
    const testContext = this.getContext(contextId);
    if (!testContext) {
      return;
    }

    logger.info(`Cleaning up test context: ${contextId}`);

    // Close browser resources
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

    // Clear test data
    testContext.testData.clear();
    testContext.screenshots.length = 0;
    testContext.attachments.length = 0;

    this.contexts.delete(contextId);
    logger.info(`Test context cleaned up: ${contextId}`);
  }

  async cleanupAllContexts(): Promise<void> {
    logger.info('Cleaning up all test contexts');
    
    const cleanupPromises = Array.from(this.contexts.keys()).map(contextId => 
      this.cleanupContext(contextId)
    );
    
    await Promise.all(cleanupPromises);
    
    logger.info('All test contexts cleaned up');
  }

  getActiveContexts(): string[] {
    return Array.from(this.contexts.keys());
  }

  getContextCount(): number {
    return this.contexts.size;
  }
}

// Convenience functions for the current context
let currentContextId: string | null = null;

export function setCurrentContext(contextId: string): void {
  currentContextId = contextId;
}

export function getCurrentContext(): TestContext | null {
  if (!currentContextId) {
    return null;
  }
  return TestContextManager.getInstance().getContext(currentContextId);
}

export function getCurrentPage(): Page | null {
  const context = getCurrentContext();
  return context?.page || null;
}

export function getCurrentConfig(): Config | null {
  const context = getCurrentContext();
  return context?.config || null;
}
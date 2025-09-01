/**
 * Cucumber Hooks and World Configuration
 * 
 * This module defines the test execution lifecycle hooks and custom World class
 * for the BDD framework. It manages browser instances, test contexts, and
 * provides comprehensive setup/teardown functionality for test scenarios.
 * 
 * Key Features:
 * - Custom World class extending Cucumber's World with browser capabilities
 * - Global browser instance management for performance optimization
 * - Automatic screenshot capture on test failures
 * - Environment validation and directory setup
 * - Test context isolation between scenarios
 * - Performance tracking and debug information collection
 * - Comprehensive error handling and logging
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Before, After, BeforeAll, AfterAll, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { TestContextManager, TestContext, setCurrentContext } from '../support/testContext';
import { validateCurrentEnvironment } from '../support/env';
import { logger } from '../../utils/logger';
import { PathUtils } from '../../utils/paths';

/**
 * Custom World class that extends Cucumber's World with browser capabilities
 * Provides test context management and convenience methods for browser interactions
 */
class CustomWorld extends World {
  /** Unique identifier for this scenario's test context */
  public contextId: string;
  /** Test context instance containing browser resources and data */
  public testContext: TestContext;
  /** Singleton context manager for resource management */
  public contextManager: TestContextManager;

  /**
   * Creates a new CustomWorld instance for a test scenario
   * @param options - Cucumber world options
   */
  constructor(options: any) {
    super(options);
    this.contextId = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.contextManager = TestContextManager.getInstance();
    this.testContext = this.contextManager.createContext(this.contextId);
    setCurrentContext(this.contextId);
    
    logger.info(`Created world for scenario: ${this.contextId}`);
  }

  // ==================== Convenience Getters ====================

  /**
   * Gets the current Playwright page instance
   * @returns Current page or null if not initialized
   */
  get page(): Page | null {
    return this.testContext.page;
  }

  /**
   * Gets the current browser context instance
   * @returns Current browser context or null if not initialized
   */
  get context(): BrowserContext | null {
    return this.testContext.context;
  }

  /**
   * Gets the current browser instance
   * @returns Current browser or null if not initialized
   */
  get browser(): Browser | null {
    return this.testContext.browser;
  }

  /**
   * Gets the current environment configuration
   * @returns Environment configuration object
   */
  get config() {
    return this.testContext.config;
  }

  // ==================== Helper Methods ====================

  /**
   * Initializes a new browser instance for this scenario
   * Creates browser with appropriate settings for the environment
   */
  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      const browser = await chromium.launch({
        headless: process.env.CI === 'true' || process.env.HEADLESS === 'true',
        slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
        args: [
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
      
      await this.contextManager.initializeBrowser(this.contextId, browser);
    }
  }

  /**
   * Captures a screenshot and attaches it to the test report
   * @param name - Optional name for the screenshot
   */
  async captureScreenshot(name?: string): Promise<void> {
    const screenshot = await this.contextManager.captureScreenshot(this.contextId, name);
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }

  /**
   * Stores test data in the scenario context
   * @param key - Data key
   * @param value - Data value
   */
  setTestData(key: string, value: any): void {
    this.contextManager.setTestData(this.contextId, key, value);
  }

  /**
   * Retrieves test data from the scenario context
   * @param key - Data key to retrieve
   * @returns Stored data value or undefined
   */
  getTestData<T = any>(key: string): T | undefined {
    return this.contextManager.getTestData<T>(this.contextId, key);
  }
}

// Set the custom world constructor for Cucumber
setWorldConstructor(CustomWorld);

/** Global browser instance shared across scenarios for performance */
let globalBrowser: Browser | null = null;

/**
 * BeforeAll hook - runs once before all test scenarios
 * Performs global setup including environment validation and browser launch
 */
BeforeAll(async function () {
  logger.info('='.repeat(80));
  logger.info('STARTING TEST EXECUTION');
  logger.info('='.repeat(80));

  // Validate environment configuration before starting tests
  const validation = validateCurrentEnvironment();
  if (!validation.isValid) {
    logger.error('Environment validation failed:');
    validation.errors.forEach(error => logger.error(`  - ${error}`));
    throw new Error(`Environment validation failed: ${validation.errors.join(', ')}`);
  }

  // Ensure required directories exist
  PathUtils.ensureDirectoryExists(PathUtils.getTestResultsPath());
  PathUtils.ensureDirectoryExists(PathUtils.getSecretsPath());

  // Launch global browser instance for reuse across scenarios
  try {
    globalBrowser = await chromium.launch({
      headless: process.env.CI === 'true' || process.env.HEADLESS === 'true',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    logger.info('Global browser launched successfully');
  } catch (error) {
    logger.error(`Failed to launch global browser: ${error}`);
    throw error;
  }

  logger.info('Test suite initialization completed');
});

/**
 * Before hook - runs before each test scenario
 * Sets up scenario-specific context and initializes browser resources
 */
Before(async function (this: CustomWorld, scenario) {
  logger.info(`Starting scenario: ${scenario.pickle.name}`);
  logger.info(`Tags: ${scenario.pickle.tags.map(tag => tag.name).join(', ')}`);

  // Set scenario-specific context as current
  setCurrentContext(this.contextId);

  // Initialize browser context for this scenario using global browser
  if (globalBrowser) {
    await this.contextManager.initializeBrowser(this.contextId, globalBrowser);
  }

  // Set scenario start time for performance tracking
  this.setTestData('scenarioStartTime', Date.now());
});

/**
 * After hook - runs after each test scenario
 * Handles failure screenshots, debug information, and context cleanup
 */
After(async function (this: CustomWorld, scenario) {
  const scenarioEndTime = Date.now();
  const scenarioStartTime = this.getTestData<number>('scenarioStartTime') || scenarioEndTime;
  const duration = scenarioEndTime - scenarioStartTime;

  logger.info(`Scenario completed: ${scenario.pickle.name} (${duration}ms)`);

  // Handle test failures with comprehensive debugging
  if (scenario.result?.status === 'FAILED') {
    logger.warn(`Scenario failed: ${scenario.pickle.name}`);
    
    // Capture failure screenshot
    try {
      await this.captureScreenshot('failure');
      logger.info('Failure screenshot captured');
    } catch (error) {
      logger.warn(`Failed to capture screenshot: ${error}`);
    }

    // Attach comprehensive debug information
    try {
      const debugInfo = {
        scenario: scenario.pickle.name,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        environment: this.config.name,
        url: this.page?.url() || 'N/A',
        userAgent: 'N/A'
      };

      this.attach(JSON.stringify(debugInfo, null, 2), 'application/json');
    } catch (error) {
      logger.warn(`Failed to attach debug info: ${error}`);
    }
  }

  // Clean up scenario-specific resources
  await this.contextManager.cleanupContext(this.contextId);
  logger.debug(`Cleaned up context: ${this.contextId}`);
});

/**
 * AfterAll hook - runs once after all test scenarios
 * Performs global cleanup including browser closure and context cleanup
 */
AfterAll(async function () {
  logger.info('='.repeat(80));
  logger.info('CLEANING UP TEST EXECUTION');
  logger.info('='.repeat(80));

  // Clean up all remaining test contexts
  await TestContextManager.getInstance().cleanupAllContexts();

  // Close global browser instance
  if (globalBrowser) {
    try {
      await globalBrowser.close();
      globalBrowser = null;
      logger.info('Global browser closed successfully');
    } catch (error) {
      logger.warn(`Failed to close global browser: ${error}`);
    }
  }

  logger.info('Test suite cleanup completed');
  logger.info('='.repeat(80));
});

// ==================== Global Error Handling ====================

/**
 * Handle unhandled promise rejections to prevent silent failures
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Handle uncaught exceptions with proper logging and exit
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export the CustomWorld class for use in step definitions
export { CustomWorld };
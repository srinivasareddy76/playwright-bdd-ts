import { Before, After, BeforeAll, AfterAll, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { TestContextManager, TestContext, setCurrentContext } from '../support/testContext';
import { validateCurrentEnvironment } from '../support/env';
import { logger } from '../../utils/logger';
import { PathUtils } from '../../utils/paths';

// Custom World class that extends Cucumber's World
class CustomWorld extends World {
  public contextId: string;
  public testContext: TestContext;
  public contextManager: TestContextManager;

  constructor(options: any) {
    super(options);
    this.contextId = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.contextManager = TestContextManager.getInstance();
    this.testContext = this.contextManager.createContext(this.contextId);
    setCurrentContext(this.contextId);
    
    logger.info(`Created world for scenario: ${this.contextId}`);
  }

  // Convenience getters
  get page(): Page | null {
    return this.testContext.page;
  }

  get context(): BrowserContext | null {
    return this.testContext.context;
  }

  get browser(): Browser | null {
    return this.testContext.browser;
  }

  get config() {
    return this.testContext.config;
  }

  // Helper methods
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

  async captureScreenshot(name?: string): Promise<void> {
    const screenshot = await this.contextManager.captureScreenshot(this.contextId, name);
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }

  setTestData(key: string, value: any): void {
    this.contextManager.setTestData(this.contextId, key, value);
  }

  getTestData<T = any>(key: string): T | undefined {
    return this.contextManager.getTestData<T>(this.contextId, key);
  }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);

// Global browser instance for reuse across scenarios
let globalBrowser: Browser | null = null;

// BeforeAll hook - runs once before all scenarios
BeforeAll(async function () {
  logger.info('='.repeat(80));
  logger.info('STARTING TEST EXECUTION');
  logger.info('='.repeat(80));

  // Validate environment configuration
  const validation = validateCurrentEnvironment();
  if (!validation.isValid) {
    logger.error('Environment validation failed:');
    validation.errors.forEach(error => logger.error(`  - ${error}`));
    throw new Error(`Environment validation failed: ${validation.errors.join(', ')}`);
  }

  // Ensure required directories exist
  PathUtils.ensureDirectoryExists(PathUtils.getTestResultsPath());
  PathUtils.ensureDirectoryExists(PathUtils.getSecretsPath());

  // Launch global browser for reuse
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

// Before hook - runs before each scenario
Before(async function (this: CustomWorld, scenario) {
  logger.info(`Starting scenario: ${scenario.pickle.name}`);
  logger.info(`Tags: ${scenario.pickle.tags.map(tag => tag.name).join(', ')}`);

  // Set scenario-specific context
  setCurrentContext(this.contextId);

  // Initialize browser context for this scenario
  if (globalBrowser) {
    await this.contextManager.initializeBrowser(this.contextId, globalBrowser);
  }

  // Set scenario start time for performance tracking
  this.setTestData('scenarioStartTime', Date.now());
});

// After hook - runs after each scenario
After(async function (this: CustomWorld, scenario) {
  const scenarioEndTime = Date.now();
  const scenarioStartTime = this.getTestData<number>('scenarioStartTime') || scenarioEndTime;
  const duration = scenarioEndTime - scenarioStartTime;

  logger.info(`Scenario completed: ${scenario.pickle.name} (${duration}ms)`);

  // Capture screenshot on failure
  if (scenario.result?.status === 'FAILED') {
    logger.warn(`Scenario failed: ${scenario.pickle.name}`);
    
    try {
      await this.captureScreenshot('failure');
      logger.info('Failure screenshot captured');
    } catch (error) {
      logger.warn(`Failed to capture screenshot: ${error}`);
    }

    // Attach additional debug information
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

  // Clean up scenario context
  await this.contextManager.cleanupContext(this.contextId);
  logger.debug(`Cleaned up context: ${this.contextId}`);
});

// AfterAll hook - runs once after all scenarios
AfterAll(async function () {
  logger.info('='.repeat(80));
  logger.info('CLEANING UP TEST EXECUTION');
  logger.info('='.repeat(80));

  // Clean up all remaining contexts
  await TestContextManager.getInstance().cleanupAllContexts();

  // Close global browser
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

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export the CustomWorld class
export { CustomWorld };
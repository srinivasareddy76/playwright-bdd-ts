


/**
 * Driver Manager Module
 * 
 * This module provides comprehensive browser driver management for the BDD framework.
 * It handles browser lifecycle, configuration, parallel execution, and advanced
 * browser features with support for multiple browser types and environments.
 * 
 * Key Features:
 * - Multi-browser support (Chromium, Firefox, Safari, Edge)
 * - Browser pool management for parallel execution
 * - Dynamic browser configuration and capabilities
 * - Browser session management and isolation
 * - Mobile and device emulation support
 * - Headless and headed mode switching
 * - Browser extension and plugin management
 * - Performance monitoring and optimization
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Browser, BrowserContext, Page, chromium, firefox, webkit, devices, BrowserType } from '@playwright/test';
import { logger } from './logger';
import { ConfigManager } from './ConfigManager';

/**
 * Supported browser types
 */
export enum BrowserName {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit',
  CHROME = 'chrome',
  EDGE = 'edge'
}

/**
 * Browser launch options interface
 */
export interface BrowserLaunchOptions {
  /** Run browser in headless mode */
  headless?: boolean;
  /** Browser executable path */
  executablePath?: string;
  /** Additional browser arguments */
  args?: string[];
  /** Ignore HTTPS errors */
  ignoreHTTPSErrors?: boolean;
  /** Slow down operations by specified milliseconds */
  slowMo?: number;
  /** Browser timeout in milliseconds */
  timeout?: number;
  /** Enable developer tools */
  devtools?: boolean;
  /** Downloads path */
  downloadsPath?: string;
  /** Proxy configuration */
  proxy?: {
    server: string;
    username?: string;
    password?: string;
    bypass?: string;
  };
}

/**
 * Browser context options interface
 */
export interface ContextOptions {
  /** Viewport size */
  viewport?: { width: number; height: number } | null;
  /** User agent string */
  userAgent?: string;
  /** Device to emulate */
  deviceName?: string;
  /** Locale */
  locale?: string;
  /** Timezone */
  timezoneId?: string;
  /** Geolocation */
  geolocation?: { latitude: number; longitude: number };
  /** Permissions to grant */
  permissions?: string[];
  /** Extra HTTP headers */
  extraHTTPHeaders?: { [key: string]: string };
  /** HTTP credentials */
  httpCredentials?: { username: string; password: string };
  /** Color scheme preference */
  colorScheme?: 'light' | 'dark' | 'no-preference';
  /** Reduced motion preference */
  reducedMotion?: 'reduce' | 'no-preference';
  /** Accept downloads */
  acceptDownloads?: boolean;
  /** Ignore HTTPS errors */
  ignoreHTTPSErrors?: boolean;
  /** Record video */
  recordVideo?: {
    dir: string;
    size?: { width: number; height: number };
  };
  /** Record HAR */
  recordHar?: {
    path: string;
    omitContent?: boolean;
  };
}

/**
 * Browser session interface
 */
export interface BrowserSession {
  /** Session ID */
  id: string;
  /** Browser instance */
  browser: Browser;
  /** Browser context */
  context: BrowserContext;
  /** Active page */
  page: Page;
  /** Browser name */
  browserName: BrowserName;
  /** Session creation time */
  createdAt: Date;
  /** Last activity time */
  lastActivity: Date;
  /** Session metadata */
  metadata: {
    testName?: string;
    tags?: string[];
    environment?: string;
  };
}

/**
 * Browser pool configuration interface
 */
export interface PoolConfig {
  /** Maximum number of browser instances */
  maxInstances: number;
  /** Minimum number of browser instances */
  minInstances: number;
  /** Instance idle timeout in milliseconds */
  idleTimeout: number;
  /** Enable instance reuse */
  reuseInstances: boolean;
  /** Browser types to include in pool */
  browserTypes: BrowserName[];
}

/**
 * Browser capabilities interface
 */
export interface BrowserCapabilities {
  /** Browser name and version */
  browserName: string;
  browserVersion: string;
  /** Platform information */
  platform: string;
  /** Supported features */
  features: {
    javascript: boolean;
    cookies: boolean;
    css: boolean;
    screenshots: boolean;
    video: boolean;
    mobile: boolean;
  };
  /** Device capabilities */
  devices: string[];
}

/**
 * Comprehensive driver manager class providing advanced browser management
 * with pool management, parallel execution, and multi-browser support
 */
export class DriverManager {
  private static instance: DriverManager;
  private browserPool: Map<string, BrowserSession> = new Map();
  private availableSessions: Set<string> = new Set();
  private busySessions: Set<string> = new Set();
  private configManager: ConfigManager;
  private poolConfig: PoolConfig;
  private sessionCounter: number = 0;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
    this.poolConfig = this.loadPoolConfig();
    this.initializeBrowserPool();
    
    // Cleanup on process exit
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  /**
   * Gets singleton instance of DriverManager
   * @returns DriverManager instance
   */
  static getInstance(): DriverManager {
    if (!DriverManager.instance) {
      DriverManager.instance = new DriverManager();
    }
    return DriverManager.instance;
  }

  /**
   * Creates a new browser session
   * @param browserName - Browser type to launch
   * @param launchOptions - Browser launch options
   * @param contextOptions - Browser context options
   * @param metadata - Session metadata
   * @returns Browser session
   */
  async createSession(
    browserName: BrowserName = BrowserName.CHROMIUM,
    launchOptions: BrowserLaunchOptions = {},
    contextOptions: ContextOptions = {},
    metadata: any = {}
  ): Promise<BrowserSession> {
    try {
      const sessionId = this.generateSessionId();
      
      // Get browser type
      const browserType = this.getBrowserType(browserName);
      
      // Merge with default options
      const finalLaunchOptions = this.mergeWithDefaults(launchOptions, browserName);
      const finalContextOptions = this.mergeContextDefaults(contextOptions);
      
      // Launch browser
      logger.info(`Launching ${browserName} browser for session: ${sessionId}`);
      const browser = await browserType.launch(finalLaunchOptions);
      
      // Create context
      const context = await browser.newContext(finalContextOptions);
      
      // Create page
      const page = await context.newPage();
      
      // Set up page event listeners
      this.setupPageListeners(page, sessionId);
      
      // Create session object
      const session: BrowserSession = {
        id: sessionId,
        browser,
        context,
        page,
        browserName,
        createdAt: new Date(),
        lastActivity: new Date(),
        metadata
      };
      
      // Add to pool
      this.browserPool.set(sessionId, session);
      this.availableSessions.add(sessionId);
      
      logger.info(`Browser session created: ${sessionId} (${browserName})`);
      return session;
    } catch (error) {
      logger.error(`Failed to create browser session: ${error}`);
      throw error;
    }
  }

  /**
   * Gets an available browser session from the pool
   * @param browserName - Preferred browser type
   * @param metadata - Session metadata
   * @returns Browser session
   */
  async getSession(browserName?: BrowserName, metadata: any = {}): Promise<BrowserSession> {
    try {
      // Try to get an available session of the preferred browser type
      if (browserName) {
        for (const sessionId of this.availableSessions) {
          const session = this.browserPool.get(sessionId);
          if (session && session.browserName === browserName) {
            this.markSessionBusy(sessionId);
            session.lastActivity = new Date();
            session.metadata = { ...session.metadata, ...metadata };
            logger.debug(`Reusing browser session: ${sessionId} (${browserName})`);
            return session;
          }
        }
      }
      
      // If no specific browser or no available session, get any available session
      if (this.availableSessions.size > 0) {
        const sessionId = this.availableSessions.values().next().value;
        if (sessionId) {
          const session = this.browserPool.get(sessionId)!;
          this.markSessionBusy(sessionId);
          session.lastActivity = new Date();
          session.metadata = { ...session.metadata, ...metadata };
          logger.debug(`Reusing browser session: ${sessionId} (${session.browserName})`);
          return session;
        }
      }
      
      // If no available sessions and pool is not at max capacity, create new session
      if (this.browserPool.size < this.poolConfig.maxInstances) {
        return await this.createSession(browserName, {}, {}, metadata);
      }
      
      // Wait for a session to become available
      logger.info('No available browser sessions. Waiting for one to become available...');
      return await this.waitForAvailableSession(browserName, metadata);
    } catch (error) {
      logger.error(`Failed to get browser session: ${error}`);
      throw error;
    }
  }

  /**
   * Releases a browser session back to the pool
   * @param sessionId - Session ID to release
   */
  async releaseSession(sessionId: string): Promise<void> {
    try {
      const session = this.browserPool.get(sessionId);
      if (!session) {
        logger.warn(`Session not found for release: ${sessionId}`);
        return;
      }
      
      // Clean up the page (navigate to about:blank, clear storage, etc.)
      await this.cleanupSession(session);
      
      // Mark as available
      this.busySessions.delete(sessionId);
      this.availableSessions.add(sessionId);
      
      logger.debug(`Browser session released: ${sessionId}`);
    } catch (error) {
      logger.error(`Failed to release browser session ${sessionId}: ${error}`);
      // If cleanup fails, destroy the session
      await this.destroySession(sessionId);
    }
  }

  /**
   * Destroys a browser session
   * @param sessionId - Session ID to destroy
   */
  async destroySession(sessionId: string): Promise<void> {
    try {
      const session = this.browserPool.get(sessionId);
      if (!session) {
        logger.warn(`Session not found for destruction: ${sessionId}`);
        return;
      }
      
      // Close browser resources
      try {
        await session.page.close();
      } catch (error) {
        logger.warn(`Failed to close page for session ${sessionId}: ${error}`);
      }
      
      try {
        await session.context.close();
      } catch (error) {
        logger.warn(`Failed to close context for session ${sessionId}: ${error}`);
      }
      
      try {
        await session.browser.close();
      } catch (error) {
        logger.warn(`Failed to close browser for session ${sessionId}: ${error}`);
      }
      
      // Remove from pool
      this.browserPool.delete(sessionId);
      this.availableSessions.delete(sessionId);
      this.busySessions.delete(sessionId);
      
      logger.info(`Browser session destroyed: ${sessionId}`);
    } catch (error) {
      logger.error(`Failed to destroy browser session ${sessionId}: ${error}`);
    }
  }

  /**
   * Creates a new page in an existing session
   * @param sessionId - Session ID
   * @returns New page instance
   */
  async createPage(sessionId: string): Promise<Page> {
    try {
      const session = this.browserPool.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }
      
      const page = await session.context.newPage();
      this.setupPageListeners(page, sessionId);
      
      logger.debug(`New page created for session: ${sessionId}`);
      return page;
    } catch (error) {
      logger.error(`Failed to create page for session ${sessionId}: ${error}`);
      throw error;
    }
  }

  /**
   * Gets browser capabilities
   * @param browserName - Browser type
   * @returns Browser capabilities
   */
  async getBrowserCapabilities(browserName: BrowserName): Promise<BrowserCapabilities> {
    try {
      const browserType = this.getBrowserType(browserName);
      
      // Create a temporary browser to get capabilities
      const browser = await browserType.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Get browser info
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const platform = await page.evaluate(() => navigator.platform);
      
      await browser.close();
      
      const capabilities: BrowserCapabilities = {
        browserName: browserName,
        browserVersion: this.extractBrowserVersion(userAgent),
        platform,
        features: {
          javascript: true,
          cookies: true,
          css: true,
          screenshots: true,
          video: true,
          mobile: browserName === BrowserName.WEBKIT || browserName === BrowserName.CHROMIUM
        },
        devices: Object.keys(devices)
      };
      
      return capabilities;
    } catch (error) {
      logger.error(`Failed to get browser capabilities for ${browserName}: ${error}`);
      throw error;
    }
  }

  /**
   * Emulates a mobile device
   * @param sessionId - Session ID
   * @param deviceName - Device name from Playwright devices
   * @returns Updated context
   */
  async emulateDevice(sessionId: string, deviceName: string): Promise<BrowserContext> {
    try {
      const session = this.browserPool.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }
      
      const device = devices[deviceName];
      if (!device) {
        throw new Error(`Device not found: ${deviceName}`);
      }
      
      // Close current context
      await session.context.close();
      
      // Create new context with device emulation
      const newContext = await session.browser.newContext(device);
      session.context = newContext;
      
      // Create new page
      const newPage = await newContext.newPage();
      session.page = newPage;
      
      this.setupPageListeners(newPage, sessionId);
      
      logger.info(`Device emulation enabled for session ${sessionId}: ${deviceName}`);
      return newContext;
    } catch (error) {
      logger.error(`Failed to emulate device for session ${sessionId}: ${error}`);
      throw error;
    }
  }

  /**
   * Takes a screenshot across all active sessions
   * @param testName - Test name for file naming
   * @returns Map of session IDs to screenshot paths
   */
  async takeScreenshotAll(testName: string): Promise<Map<string, string>> {
    const screenshots = new Map<string, string>();
    
    for (const [sessionId, session] of this.browserPool) {
      try {
        const screenshotPath = `screenshots/${testName}_${sessionId}_${Date.now()}.png`;
        await session.page.screenshot({ path: screenshotPath, fullPage: true });
        screenshots.set(sessionId, screenshotPath);
      } catch (error) {
        logger.error(`Failed to take screenshot for session ${sessionId}: ${error}`);
      }
    }
    
    return screenshots;
  }

  /**
   * Executes a function across multiple browser sessions in parallel
   * @param browserNames - Array of browser types
   * @param testFunction - Function to execute
   * @param testData - Test data to pass to function
   * @returns Array of results
   */
  async executeParallel<T>(
    browserNames: BrowserName[],
    testFunction: (session: BrowserSession, data: any) => Promise<T>,
    testData: any = {}
  ): Promise<T[]> {
    try {
      const sessions = await Promise.all(
        browserNames.map(browserName => this.getSession(browserName, { parallel: true }))
      );
      
      const results = await Promise.all(
        sessions.map(session => testFunction(session, testData))
      );
      
      // Release all sessions
      await Promise.all(
        sessions.map(session => this.releaseSession(session.id))
      );
      
      return results;
    } catch (error) {
      logger.error(`Failed to execute parallel test: ${error}`);
      throw error;
    }
  }

  /**
   * Gets pool statistics
   * @returns Pool statistics
   */
  getPoolStats(): any {
    return {
      totalSessions: this.browserPool.size,
      availableSessions: this.availableSessions.size,
      busySessions: this.busySessions.size,
      maxInstances: this.poolConfig.maxInstances,
      minInstances: this.poolConfig.minInstances,
      sessionDetails: Array.from(this.browserPool.values()).map(session => ({
        id: session.id,
        browserName: session.browserName,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        status: this.busySessions.has(session.id) ? 'busy' : 'available'
      }))
    };
  }

  /**
   * Loads pool configuration from ConfigManager
   * @returns Pool configuration
   */
  private loadPoolConfig(): PoolConfig {
    return {
      maxInstances: this.configManager.get('browser.pool.maxInstances', 5),
      minInstances: this.configManager.get('browser.pool.minInstances', 1),
      idleTimeout: this.configManager.get('browser.pool.idleTimeout', 300000), // 5 minutes
      reuseInstances: this.configManager.get('browser.pool.reuseInstances', true),
      browserTypes: this.configManager.get('browser.pool.browserTypes', [BrowserName.CHROMIUM])
    };
  }

  /**
   * Initializes the browser pool with minimum instances
   */
  private async initializeBrowserPool(): Promise<void> {
    try {
      logger.info(`Initializing browser pool with ${this.poolConfig.minInstances} instances`);
      
      const initPromises = [];
      for (let i = 0; i < this.poolConfig.minInstances; i++) {
        const browserName = this.poolConfig.browserTypes[i % this.poolConfig.browserTypes.length];
        initPromises.push(this.createSession(browserName, {}, {}, { poolInit: true }));
      }
      
      await Promise.all(initPromises);
      logger.info('Browser pool initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize browser pool: ${error}`);
    }
  }

  /**
   * Gets Playwright browser type instance
   * @param browserName - Browser name
   * @returns Browser type instance
   */
  private getBrowserType(browserName: BrowserName): BrowserType {
    switch (browserName) {
      case BrowserName.CHROMIUM:
      case BrowserName.CHROME:
      case BrowserName.EDGE:
        return chromium;
      case BrowserName.FIREFOX:
        return firefox;
      case BrowserName.WEBKIT:
        return webkit;
      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }
  }

  /**
   * Merges launch options with defaults
   * @param options - User options
   * @param browserName - Browser name
   * @returns Merged options
   */
  private mergeWithDefaults(options: BrowserLaunchOptions, browserName: BrowserName): BrowserLaunchOptions {
    const defaults = {
      headless: this.configManager.get('browser.headless', true),
      timeout: this.configManager.get('browser.timeout', 30000),
      ignoreHTTPSErrors: this.configManager.get('browser.ignoreHTTPSErrors', true),
      args: this.configManager.get(`browser.${browserName}.args`, [])
    };
    
    return { ...defaults, ...options };
  }

  /**
   * Merges context options with defaults
   * @param options - User options
   * @returns Merged options
   */
  private mergeContextDefaults(options: ContextOptions): ContextOptions {
    const defaults = {
      viewport: this.configManager.get('browser.viewport', { width: 1920, height: 1080 }),
      ignoreHTTPSErrors: this.configManager.get('browser.ignoreHTTPSErrors', true),
      acceptDownloads: this.configManager.get('browser.acceptDownloads', true)
    };
    
    return { ...defaults, ...options };
  }

  /**
   * Generates a unique session ID
   * @returns Session ID
   */
  private generateSessionId(): string {
    return `session_${++this.sessionCounter}_${Date.now()}`;
  }

  /**
   * Sets up page event listeners
   * @param page - Page instance
   * @param sessionId - Session ID
   */
  private setupPageListeners(page: Page, sessionId: string): void {
    page.on('console', msg => {
      logger.debug(`[${sessionId}] Console ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      logger.error(`[${sessionId}] Page error: ${error.message}`);
    });
    
    page.on('requestfailed', request => {
      logger.warn(`[${sessionId}] Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        logger.warn(`[${sessionId}] HTTP ${response.status()}: ${response.url()}`);
      }
    });
  }

  /**
   * Marks a session as busy
   * @param sessionId - Session ID
   */
  private markSessionBusy(sessionId: string): void {
    this.availableSessions.delete(sessionId);
    this.busySessions.add(sessionId);
  }

  /**
   * Waits for an available session
   * @param browserName - Preferred browser name
   * @param metadata - Session metadata
   * @returns Browser session
   */
  private async waitForAvailableSession(browserName?: BrowserName, metadata: any = {}): Promise<BrowserSession> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.availableSessions.size > 0) {
          clearInterval(checkInterval);
          this.getSession(browserName, metadata).then(resolve).catch(reject);
        }
      }, 1000);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout waiting for available browser session'));
      }, 30000);
    });
  }

  /**
   * Cleans up a session for reuse
   * @param session - Browser session
   */
  private async cleanupSession(session: BrowserSession): Promise<void> {
    try {
      // Navigate to blank page
      await session.page.goto('about:blank');
      
      // Clear cookies and storage
      await session.context.clearCookies();
      await session.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      // Reset viewport if needed
      await session.page.setViewportSize({ width: 1920, height: 1080 });
      
      logger.debug(`Session cleaned up: ${session.id}`);
    } catch (error) {
      logger.warn(`Failed to cleanup session ${session.id}: ${error}`);
      throw error;
    }
  }

  /**
   * Extracts browser version from user agent
   * @param userAgent - User agent string
   * @returns Browser version
   */
  private extractBrowserVersion(userAgent: string): string {
    const matches = userAgent.match(/(?:Chrome|Firefox|Safari)\/(\d+\.\d+)/);
    return matches ? matches[1] : 'Unknown';
  }

  /**
   * Cleanup method to close all browser sessions
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up browser pool...');
    
    const cleanupPromises = Array.from(this.browserPool.keys()).map(sessionId =>
      this.destroySession(sessionId)
    );
    
    await Promise.all(cleanupPromises);
    
    this.browserPool.clear();
    this.availableSessions.clear();
    this.busySessions.clear();
    
    logger.info('Browser pool cleanup completed');
  }
}





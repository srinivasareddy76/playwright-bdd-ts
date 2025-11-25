


/**
 * Utilities Index Module
 * 
 * This module serves as the main entry point for all utility classes and functions
 * in the BDD framework. It provides a centralized export system for easy access
 * to all utility functionalities across the test automation framework.
 * 
 * Available Utilities:
 * - DateUtils: Comprehensive date handling and manipulation
 * - TestDataGenerator: Dynamic test data generation for various scenarios
 * - ScreenshotUtils: Advanced screenshot capture and management
 * - DataProvider: Multi-source test data management and caching
 * - FileUtils: Comprehensive file I/O operations and management
 * - ConfigManager: Advanced configuration management with validation
 * - DriverManager: Browser driver management and pool handling
 * - Logger: Centralized logging utility (existing)
 * - PathUtils: Path management and resolution (existing)
 * 
 * @author OpenHands
 * @version 1.0.0
 */

// Date utilities
export { DateUtils, DateFormat } from './DateUtils';
export type { DateRange } from './DateUtils';

// Test data generation
export { TestDataGenerator } from './TestDataGenerator';
export type { 
  Address, 
  Person, 
  CreditCard, 
  Company, 
  GeneratorConfig 
} from './TestDataGenerator';

// Screenshot utilities
export { ScreenshotUtils } from './ScreenshotUtils';
export type { 
  ScreenshotOptions, 
  ScreenshotMetadata, 
  ComparisonResult 
} from './ScreenshotUtils';

// Data provider
export { DataProvider, DataSourceType } from './DataProvider';
export type { 
  DataProviderConfig, 
  DataQuery, 
  ValidationResult as DataValidationResult 
} from './DataProvider';

// File utilities
export { FileUtils } from './FileUtils';
export type { 
  FileOptions, 
  SearchCriteria, 
  FileInfo, 
  FileWatcherCallback, 
  CompressionOptions 
} from './FileUtils';

// Configuration manager
export { ConfigManager, ConfigSource } from './ConfigManager';
export type { 
  ValidationRule, 
  ConfigSchema, 
  ConfigChangeEvent, 
  ConfigManagerOptions,
  ValidationResult as ConfigValidationResult 
} from './ConfigManager';

// Driver manager
export { DriverManager, BrowserName } from './DriverManager';
export type { 
  BrowserLaunchOptions, 
  ContextOptions, 
  BrowserSession, 
  PoolConfig, 
  BrowserCapabilities 
} from './DriverManager';

// Existing utilities
export { logger } from './logger';
export { PathUtils } from './paths';

// Import all classes for factory and utils
import { DateUtils } from './DateUtils';
import { TestDataGenerator } from './TestDataGenerator';
import { ScreenshotUtils } from './ScreenshotUtils';
import { DataProvider } from './DataProvider';
import { FileUtils } from './FileUtils';
import { ConfigManager } from './ConfigManager';
import { DriverManager } from './DriverManager';
import { logger } from './logger';

/**
 * Utility factory class for creating and managing utility instances
 * Provides a centralized way to access all utility classes with proper initialization
 */
export class UtilityFactory {
  private static testDataGenerator: TestDataGenerator;
  private static screenshotUtils: ScreenshotUtils;
  private static dataProvider: DataProvider;
  private static fileUtils: FileUtils;
  private static configManager: ConfigManager;
  private static driverManager: DriverManager;

  /**
   * Gets DateUtils instance
   * @returns DateUtils instance
   */
  static getDateUtils(): typeof DateUtils {
    return DateUtils;
  }

  /**
   * Gets TestDataGenerator instance
   * @param config - Optional generator configuration
   * @returns TestDataGenerator instance
   */
  static getTestDataGenerator(config?: any): TestDataGenerator {
    if (!this.testDataGenerator || config) {
      this.testDataGenerator = TestDataGenerator.getInstance(config);
    }
    return this.testDataGenerator;
  }

  /**
   * Gets ScreenshotUtils instance
   * @returns ScreenshotUtils instance
   */
  static getScreenshotUtils(): ScreenshotUtils {
    if (!this.screenshotUtils) {
      this.screenshotUtils = ScreenshotUtils.getInstance();
    }
    return this.screenshotUtils;
  }

  /**
   * Gets DataProvider instance
   * @param config - Optional data provider configuration
   * @returns DataProvider instance
   */
  static getDataProvider(config?: any): DataProvider {
    if (!this.dataProvider || config) {
      this.dataProvider = DataProvider.getInstance(config);
    }
    return this.dataProvider;
  }

  /**
   * Gets FileUtils instance
   * @returns FileUtils instance
   */
  static getFileUtils(): FileUtils {
    if (!this.fileUtils) {
      this.fileUtils = FileUtils.getInstance();
    }
    return this.fileUtils;
  }

  /**
   * Gets ConfigManager instance
   * @param options - Optional configuration manager options
   * @returns ConfigManager instance
   */
  static getConfigManager(options?: any): ConfigManager {
    if (!this.configManager || options) {
      this.configManager = ConfigManager.getInstance(options);
    }
    return this.configManager;
  }

  /**
   * Gets DriverManager instance
   * @returns DriverManager instance
   */
  static getDriverManager(): DriverManager {
    if (!this.driverManager) {
      this.driverManager = DriverManager.getInstance();
    }
    return this.driverManager;
  }

  /**
   * Initializes all utilities with default configurations
   * @param configs - Optional configurations for each utility
   */
  static async initializeAll(configs: {
    testDataGenerator?: any;
    dataProvider?: any;
    configManager?: any;
  } = {}): Promise<void> {
    try {
      logger.info('Initializing all utility classes...');

      // Initialize utilities that need setup
      this.getTestDataGenerator(configs.testDataGenerator);
      this.getScreenshotUtils();
      this.getDataProvider(configs.dataProvider);
      this.getFileUtils();
      this.getConfigManager(configs.configManager);
      this.getDriverManager();

      logger.info('All utility classes initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize utility classes: ${error}`);
      throw error;
    }
  }

  /**
   * Cleanup method to properly dispose of all utility instances
   */
  static async cleanup(): Promise<void> {
    try {
      logger.info('Cleaning up utility classes...');

      // Cleanup utilities that need explicit cleanup
      if (this.driverManager) {
        await this.driverManager.cleanup();
      }

      if (this.configManager) {
        this.configManager.cleanup();
      }

      if (this.fileUtils) {
        this.fileUtils.stopAllWatchers();
      }

      if (this.dataProvider) {
        this.dataProvider.clearCache();
      }

      logger.info('All utility classes cleaned up successfully');
    } catch (error) {
      logger.error(`Error during utility cleanup: ${error}`);
    }
  }
}

/**
 * Convenience functions for quick access to common utility operations
 */
export const Utils = {
  // Date operations
  date: {
    getCurrentDate: () => DateUtils.getCurrentDate(),
    formatDate: (date: Date, format: string) => DateUtils.formatDate(date, format),
    addDays: (date: Date, days: number) => DateUtils.addTime(date, days, 'days'),
    subtractDays: (date: Date, days: number) => DateUtils.subtractTime(date, days, 'days'),
    isBusinessDay: (date: Date) => DateUtils.isBusinessDay(date),
    getDatePresets: () => DateUtils.getDatePresets()
  },

  // Data generation
  generate: {
    person: () => UtilityFactory.getTestDataGenerator().generatePerson(),
    email: () => UtilityFactory.getTestDataGenerator().generateEmail(),
    phone: () => UtilityFactory.getTestDataGenerator().generatePhoneNumber(),
    creditCard: () => UtilityFactory.getTestDataGenerator().generateCreditCard(),
    company: () => UtilityFactory.getTestDataGenerator().generateCompany(),
    uuid: () => UtilityFactory.getTestDataGenerator().generateUUID(),
    password: (length?: number) => UtilityFactory.getTestDataGenerator().generatePassword(length),
    randomString: (length: number) => UtilityFactory.getTestDataGenerator().generateRandomString(length),
    randomNumber: (min?: number, max?: number) => UtilityFactory.getTestDataGenerator().generateRandomNumber(min, max)
  },

  // File operations
  file: {
    exists: (path: string) => UtilityFactory.getFileUtils().exists(path),
    readFile: (path: string) => UtilityFactory.getFileUtils().readFile(path),
    writeFile: (path: string, content: string) => UtilityFactory.getFileUtils().writeFile(path, content),
    deleteFile: (path: string) => UtilityFactory.getFileUtils().delete(path),
    copyFile: (src: string, dest: string) => UtilityFactory.getFileUtils().copy(src, dest),
    createTempFile: (prefix?: string) => UtilityFactory.getFileUtils().createTempFile(prefix)
  },

  // Configuration operations
  config: {
    get: <T>(key: string, defaultValue?: T) => UtilityFactory.getConfigManager().get<T>(key, defaultValue),
    set: (key: string, value: any) => UtilityFactory.getConfigManager().set(key, value),
    has: (key: string) => UtilityFactory.getConfigManager().has(key),
    reload: () => UtilityFactory.getConfigManager().reload()
  },

  // Browser operations
  browser: {
    createSession: (browserName?: any) => UtilityFactory.getDriverManager().createSession(browserName),
    getSession: (browserName?: any) => UtilityFactory.getDriverManager().getSession(browserName),
    releaseSession: (sessionId: string) => UtilityFactory.getDriverManager().releaseSession(sessionId),
    getPoolStats: () => UtilityFactory.getDriverManager().getPoolStats()
  },

  // Screenshot operations
  screenshot: {
    captureFullPage: (page: any, testName: string) => UtilityFactory.getScreenshotUtils().captureFullPage(page, testName),
    captureElement: (element: any, testName: string) => UtilityFactory.getScreenshotUtils().captureElement(element, testName),
    captureFailure: (page: any, testName: string, error: string) => UtilityFactory.getScreenshotUtils().captureFailure(page, testName, error)
  },

  // Data operations
  data: {
    loadJSON: (fileName: string) => UtilityFactory.getDataProvider().loadJSON(fileName),
    loadCSV: (fileName: string) => UtilityFactory.getDataProvider().loadCSV(fileName),
    generateData: (scenario: string, count?: number) => UtilityFactory.getDataProvider().generateData(scenario, count),
    getScenarioData: (scenario: string) => UtilityFactory.getDataProvider().getScenarioData(scenario)
  }
};



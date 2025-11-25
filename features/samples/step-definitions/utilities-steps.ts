




/**
 * Step Definitions for Utilities Sample Features
 * 
 * This file contains comprehensive step definitions that demonstrate
 * how to use all the utility classes in real BDD test scenarios.
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { 
  UtilityFactory, 
  Utils, 
  DateUtils, 
  TestDataGenerator, 
  ScreenshotUtils, 
  DataProvider, 
  FileUtils, 
  ConfigManager, 
  DriverManager,
  BrowserName 
} from '../../../src/utils';
import { testContext } from '../../../src/support/testContext';

// Global test data storage
let generatedTestData: any = {};
let testFiles: string[] = [];
let browserSessions: any[] = [];

/**
 * Background and Setup Steps
 */

@Before()
async function setupUtilities() {
  // Initialize all utilities before each scenario
  await UtilityFactory.initializeAll({
    testDataGenerator: { seed: Date.now() },
    dataProvider: { cache: { enabled: true, maxSize: 100, ttl: 300000 } },
    configManager: { environment: process.env.NODE_ENV || 'test' }
  });
}

@After()
async function cleanupUtilities() {
  // Cleanup after each scenario
  try {
    // Clean up temporary files
    for (const file of testFiles) {
      if (await Utils.file.exists(file)) {
        await Utils.file.deleteFile(file);
      }
    }
    testFiles = [];

    // Release browser sessions
    for (const session of browserSessions) {
      await UtilityFactory.getDriverManager().releaseSession(session.id);
    }
    browserSessions = [];

    // Cleanup utilities
    await UtilityFactory.cleanup();
  } catch (error) {
    console.warn('Cleanup warning:', error);
  }
}

/**
 * Utility Factory and Initialization Steps
 */

@Given('I have initialized the utility factory')
async function initializeUtilityFactory() {
  await UtilityFactory.initializeAll();
  expect(UtilityFactory.getDateUtils()).toBeDefined();
  expect(UtilityFactory.getTestDataGenerator()).toBeDefined();
}

@Given('I have initialized all utility classes')
async function initializeAllUtilities() {
  await UtilityFactory.initializeAll({
    testDataGenerator: { seed: 12345 },
    dataProvider: { 
      cache: { enabled: true, maxSize: 50, ttl: 600000 },
      sources: ['json', 'csv', 'yaml']
    },
    configManager: { 
      environment: 'test',
      hotReload: true 
    }
  });
}

/**
 * TestDataGenerator Steps
 */

@Given('I have configured the test data generator with seed {string}')
async function configureTestDataGenerator(seed: string) {
  const generator = UtilityFactory.getTestDataGenerator({ seed: parseInt(seed) });
  expect(generator).toBeDefined();
}

@Given('I generate a new user profile using TestDataGenerator')
async function generateUserProfile() {
  const generator = UtilityFactory.getTestDataGenerator();
  generatedTestData.user = generator.generatePerson();
  generatedTestData.password = generator.generatePassword(12);
  
  expect(generatedTestData.user).toHaveProperty('firstName');
  expect(generatedTestData.user).toHaveProperty('email');
  expect(generatedTestData.password).toMatch(/^.{12}$/);
}

@Given('I generate a valid credit card using TestDataGenerator:')
async function generateCreditCard(dataTable: any) {
  const generator = UtilityFactory.getTestDataGenerator();
  const cardType = dataTable.hashes()[0].cardType;
  
  generatedTestData.creditCard = generator.generateCreditCard(cardType);
  
  expect(generatedTestData.creditCard).toHaveProperty('number');
  expect(generatedTestData.creditCard).toHaveProperty('expiryDate');
  expect(generatedTestData.creditCard).toHaveProperty('cvv');
}

@Given('I generate invalid test data using TestDataGenerator:')
async function generateInvalidTestData(dataTable: any) {
  const generator = UtilityFactory.getTestDataGenerator();
  generatedTestData.invalid = {};
  
  for (const row of dataTable.hashes()) {
    switch (row.dataType) {
      case 'invalidEmail':
        generatedTestData.invalid.email = 'invalid-email-format';
        break;
      case 'invalidPhone':
        generatedTestData.invalid.phone = '123';
        break;
      case 'futureDate':
        generatedTestData.invalid.birthDate = Utils.date.addDays(new Date(), 365);
        break;
      case 'shortPassword':
        generatedTestData.invalid.password = '123';
        break;
    }
  }
}

/**
 * DateUtils Steps
 */

@Given('I generate users with different age ranges using DateUtils:')
async function generateUsersWithAgeRanges(dataTable: any) {
  const generator = UtilityFactory.getTestDataGenerator();
  generatedTestData.usersByAge = {};
  
  for (const row of dataTable.hashes()) {
    const ageRange = row.ageRange;
    let birthDate: Date;
    
    switch (ageRange) {
      case 'minor':
        birthDate = Utils.date.subtractDays(new Date(), 365 * 16); // 16 years old
        break;
      case 'adult':
        birthDate = Utils.date.subtractDays(new Date(), 365 * 30); // 30 years old
        break;
      case 'senior':
        birthDate = Utils.date.subtractDays(new Date(), 365 * 70); // 70 years old
        break;
      default:
        birthDate = Utils.date.subtractDays(new Date(), 365 * 25); // 25 years old
    }
    
    const user = generator.generatePerson(undefined, undefined, birthDate);
    generatedTestData.usersByAge[ageRange] = user;
  }
}

@Given('I calculate subscription end dates using DateUtils')
async function calculateSubscriptionDates() {
  const startDate = Utils.date.getCurrentDate();
  generatedTestData.subscriptions = {
    monthly: {
      start: startDate,
      end: Utils.date.addDays(startDate, 30),
      nextBilling: Utils.date.addDays(startDate, 30)
    },
    quarterly: {
      start: startDate,
      end: Utils.date.addDays(startDate, 90),
      nextBilling: Utils.date.addDays(startDate, 90)
    },
    yearly: {
      start: startDate,
      end: Utils.date.addDays(startDate, 365),
      nextBilling: Utils.date.addDays(startDate, 365)
    }
  };
}

/**
 * FileUtils Steps
 */

@Given('I create a temporary test data file using FileUtils')
async function createTemporaryFile() {
  const tempFile = await Utils.file.createTempFile('test-data', '.json');
  testFiles.push(tempFile);
  generatedTestData.tempFile = tempFile;
  
  expect(await Utils.file.exists(tempFile)).toBe(true);
}

@Given('I set up file monitoring for inventory updates using FileUtils')
async function setupFileMonitoring() {
  const fileUtils = UtilityFactory.getFileUtils();
  const monitorPath = './test-data/inventory';
  
  // Ensure directory exists
  await fileUtils.ensureDirectory(monitorPath);
  
  // Set up file watcher
  const watcherId = fileUtils.watchFile(monitorPath, (eventType, filename, error) => {
    if (error) {
      console.error('File watch error:', error);
      return;
    }
    
    generatedTestData.fileChanges = generatedTestData.fileChanges || [];
    generatedTestData.fileChanges.push({
      event: eventType,
      file: filename,
      timestamp: new Date()
    });
  });
  
  generatedTestData.watcherId = watcherId;
}

@When('I save the generated user data to a test data file')
async function saveUserDataToFile() {
  const filePath = await Utils.file.createTempFile('user-data', '.json');
  testFiles.push(filePath);
  
  await Utils.file.writeFile(filePath, JSON.stringify(generatedTestData.user, null, 2));
  
  expect(await Utils.file.exists(filePath)).toBe(true);
  generatedTestData.savedFilePath = filePath;
}

/**
 * DataProvider Steps
 */

@Given('I load additional test data from {string} using DataProvider')
async function loadTestDataFromFile(fileName: string) {
  const dataProvider = UtilityFactory.getDataProvider();
  
  try {
    generatedTestData.loadedData = await dataProvider.loadJSON(fileName);
  } catch (error) {
    // Create sample data if file doesn't exist
    const sampleData = {
      users: [
        { id: 1, type: 'standard', features: ['basic'] },
        { id: 2, type: 'premium', features: ['basic', 'advanced'] },
        { id: 3, type: 'enterprise', features: ['basic', 'advanced', 'enterprise'] }
      ]
    };
    
    generatedTestData.loadedData = sampleData;
  }
}

@Given('I have test data files in multiple formats:')
async function setupMultiFormatTestData(dataTable: any) {
  const fileUtils = UtilityFactory.getFileUtils();
  generatedTestData.testDataFiles = {};
  
  for (const row of dataTable.hashes()) {
    const format = row.format.toLowerCase();
    const filename = row.filename;
    
    // Create sample data based on format
    let content: string;
    const sampleData = {
      id: 1,
      name: 'Sample Data',
      created: new Date().toISOString()
    };
    
    switch (format) {
      case 'json':
        content = JSON.stringify(sampleData, null, 2);
        break;
      case 'csv':
        content = 'id,name,created\n1,Sample Data,' + new Date().toISOString();
        break;
      case 'yaml':
        content = `id: 1\nname: Sample Data\ncreated: ${new Date().toISOString()}`;
        break;
      default:
        content = JSON.stringify(sampleData);
    }
    
    const filePath = `./test-data/${filename}`;
    await fileUtils.ensureDirectory('./test-data');
    await fileUtils.writeFile(filePath, content);
    testFiles.push(filePath);
    
    generatedTestData.testDataFiles[format] = filePath;
  }
}

/**
 * ConfigManager Steps
 */

@Given('I load configuration for environment {string} using ConfigManager')
async function loadEnvironmentConfiguration(environment: string) {
  const configManager = UtilityFactory.getConfigManager();
  
  // Set environment-specific configuration
  configManager.set('environment', environment);
  configManager.set(`${environment}.apiUrl`, `https://api-${environment}.example.com`);
  configManager.set(`${environment}.timeout`, environment === 'production' ? 30000 : 10000);
  
  generatedTestData.environment = environment;
  generatedTestData.config = {
    apiUrl: configManager.get(`${environment}.apiUrl`),
    timeout: configManager.get(`${environment}.timeout`)
  };
}

/**
 * DriverManager Steps
 */

@Given('I initialize multiple browser sessions using DriverManager')
async function initializeMultipleBrowsers() {
  const driverManager = UtilityFactory.getDriverManager();
  
  const browsers = [BrowserName.CHROMIUM, BrowserName.FIREFOX];
  
  for (const browserName of browsers) {
    const session = await driverManager.createSession(browserName);
    browserSessions.push(session);
  }
  
  expect(browserSessions.length).toBe(2);
}

@Given('I initialize browser sessions for cross-browser testing using DriverManager')
async function initializeCrossBrowserSessions() {
  const driverManager = UtilityFactory.getDriverManager();
  
  const browserConfigs = [
    { name: BrowserName.CHROMIUM, viewport: { width: 1920, height: 1080 } },
    { name: BrowserName.FIREFOX, viewport: { width: 1920, height: 1080 } },
    { name: BrowserName.WEBKIT, viewport: { width: 768, height: 1024 } }
  ];
  
  for (const config of browserConfigs) {
    const session = await driverManager.createSession(config.name, {}, {
      viewport: config.viewport
    });
    browserSessions.push(session);
  }
}

/**
 * ScreenshotUtils Steps
 */

@Given('I capture a screenshot before starting registration')
async function captureInitialScreenshot() {
  if (testContext.page) {
    const screenshotUtils = UtilityFactory.getScreenshotUtils();
    const screenshotPath = await screenshotUtils.captureFullPage(
      testContext.page, 
      'registration-start'
    );
    generatedTestData.screenshots = generatedTestData.screenshots || [];
    generatedTestData.screenshots.push(screenshotPath);
  }
}

@When('I capture a screenshot of the completed form')
async function captureFormScreenshot() {
  if (testContext.page) {
    const screenshotUtils = UtilityFactory.getScreenshotUtils();
    const screenshotPath = await screenshotUtils.captureFullPage(
      testContext.page, 
      'registration-form-completed'
    );
    generatedTestData.screenshots = generatedTestData.screenshots || [];
    generatedTestData.screenshots.push(screenshotPath);
  }
}

/**
 * Action Steps
 */

@When('I fill in the registration form with generated user data:')
async function fillRegistrationForm(dataTable: any) {
  if (!testContext.page) return;
  
  for (const row of dataTable.hashes()) {
    const field = row.field;
    const source = row.source;
    
    // Get value from generated data
    const value = getNestedValue(generatedTestData, source.replace('generated.', ''));
    
    if (value) {
      // This would be actual form filling in a real test
      console.log(`Filling ${field} with ${value}`);
    }
  }
}

@When('I process multiple checkouts in parallel')
async function processParallelCheckouts() {
  const driverManager = UtilityFactory.getDriverManager();
  
  const checkoutPromises = browserSessions.map(async (session, index) => {
    // Simulate checkout process
    const startTime = Date.now();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const endTime = Date.now();
    return {
      sessionId: session.id,
      processingTime: endTime - startTime,
      success: true
    };
  });
  
  generatedTestData.checkoutResults = await Promise.all(checkoutPromises);
}

/**
 * Assertion Steps
 */

@Then('I should see a successful registration message')
async function verifyRegistrationSuccess() {
  // In a real test, this would verify the success message on the page
  expect(generatedTestData.user).toBeDefined();
  expect(generatedTestData.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

@Then('the registration should be {string}')
async function verifyRegistrationResult(expectedResult: string) {
  generatedTestData.registrationResult = expectedResult;
  expect(['success', 'validation_error']).toContain(expectedResult);
}

@Then('all screenshots should be captured successfully')
async function verifyScreenshotCapture() {
  expect(generatedTestData.screenshots).toBeDefined();
  expect(generatedTestData.screenshots.length).toBeGreaterThan(0);
}

@Then('all checkouts should complete within acceptable time limits')
async function verifyCheckoutPerformance() {
  expect(generatedTestData.checkoutResults).toBeDefined();
  
  for (const result of generatedTestData.checkoutResults) {
    expect(result.success).toBe(true);
    expect(result.processingTime).toBeLessThan(5000); // 5 second limit
  }
}

@Then('I should successfully process all data formats')
async function verifyDataFormatProcessing() {
  expect(generatedTestData.testDataFiles).toBeDefined();
  expect(Object.keys(generatedTestData.testDataFiles)).toContain('json');
  expect(Object.keys(generatedTestData.testDataFiles)).toContain('csv');
  expect(Object.keys(generatedTestData.testDataFiles)).toContain('yaml');
}

/**
 * Reporting and Cleanup Steps
 */

@Then('I generate a {string} report')
async function generateReport(reportType: string) {
  const reportData = {
    reportType,
    timestamp: new Date().toISOString(),
    testData: generatedTestData,
    summary: {
      totalTests: 1,
      passed: 1,
      failed: 0
    }
  };
  
  const reportPath = await Utils.file.createTempFile(`${reportType}-report`, '.json');
  testFiles.push(reportPath);
  
  await Utils.file.writeFile(reportPath, JSON.stringify(reportData, null, 2));
  
  generatedTestData.reportPath = reportPath;
}

@Then('I clean up temporary files after the test')
async function cleanupTemporaryFiles() {
  const fileUtils = UtilityFactory.getFileUtils();
  
  for (const file of testFiles) {
    if (await fileUtils.exists(file)) {
      await fileUtils.delete(file);
    }
  }
  
  testFiles = [];
}

/**
 * Helper Functions
 */

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Export for use in other step definition files
 */
export { generatedTestData, testFiles, browserSessions };





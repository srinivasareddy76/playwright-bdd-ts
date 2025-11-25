



/**
 * Comprehensive Utilities Usage Examples
 * 
 * This file demonstrates practical usage of all utility classes in the
 * Playwright BDD TypeScript framework. These examples show real-world
 * scenarios and best practices for test automation.
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { 
  DateUtils, 
  DateFormat, 
  TestDataGenerator, 
  ScreenshotUtils, 
  DataProvider, 
  DataSourceType,
  FileUtils, 
  ConfigManager, 
  DriverManager, 
  BrowserName,
  UtilityFactory,
  Utils,
  logger 
} from '../src/utils';

/**
 * Example 1: Date Operations for Test Scenarios
 */
async function dateUtilsExamples() {
  console.log('\n=== DateUtils Examples ===');
  
  // Current date operations
  const now = DateUtils.getCurrentDate();
  const utcNow = DateUtils.getCurrentDate('UTC');
  console.log(`Current local time: ${DateUtils.formatDate(now, DateFormat.DISPLAY_DATETIME)}`);
  console.log(`Current UTC time: ${DateUtils.formatDate(utcNow, DateFormat.DISPLAY_DATETIME)}`);
  
  // Date arithmetic for test scenarios
  const futureDate = DateUtils.addTime(now, 30, 'days');
  const pastDate = DateUtils.subtractTime(now, 7, 'days');
  console.log(`30 days from now: ${DateUtils.formatDate(futureDate, DateFormat.ISO_DATE)}`);
  console.log(`7 days ago: ${DateUtils.formatDate(pastDate, DateFormat.ISO_DATE)}`);
  
  // Business day calculations
  const nextBusinessDay = DateUtils.getNextBusinessDay(now);
  const isBusinessDay = DateUtils.isBusinessDay(now);
  console.log(`Next business day: ${DateUtils.formatDate(nextBusinessDay, DateFormat.DISPLAY_DATE)}`);
  console.log(`Today is business day: ${isBusinessDay}`);
  
  // Age calculation for user registration tests
  const birthDate = new Date('1990-05-15');
  const age = DateUtils.calculateAge(birthDate);
  console.log(`Age for birth date ${DateUtils.formatDate(birthDate, DateFormat.ISO_DATE)}: ${age} years`);
  
  // Date presets for common test scenarios
  const presets = DateUtils.getDatePresets();
  console.log(`Yesterday: ${DateUtils.formatDate(presets.yesterday, DateFormat.ISO_DATE)}`);
  console.log(`Next month: ${DateUtils.formatDate(presets.nextMonth, DateFormat.ISO_DATE)}`);
}

/**
 * Example 2: Test Data Generation for Various Scenarios
 */
async function testDataGeneratorExamples() {
  console.log('\n=== TestDataGenerator Examples ===');
  
  const generator = TestDataGenerator.getInstance({ seed: 12345 });
  
  // Generate complete user profile
  const user = generator.generatePerson();
  console.log(`Generated User: ${user.fullName}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Phone: ${user.phone}`);
  console.log(`  Age: ${user.age}`);
  console.log(`  Address: ${user.address.street}, ${user.address.city}, ${user.address.state}`);
  
  // Generate financial data for payment tests
  const creditCard = generator.generateCreditCard('Visa');
  console.log(`Credit Card: ${creditCard.number}`);
  console.log(`  Expiry: ${creditCard.expiryDate}, CVV: ${creditCard.cvv}`);
  console.log(`  Holder: ${creditCard.holderName}`);
  
  // Generate company data for B2B tests
  const company = generator.generateCompany();
  console.log(`Company: ${company.name} (${company.industry})`);
  console.log(`  Website: ${company.website}`);
  console.log(`  Tax ID: ${company.taxId}`);
  
  // Generate technical data
  const uuid = generator.generateUUID();
  const password = generator.generatePassword(16, true);
  const url = generator.generateURL('https', 'api');
  console.log(`UUID: ${uuid}`);
  console.log(`Password: ${password}`);
  console.log(`API URL: ${url}`);
  
  // Scenario-based generation
  const loginData = generator.generateScenarioData('login');
  const registrationData = generator.generateScenarioData('registration');
  console.log(`Login scenario:`, loginData);
  console.log(`Registration scenario:`, registrationData);
  
  // Generate arrays for bulk testing
  const testUsers = generator.generateArray(() => generator.generatePerson(), 3);
  console.log(`Generated ${testUsers.length} test users for bulk operations`);
}

/**
 * Example 3: Screenshot Management for Visual Testing
 */
async function screenshotUtilsExamples() {
  console.log('\n=== ScreenshotUtils Examples ===');
  
  const screenshotUtils = ScreenshotUtils.getInstance();
  
  // Note: These examples would work with actual page instances
  console.log('Screenshot utilities initialized');
  console.log(`Screenshot directory: ${screenshotUtils.getScreenshotDirectory()}`);
  console.log(`Comparison directory: ${screenshotUtils.getComparisonDirectory()}`);
  console.log(`Baseline directory: ${screenshotUtils.getBaselineDirectory()}`);
  
  // Example of screenshot metadata structure
  const exampleMetadata = {
    filePath: '/screenshots/login-test_step1_20231125_143022.png',
    timestamp: new Date(),
    testInfo: {
      testName: 'login-test',
      stepName: 'step1',
      browser: 'chromium'
    },
    dimensions: { width: 1920, height: 1080 },
    fileSize: 245760,
    type: 'step' as const
  };
  
  console.log('Example screenshot metadata:', exampleMetadata);
  
  // Generate screenshot report
  const report = screenshotUtils.generateReport();
  console.log('Screenshot report summary:', report.summary);
}

/**
 * Example 4: Data Provider for Multi-Source Data Management
 */
async function dataProviderExamples() {
  console.log('\n=== DataProvider Examples ===');
  
  const dataProvider = DataProvider.getInstance({
    cache: { enabled: true, ttl: 300000 },
    validation: {
      required: ['username', 'email'],
      types: { username: 'string', email: 'string' }
    }
  });
  
  // Create sample test data
  const sampleUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'admin', active: true, age: 30 },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', active: true, age: 25 },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com', role: 'user', active: false, age: 35 },
    { id: 4, username: 'alice_brown', email: 'alice@example.com', role: 'admin', active: true, age: 28 }
  ];
  
  // Query and filter data
  const activeUsers = dataProvider.query(sampleUsers, {
    where: { active: true },
    select: ['username', 'email', 'role'],
    orderBy: [{ field: 'username', direction: 'asc' }]
  });
  console.log('Active users:', activeUsers);
  
  const adminUsers = dataProvider.query(sampleUsers, {
    where: { role: 'admin', active: true },
    limit: 2
  });
  console.log('Admin users:', adminUsers);
  
  const youngUsers = dataProvider.query(sampleUsers, {
    where: { age: { $lt: 30 } }
  });
  console.log('Users under 30:', youngUsers);
  
  // Generate test data
  const generatedLoginData = await dataProvider.generateData('login', 2);
  console.log('Generated login data:', generatedLoginData);
  
  // Data validation
  const validationResult = dataProvider.validate(sampleUsers[0]);
  console.log('Validation result:', validationResult);
  
  // Cache statistics
  const cacheStats = dataProvider.getCacheStats();
  console.log('Cache statistics:', cacheStats);
}

/**
 * Example 5: File Operations for Test Artifacts
 */
async function fileUtilsExamples() {
  console.log('\n=== FileUtils Examples ===');
  
  const fileUtils = FileUtils.getInstance();
  
  try {
    // Create temporary test files
    const tempFile1 = await fileUtils.createTempFile('test-data', '.json', '{"test": "data"}');
    const tempFile2 = await fileUtils.createTempFile('test-log', '.txt', 'Test log entry\n');
    
    console.log(`Created temp files: ${tempFile1}, ${tempFile2}`);
    
    // File information
    const fileInfo = await fileUtils.getFileInfo(tempFile1);
    console.log('File info:', {
      name: fileInfo.name,
      size: fileInfo.size,
      created: fileInfo.created,
      extension: fileInfo.extension
    });
    
    // File operations
    const content = await fileUtils.readFile(tempFile1);
    console.log('File content:', content);
    
    await fileUtils.appendFile(tempFile2, 'Additional log entry\n');
    const logContent = await fileUtils.readFile(tempFile2);
    console.log('Log content:', logContent);
    
    // File comparison
    const hash1 = await fileUtils.calculateHash(tempFile1);
    console.log(`File hash: ${hash1}`);
    
    // File size formatting
    const formattedSize = await fileUtils.getFormattedFileSize(tempFile1);
    console.log(`Formatted file size: ${formattedSize}`);
    
    console.log('File operations completed successfully');
  } catch (error) {
    console.error('File operations error:', error);
  }
}

/**
 * Example 6: Configuration Management
 */
async function configManagerExamples() {
  console.log('\n=== ConfigManager Examples ===');
  
  const configManager = ConfigManager.getInstance({
    defaults: {
      app: {
        name: 'Test Application',
        version: '1.0.0',
        environment: 'development'
      },
      database: {
        host: 'localhost',
        port: 5432,
        timeout: 30000
      },
      browser: {
        headless: true,
        viewport: { width: 1920, height: 1080 }
      }
    }
  });
  
  // Get configuration values
  const appName = configManager.get<string>('app.name');
  const dbPort = configManager.get<number>('database.port', 3306);
  const browserConfig = configManager.getByPrefix('browser');
  
  console.log(`App name: ${appName}`);
  console.log(`Database port: ${dbPort}`);
  console.log('Browser config:', browserConfig);
  
  // Set configuration values
  configManager.set('app.debug', true);
  configManager.set('database.maxConnections', 10);
  
  // Check configuration existence
  const hasDatabase = configManager.has('database');
  const hasCache = configManager.has('cache');
  console.log(`Has database config: ${hasDatabase}`);
  console.log(`Has cache config: ${hasCache}`);
  
  // Configuration validation
  const validation = configManager.validate();
  console.log('Configuration validation:', validation);
  
  // Configuration statistics
  const stats = configManager.getStats();
  console.log('Configuration stats:', stats);
}

/**
 * Example 7: Browser Driver Management
 */
async function driverManagerExamples() {
  console.log('\n=== DriverManager Examples ===');
  
  const driverManager = DriverManager.getInstance();
  
  // Get pool statistics
  const poolStats = driverManager.getPoolStats();
  console.log('Browser pool stats:', poolStats);
  
  try {
    // Get browser capabilities (this would work with actual browser)
    console.log('Browser capabilities would be retrieved here');
    
    // Example session management
    console.log('Browser session management examples:');
    console.log('- createSession(BrowserName.CHROMIUM, options, contextOptions, metadata)');
    console.log('- getSession(BrowserName.FIREFOX, metadata)');
    console.log('- releaseSession(sessionId)');
    console.log('- emulateDevice(sessionId, "iPhone 12")');
    
    // Parallel execution example
    console.log('Parallel execution would run tests across multiple browsers');
    
  } catch (error) {
    console.log('Driver manager examples (simulated):', error.message);
  }
}

/**
 * Example 8: Utility Factory and Convenience Functions
 */
async function utilityFactoryExamples() {
  console.log('\n=== UtilityFactory & Utils Examples ===');
  
  // Initialize all utilities
  await UtilityFactory.initializeAll({
    testDataGenerator: { seed: 54321 },
    configManager: { watch: false }
  });
  
  // Use convenience functions
  const tomorrow = Utils.date.addDays(new Date(), 1);
  const person = Utils.generate.person();
  const randomString = Utils.generate.randomString(10);
  
  console.log(`Tomorrow: ${Utils.date.formatDate(tomorrow, 'YYYY-MM-DD')}`);
  console.log(`Generated person: ${person.fullName}`);
  console.log(`Random string: ${randomString}`);
  
  // Configuration shortcuts
  Utils.config.set('test.mode', 'example');
  const testMode = Utils.config.get('test.mode', 'default');
  console.log(`Test mode: ${testMode}`);
  
  // File shortcuts
  const tempFile = await Utils.file.createTempFile('example');
  await Utils.file.writeFile(tempFile, 'Example content');
  const exists = Utils.file.exists(tempFile);
  console.log(`Temp file exists: ${exists}`);
  
  console.log('Utility factory examples completed');
}

/**
 * Example 9: Complete E2E Test Scenario
 */
async function completeTestScenario() {
  console.log('\n=== Complete E2E Test Scenario Example ===');
  
  try {
    // 1. Initialize utilities
    await UtilityFactory.initializeAll();
    
    // 2. Generate test data
    const testUser = Utils.generate.person();
    const testPassword = Utils.generate.password(12);
    
    console.log(`Test scenario for user: ${testUser.fullName}`);
    
    // 3. Load configuration
    const baseUrl = Utils.config.get('app.baseUrl', 'https://example.com');
    const timeout = Utils.config.get('app.timeout', 30000);
    
    // 4. Create test data file
    const testData = {
      user: testUser,
      password: testPassword,
      testId: Utils.generate.uuid(),
      createdAt: Utils.date.getCurrentDate(),
      scenario: 'user-registration'
    };
    
    const dataFile = await Utils.file.createTempFile('test-scenario', '.json');
    await Utils.file.writeFile(dataFile, JSON.stringify(testData, null, 2));
    
    console.log(`Test data saved to: ${dataFile}`);
    
    // 5. Simulate test execution steps
    const testSteps = [
      'Navigate to registration page',
      'Fill user information',
      'Submit registration form',
      'Verify success message',
      'Navigate to login page',
      'Login with new credentials',
      'Verify dashboard access'
    ];
    
    console.log('Test execution steps:');
    testSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    
    // 6. Generate test report data
    const reportData = {
      testId: testData.testId,
      testName: 'User Registration E2E Test',
      status: 'PASSED',
      duration: '45.2s',
      steps: testSteps.length,
      user: testUser.fullName,
      environment: Utils.config.get('app.environment', 'test'),
      timestamp: Utils.date.formatDate(new Date(), DateFormat.ISO_DATETIME)
    };
    
    console.log('Test execution completed:', reportData);
    
  } catch (error) {
    console.error('Test scenario error:', error);
  } finally {
    // 7. Cleanup
    await UtilityFactory.cleanup();
  }
}

/**
 * Example 10: Data-Driven Testing with Multiple Sources
 */
async function dataDrivenTestingExample() {
  console.log('\n=== Data-Driven Testing Example ===');
  
  const dataProvider = DataProvider.getInstance();
  
  // Simulate different data sources
  const csvTestCases = [
    { testCase: 'Valid Login', username: 'user1', password: 'pass1', expected: 'success' },
    { testCase: 'Invalid Username', username: 'invalid', password: 'pass1', expected: 'error' },
    { testCase: 'Invalid Password', username: 'user1', password: 'wrong', expected: 'error' }
  ];
  
  const generatedTestCases = await dataProvider.generateData('login', 2);
  
  // Combine test data
  const allTestCases = [
    ...csvTestCases,
    ...generatedTestCases.map((data, index) => ({
      testCase: `Generated Test ${index + 1}`,
      username: data.username,
      password: data.password,
      expected: 'success'
    }))
  ];
  
  console.log(`Total test cases: ${allTestCases.length}`);
  
  // Execute test cases
  for (const testCase of allTestCases) {
    console.log(`Executing: ${testCase.testCase}`);
    console.log(`  Username: ${testCase.username}`);
    console.log(`  Expected: ${testCase.expected}`);
    
    // Simulate test execution
    const result = testCase.expected === 'success' ? 'PASSED' : 'FAILED';
    console.log(`  Result: ${result}`);
  }
}

/**
 * Main execution function
 */
async function runAllExamples() {
  console.log('🚀 Starting Comprehensive Utilities Examples');
  console.log('='.repeat(50));
  
  try {
    await dateUtilsExamples();
    await testDataGeneratorExamples();
    await screenshotUtilsExamples();
    await dataProviderExamples();
    await fileUtilsExamples();
    await configManagerExamples();
    await driverManagerExamples();
    await utilityFactoryExamples();
    await completeTestScenario();
    await dataDrivenTestingExample();
    
    console.log('\n✅ All utility examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Export for use in other files
export {
  dateUtilsExamples,
  testDataGeneratorExamples,
  screenshotUtilsExamples,
  dataProviderExamples,
  fileUtilsExamples,
  configManagerExamples,
  driverManagerExamples,
  utilityFactoryExamples,
  completeTestScenario,
  dataDrivenTestingExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}





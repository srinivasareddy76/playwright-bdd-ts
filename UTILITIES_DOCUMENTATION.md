


# 🛠️ Utilities Documentation

This document provides comprehensive documentation for all utility classes and functions in the Playwright BDD TypeScript framework. These utilities enhance the testing capabilities with advanced features for data management, browser handling, file operations, and more.

## 📋 Table of Contents

1. [Overview](#overview)
2. [DateUtils](#dateutils)
3. [TestDataGenerator](#testdatagenerator)
4. [ScreenshotUtils](#screenshotutils)
5. [DataProvider](#dataprovider)
6. [FileUtils](#fileutils)
7. [ConfigManager](#configmanager)
8. [DriverManager](#drivermanager)
9. [UtilityFactory](#utilityfactory)
10. [Usage Examples](#usage-examples)
11. [Best Practices](#best-practices)

---

## Overview

The utilities module provides a comprehensive set of tools for test automation, including:

- **Date handling and manipulation**
- **Dynamic test data generation**
- **Advanced screenshot management**
- **Multi-source data provider**
- **File I/O operations**
- **Configuration management**
- **Browser driver management**

All utilities are designed with:
- ✅ **Singleton patterns** for resource efficiency
- ✅ **Comprehensive error handling** and logging
- ✅ **TypeScript support** with full type definitions
- ✅ **Extensible architecture** for custom implementations
- ✅ **Performance optimization** with caching mechanisms

---

## DateUtils

### Purpose
Comprehensive date handling utilities for test automation scenarios.

### Key Features
- Multiple date format support
- Date arithmetic operations
- Business day calculations
- Timezone conversions
- Random date generation

### Usage Examples

```typescript
import { DateUtils, DateFormat } from '../utils';

// Current date operations
const now = DateUtils.getCurrentDate();
const utcNow = DateUtils.getCurrentDate('UTC');

// Date formatting
const formatted = DateUtils.formatDate(new Date(), DateFormat.ISO_DATE);
const custom = DateUtils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');

// Date arithmetic
const tomorrow = DateUtils.addTime(new Date(), 1, 'days');
const lastWeek = DateUtils.subtractTime(new Date(), 7, 'days');
const nextMonth = DateUtils.addTime(new Date(), 1, 'months');

// Business day calculations
const isBusinessDay = DateUtils.isBusinessDay(new Date());
const nextBusinessDay = DateUtils.getNextBusinessDay(new Date());

// Date comparisons
const age = DateUtils.calculateAge(new Date('1990-01-01'));
const daysDiff = DateUtils.dateDifference(new Date(), tomorrow, 'days');

// Date presets for testing
const presets = DateUtils.getDatePresets();
console.log(presets.today, presets.yesterday, presets.nextWeek);

// Random date generation
const randomDate = DateUtils.generateRandomDate(
  new Date('2020-01-01'),
  new Date('2023-12-31')
);
```

### Available Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `getCurrentDate()` | Get current date/time | `timezone?` | `Date` |
| `formatDate()` | Format date to string | `date, format, timezone?` | `string` |
| `parseDate()` | Parse date string | `dateString, format?` | `Date` |
| `addTime()` | Add time to date | `date, amount, unit` | `Date` |
| `subtractTime()` | Subtract time from date | `date, amount, unit` | `Date` |
| `dateDifference()` | Calculate difference | `date1, date2, unit` | `number` |
| `calculateAge()` | Calculate age | `birthDate, referenceDate?` | `number` |
| `isBusinessDay()` | Check if business day | `date, config?` | `boolean` |
| `getNextBusinessDay()` | Get next business day | `date, config?` | `Date` |
| `generateRandomDate()` | Generate random date | `startDate, endDate` | `Date` |

---

## TestDataGenerator

### Purpose
Dynamic test data generation for various testing scenarios with realistic fake data.

### Key Features
- Personal information generation
- Financial data (credit cards, bank accounts)
- Business data (companies, products)
- Technical data (URLs, IPs, UUIDs)
- Seed-based reproducible generation
- Custom pattern support

### Usage Examples

```typescript
import { TestDataGenerator } from '../utils';

const generator = TestDataGenerator.getInstance();

// Personal data generation
const person = generator.generatePerson();
console.log(person.fullName, person.email, person.phone);

const firstName = generator.generateFirstName('female');
const email = generator.generateEmail('john.doe', 'company.com');
const phone = generator.generatePhoneNumber('(###) ###-####');

// Financial data
const creditCard = generator.generateCreditCard('Visa');
console.log(creditCard.number, creditCard.expiryDate, creditCard.cvv);

// Business data
const company = generator.generateCompany();
console.log(company.name, company.industry, company.website);

// Technical data
const uuid = generator.generateUUID();
const password = generator.generatePassword(16, true);
const url = generator.generateURL('https', 'api');
const ipv4 = generator.generateIPAddress(4);

// Pattern-based generation
const customData = generator.generateFromPattern(
  'User: {firstName} {lastName}, Email: {email}, ID: {uuid}'
);

// Scenario-based generation
const loginData = generator.generateScenarioData('login');
const registrationData = generator.generateScenarioData('registration');
const paymentData = generator.generateScenarioData('payment');

// Array generation
const users = generator.generateArray(() => generator.generatePerson(), 10);

// Seeded generation for reproducible results
generator.reset(12345); // Use specific seed
const reproducibleData = generator.generatePerson();
```

### Available Scenarios

| Scenario | Generated Data |
|----------|----------------|
| `login` | username, password, rememberMe |
| `registration` | Complete user profile with credentials |
| `payment` | Credit card and billing information |
| `contact` | Contact form data |

---

## ScreenshotUtils

### Purpose
Advanced screenshot capture and management with comparison capabilities.

### Key Features
- Multiple capture modes (full page, element, viewport)
- Automatic failure screenshots
- Screenshot comparison and diff generation
- Cross-browser screenshot capture
- Organized storage and metadata

### Usage Examples

```typescript
import { ScreenshotUtils } from '../utils';
import { Page, Locator } from '@playwright/test';

const screenshotUtils = ScreenshotUtils.getInstance();

// Full page screenshots
const metadata = await screenshotUtils.captureFullPage(
  page,
  'login-test',
  'after-login',
  { quality: 90, type: 'png' }
);

// Element screenshots
const loginButton = page.locator('#login-button');
await screenshotUtils.captureElement(
  loginButton,
  'button-test',
  'login-button-state'
);

// Viewport screenshots
await screenshotUtils.captureViewport(
  page,
  'responsive-test',
  'mobile-view',
  { clip: { x: 0, y: 0, width: 375, height: 667 } }
);

// Failure screenshots (automatic on test failures)
await screenshotUtils.captureFailure(
  page,
  'checkout-test',
  'Payment validation failed'
);

// Screenshot comparison
const comparisonResult = await screenshotUtils.captureForComparison(
  page,
  'homepage-test',
  'homepage-baseline',
  { threshold: 0.1 }
);

if (!comparisonResult.matches) {
  console.log(`Screenshots differ by ${comparisonResult.diffPercentage}%`);
}

// Sequential screenshots
const steps = ['login', 'navigate-to-cart', 'add-item', 'checkout'];
const screenshots = await screenshotUtils.captureSequence(
  page,
  'shopping-flow',
  steps
);

// Cross-browser screenshots
const browsers = [
  { name: 'chrome', browser: chromeBrowser },
  { name: 'firefox', browser: firefoxBrowser }
];
const crossBrowserScreenshots = await screenshotUtils.captureCrossBrowser(
  browsers,
  'https://example.com',
  'homepage-comparison'
);

// Screenshot management
const testScreenshots = screenshotUtils.getTestScreenshots('login-test');
const failureScreenshots = screenshotUtils.getFailureScreenshots();
const report = screenshotUtils.generateReport('login-test');

// Cleanup old screenshots
const cleanedCount = await screenshotUtils.cleanupOldScreenshots(7); // 7 days
```

### Screenshot Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `fullPage` | `boolean` | Capture full page | `true` |
| `quality` | `number` | Image quality (0-100) | `90` |
| `type` | `'png' \| 'jpeg'` | Image format | `'png'` |
| `animations` | `'disabled' \| 'allow'` | Handle animations | `'disabled'` |
| `mask` | `Locator[]` | Elements to mask | `[]` |
| `threshold` | `number` | Comparison threshold | `0.2` |

---

## DataProvider

### Purpose
Multi-source test data management with caching, validation, and transformation capabilities.

### Key Features
- Multiple data sources (JSON, CSV, YAML, Database, API)
- Intelligent caching and performance optimization
- Data validation and transformation
- Environment-specific data loading
- Dynamic data filtering and querying

### Usage Examples

```typescript
import { DataProvider, DataSourceType } from '../utils';

const dataProvider = DataProvider.getInstance({
  dataDirectory: './test-data',
  cache: { enabled: true, ttl: 300000 },
  validation: {
    required: ['username', 'password'],
    types: { username: 'string', password: 'string' }
  }
});

// Load data from different sources
const jsonData = await dataProvider.loadJSON('users.json', 'staging');
const csvData = await dataProvider.loadCSV('test-cases.csv', 'production');
const yamlData = await dataProvider.loadYAML('config.yaml');

// Generate test data
const generatedUsers = await dataProvider.generateData('login', 5);
const paymentData = await dataProvider.generateData('payment', 1);

// Query and filter data
const filteredData = dataProvider.query(jsonData, {
  where: { role: 'admin', active: true },
  select: ['username', 'email'],
  orderBy: [{ field: 'username', direction: 'asc' }],
  limit: 10
});

// Complex queries
const complexQuery = dataProvider.query(csvData, {
  where: { 
    age: { $gte: 18, $lt: 65 },
    status: { $in: ['active', 'pending'] }
  },
  skip: 20,
  limit: 10
});

// Scenario-specific data
const loginScenario = await dataProvider.getScenarioData('login', 'staging');
const checkoutScenario = await dataProvider.getScenarioData('checkout');

// Parameterized test data
const testParameters = await dataProvider.getParameterizedData('user-registration');

// Data validation
const validationResult = dataProvider.validate(userData);
if (!validationResult.isValid) {
  console.log('Validation errors:', validationResult.errors);
}

// Save data
await dataProvider.saveData(
  processedData,
  'processed-users.json',
  DataSourceType.JSON,
  'staging'
);

// Cache management
const cacheStats = dataProvider.getCacheStats();
dataProvider.clearCache();
```

### Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ score: { $gte: 80 } }` |
| `$lt` | Less than | `{ price: { $lt: 100 } }` |
| `$lte` | Less than or equal | `{ quantity: { $lte: 10 } }` |
| `$ne` | Not equal | `{ status: { $ne: 'inactive' } }` |
| `$in` | In array | `{ role: { $in: ['admin', 'user'] } }` |
| `$nin` | Not in array | `{ type: { $nin: ['temp', 'test'] } }` |

---

## FileUtils

### Purpose
Comprehensive file I/O operations with advanced features like watching, compression, and validation.

### Key Features
- File and directory operations
- File monitoring and watching
- File search and filtering
- File comparison and hashing
- Temporary file management
- Batch file processing

### Usage Examples

```typescript
import { FileUtils, SearchCriteria } from '../utils';

const fileUtils = FileUtils.getInstance();

// Basic file operations
const exists = fileUtils.exists('/path/to/file.txt');
const content = await fileUtils.readFile('/path/to/file.txt');
await fileUtils.writeFile('/path/to/output.txt', 'Hello World', {
  createDirs: true,
  backup: true
});

// Directory operations
await fileUtils.createDirectory('/path/to/new/dir', true);
const files = await fileUtils.listFiles('/path/to/dir', true); // recursive

// File information
const fileInfo = await fileUtils.getFileInfo('/path/to/file.txt');
console.log(fileInfo.size, fileInfo.modified, fileInfo.hash);

// File search
const searchCriteria: SearchCriteria = {
  pattern: '*.json',
  minSize: 1024,
  modifiedAfter: new Date('2023-01-01'),
  recursive: true
};
const foundFiles = await fileUtils.searchFiles('/data', searchCriteria);

// File watching
const watcherId = fileUtils.watchFile('/config/app.json', (event, filename) => {
  if (event === 'change') {
    console.log(`File changed: ${filename}`);
  }
});

// Stop watching
fileUtils.stopWatching(watcherId);

// File operations
await fileUtils.copy('/source/file.txt', '/dest/file.txt');
await fileUtils.move('/old/location.txt', '/new/location.txt');
await fileUtils.delete('/temp/file.txt');

// File comparison
const areIdentical = await fileUtils.compareFiles('/file1.txt', '/file2.txt');
const hash = await fileUtils.calculateHash('/file.txt', 'sha256');

// Temporary files
const tempFile = await fileUtils.createTempFile('test', '.json', '{"test": true}');
// Temp files are automatically cleaned up on process exit

// Batch operations
const logFiles = await fileUtils.searchFiles('/logs', { extension: 'log' });
for (const logFile of logFiles) {
  const size = await fileUtils.getFormattedFileSize(logFile);
  console.log(`${logFile}: ${size}`);
}
```

### File Search Options

| Option | Type | Description |
|--------|------|-------------|
| `pattern` | `string` | File name pattern with wildcards |
| `extension` | `string` | File extension filter |
| `minSize` | `number` | Minimum file size in bytes |
| `maxSize` | `number` | Maximum file size in bytes |
| `modifiedAfter` | `Date` | Modified after date |
| `modifiedBefore` | `Date` | Modified before date |
| `recursive` | `boolean` | Include subdirectories |
| `caseSensitive` | `boolean` | Case sensitive search |

---

## ConfigManager

### Purpose
Advanced configuration management with multi-source loading, validation, and hot-reloading.

### Key Features
- Multi-source configuration (files, environment, CLI)
- Environment-specific configurations
- Configuration validation and schema enforcement
- Hot-reloading and change notifications
- Secure handling of sensitive data

### Usage Examples

```typescript
import { ConfigManager, ConfigSource } from '../utils';

const configManager = ConfigManager.getInstance({
  configFiles: ['config.json', 'config.yaml'],
  envPrefix: 'APP_',
  watch: true,
  schema: {
    database: {
      host: { required: true, type: 'string' },
      port: { required: true, type: 'number', min: 1, max: 65535 },
      username: { required: true, type: 'string' }
    },
    api: {
      timeout: { type: 'number', min: 1000 },
      retries: { type: 'number', min: 0, max: 10 }
    }
  }
});

// Get configuration values
const dbHost = configManager.get<string>('database.host', 'localhost');
const apiTimeout = configManager.get<number>('api.timeout', 5000);
const features = configManager.getByPrefix('features');

// Set configuration values
configManager.set('api.timeout', 10000);
configManager.set('features.newFeature', true, ConfigSource.RUNTIME);

// Check configuration
const hasDatabase = configManager.has('database');
const dbConfig = configManager.getByPrefix('database');

// Environment-specific configuration
configManager.setEnvironment('staging');
const stagingConfig = configManager.getEnvironmentConfig('staging');

// Configuration validation
const validation = configManager.validate();
if (!validation.isValid) {
  console.log('Configuration errors:', validation.errors);
}

// Configuration changes
configManager.onChange((event) => {
  console.log(`Config changed: ${event.key} = ${event.newValue}`);
});

// Merge configurations
configManager.merge({
  newSection: {
    setting1: 'value1',
    setting2: 'value2'
  }
}, ConfigSource.RUNTIME);

// Save and reload
await configManager.save('./config/updated-config.json');
await configManager.reload();

// Configuration statistics
const stats = configManager.getStats();
console.log(`Total keys: ${stats.totalKeys}, Cache size: ${stats.cacheSize}`);
```

### Environment Variables

Set environment variables with the configured prefix:

```bash
# With default prefix 'APP_'
export APP_DATABASE_HOST=localhost
export APP_DATABASE_PORT=5432
export APP_API_TIMEOUT=10000
export APP_FEATURES_DEBUG=true
```

### CLI Arguments

Pass configuration via command line:

```bash
node test.js --config.database.host=localhost --config.api.timeout=5000
```

---

## DriverManager

### Purpose
Comprehensive browser driver management with pool handling and parallel execution support.

### Key Features
- Multi-browser support (Chromium, Firefox, Safari)
- Browser pool management
- Parallel test execution
- Mobile device emulation
- Session management and isolation

### Usage Examples

```typescript
import { DriverManager, BrowserName } from '../utils';

const driverManager = DriverManager.getInstance();

// Create browser sessions
const chromeSession = await driverManager.createSession(
  BrowserName.CHROMIUM,
  { headless: false, slowMo: 100 },
  { viewport: { width: 1920, height: 1080 } },
  { testName: 'login-test' }
);

// Get sessions from pool
const session = await driverManager.getSession(BrowserName.FIREFOX);

// Use the session
await session.page.goto('https://example.com');
await session.page.click('#login-button');

// Create additional pages in session
const newPage = await driverManager.createPage(session.id);
await newPage.goto('https://example.com/admin');

// Mobile device emulation
await driverManager.emulateDevice(session.id, 'iPhone 12');

// Release session back to pool
await driverManager.releaseSession(session.id);

// Parallel execution across browsers
const results = await driverManager.executeParallel(
  [BrowserName.CHROMIUM, BrowserName.FIREFOX, BrowserName.WEBKIT],
  async (session, testData) => {
    await session.page.goto(testData.url);
    return await session.page.title();
  },
  { url: 'https://example.com' }
);

// Cross-browser screenshots
const screenshots = await driverManager.takeScreenshotAll('homepage-test');

// Browser capabilities
const capabilities = await driverManager.getBrowserCapabilities(BrowserName.CHROMIUM);
console.log(capabilities.browserVersion, capabilities.features);

// Pool statistics
const poolStats = driverManager.getPoolStats();
console.log(`Active sessions: ${poolStats.totalSessions}`);
console.log(`Available: ${poolStats.availableSessions}`);
console.log(`Busy: ${poolStats.busySessions}`);

// Cleanup (automatically called on process exit)
await driverManager.cleanup();
```

### Browser Pool Configuration

Configure the browser pool in your configuration:

```json
{
  "browser": {
    "pool": {
      "maxInstances": 5,
      "minInstances": 1,
      "idleTimeout": 300000,
      "reuseInstances": true,
      "browserTypes": ["chromium", "firefox"]
    },
    "headless": true,
    "viewport": { "width": 1920, "height": 1080 },
    "timeout": 30000
  }
}
```

---

## UtilityFactory

### Purpose
Centralized factory for creating and managing utility instances with proper initialization.

### Usage Examples

```typescript
import { UtilityFactory, Utils } from '../utils';

// Initialize all utilities
await UtilityFactory.initializeAll({
  testDataGenerator: { seed: 12345 },
  dataProvider: { cache: { enabled: true } },
  configManager: { watch: true }
});

// Get specific utility instances
const dateUtils = UtilityFactory.getDateUtils();
const generator = UtilityFactory.getTestDataGenerator();
const fileUtils = UtilityFactory.getFileUtils();

// Use convenience functions
const tomorrow = Utils.date.addDays(new Date(), 1);
const person = Utils.generate.person();
const config = Utils.config.get('database.host');

// Cleanup all utilities
await UtilityFactory.cleanup();
```

---

## Usage Examples

### Complete Test Scenario Example

```typescript
import { 
  Utils, 
  UtilityFactory, 
  BrowserName, 
  DateFormat 
} from '../utils';

describe('E2E User Registration Test', () => {
  let driverManager: any;
  let session: any;

  beforeAll(async () => {
    // Initialize all utilities
    await UtilityFactory.initializeAll();
    driverManager = UtilityFactory.getDriverManager();
  });

  beforeEach(async () => {
    // Get browser session
    session = await driverManager.getSession(BrowserName.CHROMIUM, {
      testName: 'user-registration'
    });
  });

  afterEach(async () => {
    // Capture screenshot on failure
    if (this.currentTest?.state === 'failed') {
      await Utils.screenshot.captureFailure(
        session.page,
        'user-registration',
        this.currentTest.err?.message || 'Test failed'
      );
    }
    
    // Release session
    await driverManager.releaseSession(session.id);
  });

  afterAll(async () => {
    // Cleanup all utilities
    await UtilityFactory.cleanup();
  });

  test('should register new user successfully', async () => {
    // Generate test data
    const userData = Utils.generate.person();
    const password = Utils.generate.password(12);
    
    // Load test configuration
    const baseUrl = Utils.config.get('app.baseUrl', 'http://localhost:3000');
    
    // Navigate to registration page
    await session.page.goto(`${baseUrl}/register`);
    
    // Take screenshot of initial state
    await Utils.screenshot.captureFullPage(
      session.page,
      'user-registration',
      'initial-page'
    );
    
    // Fill registration form
    await session.page.fill('#firstName', userData.firstName);
    await session.page.fill('#lastName', userData.lastName);
    await session.page.fill('#email', userData.email);
    await session.page.fill('#password', password);
    await session.page.fill('#confirmPassword', password);
    
    // Select birth date
    const birthDate = Utils.date.formatDate(userData.dateOfBirth, DateFormat.ISO_DATE);
    await session.page.fill('#birthDate', birthDate);
    
    // Take screenshot before submission
    await Utils.screenshot.captureFullPage(
      session.page,
      'user-registration',
      'form-filled'
    );
    
    // Submit form
    await session.page.click('#submitButton');
    
    // Wait for success message
    await session.page.waitForSelector('.success-message');
    
    // Take final screenshot
    await Utils.screenshot.captureFullPage(
      session.page,
      'user-registration',
      'success'
    );
    
    // Save test data for future reference
    const testData = {
      user: userData,
      password: password,
      registrationDate: Utils.date.getCurrentDate(),
      testId: Utils.generate.uuid()
    };
    
    const tempFile = await Utils.file.createTempFile('registration-data', '.json');
    await Utils.file.writeFile(tempFile, JSON.stringify(testData, null, 2));
    
    // Verify registration success
    const successMessage = await session.page.textContent('.success-message');
    expect(successMessage).toContain('Registration successful');
  });
});
```

### Data-Driven Testing Example

```typescript
import { Utils, DataProvider } from '../utils';

describe('Login Tests with Multiple Data Sources', () => {
  let loginData: any[];

  beforeAll(async () => {
    const dataProvider = DataProvider.getInstance();
    
    // Load test data from multiple sources
    const csvData = await dataProvider.loadCSV('login-test-cases.csv');
    const jsonData = await dataProvider.loadJSON('user-accounts.json', 'staging');
    const generatedData = await dataProvider.generateData('login', 5);
    
    // Combine and filter data
    loginData = [
      ...csvData,
      ...dataProvider.query(jsonData, { where: { active: true } }),
      ...generatedData
    ];
  });

  loginData.forEach((testCase, index) => {
    test(`Login test case ${index + 1}: ${testCase.description}`, async () => {
      const session = await Utils.browser.getSession();
      
      try {
        await session.page.goto(Utils.config.get('app.loginUrl'));
        await session.page.fill('#username', testCase.username);
        await session.page.fill('#password', testCase.password);
        await session.page.click('#loginButton');
        
        if (testCase.expectedResult === 'success') {
          await session.page.waitForSelector('.dashboard');
          expect(await session.page.isVisible('.dashboard')).toBe(true);
        } else {
          await session.page.waitForSelector('.error-message');
          expect(await session.page.isVisible('.error-message')).toBe(true);
        }
      } finally {
        await Utils.browser.releaseSession(session.id);
      }
    });
  });
});
```

---

## Best Practices

### 1. **Utility Initialization**
```typescript
// Initialize utilities at the beginning of test suites
beforeAll(async () => {
  await UtilityFactory.initializeAll({
    testDataGenerator: { seed: process.env.TEST_SEED },
    configManager: { watch: process.env.NODE_ENV === 'development' }
  });
});

// Always cleanup after tests
afterAll(async () => {
  await UtilityFactory.cleanup();
});
```

### 2. **Error Handling**
```typescript
// Wrap utility calls in try-catch blocks
try {
  const data = await Utils.data.loadJSON('test-data.json');
} catch (error) {
  logger.error(`Failed to load test data: ${error.message}`);
  // Use fallback data or skip test
}
```

### 3. **Resource Management**
```typescript
// Always release browser sessions
let session;
try {
  session = await Utils.browser.getSession();
  // Use session...
} finally {
  if (session) {
    await Utils.browser.releaseSession(session.id);
  }
}
```

### 4. **Configuration Management**
```typescript
// Use environment-specific configurations
const config = Utils.config.get('database');
const environment = process.env.NODE_ENV || 'development';
Utils.config.setEnvironment(environment);
```

### 5. **Data Generation**
```typescript
// Use seeded generation for reproducible tests
const generator = UtilityFactory.getTestDataGenerator({ seed: 12345 });
const userData = generator.generatePerson();

// Reset seed for different test scenarios
generator.reset(54321);
```

### 6. **Screenshot Management**
```typescript
// Organize screenshots by test and step
await Utils.screenshot.captureFullPage(page, testName, stepName);

// Use failure screenshots for debugging
if (testFailed) {
  await Utils.screenshot.captureFailure(page, testName, errorMessage);
}

// Clean up old screenshots periodically
await screenshotUtils.cleanupOldScreenshots(7); // Keep last 7 days
```

### 7. **File Operations**
```typescript
// Use temporary files for test artifacts
const tempFile = await Utils.file.createTempFile('test-output', '.json');
// Temp files are automatically cleaned up

// Check file existence before operations
if (Utils.file.exists(filePath)) {
  const content = await Utils.file.readFile(filePath);
}
```

### 8. **Performance Optimization**
```typescript
// Enable caching for frequently accessed data
const dataProvider = DataProvider.getInstance({
  cache: { enabled: true, ttl: 300000 } // 5 minutes
});

// Use browser pool for parallel execution
const results = await driverManager.executeParallel(
  [BrowserName.CHROMIUM, BrowserName.FIREFOX],
  testFunction,
  testData
);
```

---

## 🎯 Summary

The utilities module provides a comprehensive toolkit for test automation with:

- **🗓️ DateUtils**: Complete date handling and business logic
- **🎲 TestDataGenerator**: Realistic fake data generation
- **📸 ScreenshotUtils**: Advanced screenshot management
- **📊 DataProvider**: Multi-source data management
- **📁 FileUtils**: Comprehensive file operations
- **⚙️ ConfigManager**: Advanced configuration handling
- **🌐 DriverManager**: Browser management and pooling
- **🏭 UtilityFactory**: Centralized utility management

All utilities are designed for enterprise-grade test automation with proper error handling, logging, and performance optimization.

For more specific examples and advanced usage, refer to the individual utility class documentation and the test examples in the repository.



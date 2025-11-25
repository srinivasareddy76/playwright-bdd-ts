




# 🎯 Sample Feature Files - Utilities Demonstration

This directory contains comprehensive sample feature files that demonstrate how to use all the utility classes created for the Playwright BDD TypeScript framework. These examples serve as both documentation and reference implementations for real-world test automation scenarios.

## 📁 Directory Structure

```
src/applications/examples/
├── README.md                           # This documentation file
├── features/
│   ├── user-registration.feature       # User management and data generation examples
│   ├── e-commerce-checkout.feature     # Payment processing and financial data examples
│   ├── data-management.feature         # File operations and data provider examples
│   ├── visual-testing.feature          # Screenshot and visual testing examples
│   └── api-testing.feature             # API testing with comprehensive utilities integration
└── step-definitions/
    └── utilities-steps.ts              # Comprehensive step definitions for all utilities
```

## 🚀 Feature Files Overview

### 1. **user-registration.feature**
**Focus**: User Management, Data Generation, Age Verification

**Utilities Demonstrated**:
- `TestDataGenerator`: Dynamic user profile generation
- `DateUtils`: Age calculations and business day handling
- `ScreenshotUtils`: Registration flow documentation
- `FileUtils`: Test data persistence
- `ConfigManager`: Environment-specific configurations
- `DriverManager`: Cross-browser testing

**Key Scenarios**:
- ✅ Successful registration with generated data
- ❌ Validation testing with invalid data patterns
- 📊 Bulk user registration with different profiles
- 🌍 Environment-specific registration flows
- 📁 File-based data management
- 📅 Age verification with date calculations
- 🌐 Cross-browser registration testing

### 2. **e-commerce-checkout.feature**
**Focus**: Payment Processing, Financial Data, Performance Testing

**Utilities Demonstrated**:
- `TestDataGenerator`: Credit card and financial data generation
- `DateUtils`: Subscription billing and date calculations
- `FileUtils`: Inventory monitoring and reporting
- `ConfigManager`: Multi-environment shipping and tax calculations
- `DriverManager`: Cross-browser checkout validation
- `ScreenshotUtils`: Payment flow documentation

**Key Scenarios**:
- 💳 Credit card payment processing with generated data
- 🔄 Multiple card types testing (Visa, MasterCard, Amex, Discover)
- 📅 Subscription checkout with recurring billing dates
- 📦 Inventory validation with file monitoring
- 🌍 Environment-specific shipping and tax calculations
- 🌐 Cross-browser checkout compatibility
- ⚡ Performance testing with bulk order generation
- 🔒 Security validation with invalid payment data

### 3. **data-management.feature**
**Focus**: File Operations, Data Processing, Caching, Validation

**Utilities Demonstrated**:
- `DataProvider`: Multi-format data loading (JSON, CSV, YAML)
- `FileUtils`: File monitoring, compression, temporary file management
- `ConfigManager`: Dynamic configuration management
- `TestDataGenerator`: Bulk data generation for different scenarios

**Key Scenarios**:
- 📄 Multi-format data loading and processing
- ⚡ Data caching and performance optimization
- 👁️ Real-time file monitoring and change detection
- ✅ Data validation and schema enforcement
- 🔍 Advanced data querying and transformation
- 🗜️ File compression and archiving operations
- 🧹 Temporary file management and cleanup
- 📊 Bulk test data generation for various scenarios
- ⚙️ Dynamic configuration management across environments
- 📤 Data export and multi-format reporting

### 4. **visual-testing.feature**
**Focus**: Screenshot Management, Visual Regression, Cross-Browser Testing

**Utilities Demonstrated**:
- `ScreenshotUtils`: Advanced screenshot capture and comparison
- `DriverManager`: Multi-browser and device emulation
- `FileUtils`: Screenshot organization and cleanup
- `ConfigManager`: Visual testing configuration

**Key Scenarios**:
- 📸 Comprehensive screenshot capture across viewports
- 🔍 Visual regression testing with baseline comparison
- 🌐 Cross-browser visual consistency testing
- 🧩 Component-level visual testing and isolation
- ❌ Automatic failure screenshot capture and analysis
- ✏️ Screenshot annotation and markup for documentation
- ⚡ Screenshot performance optimization and storage management
- 📱 Sequential screenshot capture for user flow documentation
- 📱 Mobile device visual testing and responsive design validation
- ♿ Visual accessibility testing and compliance validation

## 🛠️ Step Definitions

### **utilities-steps.ts**
Comprehensive step definitions that demonstrate:

**Setup and Initialization**:
- Utility factory initialization
- Configuration management
- Resource cleanup

**Data Generation**:
- User profile generation with TestDataGenerator
- Credit card and financial data generation
- Invalid data pattern generation for negative testing
- Age-based user generation with DateUtils

**File Operations**:
- Temporary file creation and management
- File monitoring and change detection
- Multi-format data file handling
- File compression and archiving

**Browser Management**:
- Multi-browser session initialization
- Cross-browser testing setup
- Parallel execution management

**Screenshot Operations**:
- Full-page and element screenshot capture
- Visual regression testing
- Cross-browser screenshot comparison

**Configuration Management**:
- Environment-specific configuration loading
- Dynamic configuration updates
- Multi-environment testing

## 🎯 Usage Examples

### **Running Individual Features**

```bash
# Run user registration scenarios
npx cucumber-js src/applications/examples/features/user-registration.feature

# Run e-commerce checkout scenarios
npx cucumber-js src/applications/examples/features/e-commerce-checkout.feature

# Run data management scenarios
npx cucumber-js src/applications/examples/features/data-management.feature

# Run visual testing scenarios
npx cucumber-js src/applications/examples/features/visual-testing.feature

# Run API testing scenarios
npx cucumber-js src/applications/examples/features/api-testing.feature
```

### **Running Specific Scenarios by Tags**

```bash
# Run only smoke tests
npx cucumber-js src/applications/examples/features/ --tags "@smoke"

# Run data generation tests
npx cucumber-js src/applications/examples/features/ --tags "@data-generation"

# Run cross-browser tests
npx cucumber-js src/applications/examples/features/ --tags "@cross-browser"

# Run visual testing scenarios
npx cucumber-js src/applications/examples/features/ --tags "@visual-testing"

# Run file operations tests
npx cucumber-js src/applications/examples/features/ --tags "@file-operations"

# Run all sample features
npx cucumber-js src/applications/examples/features/
```

### **Running with Different Environments**

```bash
# Run in staging environment
NODE_ENV=staging npx cucumber-js src/applications/examples/features/

# Run in production environment
NODE_ENV=production npx cucumber-js src/applications/examples/features/

# Run with specific browser
BROWSER=firefox npx cucumber-js src/applications/examples/features/
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Test environment
NODE_ENV=test|staging|production

# Browser selection
BROWSER=chromium|firefox|webkit

# Screenshot settings
SCREENSHOT_MODE=on-failure|always|never

# Data generation seed
TEST_DATA_SEED=12345

# File monitoring
FILE_WATCH_ENABLED=true|false
```

### **Utility Configuration Examples**

```typescript
// TestDataGenerator configuration
const generatorConfig = {
  seed: 12345,
  locale: 'en_US',
  patterns: {
    email: 'custom-pattern',
    phone: 'US-format'
  }
};

// DataProvider configuration
const dataProviderConfig = {
  cache: {
    enabled: true,
    maxSize: 100,
    ttl: 300000
  },
  sources: ['json', 'csv', 'yaml'],
  validation: {
    strict: true,
    schemas: './schemas/'
  }
};

// ScreenshotUtils configuration
const screenshotConfig = {
  quality: 90,
  format: 'png',
  fullPage: true,
  animations: 'disabled',
  comparison: {
    threshold: 0.1,
    includeAA: false
  }
};
```

## 📊 Test Data Examples

### **Generated User Profile**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "email": "john.doe123@example.com",
  "phone": "(555) 123-4567",
  "dateOfBirth": "1990-05-15T00:00:00.000Z",
  "age": 34,
  "gender": "Male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

### **Generated Credit Card**
```json
{
  "type": "Visa",
  "number": "4532015112830366",
  "expiryDate": "12/27",
  "cvv": "123",
  "cardholderName": "John Doe"
}
```

### **Test Configuration**
```yaml
environment: test
api:
  baseUrl: https://api-test.example.com
  timeout: 10000
database:
  host: localhost
  port: 5432
  name: test_db
browser:
  headless: true
  viewport:
    width: 1920
    height: 1080
```

## 🎨 Best Practices Demonstrated

### **1. Data Generation**
- ✅ Use seeded generation for reproducible tests
- ✅ Generate realistic data patterns
- ✅ Create scenario-specific data sets
- ✅ Validate generated data quality

### **2. File Management**
- ✅ Use temporary files for test data
- ✅ Implement proper cleanup procedures
- ✅ Monitor file changes in real-time
- ✅ Handle multiple file formats efficiently

### **3. Screenshot Management**
- ✅ Organize screenshots by test scenario
- ✅ Implement visual regression testing
- ✅ Capture failure screenshots automatically
- ✅ Optimize screenshot storage and performance

### **4. Cross-Browser Testing**
- ✅ Test across multiple browsers simultaneously
- ✅ Validate visual consistency
- ✅ Handle browser-specific configurations
- ✅ Generate compatibility reports

### **5. Configuration Management**
- ✅ Use environment-specific configurations
- ✅ Implement hot-reloading for dynamic updates
- ✅ Validate configuration schemas
- ✅ Handle sensitive configuration data securely

## 🚀 Getting Started

1. **Initialize the utilities**:
   ```typescript
   import { UtilityFactory } from '../../src/utils';
   await UtilityFactory.initializeAll();
   ```

2. **Generate test data**:
   ```typescript
   import { Utils } from '../../src/utils';
   const user = Utils.generate.person();
   const creditCard = Utils.generate.creditCard();
   ```

3. **Capture screenshots**:
   ```typescript
   const screenshotPath = await Utils.screenshot.captureFullPage(page, 'test-scenario');
   ```

4. **Manage files**:
   ```typescript
   const tempFile = await Utils.file.createTempFile('test-data', '.json');
   await Utils.file.writeFile(tempFile, JSON.stringify(data));
   ```

5. **Load configuration**:
   ```typescript
   const apiUrl = Utils.config.get('api.baseUrl');
   Utils.config.set('test.environment', 'staging');
   ```

## 📈 Advanced Usage Patterns

### **Data-Driven Testing**
```gherkin
Scenario Outline: Test with multiple data sets
  Given I load test data from "<dataFile>"
  When I execute test with "<testType>" data
  Then the result should be "<expected>"

  Examples:
    | dataFile        | testType | expected |
    | users.json      | standard | success  |
    | premium.json    | premium  | success  |
    | invalid.json    | invalid  | error    |
```

### **Parallel Execution**
```typescript
// Execute tests in parallel across multiple browsers
const results = await DriverManager.executeParallel(
  [BrowserName.CHROMIUM, BrowserName.FIREFOX],
  async (session, testData) => {
    // Test execution logic
    return testResult;
  },
  testData
);
```

### **Visual Regression Testing**
```typescript
// Capture and compare screenshots
const currentScreenshot = await ScreenshotUtils.captureFullPage(page, 'homepage');
const comparisonResult = await ScreenshotUtils.compareScreenshots(
  baselineScreenshot,
  currentScreenshot
);
```

## 🎯 Learning Objectives

By studying and running these sample features, you will learn:

1. **Comprehensive Utility Usage**: How to effectively use all 7 utility classes
2. **Real-World Scenarios**: Practical applications in test automation
3. **Best Practices**: Industry-standard patterns and approaches
4. **Integration Patterns**: How utilities work together seamlessly
5. **Performance Optimization**: Efficient resource management and caching
6. **Cross-Browser Testing**: Multi-browser validation strategies
7. **Visual Testing**: Screenshot management and regression testing
8. **Data Management**: File operations and data provider usage

## 🔗 Related Documentation

- [Utilities Documentation](../../UTILITIES_DOCUMENTATION.md)
- [Usage Examples](../../examples/utilities-usage-examples.ts)
- [Test Suite](../../src/utils/utils.test.ts)
- [Implementation Summary](../../UTILITIES_SUMMARY.md)

---

**Note**: These sample features are designed for demonstration and learning purposes. In a real project, you would adapt these patterns to your specific application and testing requirements.





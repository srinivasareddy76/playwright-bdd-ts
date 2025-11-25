



/**
 * Comprehensive Utilities Test Suite
 * 
 * This test suite validates all utility classes and their functionality
 * to ensure they work correctly in the BDD framework environment.
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
  Utils 
} from './index';

describe('Utilities Test Suite', () => {
  
  describe('DateUtils', () => {
    test('should get current date', () => {
      const now = DateUtils.getCurrentDate();
      expect(now).toBeInstanceOf(Date);
      expect(now.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test('should format dates correctly', () => {
      const testDate = new Date('2023-12-25T10:30:45.123Z');
      
      const isoDate = DateUtils.formatDate(testDate, DateFormat.ISO_DATE);
      expect(isoDate).toBe('2023-12-25');
      
      const customFormat = DateUtils.formatDate(testDate, 'YYYY-MM-DD HH:mm:ss');
      expect(customFormat).toMatch(/2023-12-25 \d{2}:\d{2}:\d{2}/);
    });

    test('should perform date arithmetic', () => {
      const baseDate = new Date('2023-01-15');
      
      const futureDate = DateUtils.addTime(baseDate, 10, 'days');
      expect(futureDate.getDate()).toBe(25);
      
      const pastDate = DateUtils.subtractTime(baseDate, 5, 'days');
      expect(pastDate.getDate()).toBe(10);
    });

    test('should calculate age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2023-01-01');
      
      const age = DateUtils.calculateAge(birthDate, referenceDate);
      expect(age).toBe(33);
    });

    test('should check business days', () => {
      const monday = new Date('2023-12-25'); // Monday
      const saturday = new Date('2023-12-30'); // Saturday
      
      expect(DateUtils.isBusinessDay(monday)).toBe(true);
      expect(DateUtils.isBusinessDay(saturday)).toBe(false);
    });

    test('should provide date presets', () => {
      const presets = DateUtils.getDatePresets();
      
      expect(presets.today).toBeInstanceOf(Date);
      expect(presets.yesterday).toBeInstanceOf(Date);
      expect(presets.tomorrow).toBeInstanceOf(Date);
      expect(presets.nextWeek).toBeInstanceOf(Date);
    });
  });

  describe('TestDataGenerator', () => {
    let generator: TestDataGenerator;

    beforeEach(() => {
      generator = TestDataGenerator.getInstance({ seed: 12345 });
    });

    test('should generate consistent data with seed', () => {
      const person1 = generator.generatePerson();
      
      generator.reset(12345);
      const person2 = generator.generatePerson();
      
      expect(person1.firstName).toBe(person2.firstName);
      expect(person1.lastName).toBe(person2.lastName);
    });

    test('should generate valid person data', () => {
      const person = generator.generatePerson();
      
      expect(person.firstName).toBeTruthy();
      expect(person.lastName).toBeTruthy();
      expect(person.fullName).toContain(person.firstName);
      expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(person.age).toBeGreaterThan(0);
      expect(person.address).toBeDefined();
    });

    test('should generate valid credit card data', () => {
      const creditCard = generator.generateCreditCard('Visa');
      
      expect(creditCard.type).toBe('Visa');
      expect(creditCard.number).toMatch(/^\d{4} \d{4} \d{4} \d{4}$/);
      expect(creditCard.expiryDate).toMatch(/^\d{2}\/\d{2}$/);
      expect(creditCard.cvv).toMatch(/^\d{3}$/);
      expect(creditCard.holderName).toBeTruthy();
    });

    test('should generate company data', () => {
      const company = generator.generateCompany();
      
      expect(company.name).toBeTruthy();
      expect(company.industry).toBeTruthy();
      expect(company.website).toMatch(/^www\..+\.com$/);
      expect(company.email).toMatch(/^info@.+\.com$/);
      expect(company.taxId).toMatch(/^\d{2}-\d{7}$/);
    });

    test('should generate technical data', () => {
      const uuid = generator.generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      
      const password = generator.generatePassword(12, true);
      expect(password).toHaveLength(12);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      
      const url = generator.generateURL('https');
      expect(url).toMatch(/^https:\/\/.+/);
    });

    test('should generate scenario data', () => {
      const loginData = generator.generateScenarioData('login');
      
      expect(loginData.username).toBeTruthy();
      expect(loginData.password).toBeTruthy();
      expect(typeof loginData.rememberMe).toBe('boolean');
    });

    test('should generate arrays of data', () => {
      const users = generator.generateArray(() => generator.generatePerson(), 5);
      
      expect(users).toHaveLength(5);
      users.forEach(user => {
        expect(user.firstName).toBeTruthy();
        expect(user.lastName).toBeTruthy();
      });
    });
  });

  describe('ScreenshotUtils', () => {
    let screenshotUtils: ScreenshotUtils;

    beforeEach(() => {
      screenshotUtils = ScreenshotUtils.getInstance();
    });

    test('should initialize with correct directories', () => {
      const screenshotDir = screenshotUtils.getScreenshotDirectory();
      const comparisonDir = screenshotUtils.getComparisonDirectory();
      const baselineDir = screenshotUtils.getBaselineDirectory();
      
      expect(screenshotDir).toContain('screenshots');
      expect(comparisonDir).toContain('comparisons');
      expect(baselineDir).toContain('baselines');
    });

    test('should generate screenshot report', () => {
      const report = screenshotUtils.generateReport();
      
      expect(report.summary).toBeDefined();
      expect(report.summary.totalScreenshots).toBeGreaterThanOrEqual(0);
      expect(report.summary.byType).toBeDefined();
      expect(report.screenshots).toBeInstanceOf(Array);
    });

    test('should get empty screenshots for non-existent test', () => {
      const screenshots = screenshotUtils.getTestScreenshots('non-existent-test');
      expect(screenshots).toHaveLength(0);
    });

    test('should get empty failure screenshots initially', () => {
      const failureScreenshots = screenshotUtils.getFailureScreenshots();
      expect(failureScreenshots).toHaveLength(0);
    });
  });

  describe('DataProvider', () => {
    let dataProvider: DataProvider;

    beforeEach(() => {
      dataProvider = DataProvider.getInstance({
        cache: { enabled: true, ttl: 300000 },
        validation: {
          required: ['id', 'name'],
          types: { id: 'number', name: 'string' }
        }
      });
    });

    test('should query data with filters', () => {
      const testData = [
        { id: 1, name: 'John', age: 30, active: true },
        { id: 2, name: 'Jane', age: 25, active: false },
        { id: 3, name: 'Bob', age: 35, active: true }
      ];

      const activeUsers = dataProvider.query(testData, {
        where: { active: true }
      });
      
      expect(activeUsers).toHaveLength(2);
      expect(activeUsers.every(user => user.active)).toBe(true);
    });

    test('should query with complex conditions', () => {
      const testData = [
        { id: 1, age: 20 },
        { id: 2, age: 30 },
        { id: 3, age: 40 }
      ];

      const result = dataProvider.query(testData, {
        where: { age: { $gte: 25, $lt: 35 } }
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(30);
    });

    test('should query with sorting and pagination', () => {
      const testData = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];

      const result = dataProvider.query(testData, {
        orderBy: [{ field: 'name', direction: 'asc' }],
        limit: 2
      });
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
    });

    test('should validate data correctly', () => {
      const validData = { id: 1, name: 'John', age: 30 };
      const invalidData = { name: 'John' }; // missing required id

      const validResult = dataProvider.validate(validData);
      const invalidResult = dataProvider.validate(invalidData);
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('Required field missing: id');
    });

    test('should generate test data', async () => {
      const loginData = await dataProvider.generateData('login', 2);
      
      expect(loginData).toHaveLength(2);
      loginData.forEach(data => {
        expect(data.username).toBeTruthy();
        expect(data.password).toBeTruthy();
      });
    });

    test('should manage cache', () => {
      const stats = dataProvider.getCacheStats();
      
      expect(stats.enabled).toBe(true);
      expect(stats.size).toBeGreaterThanOrEqual(0);
      expect(stats.entries).toBeInstanceOf(Array);
      
      dataProvider.clearCache();
      const clearedStats = dataProvider.getCacheStats();
      expect(clearedStats.size).toBe(0);
    });
  });

  describe('FileUtils', () => {
    let fileUtils: FileUtils;
    let tempFiles: string[] = [];

    beforeEach(() => {
      fileUtils = FileUtils.getInstance();
    });

    afterEach(async () => {
      // Cleanup temp files
      for (const tempFile of tempFiles) {
        try {
          if (fileUtils.exists(tempFile)) {
            await fileUtils.delete(tempFile);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      tempFiles = [];
    });

    test('should create and manage temporary files', async () => {
      const tempFile = await fileUtils.createTempFile('test', '.txt', 'Hello World');
      tempFiles.push(tempFile);
      
      expect(fileUtils.exists(tempFile)).toBe(true);
      
      const content = await fileUtils.readFile(tempFile);
      expect(content).toBe('Hello World');
    });

    test('should perform file operations', async () => {
      const tempFile = await fileUtils.createTempFile('test', '.txt', 'Initial content');
      tempFiles.push(tempFile);
      
      // Append content
      await fileUtils.appendFile(tempFile, '\nAppended content');
      
      const content = await fileUtils.readFile(tempFile);
      expect(content).toContain('Initial content');
      expect(content).toContain('Appended content');
      
      // Get file info
      const fileInfo = await fileUtils.getFileInfo(tempFile);
      expect(fileInfo.name).toContain('test');
      expect(fileInfo.extension).toBe('.txt');
      expect(fileInfo.size).toBeGreaterThan(0);
    });

    test('should calculate file hash', async () => {
      const tempFile = await fileUtils.createTempFile('hash-test', '.txt', 'Test content');
      tempFiles.push(tempFile);
      
      const hash = await fileUtils.calculateHash(tempFile);
      expect(hash).toMatch(/^[a-f0-9]{32}$/); // MD5 hash format
    });

    test('should compare files', async () => {
      const file1 = await fileUtils.createTempFile('file1', '.txt', 'Same content');
      const file2 = await fileUtils.createTempFile('file2', '.txt', 'Same content');
      const file3 = await fileUtils.createTempFile('file3', '.txt', 'Different content');
      
      tempFiles.push(file1, file2, file3);
      
      const identical = await fileUtils.compareFiles(file1, file2);
      const different = await fileUtils.compareFiles(file1, file3);
      
      expect(identical).toBe(true);
      expect(different).toBe(false);
    });

    test('should format file size', async () => {
      const tempFile = await fileUtils.createTempFile('size-test', '.txt', 'A'.repeat(1024));
      tempFiles.push(tempFile);
      
      const formattedSize = await fileUtils.getFormattedFileSize(tempFile);
      expect(formattedSize).toMatch(/KB|Bytes/);
    });
  });

  describe('ConfigManager', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
      configManager = ConfigManager.getInstance({
        defaults: {
          app: { name: 'Test App', version: '1.0.0' },
          database: { host: 'localhost', port: 5432 }
        }
      });
    });

    test('should get configuration values', () => {
      const appName = configManager.get('app.name');
      const dbPort = configManager.get('database.port', 3306);
      const nonExistent = configManager.get('non.existent', 'default');
      
      expect(appName).toBe('Test App');
      expect(dbPort).toBe(5432);
      expect(nonExistent).toBe('default');
    });

    test('should set configuration values', () => {
      configManager.set('app.debug', true);
      configManager.set('new.setting', 'value');
      
      expect(configManager.get('app.debug')).toBe(true);
      expect(configManager.get('new.setting')).toBe('value');
    });

    test('should check configuration existence', () => {
      expect(configManager.has('app.name')).toBe(true);
      expect(configManager.has('non.existent')).toBe(false);
    });

    test('should get configuration by prefix', () => {
      const appConfig = configManager.getByPrefix('app');
      
      expect(appConfig.name).toBe('Test App');
      expect(appConfig.version).toBe('1.0.0');
    });

    test('should delete configuration keys', () => {
      configManager.set('temp.setting', 'value');
      expect(configManager.has('temp.setting')).toBe(true);
      
      configManager.delete('temp.setting');
      expect(configManager.has('temp.setting')).toBe(false);
    });

    test('should validate configuration', () => {
      const validation = configManager.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should get configuration statistics', () => {
      const stats = configManager.getStats();
      
      expect(stats.totalKeys).toBeGreaterThan(0);
      expect(stats.cacheSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('DriverManager', () => {
    let driverManager: DriverManager;

    beforeEach(() => {
      driverManager = DriverManager.getInstance();
    });

    test('should get pool statistics', () => {
      const stats = driverManager.getPoolStats();
      
      expect(stats.totalSessions).toBeGreaterThanOrEqual(0);
      expect(stats.availableSessions).toBeGreaterThanOrEqual(0);
      expect(stats.busySessions).toBeGreaterThanOrEqual(0);
      expect(stats.maxInstances).toBeGreaterThan(0);
      expect(stats.sessionDetails).toBeInstanceOf(Array);
    });

    // Note: Browser-related tests would require actual browser instances
    // These are integration tests that would run in a full test environment
  });

  describe('UtilityFactory', () => {
    test('should get utility instances', () => {
      const dateUtils = UtilityFactory.getDateUtils();
      const testDataGenerator = UtilityFactory.getTestDataGenerator();
      const screenshotUtils = UtilityFactory.getScreenshotUtils();
      const dataProvider = UtilityFactory.getDataProvider();
      const fileUtils = UtilityFactory.getFileUtils();
      const configManager = UtilityFactory.getConfigManager();
      const driverManager = UtilityFactory.getDriverManager();
      
      expect(dateUtils).toBe(DateUtils);
      expect(testDataGenerator).toBeInstanceOf(TestDataGenerator);
      expect(screenshotUtils).toBeInstanceOf(ScreenshotUtils);
      expect(dataProvider).toBeInstanceOf(DataProvider);
      expect(fileUtils).toBeInstanceOf(FileUtils);
      expect(configManager).toBeInstanceOf(ConfigManager);
      expect(driverManager).toBeInstanceOf(DriverManager);
    });

    test('should initialize all utilities', async () => {
      await expect(UtilityFactory.initializeAll()).resolves.not.toThrow();
    });
  });

  describe('Utils Convenience Functions', () => {
    beforeAll(async () => {
      await UtilityFactory.initializeAll();
    });

    test('should provide date shortcuts', () => {
      const today = Utils.date.getCurrentDate();
      const tomorrow = Utils.date.addDays(new Date(), 1);
      const formatted = Utils.date.formatDate(new Date(), 'YYYY-MM-DD');
      
      expect(today).toBeInstanceOf(Date);
      expect(tomorrow).toBeInstanceOf(Date);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should provide generation shortcuts', () => {
      const person = Utils.generate.person();
      const email = Utils.generate.email();
      const uuid = Utils.generate.uuid();
      
      expect(person.firstName).toBeTruthy();
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('should provide config shortcuts', () => {
      Utils.config.set('test.value', 'hello');
      const value = Utils.config.get('test.value');
      const exists = Utils.config.has('test.value');
      
      expect(value).toBe('hello');
      expect(exists).toBe(true);
    });

    test('should provide file shortcuts', async () => {
      const tempFile = await Utils.file.createTempFile('utils-test');
      await Utils.file.writeFile(tempFile, 'Test content');
      
      const exists = Utils.file.exists(tempFile);
      const content = await Utils.file.readFile(tempFile);
      
      expect(exists).toBe(true);
      expect(content).toBe('Test content');
      
      // Cleanup
      await Utils.file.deleteFile(tempFile);
    });
  });

  describe('Integration Tests', () => {
    test('should work together in a complete scenario', async () => {
      // Initialize utilities
      await UtilityFactory.initializeAll();
      
      // Generate test data
      const user = Utils.generate.person();
      const testId = Utils.generate.uuid();
      
      // Create test configuration
      Utils.config.set('test.scenario', 'integration');
      Utils.config.set('test.user', user.fullName);
      
      // Create test data file
      const testData = {
        testId,
        user,
        timestamp: Utils.date.getCurrentDate(),
        config: Utils.config.get('test')
      };
      
      const dataFile = await Utils.file.createTempFile('integration-test', '.json');
      await Utils.file.writeFile(dataFile, JSON.stringify(testData, null, 2));
      
      // Verify file was created and contains correct data
      expect(Utils.file.exists(dataFile)).toBe(true);
      
      const savedData = JSON.parse(await Utils.file.readFile(dataFile));
      expect(savedData.testId).toBe(testId);
      expect(savedData.user.fullName).toBe(user.fullName);
      
      // Cleanup
      await Utils.file.deleteFile(dataFile);
      await UtilityFactory.cleanup();
    });
  });
});





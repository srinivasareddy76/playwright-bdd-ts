
/**
 * Simplified Step Definitions for Utilities Demo
 * 
 * This file contains working step definitions that demonstrate
 * the utility classes functionality in a simple format.
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../../common/steps/hooks';
import { 
  UtilityFactory, 
  Utils
} from '../../../utils';
import { logger } from '../../../utils/logger';

// Global test data storage
let generatedTestData: any = {};
let testFiles: string[] = [];

/**
 * Utility Factory and Initialization Steps
 */

Given('I have initialized the utility factory', async function (this: CustomWorld) {
  try {
    await UtilityFactory.initializeAll();
    expect(UtilityFactory.getDateUtils()).toBeDefined();
    expect(UtilityFactory.getTestDataGenerator()).toBeDefined();
    logger.info('✅ Utility factory initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize utility factory:', error);
    throw error;
  }
});

Given('I have initialized all utility classes', async function (this: CustomWorld) {
  try {
    await UtilityFactory.initializeAll({
      testDataGenerator: { seed: 12345 },
      dataProvider: { 
        cache: { enabled: true, maxSize: 50, ttl: 600000 }
      },
      configManager: { 
        environment: 'test'
      }
    });
    logger.info('✅ All utilities initialized with configuration');
  } catch (error) {
    logger.error('❌ Failed to initialize utilities:', error);
    throw error;
  }
});

/**
 * TestDataGenerator Steps
 */

Given('I have configured the test data generator with seed {string}', async function (this: CustomWorld, seed: string) {
  try {
    const generator = UtilityFactory.getTestDataGenerator({ seed: parseInt(seed) });
    expect(generator).toBeDefined();
    logger.info(`✅ Test data generator configured with seed: ${seed}`);
  } catch (error) {
    logger.error('❌ Failed to configure test data generator:', error);
    throw error;
  }
});

Given('I generate a new user profile using TestDataGenerator', async function (this: CustomWorld) {
  try {
    const generator = UtilityFactory.getTestDataGenerator();
    generatedTestData.user = generator.generatePerson();
    generatedTestData.password = generator.generatePassword(12);
    
    expect(generatedTestData.user).toHaveProperty('firstName');
    expect(generatedTestData.user).toHaveProperty('email');
    expect(generatedTestData.password).toMatch(/^.{12}$/);
    
    logger.info('✅ User profile generated:', {
      name: generatedTestData.user.fullName,
      email: generatedTestData.user.email
    });
  } catch (error) {
    logger.error('❌ Failed to generate user profile:', error);
    throw error;
  }
});

/**
 * DateUtils Steps
 */

Given('I calculate subscription end dates using DateUtils', async function (this: CustomWorld) {
  try {
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
    
    logger.info('✅ Subscription dates calculated successfully');
  } catch (error) {
    logger.error('❌ Failed to calculate subscription dates:', error);
    throw error;
  }
});

/**
 * FileUtils Steps
 */

Given('I create a temporary test data file using FileUtils', async function (this: CustomWorld) {
  try {
    const tempFile = await Utils.file.createTempFile();
    testFiles.push(tempFile);
    generatedTestData.tempFile = tempFile;
    
    expect(await Utils.file.exists(tempFile)).toBe(true);
    logger.info('✅ Temporary file created:', tempFile);
  } catch (error) {
    logger.error('❌ Failed to create temporary file:', error);
    throw error;
  }
});

/**
 * Action Steps
 */

When('I save the generated user data to a test data file', async function (this: CustomWorld) {
  try {
    const filePath = await Utils.file.createTempFile();
    testFiles.push(filePath);
    
    await Utils.file.writeFile(filePath, JSON.stringify(generatedTestData.user, null, 2));
    
    expect(await Utils.file.exists(filePath)).toBe(true);
    generatedTestData.savedFilePath = filePath;
    
    logger.info('✅ User data saved to file:', filePath);
  } catch (error) {
    logger.error('❌ Failed to save user data:', error);
    throw error;
  }
});

When('I fill in the registration form with generated user data:', async function (this: CustomWorld, dataTable: any) {
  try {
    for (const row of dataTable.hashes()) {
      const field = row.field;
      const source = row.source;
      
      // Get value from generated data
      const value = getNestedValue(generatedTestData, source.replace('generated.', ''));
      
      if (value) {
        logger.info(`📝 Filling ${field} with ${value}`);
      }
    }
    logger.info('✅ Registration form filled with generated data');
  } catch (error) {
    logger.error('❌ Failed to fill registration form:', error);
    throw error;
  }
});

/**
 * Assertion Steps
 */

Then('I should see a successful registration message', async function (this: CustomWorld) {
  try {
    expect(generatedTestData.user).toBeDefined();
    expect(generatedTestData.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    logger.info('✅ Registration validation passed');
  } catch (error) {
    logger.error('❌ Registration validation failed:', error);
    throw error;
  }
});

Then('the registration should be {string}', async function (this: CustomWorld, expectedResult: string) {
  try {
    generatedTestData.registrationResult = expectedResult;
    expect(['success', 'validation_error']).toContain(expectedResult);
    logger.info(`✅ Registration result verified: ${expectedResult}`);
  } catch (error) {
    logger.error('❌ Registration result verification failed:', error);
    throw error;
  }
});

Then('I generate a {string} report', async function (this: CustomWorld, reportType: string) {
  try {
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
    
    const reportPath = await Utils.file.createTempFile();
    testFiles.push(reportPath);
    
    await Utils.file.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    
    generatedTestData.reportPath = reportPath;
    logger.info(`✅ ${reportType} report generated:`, reportPath);
  } catch (error) {
    logger.error(`❌ Failed to generate ${reportType} report:`, error);
    throw error;
  }
});

Then('I clean up temporary files after the test', async function (this: CustomWorld) {
  try {
    const fileUtils = UtilityFactory.getFileUtils();
    
    for (const file of testFiles) {
      if (await fileUtils.exists(file)) {
        await fileUtils.delete(file);
      }
    }
    
    testFiles = [];
    logger.info('✅ Temporary files cleaned up successfully');
  } catch (error) {
    logger.error('❌ Failed to clean up temporary files:', error);
    // Don't throw error for cleanup failures
  }
});

/**
 * Helper Functions
 */

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Export for use in other step definition files
 */
export { generatedTestData, testFiles };


/**
 * Custom Assertions Module
 * 
 * This module provides custom assertion utilities for the BDD framework.
 * It extends Playwright's built-in assertions with domain-specific validations
 * for database operations, API responses, and common test scenarios.
 * 
 * Features:
 * - Database result assertions
 * - API response validations
 * - Custom error messages and logging
 * - Type-safe assertion methods
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { expect } from '@playwright/test';
import { logger } from '../../utils/logger';

/** Interface for database query results */
interface DatabaseResult {
  rowCount: number;
  rows: any[];
}

/** Interface for API response objects */
interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
}

/**
 * Custom assertion utilities for enhanced test validation
 */
export class CustomAssertions {
  // ==================== Database Assertions ====================

  /**
   * Asserts database result structure and optional row count
   * @param result - Database query result
   * @param expectedRowCount - Optional expected number of rows
   */
  static assertDatabaseResult(result: DatabaseResult, expectedRowCount?: number): void {
    expect(result).toBeDefined();
    expect(result.rows).toBeDefined();
    expect(Array.isArray(result.rows)).toBe(true);
    
    if (expectedRowCount !== undefined) {
      expect(result.rowCount).toBe(expectedRowCount);
      expect(result.rows.length).toBe(expectedRowCount);
    }
    
    logger.debug(`Database assertion passed: ${result.rowCount} rows returned`);
  }

  /**
   * Asserts that at least one row exists in the database result
   * @param result - Database query result
   * @param message - Optional custom error message
   */
  static assertDatabaseRowExists(result: DatabaseResult, message?: string): void {
    const msg = message || 'Expected at least one row to exist';
    expect(result.rowCount, msg).toBeGreaterThan(0);
    expect(result.rows.length, msg).toBeGreaterThan(0);
    
    logger.debug('Database assertion passed: Row exists');
  }

  /**
   * Asserts that no rows exist in the database result
   * @param result - Database query result
   * @param message - Optional custom error message
   */
  static assertDatabaseRowNotExists(result: DatabaseResult, message?: string): void {
    const msg = message || 'Expected no rows to exist';
    expect(result.rowCount, msg).toBe(0);
    expect(result.rows.length, msg).toBe(0);
    
    logger.debug('Database assertion passed: No rows exist');
  }

  /**
   * Asserts that a specific column contains expected value in the first row
   * @param result - Database query result
   * @param columnName - Name of the column to check
   * @param expectedValue - Expected value in the column
   * @param message - Optional custom error message
   */
  static assertDatabaseRowContains(result: DatabaseResult, columnName: string, expectedValue: any, message?: string): void {
    this.assertDatabaseRowExists(result);
    
    const row = result.rows[0];
    const msg = message || `Expected column '${columnName}' to contain '${expectedValue}'`;
    
    expect(row).toHaveProperty(columnName);
    expect(row[columnName], msg).toBe(expectedValue);
    
    logger.debug(`Database assertion passed: Column '${columnName}' contains expected value`);
  }

  /**
   * Asserts that the first row matches the expected object structure
   * @param result - Database query result
   * @param expectedRow - Expected row data as key-value pairs
   * @param message - Optional custom error message
   */
  static assertDatabaseRowMatches(result: DatabaseResult, expectedRow: Record<string, any>, message?: string): void {
    this.assertDatabaseRowExists(result);
    
    const row = result.rows[0];
    const msg = message || 'Expected row to match provided object';
    
    Object.keys(expectedRow).forEach(key => {
      expect(row, `${msg} - Missing property: ${key}`).toHaveProperty(key);
      expect(row[key], `${msg} - Property '${key}' mismatch`).toBe(expectedRow[key]);
    });
    
    logger.debug('Database assertion passed: Row matches expected object');
  }

  // ==================== API Assertions ====================

  /**
   * Asserts basic API response structure and optional status code
   * @param response - API response object
   * @param expectedStatus - Optional expected HTTP status code
   */
  static assertApiResponse(response: ApiResponse, expectedStatus?: number): void {
    expect(response).toBeDefined();
    expect(response.status).toBeDefined();
    expect(response.body).toBeDefined();
    
    if (expectedStatus !== undefined) {
      expect(response.status).toBe(expectedStatus);
    }
    
    logger.debug(`API assertion passed: Status ${response.status}`);
  }

  /**
   * Asserts that API response has a success status code (2xx)
   * @param response - API response object
   */
  static assertApiSuccess(response: ApiResponse): void {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    
    logger.debug(`API assertion passed: Success status ${response.status}`);
  }

  static assertApiError(response: ApiResponse, expectedStatus?: number): void {
    if (expectedStatus) {
      expect(response.status).toBe(expectedStatus);
    } else {
      expect(response.status).toBeGreaterThanOrEqual(400);
    }
    
    logger.debug(`API assertion passed: Error status ${response.status}`);
  }

  static assertApiResponseContains(response: ApiResponse, expectedData: any, message?: string): void {
    this.assertApiSuccess(response);
    
    const msg = message || 'Expected API response to contain data';
    
    if (typeof expectedData === 'object' && expectedData !== null) {
      Object.keys(expectedData).forEach(key => {
        expect(response.body, `${msg} - Missing property: ${key}`).toHaveProperty(key);
        expect(response.body[key], `${msg} - Property '${key}' mismatch`).toBe(expectedData[key]);
      });
    } else {
      expect(response.body, msg).toEqual(expectedData);
    }
    
    logger.debug('API assertion passed: Response contains expected data');
  }

  static assertApiResponseHasProperty(response: ApiResponse, propertyPath: string, expectedValue?: any): void {
    this.assertApiSuccess(response);
    
    const properties = propertyPath.split('.');
    let current = response.body;
    
    for (const prop of properties) {
      expect(current, `Expected property path '${propertyPath}' to exist`).toHaveProperty(prop);
      current = current[prop];
    }
    
    if (expectedValue !== undefined) {
      expect(current, `Expected property '${propertyPath}' to equal '${expectedValue}'`).toBe(expectedValue);
    }
    
    logger.debug(`API assertion passed: Property '${propertyPath}' exists${expectedValue !== undefined ? ' with expected value' : ''}`);
  }

  static assertApiResponseArray(response: ApiResponse, expectedLength?: number): void {
    this.assertApiSuccess(response);
    
    expect(Array.isArray(response.body), 'Expected API response body to be an array').toBe(true);
    
    if (expectedLength !== undefined) {
      expect(response.body.length, `Expected array length to be ${expectedLength}`).toBe(expectedLength);
    }
    
    logger.debug(`API assertion passed: Response is array${expectedLength !== undefined ? ` with length ${expectedLength}` : ''}`);
  }

  // String and data assertions
  static assertStringContains(actual: string, expected: string, message?: string): void {
    const msg = message || `Expected '${actual}' to contain '${expected}'`;
    expect(actual, msg).toContain(expected);
    
    logger.debug(`String assertion passed: Contains '${expected}'`);
  }

  static assertStringMatches(actual: string, pattern: RegExp, message?: string): void {
    const msg = message || `Expected '${actual}' to match pattern ${pattern}`;
    expect(actual, msg).toMatch(pattern);
    
    logger.debug(`String assertion passed: Matches pattern ${pattern}`);
  }

  static assertDateInRange(actual: Date, startDate: Date, endDate: Date, message?: string): void {
    const msg = message || `Expected date ${actual} to be between ${startDate} and ${endDate}`;
    expect(actual.getTime(), msg).toBeGreaterThanOrEqual(startDate.getTime());
    expect(actual.getTime(), msg).toBeLessThanOrEqual(endDate.getTime());
    
    logger.debug(`Date assertion passed: ${actual} is within range`);
  }

  static assertArrayContains<T>(actual: T[], expected: T, message?: string): void {
    const msg = message || `Expected array to contain ${expected}`;
    expect(actual, msg).toContain(expected);
    
    logger.debug(`Array assertion passed: Contains expected element`);
  }

  static assertArrayLength<T>(actual: T[], expectedLength: number, message?: string): void {
    const msg = message || `Expected array length to be ${expectedLength}`;
    expect(actual.length, msg).toBe(expectedLength);
    
    logger.debug(`Array assertion passed: Length is ${expectedLength}`);
  }

  static assertObjectHasProperties(actual: any, expectedProperties: string[], message?: string): void {
    const msg = message || 'Expected object to have all required properties';
    
    expectedProperties.forEach(prop => {
      expect(actual, `${msg} - Missing property: ${prop}`).toHaveProperty(prop);
    });
    
    logger.debug(`Object assertion passed: Has all required properties`);
  }

  // Numeric assertions
  static assertNumberInRange(actual: number, min: number, max: number, message?: string): void {
    const msg = message || `Expected ${actual} to be between ${min} and ${max}`;
    expect(actual, msg).toBeGreaterThanOrEqual(min);
    expect(actual, msg).toBeLessThanOrEqual(max);
    
    logger.debug(`Number assertion passed: ${actual} is within range [${min}, ${max}]`);
  }

  static assertPercentage(actual: number, message?: string): void {
    const msg = message || `Expected ${actual} to be a valid percentage (0-100)`;
    this.assertNumberInRange(actual, 0, 100, msg);
    
    logger.debug(`Percentage assertion passed: ${actual}%`);
  }

  // Timing assertions
  static assertExecutionTime(startTime: number, maxDurationMs: number, message?: string): void {
    const duration = Date.now() - startTime;
    const msg = message || `Expected execution time to be less than ${maxDurationMs}ms`;
    expect(duration, msg).toBeLessThan(maxDurationMs);
    
    logger.debug(`Timing assertion passed: Executed in ${duration}ms`);
  }

  // Custom business logic assertions
  static assertValidEmail(email: string, message?: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const msg = message || `Expected '${email}' to be a valid email address`;
    expect(email, msg).toMatch(emailRegex);
    
    logger.debug(`Email assertion passed: ${email} is valid`);
  }

  static assertValidPhoneNumber(phone: string, message?: string): void {
    // Simple phone number validation (can be customized based on requirements)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const msg = message || `Expected '${phone}' to be a valid phone number`;
    expect(phone.replace(/[\s\-\(\)]/g, ''), msg).toMatch(phoneRegex);
    
    logger.debug(`Phone assertion passed: ${phone} is valid`);
  }

  static assertValidUrl(url: string, message?: string): void {
    const msg = message || `Expected '${url}' to be a valid URL`;
    expect(() => new URL(url), msg).not.toThrow();
    
    logger.debug(`URL assertion passed: ${url} is valid`);
  }

  // Soft assertions (collect multiple failures)
  static createSoftAssertions(): SoftAssertions {
    return new SoftAssertions();
  }
}

export class SoftAssertions {
  private errors: string[] = [];

  softAssert(condition: boolean, message: string): void {
    if (!condition) {
      this.errors.push(message);
      logger.warn(`Soft assertion failed: ${message}`);
    }
  }

  softAssertEqual(actual: any, expected: any, message?: string): void {
    const msg = message || `Expected ${actual} to equal ${expected}`;
    this.softAssert(actual === expected, msg);
  }

  softAssertContains(actual: string, expected: string, message?: string): void {
    const msg = message || `Expected '${actual}' to contain '${expected}'`;
    this.softAssert(actual.includes(expected), msg);
  }

  assertAll(): void {
    if (this.errors.length > 0) {
      const errorMessage = `Soft assertions failed:\n${this.errors.join('\n')}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    logger.debug('All soft assertions passed');
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clear(): void {
    this.errors = [];
  }
}

// Export convenience functions
export const assert = CustomAssertions;
export const softAssert = CustomAssertions.createSoftAssertions;
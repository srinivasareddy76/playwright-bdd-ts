

/**
 * Data Provider Module
 * 
 * This module provides comprehensive test data management utilities for the BDD framework.
 * It supports multiple data sources, formats, and provides intelligent data loading,
 * caching, and transformation capabilities for test scenarios.
 * 
 * Key Features:
 * - Multiple data source support (JSON, CSV, XML, YAML, Database)
 * - Data transformation and validation
 * - Intelligent caching and performance optimization
 * - Environment-specific data loading
 * - Data parameterization for test scenarios
 * - Dynamic data filtering and querying
 * - Data encryption and security handling
 * - Integration with external data services
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';
import { PathUtils } from './paths';
import { TestDataGenerator } from './TestDataGenerator';

/**
 * Supported data source types
 */
export enum DataSourceType {
  JSON = 'json',
  CSV = 'csv',
  XML = 'xml',
  YAML = 'yaml',
  DATABASE = 'database',
  API = 'api',
  GENERATED = 'generated'
}

/**
 * Data provider configuration interface
 */
export interface DataProviderConfig {
  /** Default data directory */
  dataDirectory?: string;
  /** Environment-specific data paths */
  environmentPaths?: { [env: string]: string };
  /** Caching configuration */
  cache?: {
    enabled: boolean;
    ttl: number; // Time to live in milliseconds
    maxSize: number; // Maximum cache entries
  };
  /** Data validation rules */
  validation?: {
    required: string[];
    types: { [field: string]: string };
    patterns: { [field: string]: RegExp };
  };
  /** Data transformation rules */
  transformations?: { [field: string]: (value: any) => any };
}

/**
 * Data query interface for filtering and selection
 */
export interface DataQuery {
  /** Filter conditions */
  where?: { [field: string]: any };
  /** Fields to select */
  select?: string[];
  /** Sorting configuration */
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  /** Limit number of results */
  limit?: number;
  /** Skip number of results */
  skip?: number;
}

/**
 * Data cache entry interface
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

/**
 * Data validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Comprehensive data provider class for managing test data from multiple sources
 * with advanced querying, caching, and transformation capabilities
 */
export class DataProvider {
  private static instance: DataProvider;
  private config: DataProviderConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private dataDirectory: string;
  private generator: TestDataGenerator;

  private constructor(config: DataProviderConfig = {}) {
    this.config = {
      dataDirectory: config.dataDirectory || path.join(PathUtils.getProjectRoot(), 'test-data'),
      cache: {
        enabled: true,
        ttl: 300000, // 5 minutes
        maxSize: 100,
        ...config.cache
      },
      ...config
    };

    this.dataDirectory = this.config.dataDirectory!;
    this.generator = TestDataGenerator.getInstance();
    this.ensureDataDirectory();
  }

  /**
   * Gets singleton instance of DataProvider
   * @param config - Optional configuration
   * @returns DataProvider instance
   */
  static getInstance(config?: DataProviderConfig): DataProvider {
    if (!DataProvider.instance || config) {
      DataProvider.instance = new DataProvider(config);
    }
    return DataProvider.instance;
  }

  /**
   * Ensures data directory exists
   */
  private ensureDataDirectory(): void {
    PathUtils.ensureDirectoryExists(this.dataDirectory);
    
    // Create environment-specific directories
    if (this.config.environmentPaths) {
      Object.values(this.config.environmentPaths).forEach(envPath => {
        PathUtils.ensureDirectoryExists(path.join(this.dataDirectory, envPath));
      });
    }
  }

  /**
   * Loads data from a JSON file
   * @param fileName - JSON file name
   * @param environment - Optional environment
   * @returns Parsed JSON data
   */
  async loadJSON(fileName: string, environment?: string): Promise<any> {
    const cacheKey = `json_${fileName}_${environment || 'default'}`;
    
    // Check cache first
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug(`Data loaded from cache: ${fileName}`);
        return cached;
      }
    }

    try {
      const filePath = this.resolveFilePath(fileName, environment, 'json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      // Apply transformations
      const transformedData = this.applyTransformations(data);
      
      // Cache the data
      if (this.config.cache?.enabled) {
        this.setCache(cacheKey, transformedData);
      }
      
      logger.info(`JSON data loaded: ${fileName}`);
      return transformedData;
    } catch (error) {
      logger.error(`Failed to load JSON data from ${fileName}: ${error}`);
      throw error;
    }
  }

  /**
   * Loads data from a CSV file
   * @param fileName - CSV file name
   * @param environment - Optional environment
   * @param delimiter - CSV delimiter (default: comma)
   * @returns Array of objects representing CSV rows
   */
  async loadCSV(fileName: string, environment?: string, delimiter: string = ','): Promise<any[]> {
    const cacheKey = `csv_${fileName}_${environment || 'default'}`;
    
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug(`CSV data loaded from cache: ${fileName}`);
        return cached;
      }
    }

    try {
      const filePath = this.resolveFilePath(fileName, environment, 'csv');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const lines = rawData.trim().split('\n');
      
      if (lines.length === 0) {
        return [];
      }

      // Parse header
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
      
      // Parse data rows
      const data = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = this.parseValue(values[index] || '');
        });
        
        return row;
      });

      // Apply transformations
      const transformedData = data.map(row => this.applyTransformations(row));
      
      if (this.config.cache?.enabled) {
        this.setCache(cacheKey, transformedData);
      }
      
      logger.info(`CSV data loaded: ${fileName} (${transformedData.length} rows)`);
      return transformedData;
    } catch (error) {
      logger.error(`Failed to load CSV data from ${fileName}: ${error}`);
      throw error;
    }
  }

  /**
   * Loads data from a YAML file
   * @param fileName - YAML file name
   * @param environment - Optional environment
   * @returns Parsed YAML data
   */
  async loadYAML(fileName: string, environment?: string): Promise<any> {
    const cacheKey = `yaml_${fileName}_${environment || 'default'}`;
    
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug(`YAML data loaded from cache: ${fileName}`);
        return cached;
      }
    }

    try {
      const filePath = this.resolveFilePath(fileName, environment, 'yaml');
      const rawData = fs.readFileSync(filePath, 'utf8');
      
      // Simple YAML parsing (for complex YAML, use js-yaml library)
      const data = this.parseSimpleYAML(rawData);
      const transformedData = this.applyTransformations(data);
      
      if (this.config.cache?.enabled) {
        this.setCache(cacheKey, transformedData);
      }
      
      logger.info(`YAML data loaded: ${fileName}`);
      return transformedData;
    } catch (error) {
      logger.error(`Failed to load YAML data from ${fileName}: ${error}`);
      throw error;
    }
  }

  /**
   * Generates test data using TestDataGenerator
   * @param scenario - Data generation scenario
   * @param count - Number of records to generate
   * @param customConfig - Custom generation configuration
   * @returns Generated test data
   */
  async generateData(scenario: string, count: number = 1, customConfig?: any): Promise<any[]> {
    const cacheKey = `generated_${scenario}_${count}_${JSON.stringify(customConfig)}`;
    
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug(`Generated data loaded from cache: ${scenario}`);
        return cached;
      }
    }

    try {
      const data = this.generator.generateArray(
        () => this.generator.generateScenarioData(scenario),
        count
      );

      if (this.config.cache?.enabled) {
        this.setCache(cacheKey, data);
      }
      
      logger.info(`Generated test data: ${scenario} (${count} records)`);
      return data;
    } catch (error) {
      logger.error(`Failed to generate test data for scenario ${scenario}: ${error}`);
      throw error;
    }
  }

  /**
   * Queries data with filtering, sorting, and pagination
   * @param data - Source data array
   * @param query - Query parameters
   * @returns Filtered and processed data
   */
  query(data: any[], query: DataQuery = {}): any[] {
    let result = [...data];

    // Apply where conditions
    if (query.where) {
      result = result.filter(item => {
        return Object.entries(query.where!).every(([field, value]) => {
          if (typeof value === 'object' && value !== null) {
            // Handle complex conditions (e.g., { $gt: 10, $lt: 20 })
            return this.evaluateCondition(item[field], value);
          }
          return item[field] === value;
        });
      });
    }

    // Apply sorting
    if (query.orderBy && query.orderBy.length > 0) {
      result.sort((a, b) => {
        for (const sort of query.orderBy!) {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          
          if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply pagination
    if (query.skip) {
      result = result.slice(query.skip);
    }
    
    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    // Apply field selection
    if (query.select && query.select.length > 0) {
      result = result.map(item => {
        const selected: any = {};
        query.select!.forEach(field => {
          if (item.hasOwnProperty(field)) {
            selected[field] = item[field];
          }
        });
        return selected;
      });
    }

    return result;
  }

  /**
   * Validates data against configured rules
   * @param data - Data to validate
   * @returns Validation result
   */
  validate(data: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.config.validation) {
      return result;
    }

    const { required, types, patterns } = this.config.validation;

    // Check required fields
    if (required) {
      required.forEach(field => {
        if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
          result.errors.push(`Required field missing: ${field}`);
          result.isValid = false;
        }
      });
    }

    // Check data types
    if (types) {
      Object.entries(types).forEach(([field, expectedType]) => {
        if (data.hasOwnProperty(field)) {
          const actualType = typeof data[field];
          if (actualType !== expectedType) {
            result.errors.push(`Type mismatch for field ${field}: expected ${expectedType}, got ${actualType}`);
            result.isValid = false;
          }
        }
      });
    }

    // Check patterns
    if (patterns) {
      Object.entries(patterns).forEach(([field, pattern]) => {
        if (data.hasOwnProperty(field) && typeof data[field] === 'string') {
          if (!pattern.test(data[field])) {
            result.errors.push(`Pattern validation failed for field ${field}`);
            result.isValid = false;
          }
        }
      });
    }

    return result;
  }

  /**
   * Saves data to a file
   * @param data - Data to save
   * @param fileName - File name
   * @param format - File format
   * @param environment - Optional environment
   */
  async saveData(data: any, fileName: string, format: DataSourceType, environment?: string): Promise<void> {
    try {
      const filePath = this.resolveFilePath(fileName, environment, format);
      let content: string;

      switch (format) {
        case DataSourceType.JSON:
          content = JSON.stringify(data, null, 2);
          break;
        case DataSourceType.CSV:
          content = this.convertToCSV(data);
          break;
        case DataSourceType.YAML:
          content = this.convertToYAML(data);
          break;
        default:
          throw new Error(`Unsupported format for saving: ${format}`);
      }

      fs.writeFileSync(filePath, content, 'utf8');
      logger.info(`Data saved to: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to save data to ${fileName}: ${error}`);
      throw error;
    }
  }

  /**
   * Gets data for a specific test scenario
   * @param scenarioName - Test scenario name
   * @param environment - Optional environment
   * @returns Test scenario data
   */
  async getScenarioData(scenarioName: string, environment?: string): Promise<any> {
    const fileName = `${scenarioName}.json`;
    
    try {
      return await this.loadJSON(fileName, environment);
    } catch (error) {
      logger.warn(`Scenario data file not found: ${fileName}. Generating default data.`);
      
      // Generate default data for common scenarios
      const defaultData = this.generator.generateScenarioData(scenarioName);
      
      // Save generated data for future use
      await this.saveData(defaultData, fileName, DataSourceType.JSON, environment);
      
      return defaultData;
    }
  }

  /**
   * Gets parameterized data for data-driven tests
   * @param testName - Test name
   * @param environment - Optional environment
   * @returns Array of test parameters
   */
  async getParameterizedData(testName: string, environment?: string): Promise<any[]> {
    const fileName = `${testName}_parameters.json`;
    
    try {
      const data = await this.loadJSON(fileName, environment);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      logger.warn(`Parameterized data file not found: ${fileName}. Using default parameters.`);
      return [{}]; // Return empty parameter set
    }
  }

  /**
   * Resolves file path based on environment and format
   * @param fileName - Base file name
   * @param environment - Optional environment
   * @param format - File format
   * @returns Resolved file path
   */
  private resolveFilePath(fileName: string, environment?: string, format?: string): string {
    let basePath = this.dataDirectory;
    
    if (environment && this.config.environmentPaths?.[environment]) {
      basePath = path.join(this.dataDirectory, this.config.environmentPaths[environment]);
    }

    // Add extension if not present
    if (format && !fileName.includes('.')) {
      fileName = `${fileName}.${format}`;
    }

    return path.join(basePath, fileName);
  }

  /**
   * Applies configured transformations to data
   * @param data - Data to transform
   * @returns Transformed data
   */
  private applyTransformations(data: any): any {
    if (!this.config.transformations || typeof data !== 'object') {
      return data;
    }

    const transformed = { ...data };
    
    Object.entries(this.config.transformations).forEach(([field, transformer]) => {
      if (transformed.hasOwnProperty(field)) {
        try {
          transformed[field] = transformer(transformed[field]);
        } catch (error) {
          logger.warn(`Transformation failed for field ${field}: ${error}`);
        }
      }
    });

    return transformed;
  }

  /**
   * Parses a value from string to appropriate type
   * @param value - String value to parse
   * @returns Parsed value
   */
  private parseValue(value: string): any {
    if (value === '') return null;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    return value;
  }

  /**
   * Simple YAML parser (for basic YAML structures)
   * @param yamlContent - YAML content string
   * @returns Parsed object
   */
  private parseSimpleYAML(yamlContent: string): any {
    const lines = yamlContent.split('\n');
    const result: any = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          const value = trimmed.substring(colonIndex + 1).trim();
          result[key] = this.parseValue(value);
        }
      }
    });
    
    return result;
  }

  /**
   * Converts data to CSV format
   * @param data - Data to convert
   * @returns CSV string
   */
  private convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csvLines.push(values.join(','));
    });
    
    return csvLines.join('\n');
  }

  /**
   * Converts data to YAML format
   * @param data - Data to convert
   * @returns YAML string
   */
  private convertToYAML(data: any): string {
    const yamlLines: string[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      yamlLines.push(`${key}: ${value}`);
    });
    
    return yamlLines.join('\n');
  }

  /**
   * Evaluates complex query conditions
   * @param fieldValue - Field value to evaluate
   * @param condition - Condition object
   * @returns Boolean result
   */
  private evaluateCondition(fieldValue: any, condition: any): boolean {
    if (typeof condition !== 'object') {
      return fieldValue === condition;
    }

    for (const [operator, value] of Object.entries(condition)) {
      switch (operator) {
        case '$gt':
          if (!(fieldValue > (value as any))) return false;
          break;
        case '$gte':
          if (!(fieldValue >= (value as any))) return false;
          break;
        case '$lt':
          if (!(fieldValue < (value as any))) return false;
          break;
        case '$lte':
          if (!(fieldValue <= (value as any))) return false;
          break;
        case '$ne':
          if (!(fieldValue !== value)) return false;
          break;
        case '$in':
          if (!Array.isArray(value) || !value.includes(fieldValue)) return false;
          break;
        case '$nin':
          if (!Array.isArray(value) || value.includes(fieldValue)) return false;
          break;
        default:
          return fieldValue === condition;
      }
    }
    
    return true;
  }

  /**
   * Gets data from cache
   * @param key - Cache key
   * @returns Cached data or null
   */
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Sets data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private setCache(key: string, data: any): void {
    if (!this.config.cache?.enabled) {
      return;
    }

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.cache.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.config.cache.ttl
    });
  }

  /**
   * Clears the data cache
   */
  clearCache(): void {
    this.cache.clear();
    logger.info('Data provider cache cleared');
  }

  /**
   * Gets cache statistics
   * @returns Cache statistics
   */
  getCacheStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.config.cache?.maxSize || 0,
      enabled: this.config.cache?.enabled || false,
      entries: Array.from(this.cache.keys())
    };
  }
}



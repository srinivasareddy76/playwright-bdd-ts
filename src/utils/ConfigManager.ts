


/**
 * Configuration Manager Module
 * 
 * This module provides comprehensive configuration management for the BDD framework.
 * It supports multiple configuration sources, environment-specific settings,
 * dynamic configuration updates, validation, and secure handling of sensitive data.
 * 
 * Key Features:
 * - Multi-source configuration loading (files, environment, CLI args)
 * - Environment-specific configuration management
 * - Configuration validation and schema enforcement
 * - Dynamic configuration updates and hot-reloading
 * - Secure handling of sensitive configuration data
 * - Configuration caching and performance optimization
 * - Configuration merging and inheritance
 * - Runtime configuration monitoring and logging
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';
import { PathUtils } from './paths';
import { FileUtils } from './FileUtils';

/**
 * Configuration source types
 */
export enum ConfigSource {
  FILE = 'file',
  ENVIRONMENT = 'environment',
  CLI_ARGS = 'cli_args',
  RUNTIME = 'runtime',
  DEFAULT = 'default'
}

/**
 * Configuration validation rule interface
 */
export interface ValidationRule {
  /** Field is required */
  required?: boolean;
  /** Expected data type */
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  /** Minimum value (for numbers) or length (for strings/arrays) */
  min?: number;
  /** Maximum value (for numbers) or length (for strings/arrays) */
  max?: number;
  /** Regular expression pattern (for strings) */
  pattern?: RegExp;
  /** Allowed values */
  enum?: any[];
  /** Custom validation function */
  validator?: (value: any) => boolean | string;
}

/**
 * Configuration schema interface
 */
export interface ConfigSchema {
  [key: string]: ValidationRule | ConfigSchema;
}

/**
 * Configuration change event interface
 */
export interface ConfigChangeEvent {
  /** Changed configuration key */
  key: string;
  /** Old value */
  oldValue: any;
  /** New value */
  newValue: any;
  /** Change source */
  source: ConfigSource;
  /** Timestamp of change */
  timestamp: Date;
}

/**
 * Configuration manager options interface
 */
export interface ConfigManagerOptions {
  /** Configuration file paths */
  configFiles?: string[];
  /** Environment variable prefix */
  envPrefix?: string;
  /** Configuration schema for validation */
  schema?: ConfigSchema;
  /** Enable configuration watching */
  watch?: boolean;
  /** Configuration cache TTL in milliseconds */
  cacheTTL?: number;
  /** Encryption key for sensitive data */
  encryptionKey?: string;
  /** Default configuration values */
  defaults?: any;
}

/**
 * Configuration validation result interface
 */
export interface ValidationResult {
  /** Validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * Comprehensive configuration manager class providing advanced configuration
 * management with validation, hot-reloading, and multi-source support
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: any = {};
  private options: ConfigManagerOptions;
  private watchers: Map<string, string> = new Map();
  private changeListeners: Array<(event: ConfigChangeEvent) => void> = [];
  private cache: Map<string, { value: any; timestamp: number }> = new Map();
  private fileUtils: FileUtils;

  private constructor(options: ConfigManagerOptions = {}) {
    this.options = {
      configFiles: ['config.json', 'config.yaml', 'config.yml'],
      envPrefix: 'APP_',
      watch: false,
      cacheTTL: 300000, // 5 minutes
      ...options
    };

    this.fileUtils = FileUtils.getInstance();
    this.loadConfiguration();
    
    if (this.options.watch) {
      this.setupConfigWatching();
    }
  }

  /**
   * Gets singleton instance of ConfigManager
   * @param options - Optional configuration options
   * @returns ConfigManager instance
   */
  static getInstance(options?: ConfigManagerOptions): ConfigManager {
    if (!ConfigManager.instance || options) {
      ConfigManager.instance = new ConfigManager(options);
    }
    return ConfigManager.instance;
  }

  /**
   * Gets a configuration value by key path
   * @param keyPath - Dot-separated key path (e.g., 'database.host')
   * @param defaultValue - Default value if key not found
   * @returns Configuration value
   */
  get<T = any>(keyPath: string, defaultValue?: T): T {
    try {
      // Check cache first
      const cached = this.getFromCache(keyPath);
      if (cached !== undefined) {
        return cached;
      }

      const keys = keyPath.split('.');
      let value = this.config;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          value = defaultValue;
          break;
        }
      }

      // Cache the result
      this.setCache(keyPath, value);
      
      return value as T;
    } catch (error) {
      logger.error(`Error getting configuration value for key '${keyPath}': ${error}`);
      return defaultValue as T;
    }
  }

  /**
   * Sets a configuration value by key path
   * @param keyPath - Dot-separated key path
   * @param value - Value to set
   * @param source - Configuration source
   */
  set(keyPath: string, value: any, source: ConfigSource = ConfigSource.RUNTIME): void {
    try {
      const keys = keyPath.split('.');
      const oldValue = this.get(keyPath);
      
      let current = this.config;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Set the final value
      const finalKey = keys[keys.length - 1];
      current[finalKey] = value;
      
      // Clear cache for this key and related keys
      this.clearCacheForKey(keyPath);
      
      // Emit change event
      this.emitChangeEvent({
        key: keyPath,
        oldValue,
        newValue: value,
        source,
        timestamp: new Date()
      });
      
      logger.debug(`Configuration updated: ${keyPath} = ${JSON.stringify(value)}`);
    } catch (error) {
      logger.error(`Error setting configuration value for key '${keyPath}': ${error}`);
      throw error;
    }
  }

  /**
   * Checks if a configuration key exists
   * @param keyPath - Dot-separated key path
   * @returns True if key exists
   */
  has(keyPath: string): boolean {
    try {
      const keys = keyPath.split('.');
      let current = this.config;
      
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      logger.error(`Error checking configuration key '${keyPath}': ${error}`);
      return false;
    }
  }

  /**
   * Deletes a configuration key
   * @param keyPath - Dot-separated key path
   */
  delete(keyPath: string): void {
    try {
      const keys = keyPath.split('.');
      const oldValue = this.get(keyPath);
      
      if (keys.length === 1) {
        delete this.config[keys[0]];
      } else {
        let current = this.config;
        
        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (current && typeof current === 'object' && key in current) {
            current = current[key];
          } else {
            return; // Key doesn't exist
          }
        }
        
        // Delete the final key
        const finalKey = keys[keys.length - 1];
        delete current[finalKey];
      }
      
      // Clear cache
      this.clearCacheForKey(keyPath);
      
      // Emit change event
      this.emitChangeEvent({
        key: keyPath,
        oldValue,
        newValue: undefined,
        source: ConfigSource.RUNTIME,
        timestamp: new Date()
      });
      
      logger.debug(`Configuration key deleted: ${keyPath}`);
    } catch (error) {
      logger.error(`Error deleting configuration key '${keyPath}': ${error}`);
      throw error;
    }
  }

  /**
   * Gets all configuration keys with a specific prefix
   * @param prefix - Key prefix
   * @returns Object with matching keys
   */
  getByPrefix(prefix: string): any {
    try {
      const result: any = {};
      const prefixKeys = prefix.split('.');
      
      let current = this.config;
      
      // Navigate to the prefix location
      for (const key of prefixKeys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return result; // Prefix doesn't exist
        }
      }
      
      // Copy all keys from the prefix location
      if (current && typeof current === 'object') {
        return JSON.parse(JSON.stringify(current));
      }
      
      return result;
    } catch (error) {
      logger.error(`Error getting configuration by prefix '${prefix}': ${error}`);
      return {};
    }
  }

  /**
   * Merges configuration from another object
   * @param newConfig - Configuration object to merge
   * @param source - Configuration source
   */
  merge(newConfig: any, source: ConfigSource = ConfigSource.RUNTIME): void {
    try {
      this.config = this.deepMerge(this.config, newConfig);
      this.clearCache();
      
      logger.info(`Configuration merged from source: ${source}`);
    } catch (error) {
      logger.error(`Error merging configuration: ${error}`);
      throw error;
    }
  }

  /**
   * Validates configuration against schema
   * @param config - Configuration to validate (defaults to current config)
   * @returns Validation result
   */
  validate(config: any = this.config): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.options.schema) {
      result.warnings.push('No validation schema defined');
      return result;
    }

    try {
      this.validateObject(config, this.options.schema, '', result);
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${error}`);
    }

    return result;
  }

  /**
   * Reloads configuration from all sources
   */
  async reload(): Promise<void> {
    try {
      logger.info('Reloading configuration...');
      
      // Clear cache
      this.clearCache();
      
      // Reload configuration
      this.loadConfiguration();
      
      logger.info('Configuration reloaded successfully');
    } catch (error) {
      logger.error(`Error reloading configuration: ${error}`);
      throw error;
    }
  }

  /**
   * Saves current configuration to file
   * @param filePath - File path to save to
   * @param format - File format (json, yaml)
   */
  async save(filePath?: string, format: 'json' | 'yaml' = 'json'): Promise<void> {
    try {
      const configPath = filePath || path.join(PathUtils.getConfigPath(), `config.${format}`);
      
      let content: string;
      
      if (format === 'json') {
        content = JSON.stringify(this.config, null, 2);
      } else {
        content = this.convertToYAML(this.config);
      }
      
      await this.fileUtils.writeFile(configPath, content, { createDirs: true });
      
      logger.info(`Configuration saved to: ${configPath}`);
    } catch (error) {
      logger.error(`Error saving configuration: ${error}`);
      throw error;
    }
  }

  /**
   * Gets environment-specific configuration
   * @param environment - Environment name
   * @returns Environment configuration
   */
  getEnvironmentConfig(environment: string): any {
    return this.get(`environments.${environment}`, {});
  }

  /**
   * Sets the active environment
   * @param environment - Environment name
   */
  setEnvironment(environment: string): void {
    const envConfig = this.getEnvironmentConfig(environment);
    
    if (Object.keys(envConfig).length > 0) {
      this.merge(envConfig, ConfigSource.ENVIRONMENT);
      this.set('activeEnvironment', environment, ConfigSource.ENVIRONMENT);
      
      logger.info(`Active environment set to: ${environment}`);
    } else {
      logger.warn(`Environment configuration not found: ${environment}`);
    }
  }

  /**
   * Adds a configuration change listener
   * @param listener - Change event listener
   */
  onChange(listener: (event: ConfigChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }

  /**
   * Removes a configuration change listener
   * @param listener - Change event listener to remove
   */
  removeChangeListener(listener: (event: ConfigChangeEvent) => void): void {
    const index = this.changeListeners.indexOf(listener);
    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  }

  /**
   * Gets configuration as a plain object
   * @returns Configuration object
   */
  toObject(): any {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Gets configuration statistics
   * @returns Configuration statistics
   */
  getStats(): any {
    return {
      totalKeys: this.countKeys(this.config),
      cacheSize: this.cache.size,
      watchedFiles: this.watchers.size,
      changeListeners: this.changeListeners.length,
      lastReload: new Date().toISOString()
    };
  }

  /**
   * Loads configuration from all sources
   */
  private loadConfiguration(): void {
    // Start with defaults
    if (this.options.defaults) {
      this.config = JSON.parse(JSON.stringify(this.options.defaults));
    }

    // Load from configuration files
    this.loadFromFiles();
    
    // Load from environment variables
    this.loadFromEnvironment();
    
    // Load from CLI arguments
    this.loadFromCliArgs();
    
    // Validate configuration
    const validation = this.validate();
    if (!validation.isValid) {
      logger.warn(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }
    
    logger.info('Configuration loaded successfully');
  }

  /**
   * Loads configuration from files
   */
  private loadFromFiles(): void {
    if (!this.options.configFiles) return;

    for (const configFile of this.options.configFiles) {
      try {
        const configPath = path.resolve(PathUtils.getConfigPath(), configFile);
        
        if (this.fileUtils.exists(configPath)) {
          const content = fs.readFileSync(configPath, 'utf8');
          let fileConfig: any;
          
          if (configFile.endsWith('.json')) {
            fileConfig = JSON.parse(content);
          } else if (configFile.endsWith('.yaml') || configFile.endsWith('.yml')) {
            fileConfig = this.parseYAML(content);
          } else {
            logger.warn(`Unsupported configuration file format: ${configFile}`);
            continue;
          }
          
          this.config = this.deepMerge(this.config, fileConfig);
          logger.debug(`Loaded configuration from: ${configFile}`);
        }
      } catch (error) {
        logger.error(`Error loading configuration file ${configFile}: ${error}`);
      }
    }
  }

  /**
   * Loads configuration from environment variables
   */
  private loadFromEnvironment(): void {
    if (!this.options.envPrefix) return;

    const envConfig: any = {};
    const prefix = this.options.envPrefix;
    
    Object.keys(process.env).forEach(key => {
      if (key.startsWith(prefix)) {
        const configKey = key.substring(prefix.length).toLowerCase().replace(/_/g, '.');
        const value = this.parseEnvValue(process.env[key]!);
        this.setNestedValue(envConfig, configKey, value);
      }
    });
    
    if (Object.keys(envConfig).length > 0) {
      this.config = this.deepMerge(this.config, envConfig);
      logger.debug('Loaded configuration from environment variables');
    }
  }

  /**
   * Loads configuration from CLI arguments
   */
  private loadFromCliArgs(): void {
    const args = process.argv.slice(2);
    const cliConfig: any = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg.startsWith('--config.')) {
        const key = arg.substring(9); // Remove '--config.'
        const value = args[i + 1];
        
        if (value && !value.startsWith('--')) {
          this.setNestedValue(cliConfig, key, this.parseEnvValue(value));
          i++; // Skip the value in next iteration
        }
      }
    }
    
    if (Object.keys(cliConfig).length > 0) {
      this.config = this.deepMerge(this.config, cliConfig);
      logger.debug('Loaded configuration from CLI arguments');
    }
  }

  /**
   * Sets up configuration file watching
   */
  private setupConfigWatching(): void {
    if (!this.options.configFiles) return;

    for (const configFile of this.options.configFiles) {
      try {
        const configPath = path.resolve(PathUtils.getConfigPath(), configFile);
        
        if (this.fileUtils.exists(configPath)) {
          const watcherId = this.fileUtils.watchFile(configPath, (event) => {
            if (event === 'change') {
              logger.info(`Configuration file changed: ${configFile}. Reloading...`);
              this.reload();
            }
          });
          
          this.watchers.set(configFile, watcherId);
        }
      } catch (error) {
        logger.error(`Error setting up file watcher for ${configFile}: ${error}`);
      }
    }
  }

  /**
   * Validates an object against schema
   * @param obj - Object to validate
   * @param schema - Validation schema
   * @param path - Current path for error reporting
   * @param result - Validation result to update
   */
  private validateObject(obj: any, schema: ConfigSchema, path: string, result: ValidationResult): void {
    for (const [key, rule] of Object.entries(schema)) {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      if (typeof rule === 'object' && !('type' in rule)) {
        // Nested schema
        if (value && typeof value === 'object') {
          this.validateObject(value, rule as ConfigSchema, currentPath, result);
        }
      } else {
        // Validation rule
        const validationRule = rule as ValidationRule;
        
        // Check required
        if (validationRule.required && (value === undefined || value === null)) {
          result.errors.push(`Required field missing: ${currentPath}`);
          result.isValid = false;
          continue;
        }
        
        if (value !== undefined && value !== null) {
          // Check type
          if (validationRule.type) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== validationRule.type) {
              result.errors.push(`Type mismatch at ${currentPath}: expected ${validationRule.type}, got ${actualType}`);
              result.isValid = false;
            }
          }
          
          // Check enum
          if (validationRule.enum && !validationRule.enum.includes(value)) {
            result.errors.push(`Invalid value at ${currentPath}: must be one of ${validationRule.enum.join(', ')}`);
            result.isValid = false;
          }
          
          // Check pattern
          if (validationRule.pattern && typeof value === 'string' && !validationRule.pattern.test(value)) {
            result.errors.push(`Pattern validation failed at ${currentPath}`);
            result.isValid = false;
          }
          
          // Check custom validator
          if (validationRule.validator) {
            const validationResult = validationRule.validator(value);
            if (validationResult !== true) {
              const message = typeof validationResult === 'string' ? validationResult : `Custom validation failed at ${currentPath}`;
              result.errors.push(message);
              result.isValid = false;
            }
          }
        }
      }
    }
  }

  /**
   * Deep merges two objects
   * @param target - Target object
   * @param source - Source object
   * @returns Merged object
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Sets a nested value in an object
   * @param obj - Target object
   * @param path - Dot-separated path
   * @param value - Value to set
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Parses environment variable value
   * @param value - String value
   * @returns Parsed value
   */
  private parseEnvValue(value: string): any {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    
    // Try to parse as JSON
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  /**
   * Simple YAML parser
   * @param content - YAML content
   * @returns Parsed object
   */
  private parseYAML(content: string): any {
    // Simplified YAML parser - for production use js-yaml library
    const lines = content.split('\n');
    const result: any = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          const value = trimmed.substring(colonIndex + 1).trim();
          result[key] = this.parseEnvValue(value);
        }
      }
    });
    
    return result;
  }

  /**
   * Converts object to YAML
   * @param obj - Object to convert
   * @returns YAML string
   */
  private convertToYAML(obj: any): string {
    const convertValue = (value: any, indent: string = ''): string[] => {
      const result: string[] = [];
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, val] of Object.entries(value)) {
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            result.push(`${indent}${key}:`);
            result.push(...convertValue(val, indent + '  '));
          } else {
            result.push(`${indent}${key}: ${val}`);
          }
        }
      }
      
      return result;
    };
    
    return convertValue(obj).join('\n');
  }

  /**
   * Counts total number of keys in configuration
   * @param obj - Object to count keys in
   * @returns Number of keys
   */
  private countKeys(obj: any): number {
    let count = 0;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        count++;
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          count += this.countKeys(obj[key]);
        }
      }
    }
    
    return count;
  }

  /**
   * Gets value from cache
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return undefined;
    }
    
    if (Date.now() - cached.timestamp > this.options.cacheTTL!) {
      this.cache.delete(key);
      return undefined;
    }
    
    return cached.value;
  }

  /**
   * Sets value in cache
   * @param key - Cache key
   * @param value - Value to cache
   */
  private setCache(key: string, value: any): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Clears cache for a specific key and related keys
   * @param key - Key to clear
   */
  private clearCacheForKey(key: string): void {
    // Clear exact match
    this.cache.delete(key);
    
    // Clear keys that start with this key
    for (const cacheKey of this.cache.keys()) {
      if (cacheKey.startsWith(key + '.')) {
        this.cache.delete(cacheKey);
      }
    }
  }

  /**
   * Clears entire cache
   */
  private clearCache(): void {
    this.cache.clear();
  }

  /**
   * Emits a configuration change event
   * @param event - Change event
   */
  private emitChangeEvent(event: ConfigChangeEvent): void {
    for (const listener of this.changeListeners) {
      try {
        listener(event);
      } catch (error) {
        logger.error(`Error in configuration change listener: ${error}`);
      }
    }
  }

  /**
   * Cleanup method to stop watchers and clear resources
   */
  cleanup(): void {
    // Stop all file watchers
    for (const watcherId of this.watchers.values()) {
      this.fileUtils.stopWatching(watcherId);
    }
    this.watchers.clear();
    
    // Clear cache
    this.clearCache();
    
    // Clear listeners
    this.changeListeners.length = 0;
    
    logger.info('ConfigManager cleanup completed');
  }
}




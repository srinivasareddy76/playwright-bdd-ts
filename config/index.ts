/**
 * Configuration Management Module
 * 
 * This module provides centralized configuration management for the BDD framework.
 * It supports multiple environments (dev, test, uat, onprem) with environment-specific
 * configuration files and runtime overrides via environment variables.
 * 
 * Key Features:
 * - Environment-specific configuration loading
 * - Runtime configuration overrides via environment variables
 * - Configuration validation using Zod schemas
 * - Caching for performance optimization
 * - Support for Oracle, PostgreSQL, and client certificate configurations
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { validateConfig, type Config } from './schema';
import { logger } from '../src/utils/logger';

// Load environment variables from .env file
dotenvConfig();

/** Current application environment, defaults to T5 if not specified */
const APP_ENV = process.env.APP_ENV || 'T5';

/**
 * Mapping of environment names to their respective groups
 * Used to organize configurations by deployment type
 */
const ENV_GROUP_MAP: Record<string, string> = {
  D1: 'dev',      // Development environments
  D2: 'dev',
  D3: 'dev',
  T1: 'test',     // Test environments
  T2: 'test',
  T3: 'test',
  T4: 'test',
  T5: 'test',
  U1: 'uat',      // User Acceptance Test environments
  U2: 'uat',
  U3: 'uat',
  U4: 'uat',
  QD1: 'onprem',  // On-premise environments
  QD2: 'onprem',
  QD3: 'onprem',
  QD4: 'onprem',
};

/**
 * Determines the environment group for a given environment name
 * @param envName - The environment name (e.g., 'T5', 'D1')
 * @returns The environment group (e.g., 'test', 'dev')
 * @throws Error if environment name is not recognized
 */
function getEnvGroup(envName: string): string {
  const group = ENV_GROUP_MAP[envName];
  if (!group) {
    throw new Error(`Unknown environment: ${envName}. Valid environments: ${Object.keys(ENV_GROUP_MAP).join(', ')}`);
  }
  return group;
}

/**
 * Loads and validates configuration from environment-specific JSON file
 * @param envName - The environment name to load configuration for
 * @returns Validated configuration object
 * @throws Error if configuration file is not found or invalid
 */
function loadConfigFile(envName: string): Config {
  const group = getEnvGroup(envName);
  const configPath = path.join(__dirname, 'env', group, `${envName}.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  try {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return validateConfig(configData);
  } catch (error) {
    throw new Error(`Failed to load or validate config from ${configPath}: ${error}`);
  }
}

/**
 * Applies runtime environment variable overrides to the base configuration
 * This allows for dynamic configuration changes without modifying config files
 * @param config - Base configuration object
 * @returns Configuration with environment variable overrides applied
 */
function applyEnvironmentOverrides(config: Config): Config {
  const overrides: Partial<Config> = {};

  // Application configuration overrides
  if (process.env.APP_BASE_URL) {
    overrides.app = { ...config.app, baseUrl: process.env.APP_BASE_URL };
  }
  if (process.env.APP_USERNAME) {
    overrides.app = { ...overrides.app, ...config.app, username: process.env.APP_USERNAME };
  }
  if (process.env.APP_PASSWORD) {
    overrides.app = { ...overrides.app, ...config.app, password: process.env.APP_PASSWORD };
  }

  // Oracle database configuration overrides
  const oracleOverrides: Partial<Config['db']['oracle']> = {};
  if (process.env.ORACLE_HOST) oracleOverrides.host = process.env.ORACLE_HOST;
  if (process.env.ORACLE_PORT) oracleOverrides.port = parseInt(process.env.ORACLE_PORT, 10);
  if (process.env.ORACLE_SERVICE_NAME) oracleOverrides.serviceName = process.env.ORACLE_SERVICE_NAME;
  if (process.env.ORACLE_USER) oracleOverrides.user = process.env.ORACLE_USER;
  if (process.env.ORACLE_PASSWORD) oracleOverrides.password = process.env.ORACLE_PASSWORD;

  // PostgreSQL database configuration overrides
  const pgOverrides: Partial<Config['db']['postgres']> = {};
  if (process.env.POSTGRES_HOST) pgOverrides.host = process.env.POSTGRES_HOST;
  if (process.env.POSTGRES_PORT) pgOverrides.port = parseInt(process.env.POSTGRES_PORT, 10);
  if (process.env.POSTGRES_DATABASE) pgOverrides.database = process.env.POSTGRES_DATABASE;
  if (process.env.POSTGRES_USER) pgOverrides.user = process.env.POSTGRES_USER;
  if (process.env.PG_PASSWORD) pgOverrides.password = process.env.PG_PASSWORD;

  // Client certificate configuration overrides
  const certOverrides: Partial<Config['certs']['client']> = {};
  if (process.env.PFX_PATH) certOverrides.pfxPath = process.env.PFX_PATH;
  if (process.env.PFX_PASSPHRASE) certOverrides.passphrase = process.env.PFX_PASSPHRASE;
  if (process.env.CERT_ORIGIN) certOverrides.origin = process.env.CERT_ORIGIN;

  // Merge all overrides with base configuration
  const mergedConfig: Config = {
    ...config,
    ...overrides,
    db: {
      oracle: { ...config.db.oracle, ...oracleOverrides },
      postgres: { ...config.db.postgres, ...pgOverrides },
    },
    certs: {
      client: { ...config.certs.client, ...certOverrides },
    },
  };

  return validateConfig(mergedConfig);
}

/** Cached configuration to avoid repeated file system operations */
let cachedConfig: Config | null = null;

/**
 * Main configuration loader function
 * Loads configuration from file and applies environment overrides
 * @returns Complete configuration object for the current environment
 * @throws Error if configuration loading or validation fails
 */
export function loadConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  logger.info(`Loading configuration for environment: ${APP_ENV}`);

  try {
    const baseConfig = loadConfigFile(APP_ENV);
    cachedConfig = applyEnvironmentOverrides(baseConfig);
    
    logger.info(`Configuration loaded successfully for ${cachedConfig.name} (${cachedConfig.group})`);
    return cachedConfig;
  } catch (error) {
    logger.error(`Failed to load configuration: ${error}`);
    throw error;
  }
}

/**
 * Gets the current application environment name
 * @returns Current environment name (e.g., 'T5', 'D1')
 */
export function getAppEnv(): string {
  return APP_ENV;
}

/**
 * Checks if the current environment is an on-premise environment
 * @returns True if current environment is on-premise, false otherwise
 */
export function isOnPremEnv(): boolean {
  return getEnvGroup(APP_ENV) === 'onprem';
}

/**
 * Checks if the current environment is a cloud environment
 * @returns True if current environment is cloud-based, false otherwise
 */
export function isCloudEnv(): boolean {
  return !isOnPremEnv();
}
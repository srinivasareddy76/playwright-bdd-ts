import * as fs from 'fs';
import * as path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { validateConfig, type Config } from './schema';
import { logger } from '../src/utils/logger';

// Load environment variables from .env file
dotenvConfig();

const APP_ENV = process.env.APP_ENV || 'T5';

// Map environment names to their groups
const ENV_GROUP_MAP: Record<string, string> = {
  D1: 'dev',
  D2: 'dev',
  D3: 'dev',
  T1: 'test',
  T2: 'test',
  T3: 'test',
  T4: 'test',
  T5: 'test',
  U1: 'uat',
  U2: 'uat',
  U3: 'uat',
  U4: 'uat',
  QD1: 'onprem',
  QD2: 'onprem',
  QD3: 'onprem',
  QD4: 'onprem',
};

function getEnvGroup(envName: string): string {
  const group = ENV_GROUP_MAP[envName];
  if (!group) {
    throw new Error(`Unknown environment: ${envName}. Valid environments: ${Object.keys(ENV_GROUP_MAP).join(', ')}`);
  }
  return group;
}

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

function applyEnvironmentOverrides(config: Config): Config {
  const overrides: Partial<Config> = {};

  // App overrides
  if (process.env.APP_BASE_URL) {
    overrides.app = { ...config.app, baseUrl: process.env.APP_BASE_URL };
  }
  if (process.env.APP_USERNAME) {
    overrides.app = { ...overrides.app, ...config.app, username: process.env.APP_USERNAME };
  }
  if (process.env.APP_PASSWORD) {
    overrides.app = { ...overrides.app, ...config.app, password: process.env.APP_PASSWORD };
  }

  // Oracle overrides
  const oracleOverrides: Partial<Config['db']['oracle']> = {};
  if (process.env.ORACLE_HOST) oracleOverrides.host = process.env.ORACLE_HOST;
  if (process.env.ORACLE_PORT) oracleOverrides.port = parseInt(process.env.ORACLE_PORT, 10);
  if (process.env.ORACLE_SERVICE_NAME) oracleOverrides.serviceName = process.env.ORACLE_SERVICE_NAME;
  if (process.env.ORACLE_USER) oracleOverrides.user = process.env.ORACLE_USER;
  if (process.env.ORACLE_PASSWORD) oracleOverrides.password = process.env.ORACLE_PASSWORD;

  // Postgres overrides
  const pgOverrides: Partial<Config['db']['postgres']> = {};
  if (process.env.POSTGRES_HOST) pgOverrides.host = process.env.POSTGRES_HOST;
  if (process.env.POSTGRES_PORT) pgOverrides.port = parseInt(process.env.POSTGRES_PORT, 10);
  if (process.env.POSTGRES_DATABASE) pgOverrides.database = process.env.POSTGRES_DATABASE;
  if (process.env.POSTGRES_USER) pgOverrides.user = process.env.POSTGRES_USER;
  if (process.env.PG_PASSWORD) pgOverrides.password = process.env.PG_PASSWORD;

  // Certificate overrides
  const certOverrides: Partial<Config['certs']['client']> = {};
  if (process.env.PFX_PATH) certOverrides.pfxPath = process.env.PFX_PATH;
  if (process.env.PFX_PASSPHRASE) certOverrides.passphrase = process.env.PFX_PASSPHRASE;
  if (process.env.CERT_ORIGIN) certOverrides.origin = process.env.CERT_ORIGIN;

  // Apply overrides
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

let cachedConfig: Config | null = null;

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

export function getAppEnv(): string {
  return APP_ENV;
}

export function isOnPremEnv(): boolean {
  return getEnvGroup(APP_ENV) === 'onprem';
}

export function isCloudEnv(): boolean {
  return !isOnPremEnv();
}
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.getAppEnv = getAppEnv;
exports.isOnPremEnv = isOnPremEnv;
exports.isCloudEnv = isCloudEnv;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = require("dotenv");
const schema_1 = require("./schema");
const logger_1 = require("../src/utils/logger");
// Load environment variables from .env file
(0, dotenv_1.config)();
const APP_ENV = process.env.APP_ENV || 'T5';
// Map environment names to their groups
const ENV_GROUP_MAP = {
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
function getEnvGroup(envName) {
    const group = ENV_GROUP_MAP[envName];
    if (!group) {
        throw new Error(`Unknown environment: ${envName}. Valid environments: ${Object.keys(ENV_GROUP_MAP).join(', ')}`);
    }
    return group;
}
function loadConfigFile(envName) {
    const group = getEnvGroup(envName);
    const configPath = path.join(__dirname, 'env', group, `${envName}.json`);
    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
    }
    try {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        return (0, schema_1.validateConfig)(configData);
    }
    catch (error) {
        throw new Error(`Failed to load or validate config from ${configPath}: ${error}`);
    }
}
function applyEnvironmentOverrides(config) {
    const overrides = {};
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
    const oracleOverrides = {};
    if (process.env.ORACLE_HOST)
        oracleOverrides.host = process.env.ORACLE_HOST;
    if (process.env.ORACLE_PORT)
        oracleOverrides.port = parseInt(process.env.ORACLE_PORT, 10);
    if (process.env.ORACLE_SERVICE_NAME)
        oracleOverrides.serviceName = process.env.ORACLE_SERVICE_NAME;
    if (process.env.ORACLE_USER)
        oracleOverrides.user = process.env.ORACLE_USER;
    if (process.env.ORACLE_PASSWORD)
        oracleOverrides.password = process.env.ORACLE_PASSWORD;
    // Postgres overrides
    const pgOverrides = {};
    if (process.env.POSTGRES_HOST)
        pgOverrides.host = process.env.POSTGRES_HOST;
    if (process.env.POSTGRES_PORT)
        pgOverrides.port = parseInt(process.env.POSTGRES_PORT, 10);
    if (process.env.POSTGRES_DATABASE)
        pgOverrides.database = process.env.POSTGRES_DATABASE;
    if (process.env.POSTGRES_USER)
        pgOverrides.user = process.env.POSTGRES_USER;
    if (process.env.PG_PASSWORD)
        pgOverrides.password = process.env.PG_PASSWORD;
    // Certificate overrides
    const certOverrides = {};
    if (process.env.PFX_PATH)
        certOverrides.pfxPath = process.env.PFX_PATH;
    if (process.env.PFX_PASSPHRASE)
        certOverrides.passphrase = process.env.PFX_PASSPHRASE;
    if (process.env.CERT_ORIGIN)
        certOverrides.origin = process.env.CERT_ORIGIN;
    // Apply overrides
    const mergedConfig = {
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
    return (0, schema_1.validateConfig)(mergedConfig);
}
let cachedConfig = null;
function loadConfig() {
    if (cachedConfig) {
        return cachedConfig;
    }
    logger_1.logger.info(`Loading configuration for environment: ${APP_ENV}`);
    try {
        const baseConfig = loadConfigFile(APP_ENV);
        cachedConfig = applyEnvironmentOverrides(baseConfig);
        logger_1.logger.info(`Configuration loaded successfully for ${cachedConfig.name} (${cachedConfig.group})`);
        return cachedConfig;
    }
    catch (error) {
        logger_1.logger.error(`Failed to load configuration: ${error}`);
        throw error;
    }
}
function getAppEnv() {
    return APP_ENV;
}
function isOnPremEnv() {
    return getEnvGroup(APP_ENV) === 'onprem';
}
function isCloudEnv() {
    return !isOnPremEnv();
}
//# sourceMappingURL=index.js.map
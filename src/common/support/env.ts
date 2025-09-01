import { loadConfig, getAppEnv, isOnPremEnv, isCloudEnv } from '../../../config';
import { logger } from '../../utils/logger';
import type { Config } from '../../../config/schema';

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: Config;
  private envName: string;

  private constructor() {
    this.envName = getAppEnv();
    this.config = loadConfig();
    this.logEnvironmentInfo();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private logEnvironmentInfo(): void {
    logger.info('='.repeat(60));
    logger.info('ENVIRONMENT CONFIGURATION');
    logger.info('='.repeat(60));
    logger.info(`Environment: ${this.config.name} (${this.config.group})`);
    logger.info(`App URL: ${this.config.app.baseUrl}`);
    logger.info(`Database Type: ${isOnPremEnv() ? 'Oracle (On-Premise)' : 'PostgreSQL (Cloud)'}`);
    logger.info(`Oracle Host: ${this.config.db.oracle.host}:${this.config.db.oracle.port}`);
    logger.info(`PostgreSQL Host: ${this.config.db.postgres.host}:${this.config.db.postgres.port}`);
    logger.info(`Certificate Origin: ${this.config.certs.client.origin}`);
    logger.info('='.repeat(60));
  }

  getConfig(): Config {
    return this.config;
  }

  getEnvironmentName(): string {
    return this.envName;
  }

  getEnvironmentGroup(): string {
    return this.config.group;
  }

  isOnPremise(): boolean {
    return isOnPremEnv();
  }

  isCloud(): boolean {
    return isCloudEnv();
  }

  getAppUrl(): string {
    return this.config.app.baseUrl;
  }

  getAppCredentials(): { username: string; password: string } {
    return {
      username: this.config.app.username,
      password: this.config.app.password,
    };
  }

  getDatabaseConfig(): {
    oracle: Config['db']['oracle'];
    postgres: Config['db']['postgres'];
  } {
    return {
      oracle: this.config.db.oracle,
      postgres: this.config.db.postgres,
    };
  }

  getCertificateConfig(): Config['certs']['client'] {
    return this.config.certs.client;
  }

  // Environment-specific feature flags
  isFeatureEnabled(featureName: string): boolean {
    const featureFlags: Record<string, boolean> = {
      // Development environment features
      debugMode: this.config.group === 'dev',
      verboseLogging: this.config.group === 'dev',
      
      // Test environment features
      parallelExecution: this.config.group === 'test',
      screenshotOnFailure: true,
      videoRecording: this.config.group !== 'dev',
      
      // UAT environment features
      performanceMonitoring: this.config.group === 'uat',
      
      // On-premise specific features
      oracleDatabase: this.isOnPremise(),
      clientCertificates: true,
      
      // Cloud specific features
      postgresDatabase: this.isCloud(),
      awsIntegration: this.isCloud(),
    };

    return featureFlags[featureName] || false;
  }

  // Environment-specific timeouts
  getTimeouts(): {
    navigation: number;
    action: number;
    assertion: number;
    api: number;
    database: number;
  } {
    const baseTimeouts = {
      navigation: 30000,
      action: 10000,
      assertion: 5000,
      api: 15000,
      database: 30000,
    };

    // Adjust timeouts based on environment
    const multiplier = this.getTimeoutMultiplier();
    
    return {
      navigation: baseTimeouts.navigation * multiplier,
      action: baseTimeouts.action * multiplier,
      assertion: baseTimeouts.assertion * multiplier,
      api: baseTimeouts.api * multiplier,
      database: baseTimeouts.database * multiplier,
    };
  }

  private getTimeoutMultiplier(): number {
    switch (this.config.group) {
      case 'dev':
        return 1.5; // Slower for debugging
      case 'test':
        return 1.0; // Standard timeouts
      case 'uat':
        return 1.2; // Slightly longer for stability
      case 'onprem':
        return 2.0; // Longer for on-premise networks
      default:
        return 1.0;
    }
  }

  // Environment-specific retry settings
  getRetrySettings(): {
    maxRetries: number;
    retryDelay: number;
    exponentialBackoff: boolean;
  } {
    switch (this.config.group) {
      case 'dev':
        return {
          maxRetries: 1,
          retryDelay: 1000,
          exponentialBackoff: false,
        };
      case 'test':
        return {
          maxRetries: 2,
          retryDelay: 2000,
          exponentialBackoff: true,
        };
      case 'uat':
        return {
          maxRetries: 3,
          retryDelay: 3000,
          exponentialBackoff: true,
        };
      case 'onprem':
        return {
          maxRetries: 3,
          retryDelay: 5000,
          exponentialBackoff: true,
        };
      default:
        return {
          maxRetries: 2,
          retryDelay: 2000,
          exponentialBackoff: true,
        };
    }
  }

  // Environment validation
  validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate app configuration
    if (!this.config.app.baseUrl) {
      errors.push('App base URL is not configured');
    }

    if (!this.config.app.username || !this.config.app.password) {
      errors.push('App credentials are not configured');
    }

    // Validate database configuration
    if (this.isOnPremise()) {
      if (!this.config.db.oracle.host || !this.config.db.oracle.user) {
        errors.push('Oracle database configuration is incomplete');
      }
    } else {
      if (!this.config.db.postgres.host || !this.config.db.postgres.user) {
        errors.push('PostgreSQL database configuration is incomplete');
      }
    }

    // Validate certificate configuration
    if (!this.config.certs.client.pfxPath || !this.config.certs.client.passphrase) {
      errors.push('Client certificate configuration is incomplete');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get environment-specific test tags
  getEnvironmentTags(): string[] {
    const tags = [
      `@${this.config.group}`,
      `@${this.envName.toLowerCase()}`,
    ];

    if (this.isOnPremise()) {
      tags.push('@onprem', '@oracle');
    } else {
      tags.push('@cloud', '@postgres');
    }

    return tags;
  }

  // Environment comparison utilities
  isSameEnvironmentGroup(_otherEnv: string): boolean {
    const otherConfig = loadConfig(); // This would need to be modified to load specific env
    return this.config.group === otherConfig.group;
  }

  isProductionLike(): boolean {
    return this.config.group === 'uat' || this.config.group === 'onprem';
  }

  isDevelopmentLike(): boolean {
    return this.config.group === 'dev' || this.config.group === 'test';
  }
}

// Convenience functions
export function getEnvironment(): EnvironmentManager {
  return EnvironmentManager.getInstance();
}

export function getCurrentEnvironmentName(): string {
  return getEnvironment().getEnvironmentName();
}

export function getCurrentConfig(): Config {
  return getEnvironment().getConfig();
}

export function isFeatureEnabled(featureName: string): boolean {
  return getEnvironment().isFeatureEnabled(featureName);
}

export function getEnvironmentTimeouts() {
  return getEnvironment().getTimeouts();
}

export function validateCurrentEnvironment() {
  return getEnvironment().validateEnvironment();
}
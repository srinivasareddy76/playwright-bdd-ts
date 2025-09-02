/**
 * Configuration Schema Definition
 * 
 * This module defines the Zod schema for validating configuration objects
 * used throughout the BDD framework. It ensures type safety and runtime
 * validation of configuration data loaded from JSON files.
 * 
 * Key Features:
 * - Comprehensive validation for all configuration sections
 * - Type inference for TypeScript integration
 * - Default values for optional properties
 * - Custom validation rules for complex requirements
 * - Support for Oracle, PostgreSQL, and client certificate configurations
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Main configuration schema defining the structure and validation rules
 * for all configuration objects in the framework
 */
export const ConfigSchema = z.object({
  /** Environment name (e.g., "Test Environment T5") */
  name: z.string(),
  
  /** Environment group classification */
  group: z.enum(['dev', 'test', 'uat', 'onprem']),
  
  /** Application-specific configuration */
  app: z.object({
    /** Base URL for the application under test */
    baseUrl: z.string().url(),
    /** Default username for authentication */
    username: z.string(),
    /** Default password for authentication */
    password: z.string(),
  }),
  
  /** Database configuration section */
  db: z.object({
    /** Oracle database configuration */
    oracle: z
      .object({
        /** Oracle database host */
        host: z.string(),
        /** Oracle database port */
        port: z.number().int().positive(),
        /** Oracle service name (alternative to connect string) */
        serviceName: z.string().optional(),
        /** Oracle connect string (alternative to service name) */
        connectString: z.string().optional(),
        /** Database username */
        user: z.string(),
        /** Database password */
        password: z.string(),
        /** Minimum number of connections in pool */
        poolMin: z.number().int().nonnegative().default(1),
        /** Maximum number of connections in pool */
        poolMax: z.number().int().positive().default(10),
        /** Connection pool increment size */
        poolIncrement: z.number().int().positive().default(1),
        /** Pool timeout in seconds */
        poolTimeout: z.number().int().positive().default(60),
        /** Enable connection statistics */
        enableStatistics: z.boolean().default(false),
      })
      .refine(data => data.serviceName || data.connectString, {
        message: 'Either serviceName or connectString must be provided',
      }),
    
    /** PostgreSQL database configuration */
    postgres: z.object({
      /** PostgreSQL database host */
      host: z.string(),
      /** PostgreSQL database port */
      port: z.number().int().positive(),
      /** Database name */
      database: z.string(),
      /** Database username */
      user: z.string(),
      /** Database password */
      password: z.string(),
      /** Maximum number of connections in pool */
      max: z.number().int().positive().default(20),
      /** Idle timeout in milliseconds */
      idleTimeoutMillis: z.number().int().positive().default(30000),
      /** Connection timeout in milliseconds */
      connectionTimeoutMillis: z.number().int().positive().default(2000),
      /** SSL configuration for secure connections */
      ssl: z
        .object({
          /** Whether to reject unauthorized certificates */
          rejectUnauthorized: z.boolean().default(false),
          /** Certificate Authority certificate */
          ca: z.string().optional(),
          /** Client certificate */
          cert: z.string().optional(),
          /** Client private key */
          key: z.string().optional(),
        })
        .optional(),
    }),
  }),
  
  /** Certificate configuration section */
  certs: z.object({
    /** Client certificate configuration for mTLS */
    client: z.object({
      /** Path to PFX certificate file */
      pfxPath: z.string(),
      /** Passphrase for PFX certificate */
      passphrase: z.string(),
      /** Origin URL for certificate validation */
      origin: z.string().url(),
    }),
  }),
});

/**
 * TypeScript type inferred from the configuration schema
 * Provides compile-time type checking for configuration objects
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Validates a configuration object against the schema
 * @param config - Raw configuration object to validate
 * @returns Validated and typed configuration object
 * @throws ZodError if validation fails
 */
export const validateConfig = (config: unknown): Config => {
  return ConfigSchema.parse(config);
};
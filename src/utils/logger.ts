/**
 * Logging Utility Module
 * 
 * This module provides centralized logging functionality for the BDD framework
 * using Winston logger. It supports multiple log levels, file rotation, and
 * both console and file output with proper formatting.
 * 
 * Key Features:
 * - Configurable log levels via environment variables
 * - Console output with colorization
 * - File-based logging with rotation (5MB max, 5 files)
 * - Separate error log file
 * - Timestamp formatting
 * - Stack trace support for errors
 * - Automatic log directory creation
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import winston from 'winston';
import * as fs from 'fs';

/** Log level from environment variable, defaults to 'info' */
const logLevel = process.env.LOG_LEVEL || 'info';

/**
 * Winston logger instance configured for the BDD framework
 * Provides structured logging with multiple transports and formatting
 */
export const logger = winston.createLogger({
  /** Set log level from environment or default to info */
  level: logLevel,
  
  /** Combined format configuration for structured logging */
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
    })
  ),
  
  /** Multiple transport configuration for different output destinations */
  transports: [
    /** Console transport with colorization for development */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    /** Error-only file transport with rotation */
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    /** Combined log file transport with rotation */
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Ensure logs directory exists
 * Creates the logs directory if it doesn't exist to prevent file transport errors
 */
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}
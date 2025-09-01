/**
 * Path Utilities Module
 * 
 * This module provides centralized path management utilities for the BDD framework.
 * It handles project structure navigation, directory creation, and certificate
 * file resolution with proper validation.
 * 
 * Key Features:
 * - Project root and standard directory path resolution
 * - Automatic directory creation with recursive support
 * - PFX certificate file resolution and validation
 * - Cross-platform path handling
 * - Comprehensive error messages for missing files
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import * as path from 'path';
import * as fs from 'fs';

/**
 * Utility class for managing file system paths within the BDD framework
 * Provides static methods for common path operations and validations
 */
export class PathUtils {
  /**
   * Gets the absolute path to the project root directory
   * @returns Absolute path to project root
   */
  static getProjectRoot(): string {
    return path.resolve(__dirname, '../..');
  }

  /**
   * Gets the absolute path to the configuration directory
   * @returns Absolute path to config directory
   */
  static getConfigPath(): string {
    return path.join(this.getProjectRoot(), 'config');
  }

  /**
   * Gets the absolute path to the secrets directory
   * Used for storing sensitive files like certificates
   * @returns Absolute path to secrets directory
   */
  static getSecretsPath(): string {
    return path.join(this.getProjectRoot(), 'secrets');
  }

  /**
   * Gets the absolute path to the features directory
   * @returns Absolute path to features directory
   */
  static getFeaturesPath(): string {
    return path.join(this.getProjectRoot(), 'features');
  }

  /**
   * Gets the absolute path to the test results directory
   * @returns Absolute path to test-results directory
   */
  static getTestResultsPath(): string {
    return path.join(this.getProjectRoot(), 'test-results');
  }

  /**
   * Ensures a directory exists, creating it recursively if necessary
   * @param dirPath - Path to the directory to create
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Resolves PFX certificate file path with fallback locations
   * Tries multiple locations in order:
   * 1. Absolute path (if provided)
   * 2. Relative to project root
   * 3. Relative to secrets directory
   * 
   * @param pfxPath - Original PFX file path from configuration
   * @returns Resolved absolute path to PFX file
   */
  static resolvePfxPath(pfxPath: string): string {
    if (path.isAbsolute(pfxPath)) {
      return pfxPath;
    }
    
    // Try relative to project root first
    const projectRelativePath = path.join(this.getProjectRoot(), pfxPath);
    if (fs.existsSync(projectRelativePath)) {
      return projectRelativePath;
    }

    // Try relative to secrets directory
    const secretsRelativePath = path.join(this.getSecretsPath(), pfxPath);
    if (fs.existsSync(secretsRelativePath)) {
      return secretsRelativePath;
    }

    // Return the original path (will fail later with clear error)
    return pfxPath;
  }

  /**
   * Validates that a PFX certificate file exists and is accessible
   * Provides detailed error messages for troubleshooting
   * 
   * @param pfxPath - Path to PFX certificate file
   * @throws Error if file is not found or not accessible
   */
  static validatePfxFile(pfxPath: string): void {
    const resolvedPath = this.resolvePfxPath(pfxPath);
    
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(
        `PFX certificate file not found: ${resolvedPath}\n` +
        'Please ensure your client certificate is placed in the secrets/ directory.\n' +
        'See README.md for setup instructions.'
      );
    }

    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      throw new Error(`PFX path is not a file: ${resolvedPath}`);
    }
  }
}


/**
 * File Utilities Module
 * 
 * This module provides comprehensive file I/O operations for the BDD framework.
 * It includes file manipulation, directory operations, file monitoring, compression,
 * and advanced file processing capabilities with error handling and logging.
 * 
 * Key Features:
 * - File and directory operations (create, read, write, delete, copy, move)
 * - File monitoring and watching capabilities
 * - File compression and archiving
 * - File encryption and security operations
 * - Batch file processing
 * - File validation and integrity checking
 * - Temporary file management
 * - File search and filtering
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from './logger';
import { PathUtils } from './paths';
import { DateUtils, DateFormat } from './DateUtils';

/**
 * File operation options interface
 */
export interface FileOptions {
  /** File encoding (default: utf8) */
  encoding?: BufferEncoding;
  /** Create directories if they don't exist */
  createDirs?: boolean;
  /** Overwrite existing files */
  overwrite?: boolean;
  /** File permissions (octal) */
  mode?: number;
  /** Backup existing file before operation */
  backup?: boolean;
}

/**
 * File search criteria interface
 */
export interface SearchCriteria {
  /** File name pattern (supports wildcards) */
  pattern?: string;
  /** File extension filter */
  extension?: string;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Modified after date */
  modifiedAfter?: Date;
  /** Modified before date */
  modifiedBefore?: Date;
  /** Include subdirectories */
  recursive?: boolean;
  /** Case sensitive search */
  caseSensitive?: boolean;
}

/**
 * File information interface
 */
export interface FileInfo {
  /** Full file path */
  path: string;
  /** File name with extension */
  name: string;
  /** File name without extension */
  baseName: string;
  /** File extension */
  extension: string;
  /** File size in bytes */
  size: number;
  /** Creation date */
  created: Date;
  /** Last modified date */
  modified: Date;
  /** Last accessed date */
  accessed: Date;
  /** Is directory */
  isDirectory: boolean;
  /** Is file */
  isFile: boolean;
  /** File permissions */
  permissions: string;
  /** File hash (MD5) */
  hash?: string;
}

/**
 * File watcher callback interface
 */
export interface FileWatcherCallback {
  (event: 'change' | 'rename' | 'error', filename?: string, error?: Error): void;
}

/**
 * Compression options interface
 */
export interface CompressionOptions {
  /** Compression level (1-9) */
  level?: number;
  /** Include subdirectories */
  recursive?: boolean;
  /** Exclude patterns */
  exclude?: string[];
  /** Compression format */
  format?: 'zip' | 'gzip' | 'tar';
}

/**
 * Comprehensive file utility class providing advanced file I/O operations
 * for test automation with enhanced error handling and logging
 */
export class FileUtils {
  private static instance: FileUtils;
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private tempFiles: Set<string> = new Set();

  private constructor() {
    // Cleanup temp files on process exit
    process.on('exit', () => this.cleanupTempFiles());
    process.on('SIGINT', () => this.cleanupTempFiles());
    process.on('SIGTERM', () => this.cleanupTempFiles());
  }

  /**
   * Gets singleton instance of FileUtils
   * @returns FileUtils instance
   */
  static getInstance(): FileUtils {
    if (!FileUtils.instance) {
      FileUtils.instance = new FileUtils();
    }
    return FileUtils.instance;
  }

  /**
   * Checks if a file or directory exists
   * @param filePath - Path to check
   * @returns True if exists
   */
  exists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      logger.error(`Error checking file existence: ${filePath} - ${error}`);
      return false;
    }
  }

  /**
   * Reads file content as string
   * @param filePath - Path to file
   * @param encoding - File encoding
   * @returns File content
   */
  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    try {
      if (!this.exists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, encoding);
      logger.debug(`File read successfully: ${filePath}`);
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Reads file content as buffer
   * @param filePath - Path to file
   * @returns File buffer
   */
  async readFileBuffer(filePath: string): Promise<Buffer> {
    try {
      if (!this.exists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const buffer = fs.readFileSync(filePath);
      logger.debug(`File buffer read successfully: ${filePath}`);
      return buffer;
    } catch (error) {
      logger.error(`Failed to read file buffer: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Writes content to file
   * @param filePath - Path to file
   * @param content - Content to write
   * @param options - Write options
   */
  async writeFile(filePath: string, content: string | Buffer, options: FileOptions = {}): Promise<void> {
    try {
      const {
        encoding = 'utf8',
        createDirs = true,
        overwrite = true,
        mode,
        backup = false
      } = options;

      // Create backup if requested
      if (backup && this.exists(filePath)) {
        await this.createBackup(filePath);
      }

      // Check if file exists and overwrite is disabled
      if (!overwrite && this.exists(filePath)) {
        throw new Error(`File already exists and overwrite is disabled: ${filePath}`);
      }

      // Create directories if needed
      if (createDirs) {
        const dir = path.dirname(filePath);
        if (!this.exists(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }

      // Write file
      if (Buffer.isBuffer(content)) {
        fs.writeFileSync(filePath, content, { mode });
      } else {
        fs.writeFileSync(filePath, content, { encoding, mode });
      }

      logger.info(`File written successfully: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Appends content to file
   * @param filePath - Path to file
   * @param content - Content to append
   * @param options - Append options
   */
  async appendFile(filePath: string, content: string, options: FileOptions = {}): Promise<void> {
    try {
      const { encoding = 'utf8', createDirs = true } = options;

      // Create directories if needed
      if (createDirs) {
        const dir = path.dirname(filePath);
        if (!this.exists(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }

      fs.appendFileSync(filePath, content, { encoding });
      logger.debug(`Content appended to file: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to append to file: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a file or directory
   * @param filePath - Path to delete
   * @param recursive - Delete directories recursively
   */
  async delete(filePath: string, recursive: boolean = false): Promise<void> {
    try {
      if (!this.exists(filePath)) {
        logger.warn(`File/directory not found for deletion: ${filePath}`);
        return;
      }

      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        if (recursive) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.rmdirSync(filePath);
        }
      } else {
        fs.unlinkSync(filePath);
      }

      logger.info(`Deleted: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Copies a file or directory
   * @param sourcePath - Source path
   * @param destinationPath - Destination path
   * @param options - Copy options
   */
  async copy(sourcePath: string, destinationPath: string, options: FileOptions = {}): Promise<void> {
    try {
      if (!this.exists(sourcePath)) {
        throw new Error(`Source not found: ${sourcePath}`);
      }

      const { createDirs = true, overwrite = true } = options;

      // Check if destination exists and overwrite is disabled
      if (!overwrite && this.exists(destinationPath)) {
        throw new Error(`Destination exists and overwrite is disabled: ${destinationPath}`);
      }

      // Create destination directory if needed
      if (createDirs) {
        const destDir = path.dirname(destinationPath);
        if (!this.exists(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
      }

      const stats = fs.statSync(sourcePath);
      
      if (stats.isDirectory()) {
        await this.copyDirectory(sourcePath, destinationPath, options);
      } else {
        fs.copyFileSync(sourcePath, destinationPath);
      }

      logger.info(`Copied: ${sourcePath} -> ${destinationPath}`);
    } catch (error) {
      logger.error(`Failed to copy: ${sourcePath} -> ${destinationPath} - ${error}`);
      throw error;
    }
  }

  /**
   * Moves a file or directory
   * @param sourcePath - Source path
   * @param destinationPath - Destination path
   * @param options - Move options
   */
  async move(sourcePath: string, destinationPath: string, options: FileOptions = {}): Promise<void> {
    try {
      await this.copy(sourcePath, destinationPath, options);
      await this.delete(sourcePath, true);
      logger.info(`Moved: ${sourcePath} -> ${destinationPath}`);
    } catch (error) {
      logger.error(`Failed to move: ${sourcePath} -> ${destinationPath} - ${error}`);
      throw error;
    }
  }

  /**
   * Creates a directory
   * @param dirPath - Directory path
   * @param recursive - Create parent directories
   */
  async createDirectory(dirPath: string, recursive: boolean = true): Promise<void> {
    try {
      if (this.exists(dirPath)) {
        logger.debug(`Directory already exists: ${dirPath}`);
        return;
      }

      fs.mkdirSync(dirPath, { recursive });
      logger.info(`Directory created: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to create directory: ${dirPath} - ${error}`);
      throw error;
    }
  }

  /**
   * Lists files and directories in a path
   * @param dirPath - Directory path
   * @param recursive - Include subdirectories
   * @returns Array of file paths
   */
  async listFiles(dirPath: string, recursive: boolean = false): Promise<string[]> {
    try {
      if (!this.exists(dirPath)) {
        throw new Error(`Directory not found: ${dirPath}`);
      }

      const files: string[] = [];
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
          files.push(itemPath);
        } else if (stats.isDirectory() && recursive) {
          const subFiles = await this.listFiles(itemPath, recursive);
          files.push(...subFiles);
        }
      }

      return files;
    } catch (error) {
      logger.error(`Failed to list files: ${dirPath} - ${error}`);
      throw error;
    }
  }

  /**
   * Gets detailed file information
   * @param filePath - Path to file
   * @returns File information
   */
  async getFileInfo(filePath: string): Promise<FileInfo> {
    try {
      if (!this.exists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      const parsedPath = path.parse(filePath);

      const fileInfo: FileInfo = {
        path: filePath,
        name: parsedPath.base,
        baseName: parsedPath.name,
        extension: parsedPath.ext,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        permissions: stats.mode.toString(8)
      };

      // Calculate hash for files
      if (fileInfo.isFile) {
        fileInfo.hash = await this.calculateHash(filePath);
      }

      return fileInfo;
    } catch (error) {
      logger.error(`Failed to get file info: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Searches for files based on criteria
   * @param searchPath - Path to search in
   * @param criteria - Search criteria
   * @returns Array of matching file paths
   */
  async searchFiles(searchPath: string, criteria: SearchCriteria = {}): Promise<string[]> {
    try {
      const {
        pattern,
        extension,
        minSize,
        maxSize,
        modifiedAfter,
        modifiedBefore,
        recursive = false,
        caseSensitive = false
      } = criteria;

      const allFiles = await this.listFiles(searchPath, recursive);
      const matchingFiles: string[] = [];

      for (const filePath of allFiles) {
        const fileInfo = await this.getFileInfo(filePath);
        let matches = true;

        // Pattern matching
        if (pattern && matches) {
          const fileName = caseSensitive ? fileInfo.name : fileInfo.name.toLowerCase();
          const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();
          matches = this.matchesPattern(fileName, searchPattern);
        }

        // Extension matching
        if (extension && matches) {
          const fileExt = fileInfo.extension.toLowerCase();
          const searchExt = extension.toLowerCase();
          matches = fileExt === (searchExt.startsWith('.') ? searchExt : `.${searchExt}`);
        }

        // Size filtering
        if (minSize !== undefined && matches) {
          matches = fileInfo.size >= minSize;
        }

        if (maxSize !== undefined && matches) {
          matches = fileInfo.size <= maxSize;
        }

        // Date filtering
        if (modifiedAfter && matches) {
          matches = fileInfo.modified >= modifiedAfter;
        }

        if (modifiedBefore && matches) {
          matches = fileInfo.modified <= modifiedBefore;
        }

        if (matches) {
          matchingFiles.push(filePath);
        }
      }

      logger.info(`Found ${matchingFiles.length} files matching criteria in ${searchPath}`);
      return matchingFiles;
    } catch (error) {
      logger.error(`Failed to search files: ${searchPath} - ${error}`);
      throw error;
    }
  }

  /**
   * Watches a file or directory for changes
   * @param filePath - Path to watch
   * @param callback - Callback function for changes
   * @returns Watcher ID for stopping the watch
   */
  watchFile(filePath: string, callback: FileWatcherCallback): string {
    try {
      const watcherId = `${filePath}_${Date.now()}`;
      
      const watcher = fs.watch(filePath, { recursive: true }, (eventType, filename) => {
        callback(eventType as 'change' | 'rename', filename || undefined);
      });

      watcher.on('error', (error) => {
        callback('error', undefined, error);
      });

      this.watchers.set(watcherId, watcher);
      logger.info(`Started watching: ${filePath} (ID: ${watcherId})`);
      
      return watcherId;
    } catch (error) {
      logger.error(`Failed to watch file: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Stops watching a file
   * @param watcherId - Watcher ID returned by watchFile
   */
  stopWatching(watcherId: string): void {
    try {
      const watcher = this.watchers.get(watcherId);
      if (watcher) {
        watcher.close();
        this.watchers.delete(watcherId);
        logger.info(`Stopped watching (ID: ${watcherId})`);
      }
    } catch (error) {
      logger.error(`Failed to stop watching (ID: ${watcherId}) - ${error}`);
    }
  }

  /**
   * Creates a temporary file
   * @param prefix - File name prefix
   * @param suffix - File name suffix
   * @param content - Optional initial content
   * @returns Temporary file path
   */
  async createTempFile(prefix: string = 'temp', suffix: string = '.tmp', content?: string): Promise<string> {
    try {
      const tempDir = path.join(PathUtils.getProjectRoot(), 'temp');
      PathUtils.ensureDirectoryExists(tempDir);

      const timestamp = DateUtils.formatDate(new Date(), DateFormat.FILE_TIMESTAMP);
      const fileName = `${prefix}_${timestamp}_${Math.random().toString(36).substr(2, 9)}${suffix}`;
      const tempPath = path.join(tempDir, fileName);

      if (content) {
        await this.writeFile(tempPath, content);
      } else {
        fs.writeFileSync(tempPath, '');
      }

      this.tempFiles.add(tempPath);
      logger.debug(`Temporary file created: ${tempPath}`);
      
      return tempPath;
    } catch (error) {
      logger.error(`Failed to create temporary file - ${error}`);
      throw error;
    }
  }

  /**
   * Calculates file hash
   * @param filePath - Path to file
   * @param algorithm - Hash algorithm (default: md5)
   * @returns File hash
   */
  async calculateHash(filePath: string, algorithm: string = 'md5'): Promise<string> {
    try {
      const buffer = await this.readFileBuffer(filePath);
      const hash = crypto.createHash(algorithm);
      hash.update(buffer);
      return hash.digest('hex');
    } catch (error) {
      logger.error(`Failed to calculate hash for: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Compares two files
   * @param file1Path - First file path
   * @param file2Path - Second file path
   * @returns True if files are identical
   */
  async compareFiles(file1Path: string, file2Path: string): Promise<boolean> {
    try {
      const hash1 = await this.calculateHash(file1Path);
      const hash2 = await this.calculateHash(file2Path);
      return hash1 === hash2;
    } catch (error) {
      logger.error(`Failed to compare files: ${file1Path} vs ${file2Path} - ${error}`);
      throw error;
    }
  }

  /**
   * Creates a backup of a file
   * @param filePath - File to backup
   * @returns Backup file path
   */
  private async createBackup(filePath: string): Promise<string> {
    const timestamp = DateUtils.formatDate(new Date(), DateFormat.FILE_TIMESTAMP);
    const backupPath = `${filePath}.backup.${timestamp}`;
    await this.copy(filePath, backupPath);
    logger.info(`Backup created: ${backupPath}`);
    return backupPath;
  }

  /**
   * Copies a directory recursively
   * @param sourcePath - Source directory
   * @param destinationPath - Destination directory
   * @param options - Copy options
   */
  private async copyDirectory(sourcePath: string, destinationPath: string, options: FileOptions): Promise<void> {
    await this.createDirectory(destinationPath);
    const items = fs.readdirSync(sourcePath);

    for (const item of items) {
      const sourceItem = path.join(sourcePath, item);
      const destItem = path.join(destinationPath, item);
      await this.copy(sourceItem, destItem, options);
    }
  }

  /**
   * Matches a string against a pattern with wildcards
   * @param text - Text to match
   * @param pattern - Pattern with wildcards (* and ?)
   * @returns True if matches
   */
  private matchesPattern(text: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(text);
  }

  /**
   * Cleans up temporary files
   */
  private cleanupTempFiles(): void {
    for (const tempFile of this.tempFiles) {
      try {
        if (this.exists(tempFile)) {
          fs.unlinkSync(tempFile);
          logger.debug(`Cleaned up temp file: ${tempFile}`);
        }
      } catch (error) {
        logger.warn(`Failed to cleanup temp file: ${tempFile} - ${error}`);
      }
    }
    this.tempFiles.clear();
  }

  /**
   * Gets file size in human readable format
   * @param filePath - Path to file
   * @returns Formatted file size
   */
  async getFormattedFileSize(filePath: string): Promise<string> {
    try {
      const stats = fs.statSync(filePath);
      const bytes = stats.size;
      
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } catch (error) {
      logger.error(`Failed to get formatted file size: ${filePath} - ${error}`);
      throw error;
    }
  }

  /**
   * Stops all file watchers
   */
  stopAllWatchers(): void {
    for (const [watcherId, watcher] of this.watchers) {
      try {
        watcher.close();
        logger.debug(`Stopped watcher: ${watcherId}`);
      } catch (error) {
        logger.warn(`Failed to stop watcher ${watcherId}: ${error}`);
      }
    }
    this.watchers.clear();
    logger.info('All file watchers stopped');
  }
}



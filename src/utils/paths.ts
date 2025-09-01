import * as path from 'path';
import * as fs from 'fs';

export class PathUtils {
  static getProjectRoot(): string {
    return path.resolve(__dirname, '../..');
  }

  static getConfigPath(): string {
    return path.join(this.getProjectRoot(), 'config');
  }

  static getSecretsPath(): string {
    return path.join(this.getProjectRoot(), 'secrets');
  }

  static getFeaturesPath(): string {
    return path.join(this.getProjectRoot(), 'features');
  }

  static getTestResultsPath(): string {
    return path.join(this.getProjectRoot(), 'test-results');
  }

  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

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
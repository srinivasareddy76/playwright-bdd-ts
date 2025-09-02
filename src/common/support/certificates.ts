import { PathUtils } from '../../utils/paths';
import { logger } from '../../utils/logger';
import type { Config } from '../../../config/schema';

export interface ClientCertificateConfig {
  pfxPath: string;
  passphrase: string;
  origin: string;
}

export class CertificateManager {
  private static instance: CertificateManager;
  private config: Config['certs']['client'];

  private constructor(config: Config['certs']['client']) {
    this.config = config;
  }

  static getInstance(config: Config['certs']['client']): CertificateManager {
    if (!CertificateManager.instance) {
      CertificateManager.instance = new CertificateManager(config);
    }
    return CertificateManager.instance;
  }

  getClientCertificateConfig(): ClientCertificateConfig {
    const resolvedPfxPath = PathUtils.resolvePfxPath(this.config.pfxPath);
    
    try {
      PathUtils.validatePfxFile(this.config.pfxPath);
      logger.info(`Using client certificate: ${resolvedPfxPath}`);
      
      return {
        pfxPath: resolvedPfxPath,
        passphrase: this.config.passphrase,
        origin: this.config.origin,
      };
    } catch (error) {
      logger.error(`Certificate validation failed: ${error}`);
      throw new Error(
        `Failed to load client certificate: ${error}\n\n` +
        'Setup instructions:\n' +
        '1. Place your client certificate (.pfx file) in the secrets/ directory\n' +
        '2. Set PFX_PASSPHRASE in your .env file\n' +
        '3. Ensure the certificate is valid and not expired\n' +
        '4. Verify the origin matches your API endpoint\n\n' +
        'Example .env configuration:\n' +
        'PFX_PASSPHRASE=your_certificate_passphrase\n' +
        'PFX_PATH=secrets/client.pfx'
      );
    }
  }

  validateCertificateForOrigin(targetOrigin: string): void {
    if (this.config.origin !== targetOrigin) {
      logger.warn(
        `Certificate origin mismatch: configured for ${this.config.origin}, ` +
        `but targeting ${targetOrigin}. This may cause authentication failures.`
      );
    }
  }

  isCertificateConfigured(): boolean {
    try {
      this.getClientCertificateConfig();
      return true;
    } catch {
      return false;
    }
  }
}
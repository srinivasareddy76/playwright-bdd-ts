import { APIRequestContext, APIResponse, request, BrowserContext } from '@playwright/test';
import { CertificateManager } from '../support/certificates';
import { logger } from '../utils/logger';
import type { Config } from '../../config/schema';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  raw: APIResponse;
}

export class BaseApiClient {
  private context: APIRequestContext | null = null;
  private config: Config;
  private certificateManager: CertificateManager;
  private defaultHeaders: Record<string, string>;

  constructor(config: Config) {
    this.config = config;
    this.certificateManager = CertificateManager.getInstance(config.certs.client);
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Playwright-BDD-Framework/1.0',
    };
  }

  async initialize(): Promise<void> {
    if (this.context) {
      return; // Already initialized
    }

    logger.info('Initializing API client with mTLS support');

    try {
      const certConfig = this.certificateManager.getClientCertificateConfig();
      this.certificateManager.validateCertificateForOrigin(this.config.app.baseUrl);

      this.context = await request.newContext({
        baseURL: this.config.app.baseUrl,
        clientCertificates: [
          {
            pfxPath: certConfig.pfxPath,
            passphrase: certConfig.passphrase,
            origin: certConfig.origin,
          },
        ],
        extraHTTPHeaders: this.defaultHeaders,
        timeout: 30000,
        ignoreHTTPSErrors: false, // Set to true only for testing with self-signed certs
      });

      logger.info(`API client initialized with base URL: ${this.config.app.baseUrl}`);
    } catch (error) {
      logger.error(`Failed to initialize API client: ${error}`);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
      logger.info('API client disposed');
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.context) {
      await this.initialize();
    }
  }

  private mergeHeaders(options?: ApiRequestOptions): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...options?.headers,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = endpoint;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  private async processResponse(response: APIResponse): Promise<ApiResponse> {
    const headers: Record<string, string> = {};
    // Convert headers to the expected format
    const headerEntries = Object.entries(response.headers());
    headerEntries.forEach(([key, value]) => {
      headers[key] = value;
    });

    let body: any;
    const contentType = headers['content-type'] || '';
    
    try {
      if (contentType.includes('application/json')) {
        body = await response.json();
      } else if (contentType.includes('text/')) {
        body = await response.text();
      } else {
        body = await response.body();
      }
    } catch (error) {
      logger.warn(`Failed to parse response body: ${error}`);
      body = await response.text();
    }

    const apiResponse: ApiResponse = {
      status: response.status(),
      statusText: response.statusText(),
      headers,
      body,
      raw: response,
    };

    logger.debug(`API Response: ${response.status()} ${response.statusText()}`);
    return apiResponse;
  }

  // HTTP Methods
  async get(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse> {
    await this.ensureInitialized();
    
    const url = this.buildUrl(endpoint, options?.params);
    const headers = this.mergeHeaders(options);

    logger.info(`GET ${url}`);
    
    const response = await this.context!.get(url, {
      headers,
      ...(options?.timeout && { timeout: options.timeout }),
    });

    return this.processResponse(response);
  }

  async post(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse> {
    await this.ensureInitialized();
    
    const url = this.buildUrl(endpoint, options?.params);
    const headers = this.mergeHeaders(options);

    logger.info(`POST ${url}`);
    
    const response = await this.context!.post(url, {
      headers,
      data: JSON.stringify(data),
      ...(options?.timeout && { timeout: options.timeout }),
    });

    return this.processResponse(response);
  }

  async put(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse> {
    await this.ensureInitialized();
    
    const url = this.buildUrl(endpoint, options?.params);
    const headers = this.mergeHeaders(options);

    logger.info(`PUT ${url}`);
    
    const response = await this.context!.put(url, {
      headers,
      data: JSON.stringify(data),
      ...(options?.timeout && { timeout: options.timeout }),
    });

    return this.processResponse(response);
  }

  async patch(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse> {
    await this.ensureInitialized();
    
    const url = this.buildUrl(endpoint, options?.params);
    const headers = this.mergeHeaders(options);

    logger.info(`PATCH ${url}`);
    
    const response = await this.context!.patch(url, {
      headers,
      data: JSON.stringify(data),
      ...(options?.timeout && { timeout: options.timeout }),
    });

    return this.processResponse(response);
  }

  async delete(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse> {
    await this.ensureInitialized();
    
    const url = this.buildUrl(endpoint, options?.params);
    const headers = this.mergeHeaders(options);

    logger.info(`DELETE ${url}`);
    
    const response = await this.context!.delete(url, {
      headers,
      ...(options?.timeout && { timeout: options.timeout }),
    });

    return this.processResponse(response);
  }

  // Utility methods
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  // Browser context with client certificates (for UI tests that need mTLS)
  static async createBrowserContextWithCerts(
    browserContext: BrowserContext,
    config: Config
  ): Promise<BrowserContext> {
    const certificateManager = CertificateManager.getInstance(config.certs.client);
    
    try {
      const certConfig = certificateManager.getClientCertificateConfig();
      
      // Note: This creates a new context with client certificates
      // The original context should be closed after creating this one
      const contextWithCerts = await browserContext.browser()!.newContext({
        ...browserContext,
        clientCertificates: [
          {
            pfxPath: certConfig.pfxPath,
            passphrase: certConfig.passphrase,
            origin: certConfig.origin,
          },
        ],
      });

      logger.info('Browser context created with client certificates');
      return contextWithCerts;
    } catch (error) {
      logger.error(`Failed to create browser context with certificates: ${error}`);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', { timeout: 5000 });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      logger.warn(`Health check failed: ${error}`);
      return false;
    }
  }
}
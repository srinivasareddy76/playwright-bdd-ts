import { BaseApiClient } from './BaseApiClient';
import { loadConfig } from '../../config';
import { logger } from '../utils/logger';
import type { Config } from '../../config/schema';

export class ApiClientFactory {
  private static clients: Map<string, BaseApiClient> = new Map();
  private static defaultConfig: Config | null = null;

  static async createClient(config?: Config): Promise<BaseApiClient> {
    const clientConfig = config || this.getDefaultConfig();
    const clientKey = this.generateClientKey(clientConfig);

    // Return existing client if available
    if (this.clients.has(clientKey)) {
      const existingClient = this.clients.get(clientKey)!;
      logger.debug(`Reusing existing API client for ${clientConfig.app.baseUrl}`);
      return existingClient;
    }

    // Create new client
    const client = new BaseApiClient(clientConfig);
    await client.initialize();
    
    this.clients.set(clientKey, client);
    logger.info(`Created new API client for ${clientConfig.app.baseUrl}`);
    
    return client;
  }

  static async createClientForEnvironment(): Promise<BaseApiClient> {
    // This would require loading a specific environment config
    // For now, we'll use the current environment
    logger.warn(`Environment-specific client creation not implemented. Using current environment.`);
    return this.createClient();
  }

  static getDefaultConfig(): Config {
    if (!this.defaultConfig) {
      this.defaultConfig = loadConfig();
    }
    return this.defaultConfig;
  }

  static setDefaultConfig(config: Config): void {
    this.defaultConfig = config;
  }

  private static generateClientKey(config: Config): string {
    // Generate a unique key based on config properties
    return `${config.app.baseUrl}-${config.certs.client.origin}-${config.name}`;
  }

  static async disposeClient(config: Config): Promise<void> {
    const clientKey = this.generateClientKey(config);
    const client = this.clients.get(clientKey);
    
    if (client) {
      await client.dispose();
      this.clients.delete(clientKey);
      logger.info(`Disposed API client for ${config.app.baseUrl}`);
    }
  }

  static async disposeAllClients(): Promise<void> {
    logger.info('Disposing all API clients');
    
    const disposePromises = Array.from(this.clients.values()).map(client => client.dispose());
    await Promise.all(disposePromises);
    
    this.clients.clear();
    logger.info('All API clients disposed');
  }

  static getActiveClientCount(): number {
    return this.clients.size;
  }

  static getActiveClients(): BaseApiClient[] {
    return Array.from(this.clients.values());
  }

  // Utility method to create a client with custom headers
  static async createClientWithHeaders(
    headers: Record<string, string>,
    config?: Config
  ): Promise<BaseApiClient> {
    const client = await this.createClient(config);
    
    // Set custom headers
    Object.entries(headers).forEach(([key, value]) => {
      client.setDefaultHeader(key, value);
    });
    
    return client;
  }

  // Utility method to create a client with authentication
  static async createAuthenticatedClient(
    authToken: string,
    authType: 'Bearer' | 'Basic' | 'ApiKey' = 'Bearer',
    config?: Config
  ): Promise<BaseApiClient> {
    const authHeaders: Record<string, string> = {};
    
    switch (authType) {
      case 'Bearer':
        authHeaders['Authorization'] = `Bearer ${authToken}`;
        break;
      case 'Basic':
        authHeaders['Authorization'] = `Basic ${authToken}`;
        break;
      case 'ApiKey':
        authHeaders['X-API-Key'] = authToken;
        break;
    }
    
    return this.createClientWithHeaders(authHeaders, config);
  }

  // Health check for all active clients
  static async healthCheckAllClients(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    for (const [key, client] of this.clients.entries()) {
      try {
        const isHealthy = await client.healthCheck();
        results.set(key, isHealthy);
      } catch (error) {
        logger.error(`Health check failed for client ${key}: ${error}`);
        results.set(key, false);
      }
    }
    
    return results;
  }
}
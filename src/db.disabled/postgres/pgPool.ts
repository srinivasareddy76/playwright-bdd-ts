import { Pool, PoolClient, QueryResult } from 'pg';
import { logger } from '../../utils/logger';
import {
  ConnectionPool,
  DatabaseResult,
  QueryOptions,
  PoolStatus,
  PostgresConnectionConfig,
  PostgresResult,
  ConnectionError,
  QueryError,
  TimeoutError,
  QueryParams,
} from '../types';

export class PostgresConnectionPool implements ConnectionPool {
  private pool: Pool | null = null;
  private config: PostgresConnectionConfig;
  private isInitialized = false;

  constructor(config: PostgresConnectionConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      logger.info('Creating PostgreSQL connection pool');

      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        max: this.config.max,
        idleTimeoutMillis: this.config.idleTimeoutMillis,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis,
        ssl: this.config.ssl,
        // Additional pool settings
        allowExitOnIdle: false,
        maxUses: 7500, // Maximum number of times a connection can be reused
        application_name: 'playwright-bdd-framework',
      });

      // Set up pool event handlers
      this.pool.on('connect', (client) => {
        logger.debug('New PostgreSQL client connected');
        // Set default timezone and other session settings
        client.query('SET timezone = UTC');
      });

      this.pool.on('error', (err) => {
        logger.error(`PostgreSQL pool error: ${err}`);
      });

      this.pool.on('remove', () => {
        logger.debug('PostgreSQL client removed from pool');
      });

      // Test the connection
      await this.healthCheck();

      this.isInitialized = true;
      logger.info(`PostgreSQL connection pool created successfully with ${this.config.max} max connections`);
    } catch (error) {
      logger.error(`Failed to create PostgreSQL connection pool: ${error}`);
      throw new ConnectionError(`Failed to create PostgreSQL connection pool: ${error}`, error as Error);
    }
  }

  async getConnection(): Promise<PoolClient> {
    await this.ensureInitialized();
    
    try {
      const client = await this.pool!.connect();
      logger.debug('PostgreSQL connection acquired from pool');
      return client;
    } catch (error) {
      logger.error(`Failed to get PostgreSQL connection: ${error}`);
      throw new ConnectionError(`Failed to get PostgreSQL connection: ${error}`, error as Error);
    }
  }

  async query(text: string, params: QueryParams = [], options: QueryOptions = {}): Promise<DatabaseResult> {
    await this.ensureInitialized();
    
    const startTime = Date.now();
    let client: PoolClient | null = null;

    try {
      client = await this.getConnection();
      
      logger.debug(`Executing PostgreSQL query: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      
      // Handle timeout
      let queryPromise: Promise<QueryResult>;
      if (options.timeout) {
        queryPromise = Promise.race([
          client.query(text, this.normalizeParams(params)),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new TimeoutError(`Query timeout after ${options.timeout}ms`, options.timeout!)), options.timeout)
          )
        ]);
      } else {
        queryPromise = client.query(text, this.normalizeParams(params));
      }

      const result = await queryPromise;
      
      const executionTime = Date.now() - startTime;
      logger.debug(`PostgreSQL query executed in ${executionTime}ms, returned ${result.rows.length} rows`);

      return this.normalizeResult(result);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      logger.error(`PostgreSQL query failed after ${executionTime}ms: ${error}`);
      
      if (error instanceof TimeoutError) {
        throw error;
      }
      
      throw new QueryError(`PostgreSQL query failed: ${error}`, text, params as any[], error as Error);
    } finally {
      if (client) {
        try {
          client.release();
          logger.debug('PostgreSQL connection returned to pool');
        } catch (releaseError) {
          logger.warn(`Failed to release PostgreSQL connection: ${releaseError}`);
        }
      }
    }
  }

  private normalizeParams(params: QueryParams): any[] {
    if (Array.isArray(params)) {
      return params;
    } else if (typeof params === 'object' && params !== null) {
      // PostgreSQL uses positional parameters, so we need to convert object to array
      // This is a simplified approach - in practice, you might want to use named parameters
      return Object.values(params);
    }
    return [];
  }

  private normalizeResult(result: QueryResult): PostgresResult {
    return {
      rows: result.rows,
      rowCount: result.rowCount || result.rows.length,
      fields: result.fields,
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      try {
        logger.info('Closing PostgreSQL connection pool');
        await this.pool.end();
        this.pool = null;
        this.isInitialized = false;
        logger.info('PostgreSQL connection pool closed successfully');
      } catch (error) {
        logger.error(`Failed to close PostgreSQL connection pool: ${error}`);
        throw new ConnectionError(`Failed to close PostgreSQL connection pool: ${error}`, error as Error);
      }
    }
  }

  getPoolStatus(): PoolStatus {
    if (!this.pool) {
      return {
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        pendingRequests: 0,
      };
    }

    return {
      totalConnections: this.pool.totalCount,
      activeConnections: this.pool.totalCount - this.pool.idleCount,
      idleConnections: this.pool.idleCount,
      pendingRequests: this.pool.waitingCount,
    };
  }

  isConnected(): boolean {
    return this.isInitialized && this.pool !== null && !this.pool.ended;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // Transaction support
  async beginTransaction(): Promise<PostgresTransaction> {
    const client = await this.getConnection();
    await client.query('BEGIN');
    return new PostgresTransaction(client);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health_check', [], { timeout: 5000 });
      return result.rows.length === 1 && result.rows[0].health_check === 1;
    } catch (error) {
      logger.warn(`PostgreSQL health check failed: ${error}`);
      return false;
    }
  }

  // Utility methods
  async getVersion(): Promise<string> {
    try {
      const result = await this.query('SELECT version() as version');
      return result.rows[0]?.version || 'Unknown';
    } catch (error) {
      logger.warn(`Failed to get PostgreSQL version: ${error}`);
      return 'Unknown';
    }
  }

  async getCurrentDatabase(): Promise<string> {
    try {
      const result = await this.query('SELECT current_database() as database');
      return result.rows[0]?.database || 'Unknown';
    } catch (error) {
      logger.warn(`Failed to get current database: ${error}`);
      return 'Unknown';
    }
  }

  async getCurrentUser(): Promise<string> {
    try {
      const result = await this.query('SELECT current_user as user');
      return result.rows[0]?.user || 'Unknown';
    } catch (error) {
      logger.warn(`Failed to get current user: ${error}`);
      return 'Unknown';
    }
  }
}

class PostgresTransaction {
  private isCompleted = false;

  constructor(private client: PoolClient) {}

  async query(text: string, params: QueryParams = [], options: QueryOptions = {}): Promise<DatabaseResult> {
    if (this.isCompleted) {
      throw new QueryError('Transaction has already been completed (committed or rolled back)');
    }

    try {
      const result = await this.client.query(text, Array.isArray(params) ? params : Object.values(params));
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || result.rows.length,
        fields: result.fields,
      };
    } catch (error) {
      throw new QueryError(`PostgreSQL transaction query failed: ${error}`, text, params as any[], error as Error);
    }
  }

  async commit(): Promise<void> {
    if (this.isCompleted) {
      throw new QueryError('Transaction has already been completed');
    }

    try {
      await this.client.query('COMMIT');
      this.isCompleted = true;
      logger.debug('PostgreSQL transaction committed');
    } catch (error) {
      throw new QueryError(`PostgreSQL transaction commit failed: ${error}`, undefined, undefined, error as Error);
    } finally {
      this.release();
    }
  }

  async rollback(): Promise<void> {
    if (this.isCompleted) {
      throw new QueryError('Transaction has already been completed');
    }

    try {
      await this.client.query('ROLLBACK');
      this.isCompleted = true;
      logger.debug('PostgreSQL transaction rolled back');
    } catch (error) {
      throw new QueryError(`PostgreSQL transaction rollback failed: ${error}`, undefined, undefined, error as Error);
    } finally {
      this.release();
    }
  }

  private release(): void {
    try {
      this.client.release();
    } catch (error) {
      logger.warn(`Failed to release PostgreSQL transaction client: ${error}`);
    }
  }
}
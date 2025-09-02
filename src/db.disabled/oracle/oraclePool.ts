import oracledb from 'oracledb';
import { logger } from '../../utils/logger';
import {
  ConnectionPool,
  DatabaseResult,
  QueryOptions,
  PoolStatus,
  OracleConnectionConfig,
  OracleResult,
  ConnectionError,
  QueryError,
  TimeoutError,
  QueryParams,
} from '../types';

export class OracleConnectionPool implements ConnectionPool {
  private pool: oracledb.Pool | null = null;
  private config: OracleConnectionConfig;
  private isInitialized = false;

  constructor(config: OracleConnectionConfig) {
    this.config = config;
    this.initializeOracleDB();
  }

  private initializeOracleDB(): void {
    // Set Oracle client mode
    if (process.env.USE_OCI === '1') {
      try {
        oracledb.initOracleClient();
        logger.info('Oracle client initialized in Thick mode (OCI)');
      } catch (error) {
        logger.warn(`Failed to initialize Oracle Thick mode, falling back to Thin mode: ${error}`);
      }
    } else {
      logger.info('Using Oracle Thin mode (default)');
    }

    // Configure Oracle defaults
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.autoCommit = false; // Explicit transaction control
    oracledb.fetchAsString = [oracledb.CLOB, oracledb.NCLOB];
    oracledb.fetchAsBuffer = [oracledb.BLOB];
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      logger.info('Creating Oracle connection pool');

      const connectString = this.config.connectString || 
        `${this.config.host}:${this.config.port}/${this.config.serviceName}`;

      this.pool = await oracledb.createPool({
        user: this.config.user,
        password: this.config.password,
        connectString,
        poolMin: this.config.poolMin,
        poolMax: this.config.poolMax,
        poolIncrement: this.config.poolIncrement,
        poolTimeout: this.config.poolTimeout,
        enableStatistics: this.config.enableStatistics,
        // Additional pool settings
        poolPingInterval: 60, // seconds
        poolMaxPerShard: 0, // unlimited
        stmtCacheSize: 30,
      });

      this.isInitialized = true;
      logger.info(`Oracle connection pool created successfully with ${this.config.poolMax} max connections`);
    } catch (error) {
      logger.error(`Failed to create Oracle connection pool: ${error}`);
      throw new ConnectionError(`Failed to create Oracle connection pool: ${error}`, error as Error);
    }
  }

  async getConnection(): Promise<oracledb.Connection> {
    await this.ensureInitialized();
    
    try {
      const connection = await this.pool!.getConnection();
      logger.debug('Oracle connection acquired from pool');
      return connection;
    } catch (error) {
      logger.error(`Failed to get Oracle connection: ${error}`);
      throw new ConnectionError(`Failed to get Oracle connection: ${error}`, error as Error);
    }
  }

  async query(sql: string, params: QueryParams = [], options: QueryOptions = {}): Promise<DatabaseResult> {
    await this.ensureInitialized();
    
    const startTime = Date.now();
    let connection: oracledb.Connection | null = null;

    try {
      connection = await this.getConnection();
      
      logger.debug(`Executing Oracle query: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
      
      const executeOptions: oracledb.ExecuteOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        maxRows: options.maxRows || 1000,
        fetchArraySize: 100,
      };

      const result = await connection.execute(sql, this.normalizeParams(params), executeOptions);
      
      const executionTime = Date.now() - startTime;
      logger.debug(`Oracle query executed in ${executionTime}ms, returned ${result.rows?.length || 0} rows`);

      return this.normalizeResult(result);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      logger.error(`Oracle query failed after ${executionTime}ms: ${error}`);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new TimeoutError(`Query timeout after ${executionTime}ms`, executionTime);
      }
      
      throw new QueryError(`Oracle query failed: ${error}`, sql, params as any[], error as Error);
    } finally {
      if (connection) {
        try {
          await connection.close();
          logger.debug('Oracle connection returned to pool');
        } catch (closeError) {
          logger.warn(`Failed to close Oracle connection: ${closeError}`);
        }
      }
    }
  }

  private normalizeParams(params: QueryParams): any {
    if (Array.isArray(params)) {
      return params;
    } else if (typeof params === 'object' && params !== null) {
      // Convert object params to Oracle bind format
      const oracleParams: Record<string, any> = {};
      Object.entries(params).forEach(([key, value]) => {
        oracleParams[key] = value;
      });
      return oracleParams;
    }
    return [];
  }

  private normalizeResult(result: oracledb.Result<any>): OracleResult {
    return {
      rows: result.rows || [],
      rowCount: result.rowsAffected || result.rows?.length || 0,
      metaData: result.metaData || [],
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      try {
        logger.info('Closing Oracle connection pool');
        await this.pool.close(10); // 10 second drain time
        this.pool = null;
        this.isInitialized = false;
        logger.info('Oracle connection pool closed successfully');
      } catch (error) {
        logger.error(`Failed to close Oracle connection pool: ${error}`);
        throw new ConnectionError(`Failed to close Oracle connection pool: ${error}`, error as Error);
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
      totalConnections: this.pool.connectionsOpen,
      activeConnections: this.pool.connectionsInUse,
      idleConnections: this.pool.connectionsOpen - this.pool.connectionsInUse,
      pendingRequests: 0, // Oracle doesn't expose this directly
    };
  }

  isConnected(): boolean {
    return this.isInitialized && this.pool !== null;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // Transaction support
  async beginTransaction(): Promise<OracleTransaction> {
    const connection = await this.getConnection();
    return new OracleTransaction(connection);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 FROM DUAL', [], { timeout: 5000 });
      return result.rows.length === 1;
    } catch (error) {
      logger.warn(`Oracle health check failed: ${error}`);
      return false;
    }
  }
}

class OracleTransaction {
  constructor(private connection: oracledb.Connection) {}

  async query(sql: string, params: QueryParams = [], options: QueryOptions = {}): Promise<DatabaseResult> {
    try {
      const executeOptions: oracledb.ExecuteOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        maxRows: options.maxRows || 1000,
        autoCommit: false, // Important for transactions
      };

      const result = await this.connection.execute(sql, params as any, executeOptions);
      
      return {
        rows: result.rows || [],
        rowCount: result.rowsAffected || result.rows?.length || 0,
        metaData: result.metaData || [],
      };
    } catch (error) {
      throw new QueryError(`Oracle transaction query failed: ${error}`, sql, params as any[], error as Error);
    }
  }

  async commit(): Promise<void> {
    try {
      await this.connection.commit();
      logger.debug('Oracle transaction committed');
    } catch (error) {
      throw new QueryError(`Oracle transaction commit failed: ${error}`, undefined, undefined, error as Error);
    } finally {
      await this.close();
    }
  }

  async rollback(): Promise<void> {
    try {
      await this.connection.rollback();
      logger.debug('Oracle transaction rolled back');
    } catch (error) {
      throw new QueryError(`Oracle transaction rollback failed: ${error}`, undefined, undefined, error as Error);
    } finally {
      await this.close();
    }
  }

  private async close(): Promise<void> {
    try {
      await this.connection.close();
    } catch (error) {
      logger.warn(`Failed to close Oracle transaction connection: ${error}`);
    }
  }
}
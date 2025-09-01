import { loadConfig, isOnPremEnv } from '../../config';
import { OracleConnectionPool } from './oracle/oraclePool';
import { OracleSqlHelper } from './oracle/oracleSql';
import { PostgresConnectionPool } from './postgres/pgPool';
import { PostgresSqlHelper } from './postgres/pgSql';
import { logger } from '../utils/logger';
import { ConnectionPool, DatabaseType } from './types';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private oraclePool: OracleConnectionPool | null = null;
  private postgresPool: PostgresConnectionPool | null = null;
  private oracleSql: OracleSqlHelper | null = null;
  private postgresSql: PostgresSqlHelper | null = null;
  private config = loadConfig();

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Get the appropriate database pool based on environment
  async getPool(): Promise<ConnectionPool> {
    if (isOnPremEnv()) {
      return this.getOraclePool();
    } else {
      return this.getPostgresPool();
    }
  }

  // Get Oracle pool (for on-premise environments)
  async getOraclePool(): Promise<OracleConnectionPool> {
    if (!this.oraclePool) {
      logger.info('Initializing Oracle connection pool');
      this.oraclePool = new OracleConnectionPool(this.config.db.oracle);
      await this.oraclePool.initialize();
    }
    return this.oraclePool;
  }

  // Get PostgreSQL pool (for cloud environments)
  async getPostgresPool(): Promise<PostgresConnectionPool> {
    if (!this.postgresPool) {
      logger.info('Initializing PostgreSQL connection pool');
      this.postgresPool = new PostgresConnectionPool(this.config.db.postgres);
      await this.postgresPool.initialize();
    }
    return this.postgresPool;
  }

  // Get SQL helper for the current environment
  async getSqlHelper(): Promise<OracleSqlHelper | PostgresSqlHelper> {
    if (isOnPremEnv()) {
      return this.getOracleSqlHelper();
    } else {
      return this.getPostgresSqlHelper();
    }
  }

  // Get Oracle SQL helper
  async getOracleSqlHelper(): Promise<OracleSqlHelper> {
    if (!this.oracleSql) {
      const pool = await this.getOraclePool();
      this.oracleSql = new OracleSqlHelper(pool);
    }
    return this.oracleSql;
  }

  // Get PostgreSQL SQL helper
  async getPostgresSqlHelper(): Promise<PostgresSqlHelper> {
    if (!this.postgresSql) {
      const pool = await this.getPostgresPool();
      this.postgresSql = new PostgresSqlHelper(pool);
    }
    return this.postgresSql;
  }

  // Get database type for current environment
  getDatabaseType(): DatabaseType {
    return isOnPremEnv() ? DatabaseType.ORACLE : DatabaseType.POSTGRES;
  }

  // Execute query using the appropriate database
  async query(sql: string, params: any[] = [], options?: { timeout?: number; maxRows?: number }) {
    const pool = await this.getPool();
    return pool.query(sql, params, options);
  }

  // Health check for all active connections
  async healthCheck(): Promise<{ oracle: boolean; postgres: boolean }> {
    const results = { oracle: false, postgres: false };

    if (this.oraclePool) {
      try {
        results.oracle = await this.oraclePool.healthCheck();
      } catch (error) {
        logger.warn(`Oracle health check failed: ${error}`);
      }
    }

    if (this.postgresPool) {
      try {
        results.postgres = await this.postgresPool.healthCheck();
      } catch (error) {
        logger.warn(`PostgreSQL health check failed: ${error}`);
      }
    }

    return results;
  }

  // Get pool status for all active connections
  getPoolStatus(): { oracle?: any; postgres?: any } {
    const status: { oracle?: any; postgres?: any } = {};

    if (this.oraclePool) {
      status.oracle = this.oraclePool.getPoolStatus();
    }

    if (this.postgresPool) {
      status.postgres = this.postgresPool.getPoolStatus();
    }

    return status;
  }

  // Close all database connections
  async closeAll(): Promise<void> {
    logger.info('Closing all database connections');

    const closePromises: Promise<void>[] = [];

    if (this.oraclePool) {
      closePromises.push(this.oraclePool.close());
    }

    if (this.postgresPool) {
      closePromises.push(this.postgresPool.close());
    }

    await Promise.all(closePromises);

    // Reset instances
    this.oraclePool = null;
    this.postgresPool = null;
    this.oracleSql = null;
    this.postgresSql = null;

    logger.info('All database connections closed');
  }

  // Force close and recreate connections (useful for connection recovery)
  async reconnect(): Promise<void> {
    logger.info('Reconnecting database connections');
    await this.closeAll();
    
    // Reinitialize based on environment
    if (isOnPremEnv()) {
      await this.getOraclePool();
    } else {
      await this.getPostgresPool();
    }
    
    logger.info('Database connections reestablished');
  }
}

// Convenience functions for easy access
export async function getDatabase(): Promise<ConnectionPool> {
  return DatabaseManager.getInstance().getPool();
}

export async function getSqlHelper(): Promise<OracleSqlHelper | PostgresSqlHelper> {
  return DatabaseManager.getInstance().getSqlHelper();
}

export async function executeQuery(sql: string, params: any[] = [], options?: { timeout?: number; maxRows?: number }) {
  return DatabaseManager.getInstance().query(sql, params, options);
}

export function getDatabaseType(): DatabaseType {
  return DatabaseManager.getInstance().getDatabaseType();
}

export async function closeDatabaseConnections(): Promise<void> {
  return DatabaseManager.getInstance().closeAll();
}

// Export types and classes for direct use
export * from './types';
export { OracleConnectionPool } from './oracle/oraclePool';
export { OracleSqlHelper } from './oracle/oracleSql';
export { PostgresConnectionPool } from './postgres/pgPool';
export { PostgresSqlHelper } from './postgres/pgSql';
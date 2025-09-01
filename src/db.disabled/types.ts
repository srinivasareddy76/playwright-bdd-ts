// Database connection types and interfaces

export interface DatabaseResult {
  rows: any[];
  rowCount: number;
  fields?: any[];
  metaData?: any[];
}

export interface QueryOptions {
  timeout?: number;
  maxRows?: number;
}

export interface DatabaseConnection {
  query(sql: string, params?: any[], options?: QueryOptions): Promise<DatabaseResult>;
  close(): Promise<void>;
  isConnected(): boolean;
}

export interface ConnectionPool {
  getConnection(): Promise<DatabaseConnection>;
  query(sql: string, params?: any[], options?: QueryOptions): Promise<DatabaseResult>;
  close(): Promise<void>;
  getPoolStatus(): PoolStatus;
}

export interface PoolStatus {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  pendingRequests: number;
}

// Oracle-specific types
export interface OracleConnectionConfig {
  host: string;
  port: number;
  serviceName?: string;
  connectString?: string;
  user: string;
  password: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
  poolTimeout: number;
  enableStatistics: boolean;
}

export interface OracleResult extends DatabaseResult {
  metaData: Array<{
    name: string;
    fetchType: number;
    dbType: number;
    dbTypeName: string;
    nullable: boolean;
    precision?: number;
    scale?: number;
  }>;
}

// PostgreSQL-specific types
export interface PostgresConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  ssl?: {
    rejectUnauthorized: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };
}

export interface PostgresResult extends DatabaseResult {
  fields: Array<{
    name: string;
    tableID: number;
    columnID: number;
    dataTypeID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: string;
  }>;
}

// Common database error types
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public sqlState?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string, originalError?: Error) {
    super(message, 'CONNECTION_ERROR', undefined, originalError);
    this.name = 'ConnectionError';
  }
}

export class QueryError extends DatabaseError {
  constructor(
    message: string,
    public sql?: string,
    public params?: any[],
    originalError?: Error
  ) {
    super(message, 'QUERY_ERROR', undefined, originalError);
    this.name = 'QueryError';
  }
}

export class TimeoutError extends DatabaseError {
  constructor(message: string, public timeoutMs: number) {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

// Database type enumeration
export enum DatabaseType {
  ORACLE = 'oracle',
  POSTGRES = 'postgres',
}

// Query parameter types
export type QueryParam = string | number | boolean | Date | null | Buffer;
export type QueryParams = QueryParam[] | Record<string, QueryParam>;

// Transaction interface
export interface Transaction {
  query(sql: string, params?: QueryParams, options?: QueryOptions): Promise<DatabaseResult>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// Database factory interface
export interface DatabaseFactory {
  createPool(config: OracleConnectionConfig | PostgresConnectionConfig): Promise<ConnectionPool>;
  getDatabaseType(): DatabaseType;
}
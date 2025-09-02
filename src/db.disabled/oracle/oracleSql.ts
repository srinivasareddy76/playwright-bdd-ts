import { OracleConnectionPool } from './oraclePool';
import { logger } from '../../utils/logger';
import { DatabaseResult, QueryParams, QueryOptions } from '../types';

export class OracleSqlHelper {
  private pool: OracleConnectionPool;

  constructor(pool: OracleConnectionPool) {
    this.pool = pool;
  }

  // Common query patterns
  async selectOne<T = any>(sql: string, params: QueryParams = []): Promise<T | null> {
    const result = await this.pool.query(sql, params, { maxRows: 1 });
    return result.rows.length > 0 ? result.rows[0] as T : null;
  }

  async selectMany<T = any>(sql: string, params: QueryParams = [], options?: QueryOptions): Promise<T[]> {
    const result = await this.pool.query(sql, params, options);
    return result.rows as T[];
  }

  async insert(table: string, data: Record<string, any>): Promise<DatabaseResult> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `:${index + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    logger.debug(`Inserting into ${table}: ${JSON.stringify(data)}`);
    return await this.pool.query(sql, values);
  }

  async update(table: string, data: Record<string, any>, whereClause: string, whereParams: QueryParams = []): Promise<DatabaseResult> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = :${index + 1}`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const allParams = [...values, ...whereParams];
    
    logger.debug(`Updating ${table}: ${JSON.stringify(data)} WHERE ${whereClause}`);
    return await this.pool.query(sql, allParams);
  }

  async delete(table: string, whereClause: string, whereParams: QueryParams = []): Promise<DatabaseResult> {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    logger.debug(`Deleting from ${table} WHERE ${whereClause}`);
    return await this.pool.query(sql, whereParams);
  }

  // Oracle-specific helpers
  async getSequenceNextValue(sequenceName: string): Promise<number> {
    const result = await this.selectOne<{ NEXTVAL: number }>(`SELECT ${sequenceName}.NEXTVAL FROM DUAL`);
    return result?.NEXTVAL || 0;
  }

  async getSequenceCurrentValue(sequenceName: string): Promise<number> {
    const result = await this.selectOne<{ CURRVAL: number }>(`SELECT ${sequenceName}.CURRVAL FROM DUAL`);
    return result?.CURRVAL || 0;
  }

  async tableExists(tableName: string, schemaName?: string): Promise<boolean> {
    const sql = schemaName 
      ? `SELECT COUNT(*) as COUNT FROM ALL_TABLES WHERE TABLE_NAME = :1 AND OWNER = :2`
      : `SELECT COUNT(*) as COUNT FROM USER_TABLES WHERE TABLE_NAME = :1`;
    
    const params = schemaName ? [tableName.toUpperCase(), schemaName.toUpperCase()] : [tableName.toUpperCase()];
    const result = await this.selectOne<{ COUNT: number }>(sql, params);
    
    return (result?.COUNT || 0) > 0;
  }

  async getTableColumns(tableName: string, schemaName?: string): Promise<Array<{
    columnName: string;
    dataType: string;
    nullable: boolean;
    defaultValue?: string;
  }>> {
    const sql = schemaName
      ? `SELECT COLUMN_NAME, DATA_TYPE, NULLABLE, DATA_DEFAULT 
         FROM ALL_TAB_COLUMNS 
         WHERE TABLE_NAME = :1 AND OWNER = :2 
         ORDER BY COLUMN_ID`
      : `SELECT COLUMN_NAME, DATA_TYPE, NULLABLE, DATA_DEFAULT 
         FROM USER_TAB_COLUMNS 
         WHERE TABLE_NAME = :1 
         ORDER BY COLUMN_ID`;
    
    const params = schemaName ? [tableName.toUpperCase(), schemaName.toUpperCase()] : [tableName.toUpperCase()];
    const result = await this.selectMany<{
      COLUMN_NAME: string;
      DATA_TYPE: string;
      NULLABLE: string;
      DATA_DEFAULT?: string;
    }>(sql, params);
    
    return result.map(row => ({
      columnName: row.COLUMN_NAME,
      dataType: row.DATA_TYPE,
      nullable: row.NULLABLE === 'Y',
      defaultValue: row.DATA_DEFAULT,
    }));
  }

  // Utility methods for common Oracle operations
  async executeProcedure(procedureName: string, params: Record<string, any> = {}): Promise<DatabaseResult> {
    const paramNames = Object.keys(params);
    const paramPlaceholders = paramNames.map(name => `${name} => :${name}`).join(', ');
    
    const sql = `BEGIN ${procedureName}(${paramPlaceholders}); END;`;
    
    logger.debug(`Executing procedure ${procedureName} with params: ${JSON.stringify(params)}`);
    return await this.pool.query(sql, params);
  }

  async executeFunction<T = any>(functionName: string, params: Record<string, any> = {}): Promise<T> {
    const paramNames = Object.keys(params);
    const paramPlaceholders = paramNames.map(name => `${name} => :${name}`).join(', ');
    
    const sql = `SELECT ${functionName}(${paramPlaceholders}) as RESULT FROM DUAL`;
    
    logger.debug(`Executing function ${functionName} with params: ${JSON.stringify(params)}`);
    const result = await this.selectOne<{ RESULT: T }>(sql, params);
    
    return result?.RESULT as T;
  }

  // Date/Time helpers for Oracle
  async getCurrentTimestamp(): Promise<Date> {
    const result = await this.selectOne<{ CURRENT_TIMESTAMP: Date }>('SELECT CURRENT_TIMESTAMP FROM DUAL');
    return result?.CURRENT_TIMESTAMP || new Date();
  }

  async getSysdate(): Promise<Date> {
    const result = await this.selectOne<{ SYSDATE: Date }>('SELECT SYSDATE FROM DUAL');
    return result?.SYSDATE || new Date();
  }

  // Bulk operations
  async bulkInsert(table: string, records: Record<string, any>[]): Promise<DatabaseResult> {
    if (records.length === 0) {
      return { rows: [], rowCount: 0 };
    }

    const columns = Object.keys(records[0]);
    const placeholders = columns.map((_, index) => `:${index + 1}`).join(', ');
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    // For bulk operations, we'd typically use executeMany, but for simplicity using individual inserts
    let totalRowsAffected = 0;
    
    for (const record of records) {
      const values = columns.map(col => record[col]);
      const result = await this.pool.query(sql, values);
      totalRowsAffected += result.rowCount;
    }
    
    logger.debug(`Bulk inserted ${totalRowsAffected} rows into ${table}`);
    return { rows: [], rowCount: totalRowsAffected };
  }

  // Query building helpers
  buildWhereClause(conditions: Record<string, any>): { whereClause: string; params: any[] } {
    const keys = Object.keys(conditions);
    if (keys.length === 0) {
      return { whereClause: '1=1', params: [] };
    }

    const clauses = keys.map((key, index) => `${key} = :${index + 1}`);
    const whereClause = clauses.join(' AND ');
    const params = Object.values(conditions);

    return { whereClause, params };
  }

  buildOrderByClause(orderBy: Record<string, 'ASC' | 'DESC'>): string {
    const keys = Object.keys(orderBy);
    if (keys.length === 0) {
      return '';
    }

    const clauses = keys.map(key => `${key} ${orderBy[key]}`);
    return `ORDER BY ${clauses.join(', ')}`;
  }

  // Pagination helper
  async selectWithPagination<T = any>(
    sql: string,
    params: QueryParams = [],
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ data: T[]; totalCount: number; page: number; pageSize: number }> {
    // Get total count
    const countSql = `SELECT COUNT(*) as TOTAL_COUNT FROM (${sql})`;
    const countResult = await this.selectOne<{ TOTAL_COUNT: number }>(countSql, params);
    const totalCount = countResult?.TOTAL_COUNT || 0;

    // Get paginated data
    const offset = (page - 1) * pageSize;
    const paginatedSql = `
      SELECT * FROM (
        SELECT ROWNUM as RN, t.* FROM (${sql}) t
        WHERE ROWNUM <= :max_row
      ) WHERE RN > :min_row
    `;
    
    const paginatedParams = [...(Array.isArray(params) ? params : []), offset + pageSize, offset];
    const data = await this.selectMany<T>(paginatedSql, paginatedParams);

    return {
      data,
      totalCount,
      page,
      pageSize,
    };
  }
}
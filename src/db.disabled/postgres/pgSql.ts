import { PostgresConnectionPool } from './pgPool';
import { logger } from '../../utils/logger';
import { DatabaseResult, QueryParams, QueryOptions } from '../types';

export class PostgresSqlHelper {
  private pool: PostgresConnectionPool;

  constructor(pool: PostgresConnectionPool) {
    this.pool = pool;
  }

  // Common query patterns
  async selectOne<T = any>(sql: string, params: QueryParams = []): Promise<T | null> {
    const result = await this.pool.query(`${sql} LIMIT 1`, params);
    return result.rows.length > 0 ? result.rows[0] as T : null;
  }

  async selectMany<T = any>(sql: string, params: QueryParams = [], options?: QueryOptions): Promise<T[]> {
    const result = await this.pool.query(sql, params, options);
    return result.rows as T[];
  }

  async insert(table: string, data: Record<string, any>): Promise<DatabaseResult> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    logger.debug(`Inserting into ${table}: ${JSON.stringify(data)}`);
    return await this.pool.query(sql, values);
  }

  async insertMany(table: string, records: Record<string, any>[]): Promise<DatabaseResult> {
    if (records.length === 0) {
      return { rows: [], rowCount: 0 };
    }

    const columns = Object.keys(records[0]);
    const valueRows = records.map((record, recordIndex) => {
      const recordValues = columns.map((col, colIndex) => `$${recordIndex * columns.length + colIndex + 1}`);
      return `(${recordValues.join(', ')})`;
    });
    
    const allValues = records.flatMap(record => columns.map(col => record[col]));
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${valueRows.join(', ')} RETURNING *`;
    
    logger.debug(`Bulk inserting ${records.length} records into ${table}`);
    return await this.pool.query(sql, allValues);
  }

  async update(table: string, data: Record<string, any>, whereClause: string, whereParams: QueryParams = []): Promise<DatabaseResult> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    
    // Adjust parameter numbers for WHERE clause
    const adjustedWhereClause = this.adjustParameterNumbers(whereClause, columns.length);
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${adjustedWhereClause} RETURNING *`;
    const allParams = [...values, ...(Array.isArray(whereParams) ? whereParams : Object.values(whereParams))];
    
    logger.debug(`Updating ${table}: ${JSON.stringify(data)} WHERE ${whereClause}`);
    return await this.pool.query(sql, allParams);
  }

  async delete(table: string, whereClause: string, whereParams: QueryParams = []): Promise<DatabaseResult> {
    const sql = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
    
    logger.debug(`Deleting from ${table} WHERE ${whereClause}`);
    return await this.pool.query(sql, whereParams);
  }

  async upsert(table: string, data: Record<string, any>, conflictColumns: string[]): Promise<DatabaseResult> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    
    const updateColumns = columns.filter(col => !conflictColumns.includes(col));
    const updateClause = updateColumns.map(col => `${col} = EXCLUDED.${col}`).join(', ');
    
    const sql = `
      INSERT INTO ${table} (${columns.join(', ')}) 
      VALUES (${placeholders})
      ON CONFLICT (${conflictColumns.join(', ')}) 
      DO UPDATE SET ${updateClause}
      RETURNING *
    `;
    
    logger.debug(`Upserting into ${table}: ${JSON.stringify(data)}`);
    return await this.pool.query(sql, values);
  }

  // PostgreSQL-specific helpers
  async getNextSequenceValue(sequenceName: string): Promise<number> {
    const result = await this.selectOne<{ nextval: number }>(`SELECT nextval('${sequenceName}') as nextval`);
    return result?.nextval || 0;
  }

  async getCurrentSequenceValue(sequenceName: string): Promise<number> {
    const result = await this.selectOne<{ currval: number }>(`SELECT currval('${sequenceName}') as currval`);
    return result?.currval || 0;
  }

  async setSequenceValue(sequenceName: string, value: number): Promise<void> {
    await this.pool.query(`SELECT setval('${sequenceName}', $1)`, [value]);
  }

  async tableExists(tableName: string, schemaName: string = 'public'): Promise<boolean> {
    const sql = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1 AND table_name = $2
      ) as exists
    `;
    
    const result = await this.selectOne<{ exists: boolean }>(sql, [schemaName, tableName]);
    return result?.exists || false;
  }

  async getTableColumns(tableName: string, schemaName: string = 'public'): Promise<Array<{
    columnName: string;
    dataType: string;
    isNullable: boolean;
    defaultValue?: string;
    maxLength?: number;
  }>> {
    const sql = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = $1 AND table_name = $2 
      ORDER BY ordinal_position
    `;
    
    const result = await this.selectMany<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default?: string;
      character_maximum_length?: number;
    }>(sql, [schemaName, tableName]);
    
    return result.map(row => ({
      columnName: row.column_name,
      dataType: row.data_type,
      isNullable: row.is_nullable === 'YES',
      defaultValue: row.column_default,
      maxLength: row.character_maximum_length,
    }));
  }

  async getTableIndexes(tableName: string, schemaName: string = 'public'): Promise<Array<{
    indexName: string;
    columnName: string;
    isUnique: boolean;
    isPrimary: boolean;
  }>> {
    const sql = `
      SELECT 
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique,
        ix.indisprimary as is_primary
      FROM 
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a,
        pg_namespace n
      WHERE 
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relkind = 'r'
        AND n.oid = t.relnamespace
        AND n.nspname = $1
        AND t.relname = $2
      ORDER BY i.relname, a.attname
    `;
    
    const result = await this.selectMany<{
      index_name: string;
      column_name: string;
      is_unique: boolean;
      is_primary: boolean;
    }>(sql, [schemaName, tableName]);
    
    return result.map(row => ({
      indexName: row.index_name,
      columnName: row.column_name,
      isUnique: row.is_unique,
      isPrimary: row.is_primary,
    }));
  }

  // JSON operations (PostgreSQL specific)
  async selectJsonField<T = any>(table: string, jsonColumn: string, jsonPath: string, whereClause?: string, whereParams: QueryParams = []): Promise<T[]> {
    const sql = whereClause 
      ? `SELECT ${jsonColumn}->>'${jsonPath}' as value FROM ${table} WHERE ${whereClause}`
      : `SELECT ${jsonColumn}->>'${jsonPath}' as value FROM ${table}`;
    
    const result = await this.selectMany<{ value: T }>(sql, whereParams);
    return result.map(row => row.value);
  }

  async updateJsonField(table: string, jsonColumn: string, jsonPath: string, newValue: any, whereClause: string, whereParams: QueryParams = []): Promise<DatabaseResult> {
    const sql = `UPDATE ${table} SET ${jsonColumn} = jsonb_set(${jsonColumn}, '{${jsonPath}}', $1) WHERE ${whereClause} RETURNING *`;
    const allParams = [JSON.stringify(newValue), ...(Array.isArray(whereParams) ? whereParams : Object.values(whereParams))];
    
    return await this.pool.query(sql, allParams);
  }

  // Full-text search
  async fullTextSearch<T = any>(table: string, searchColumn: string, searchTerm: string, additionalColumns: string = '*'): Promise<T[]> {
    const sql = `
      SELECT ${additionalColumns}, ts_rank(to_tsvector(${searchColumn}), plainto_tsquery($1)) as rank
      FROM ${table} 
      WHERE to_tsvector(${searchColumn}) @@ plainto_tsquery($1)
      ORDER BY rank DESC
    `;
    
    return await this.selectMany<T>(sql, [searchTerm]);
  }

  // Date/Time helpers
  async getCurrentTimestamp(): Promise<Date> {
    const result = await this.selectOne<{ now: Date }>('SELECT NOW() as now');
    return result?.now || new Date();
  }

  async getCurrentDate(): Promise<Date> {
    const result = await this.selectOne<{ current_date: Date }>('SELECT CURRENT_DATE as current_date');
    return result?.current_date || new Date();
  }

  // Utility methods
  private adjustParameterNumbers(whereClause: string, offset: number): string {
    return whereClause.replace(/\$(\d+)/g, (match, num) => `$${parseInt(num) + offset}`);
  }

  buildWhereClause(conditions: Record<string, any>): { whereClause: string; params: any[] } {
    const keys = Object.keys(conditions);
    if (keys.length === 0) {
      return { whereClause: '1=1', params: [] };
    }

    const clauses = keys.map((key, index) => `${key} = $${index + 1}`);
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
    const countSql = `SELECT COUNT(*) as total_count FROM (${sql}) as count_query`;
    const countResult = await this.selectOne<{ total_count: number }>(countSql, params);
    const totalCount = Number(countResult?.total_count || 0);

    // Get paginated data
    const offset = (page - 1) * pageSize;
    const paginatedSql = `${sql} LIMIT $${(Array.isArray(params) ? params.length : Object.keys(params).length) + 1} OFFSET $${(Array.isArray(params) ? params.length : Object.keys(params).length) + 2}`;
    const paginatedParams = [...(Array.isArray(params) ? params : Object.values(params)), pageSize, offset];
    const data = await this.selectMany<T>(paginatedSql, paginatedParams);

    return {
      data,
      totalCount,
      page,
      pageSize,
    };
  }

  // Batch operations
  async executeBatch(queries: Array<{ sql: string; params?: QueryParams }>): Promise<DatabaseResult[]> {
    const results: DatabaseResult[] = [];
    
    for (const query of queries) {
      const result = await this.pool.query(query.sql, query.params || []);
      results.push(result);
    }
    
    return results;
  }
}
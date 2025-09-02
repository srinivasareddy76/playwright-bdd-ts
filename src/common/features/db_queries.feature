@db @database
Feature: Database Operations
  As a test automation engineer
  I want to execute database queries and validate results
  So that I can verify data integrity and business logic

  Background:
    Given I have a database connection

  @smoke @positive @oracle
  Scenario: Execute basic Oracle query
    When I execute the query "SELECT USER FROM DUAL"
    Then the query should return 1 rows
    And the first row should have "USER" equal to "T5_ORACLE_USER"

  @smoke @positive @postgres
  Scenario: Execute basic PostgreSQL query
    When I execute the query "SELECT current_user"
    Then the query should return 1 rows
    And the first row should have "current_user" equal to "t5_pg_user"

  @positive @parameterized
  Scenario: Execute parameterized query
    When I execute the query "SELECT * FROM users WHERE status = ? AND created_date > ?" with parameters:
      | status       | active     |
      | created_date | 2024-01-01 |
    Then the result should have at least 1 rows
    And all rows should have "status" equal to "active"

  @positive @insert
  Scenario: Insert new record
    When I insert a record into "test_users" table:
      | username | john_doe           |
      | email    | john@example.com   |
      | status   | active             |
      | role     | user               |
    Then the query should return 1 rows
    And I store the value of column "id" from the first row as "newUserId"

  @positive @update
  Scenario: Update existing record
    Given I insert a record into "test_users" table:
      | username | jane_doe           |
      | email    | jane@example.com   |
      | status   | pending            |
    When I update records in "test_users" table where "username = 'jane_doe'" with:
      | status | active |
      | email  | jane.doe@example.com |
    Then the query should return 1 rows

  @positive @delete
  Scenario: Delete records
    Given I insert a record into "test_users" table:
      | username | temp_user          |
      | email    | temp@example.com   |
      | status   | temporary          |
    When I delete records from "test_users" table where "status = 'temporary'"
    Then the result should have at least 1 rows

  @positive @oracle-specific
  Scenario: Oracle sequence operations
    When I get the next sequence value for "user_id_seq"
    And I store the value as "nextId"
    Then the stored "nextId" should be a number
    And the stored "nextId" should be greater than 0

  @positive @postgres-specific
  Scenario: PostgreSQL sequence operations
    When I get the next sequence value for "user_id_seq"
    And I store the value as "nextId"
    Then the stored "nextId" should be a number
    And the stored "nextId" should be greater than 0

  @positive @metadata
  Scenario: Check table existence
    When I check if table "users" exists
    Then the table "users" should exist

  @negative @metadata
  Scenario: Check non-existent table
    When I check if table "non_existent_table" exists
    Then the table "non_existent_table" should not exist

  @positive @complex-query
  Scenario: Execute complex join query
    When I execute the query:
      """
      SELECT u.username, u.email, p.name as profile_name, r.role_name
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      LEFT JOIN user_roles r ON u.role_id = r.id
      WHERE u.status = 'active'
      ORDER BY u.created_date DESC
      LIMIT 10
      """
    Then the result should have at least 1 rows
    And the first row should have "username" not null
    And the first row should have "email" not null

  @positive @aggregation
  Scenario: Execute aggregation query
    When I execute the query:
      """
      SELECT 
        status,
        COUNT(*) as user_count,
        MIN(created_date) as earliest_date,
        MAX(created_date) as latest_date
      FROM users 
      GROUP BY status
      HAVING COUNT(*) > 0
      ORDER BY user_count DESC
      """
    Then the result should have at least 1 rows
    And the column "user_count" should be a number
    And the column "earliest_date" should be a date
    And the column "latest_date" should be a date

  @positive @data-validation
  Scenario: Validate user data integrity
    When I execute the query "SELECT * FROM users WHERE email IS NULL OR email = ''"
    Then the query should return no rows

  @positive @data-validation
  Scenario: Validate referential integrity
    When I execute the query:
      """
      SELECT u.id, u.username 
      FROM users u 
      LEFT JOIN user_profiles p ON u.id = p.user_id 
      WHERE u.status = 'active' AND p.user_id IS NULL
      """
    Then the query should return no rows

  @performance
  Scenario: Query performance test
    When I record the query start time
    And I execute the query "SELECT COUNT(*) as total_users FROM users"
    Then the query execution time should be less than 1000 milliseconds
    And the query should return 1 rows
    And the first row should have "total_users" be a number

  @positive @transaction
  Scenario: Transaction operations
    When I begin a transaction
    And I insert a record into "test_users" table:
      | username | transaction_test   |
      | email    | test@example.com   |
      | status   | pending            |
    And I execute the query "SELECT COUNT(*) as count FROM test_users WHERE username = 'transaction_test'"
    Then the first row should have "count" equal to "1"
    When I rollback the transaction
    And I execute the query "SELECT COUNT(*) as count FROM test_users WHERE username = 'transaction_test'"
    Then the first row should have "count" equal to "0"

  @positive @batch-operations
  Scenario: Multiple database operations
    When I execute the query "DELETE FROM test_batch_users WHERE username LIKE 'batch_test_%'"
    And I insert a record into "test_batch_users" table:
      | username | batch_test_1       |
      | email    | batch1@example.com |
      | status   | active             |
    And I insert a record into "test_batch_users" table:
      | username | batch_test_2       |
      | email    | batch2@example.com |
      | status   | active             |
    And I execute the query "SELECT COUNT(*) as count FROM test_batch_users WHERE username LIKE 'batch_test_%'"
    Then the first row should have "count" equal to "2"

  @oracle @system-queries
  Scenario: Oracle system information queries
    When I run "oracle" query "select_date" with parameters:
      | dummy | value |
    Then the query should return 1 rows
    And the column "SYSDATE" should be a date

  @postgres @system-queries
  Scenario: PostgreSQL system information queries
    When I run "postgres" query "select_version" with parameters:
      | dummy | value |
    Then the query should return 1 rows
    And the column "version" should contain "PostgreSQL"

  @positive @data-types
  Scenario: Test various data types
    When I insert a record into "test_data_types" table:
      | string_col  | Test String        |
      | number_col  | 42                 |
      | date_col    | 2024-01-01         |
      | boolean_col | true               |
      | json_col    | {"key": "value"}   |
    Then the query should return 1 rows
    And the first row should have "string_col" equal to "Test String"
    And the first row should have "number_col" equal to "42"

  @negative @error-handling
  Scenario: Handle SQL syntax errors gracefully
    When I execute the query "SELECT * FROM non_existent_table"
    Then the query should fail with an error
    And the error should contain "does not exist" or "not found"

  @positive @pagination
  Scenario: Test query pagination
    When I execute the query "SELECT * FROM users ORDER BY id LIMIT 5 OFFSET 0"
    Then the result should have no more than 5 rows
    When I execute the query "SELECT * FROM users ORDER BY id LIMIT 5 OFFSET 5"
    Then the result should have no more than 5 rows
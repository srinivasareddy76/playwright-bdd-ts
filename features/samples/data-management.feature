


@sample @data-management @file-operations
Feature: Advanced Data Management and File Operations
  As a test automation engineer
  I want to demonstrate comprehensive data management capabilities
  So that I can handle complex test data scenarios efficiently

  Background:
    Given I have initialized the UtilityFactory with all utilities
    And I have configured data providers for multiple sources
    And I have set up file monitoring and management

  @data-provider @json @csv @yaml
  Scenario: Multi-format data loading and processing
    Given I have test data files in multiple formats:
      | format | filename              | description        |
      | JSON   | users/customers.json  | Customer profiles  |
      | CSV    | products/catalog.csv  | Product catalog    |
      | YAML   | config/settings.yaml  | Application config |
    When I load data from each format using DataProvider
    And I validate the data structure and content
    And I transform data between different formats
    Then I should successfully process all data formats
    And I should be able to query data using complex filters
    And I capture data processing screenshots
    And I generate a data validation report

  @data-caching @performance @optimization
  Scenario: Data caching and performance optimization
    Given I configure DataProvider with caching enabled
    And I set cache TTL to 300 seconds
    And I prepare large datasets for performance testing
    When I load the same dataset multiple times
    And I measure loading times for cached vs non-cached data
    Then subsequent loads should be significantly faster
    And I should see cache hit statistics
    And I validate cache expiration behavior
    And I generate performance comparison reports

  @file-monitoring @real-time @notifications
  Scenario: Real-time file monitoring and change detection
    Given I set up file watchers using FileUtils for:
      | directory    | pattern | action    |
      | test-data/   | *.json  | reload    |
      | config/      | *.yaml  | validate  |
      | reports/     | *.html  | archive   |
    When I modify files in monitored directories
    And I create new files matching watch patterns
    And I delete files from monitored locations
    Then I should receive real-time change notifications
    And appropriate actions should be triggered automatically
    And I should capture file change events with timestamps
    And I generate a file monitoring activity report

  @data-validation @schema @integrity
  Scenario: Data validation and schema enforcement
    Given I define data schemas for validation:
      | dataType | schema                    |
      | user     | schemas/user-schema.json  |
      | product  | schemas/product-schema.json |
      | order    | schemas/order-schema.json |
    When I load test data and apply schema validation
    And I test with both valid and invalid data samples
    Then valid data should pass validation successfully
    And invalid data should be rejected with clear error messages
    And I should capture validation results for each schema
    And I generate a data quality report

  @data-transformation @filtering @querying
  Scenario: Advanced data querying and transformation
    Given I load a large dataset using DataProvider
    And I prepare complex query scenarios:
      | queryType    | criteria                           |
      | range        | age between 25 and 45             |
      | text         | name contains "John"              |
      | date         | created after 2024-01-01          |
      | nested       | address.state equals "California" |
      | combination  | multiple criteria with AND/OR     |
    When I execute each query against the dataset
    And I apply data transformations and aggregations
    Then I should get accurate filtered results
    And query performance should be within acceptable limits
    And I capture query execution times and result counts
    And I generate query performance analytics

  @file-operations @compression @archiving
  Scenario: File compression and archiving operations
    Given I create test files of various sizes using FileUtils
    And I prepare directories with multiple file types
    When I compress individual files and entire directories
    And I test different compression algorithms and levels
    And I extract compressed files to verify integrity
    Then compression should reduce file sizes significantly
    And extracted files should match original content exactly
    And I should capture compression ratios and performance metrics
    And I clean up temporary files after testing

  @temporary-files @cleanup @resource-management
  Scenario: Temporary file management and cleanup
    Given I create multiple temporary files using FileUtils:
      | fileType | count | size    | prefix      |
      | text     | 10    | 1KB     | test-data   |
      | json     | 5     | 10KB    | config      |
      | binary   | 3     | 100KB   | media       |
    When I perform operations with temporary files
    And I track file creation and usage
    And I trigger automatic cleanup processes
    Then temporary files should be cleaned up properly
    And no orphaned files should remain after tests
    And I should capture file lifecycle events
    And I generate resource usage reports

  @data-generation @bulk @scenarios
  Scenario: Bulk test data generation for different scenarios
    Given I configure TestDataGenerator for bulk generation
    When I generate large datasets for different test scenarios:
      | scenario     | recordCount | dataTypes                    |
      | load-testing | 1000        | users, orders, products      |
      | edge-cases   | 100         | boundary values, nulls       |
      | performance  | 5000        | complex nested objects       |
      | security     | 200         | injection patterns, exploits |
    And I save generated data to files using FileUtils
    And I validate data quality and uniqueness
    Then all generated data should meet scenario requirements
    And data should be properly distributed and realistic
    And I capture generation performance metrics
    And I create data generation summary reports

  @configuration @environment @dynamic
  Scenario: Dynamic configuration management across environments
    Given I set up ConfigManager for multiple environments:
      | environment | configFile           | features              |
      | development | config/dev.yaml      | debug, mock-services  |
      | staging     | config/staging.yaml  | integration-tests     |
      | production  | config/prod.yaml     | monitoring, security  |
    When I switch between environments dynamically
    And I reload configurations with hot-reload enabled
    And I validate environment-specific settings
    Then configuration should update without application restart
    And environment-specific features should be enabled/disabled
    And I should capture configuration change events
    And I generate environment configuration reports

  @data-export @reporting @formats
  Scenario: Data export and multi-format reporting
    Given I have processed test data from multiple sources
    And I have generated test results and analytics
    When I export data in different formats:
      | format | filename                  | content              |
      | JSON   | results/test-results.json | structured test data |
      | CSV    | results/summary.csv       | tabular summaries    |
      | YAML   | results/config-dump.yaml  | configuration data   |
      | XML    | results/report.xml        | test report format   |
    And I validate exported file integrity
    And I test data import from exported files
    Then all exports should maintain data fidelity
    And imported data should match original datasets
    And I capture export/import performance metrics
    And I generate data portability reports




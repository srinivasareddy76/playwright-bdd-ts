




@sample @api-testing @integration @data-validation
Feature: API Testing with Comprehensive Utilities Integration
  As a test automation engineer
  I want to demonstrate API testing capabilities using all utilities
  So that I can validate backend services with comprehensive data management

  Background:
    Given I have initialized all utilities for API testing
    And I have configured API endpoints using ConfigManager
    And I have set up request/response logging using FileUtils

  @api @user-management @crud-operations
  Scenario: Complete user CRUD operations with generated data
    Given I generate a comprehensive user profile using TestDataGenerator
    And I capture the initial API state using ScreenshotUtils
    When I create a new user via POST API with generated data
    Then the user should be created successfully with status code 201
    And I should receive a valid user ID in the response
    When I retrieve the user via GET API using the returned ID
    Then the retrieved user data should match the created user data
    When I update the user via PUT API with modified generated data
    Then the user should be updated successfully with status code 200
    When I delete the user via DELETE API
    Then the user should be deleted successfully with status code 204
    And I save the complete API interaction log to a file
    And I generate an API testing report with all operations

  @api @data-validation @schema-validation
  Scenario: API response validation with schema enforcement
    Given I define API response schemas using DataProvider:
      | endpoint    | method | schema                    |
      | /users      | GET    | schemas/users-list.json   |
      | /users/{id} | GET    | schemas/user-detail.json  |
      | /products   | GET    | schemas/products.json     |
      | /orders     | POST   | schemas/order-create.json |
    And I generate test data for each API endpoint
    When I make API calls to all defined endpoints
    And I validate each response against its schema
    Then all API responses should conform to their schemas
    And I should capture any schema validation failures
    And I generate a schema compliance report

  @api @performance @load-testing @bulk-operations
  Scenario: API performance testing with bulk data generation
    Given I generate bulk test data using TestDataGenerator:
      | dataType | count | description           |
      | users    | 100   | User profiles         |
      | products | 50    | Product catalog       |
      | orders   | 200   | Customer orders       |
    And I configure performance monitoring using DriverManager
    When I execute bulk API operations in parallel:
      | operation | endpoint     | data    | concurrency |
      | CREATE    | /users       | users   | 10          |
      | CREATE    | /products    | products| 5           |
      | CREATE    | /orders      | orders  | 15          |
    And I monitor response times and success rates
    Then all API operations should complete within acceptable time limits
    And success rate should be above 95%
    And I capture performance metrics and statistics
    And I generate a performance testing report

  @api @error-handling @negative-testing
  Scenario: API error handling with invalid data patterns
    Given I generate invalid data patterns using TestDataGenerator:
      | invalidType     | pattern              | expectedError |
      | malformedEmail  | invalid-email        | 400          |
      | missingRequired | null-required-fields | 400          |
      | invalidFormat   | wrong-data-types     | 400          |
      | oversizeData    | exceeds-limits       | 413          |
      | unauthorized    | invalid-credentials  | 401          |
    When I make API calls with each invalid data pattern
    Then I should receive appropriate error responses
    And error messages should be descriptive and helpful
    And I capture all error scenarios with screenshots
    And I log error patterns for security analysis

  @api @authentication @security @token-management
  Scenario: API authentication and security testing
    Given I generate user credentials using TestDataGenerator
    And I configure authentication endpoints using ConfigManager
    When I authenticate with generated credentials
    Then I should receive a valid authentication token
    And I store the token securely using ConfigManager
    When I make authenticated API calls using the token
    Then all authenticated requests should succeed
    When I test token expiration scenarios using DateUtils
    And I attempt API calls with expired tokens
    Then I should receive 401 unauthorized responses
    And I capture security test results for compliance

  @api @data-transformation @format-conversion
  Scenario: API data transformation and format handling
    Given I prepare test data in multiple formats using DataProvider:
      | format | filename              | content           |
      | JSON   | api-data/users.json   | User data         |
      | CSV    | api-data/products.csv | Product catalog   |
      | YAML   | api-data/config.yaml  | Configuration     |
    When I load data from each format
    And I transform data to API-compatible formats
    And I send transformed data to respective API endpoints
    Then all API calls should process the data correctly
    And I should validate data integrity after transformation
    And I generate data transformation reports

  @api @file-upload @binary-data @multipart
  Scenario: File upload API testing with generated content
    Given I generate test files using FileUtils:
      | fileType | size  | count | description        |
      | image    | 1MB   | 5     | Profile pictures   |
      | document | 500KB | 3     | User documents     |
      | data     | 100KB | 10    | CSV data files     |
    When I upload files via multipart API endpoints
    And I validate file upload responses
    Then all files should be uploaded successfully
    And I should receive valid file URLs in responses
    When I download uploaded files via API
    Then downloaded files should match original files exactly
    And I clean up uploaded test files after validation

  @api @rate-limiting @throttling @resilience
  Scenario: API rate limiting and resilience testing
    Given I configure rate limiting test parameters using ConfigManager
    And I generate test data for high-volume requests
    When I make rapid API calls exceeding rate limits
    Then I should receive 429 Too Many Requests responses
    And rate limit headers should be present in responses
    When I implement retry logic with exponential backoff using DateUtils
    And I retry failed requests after appropriate delays
    Then retried requests should succeed when rate limits reset
    And I capture rate limiting behavior and recovery times

  @api @caching @performance-optimization
  Scenario: API response caching and optimization testing
    Given I configure API response caching using DataProvider
    And I generate test data for cacheable endpoints
    When I make initial API calls to cacheable endpoints
    And I measure initial response times
    When I make subsequent calls to the same endpoints
    Then cached responses should be significantly faster
    And cached data should match original responses exactly
    When I test cache invalidation scenarios
    Then updated data should bypass cache appropriately
    And I generate caching performance analysis

  @api @webhook @event-driven @real-time
  Scenario: Webhook and event-driven API testing
    Given I set up webhook endpoint monitoring using FileUtils
    And I configure webhook URLs using ConfigManager
    When I trigger events that should generate webhooks
    And I monitor webhook delivery in real-time
    Then webhooks should be delivered within acceptable timeframes
    And webhook payloads should contain expected event data
    When I simulate webhook delivery failures
    Then the system should implement proper retry mechanisms
    And I capture webhook delivery statistics and reliability metrics

  @api @database-integration @data-consistency
  Scenario: API and database consistency validation
    Given I generate test data with database constraints
    And I configure database connection using ConfigManager
    When I create data via API endpoints
    And I verify data persistence in the database directly
    Then API data should match database records exactly
    When I update data via API
    And I check database for consistency
    Then database should reflect all API changes correctly
    When I test concurrent API operations
    Then data consistency should be maintained under load
    And I generate data consistency reports

  @api @monitoring @alerting @observability
  Scenario: API monitoring and alerting integration
    Given I configure monitoring endpoints using ConfigManager
    And I set up alert thresholds for API metrics
    When I execute comprehensive API test suites
    And I monitor API health and performance metrics
    Then monitoring systems should capture all API interactions
    And alerts should trigger for performance degradation
    When I simulate API failures and recovery
    Then monitoring should detect and report issues accurately
    And I generate comprehensive observability reports

  @api @versioning @backward-compatibility
  Scenario: API versioning and backward compatibility testing
    Given I configure multiple API versions using ConfigManager:
      | version | baseUrl                    | features              |
      | v1      | https://api.example.com/v1 | basic functionality   |
      | v2      | https://api.example.com/v2 | enhanced features     |
      | v3      | https://api.example.com/v3 | latest capabilities   |
    And I generate compatible test data for each version
    When I test the same operations across all API versions
    Then older versions should maintain backward compatibility
    And newer versions should provide enhanced functionality
    When I test deprecated endpoint warnings
    Then appropriate deprecation notices should be returned
    And I generate API versioning compatibility reports





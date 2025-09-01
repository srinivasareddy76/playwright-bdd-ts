@api @mtls
Feature: API mTLS Authentication
  As a system integrator
  I want to make secure API calls using client certificates
  So that I can authenticate with mutual TLS

  Background:
    Given I have an API client with mTLS

  @smoke @positive
  Scenario: Successful API call with client certificate
    When I call "GET" "/secure/ping" with mTLS
    Then the response status should be 200
    And the response should be successful

  @positive
  Scenario: Health check with mTLS
    When I check the API health
    Then the API should be healthy

  @positive
  Scenario: Secure endpoint access with mTLS
    When I make a secure API call to "/secure/user/profile"
    Then the response should be successful
    And the response should have property "user"
    And the response should have property "authenticated" with value "true"

  @positive
  Scenario: POST request with mTLS and JSON payload
    Given I set the request header "Content-Type" to "application/json"
    When I send a "POST" request to "/secure/data" with JSON:
      """
      {
        "name": "Test Data",
        "value": 123,
        "timestamp": "2024-01-01T00:00:00Z"
      }
      """
    Then the response status should be 201
    And the response should have property "id"
    And the response should have property "status" with value "created"

  @positive
  Scenario: Multiple secure API calls
    When I send multiple requests:
      | method | endpoint           |
      | GET    | /secure/ping       |
      | GET    | /secure/status     |
      | GET    | /secure/version    |
    Then all batch requests should be successful

  @negative
  Scenario: API call to non-existent secure endpoint
    When I call "GET" "/secure/nonexistent" with mTLS
    Then the response status should be 404
    And the response should be an error

  @positive @data
  Scenario: Retrieve and validate secure data
    When I call "GET" "/secure/data/list" with mTLS
    Then the response should be successful
    And the response should be a JSON array
    And I extract "data.0.id" from the response as "firstDataId"
    When I call "GET" "/secure/data/{firstDataId}" with mTLS
    Then the response should be successful
    And the response should have property "id"

  @positive @headers
  Scenario: API call with custom headers and mTLS
    Given I set the request header "X-Client-Version" to "1.0.0"
    And I set the request header "X-Request-ID" to "test-12345"
    When I call "GET" "/secure/echo" with mTLS
    Then the response should be successful
    And the response should have header "X-Request-ID"
    And the response should have header "X-Request-ID" with value "test-12345"

  @performance
  Scenario: API performance with mTLS
    When I record the request start time
    And I call "GET" "/secure/ping" with mTLS
    Then the response time should be less than 2000 milliseconds
    And the response should be successful

  @positive @authentication
  Scenario: Verify mTLS certificate authentication
    When I call "GET" "/secure/cert/info" with mTLS
    Then the response should be successful
    And the response should have property "client_cert_verified" with value "true"
    And the response should have property "client_cert_subject"

  @positive @crud
  Scenario: Complete CRUD operations with mTLS
    # Create
    When I send a "POST" request to "/secure/items" with JSON:
      """
      {
        "name": "Test Item",
        "description": "Created via mTLS API test"
      }
      """
    Then the response status should be 201
    And I extract "id" from the response as "itemId"
    
    # Read
    When I call "GET" "/secure/items/{itemId}" with mTLS
    Then the response should be successful
    And the response should have property "name" with value "Test Item"
    
    # Update
    When I send a "PUT" request to "/secure/items/{itemId}" with JSON:
      """
      {
        "name": "Updated Test Item",
        "description": "Updated via mTLS API test"
      }
      """
    Then the response should be successful
    And the response should have property "name" with value "Updated Test Item"
    
    # Delete
    When I call "DELETE" "/secure/items/{itemId}" with mTLS
    Then the response status should be 204

  @error-handling
  Scenario: Handle API errors gracefully with mTLS
    When I send a "POST" request to "/secure/validate" with JSON:
      """
      {
        "invalid": "data"
      }
      """
    Then the response status should be 400
    And the response should be an error
    And the response should have property "error"
    And the response should have property "message"
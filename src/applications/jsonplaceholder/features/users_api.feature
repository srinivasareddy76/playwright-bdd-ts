@api @users @jsonplaceholder
Feature: JSONPlaceholder Users API Testing
  As a developer
  I want to test the Users API endpoints
  So that I can ensure user data retrieval works correctly

  Background:
    Given I have initialized the JSONPlaceholder API client

  @smoke @get
  Scenario: Get all users successfully
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should contain an array of users
    And the response should contain 10 users
    And each user should have required fields "id", "name", "username", "email"

  @smoke @get
  Scenario: Get a specific user by ID
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And the response should contain a single user object
    And the user should have id 1
    And the user should have required fields "id", "name", "username", "email", "address", "phone", "website", "company"

  @get @positive
  Scenario Outline: Get users by valid ID
    When I send a GET request to "/users/<userId>"
    Then the response status should be 200
    And the response should contain a single user object
    And the user should have id <userId>
    And the user should have a valid email format
    And the user should have complete address information

    Examples:
      | userId |
      | 1      |
      | 5      |
      | 10     |

  @get @negative
  Scenario: Get user with invalid ID
    When I send a GET request to "/users/999"
    Then the response status should be 404

  @get @boundary
  Scenario Outline: Get users with boundary value IDs
    When I send a GET request to "/users/<userId>"
    Then the response status should be <expectedStatus>

    Examples:
      | userId | expectedStatus |
      | 0      | 404           |
      | 1      | 200           |
      | 10     | 200           |
      | 11     | 404           |

  @validation
  Scenario: Validate user response structure and data types
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And the user response should have valid structure
    And the user should have numeric id
    And the user should have string name
    And the user should have string username
    And the user should have valid email format
    And the user should have complete address with geo coordinates
    And the user should have string phone
    And the user should have string website
    And the user should have complete company information

  @validation
  Scenario: Validate all users have consistent structure
    When I send a GET request to "/users"
    Then the response status should be 200
    And all users should have consistent structure
    And all users should have valid email formats
    And all users should have complete address information
    And all users should have company information

  @data-integrity
  Scenario: Verify user data integrity
    When I send a GET request to "/users"
    Then the response status should be 200
    And all user IDs should be unique
    And all usernames should be unique
    And all email addresses should be unique
    And all user IDs should be sequential from 1 to 10

  @relationships
  Scenario: Verify user relationships with posts
    Given I get user with id 1
    When I send a GET request to "/posts" with query parameter "userId" as "1"
    Then the response status should be 200
    And the response should contain posts for user 1
    And all returned posts should belong to user 1

  @relationships
  Scenario: Verify user relationships with albums
    Given I get user with id 1
    When I send a GET request to "/albums" with query parameter "userId" as "1"
    Then the response status should be 200
    And the response should contain albums for user 1
    And all returned albums should belong to user 1

  @relationships
  Scenario: Verify user relationships with todos
    Given I get user with id 1
    When I send a GET request to "/todos" with query parameter "userId" as "1"
    Then the response status should be 200
    And the response should contain todos for user 1
    And all returned todos should belong to user 1

  @performance
  Scenario: Get all users performance test
    When I send a GET request to "/users"
    Then the response should be received within 2 seconds
    And the response status should be 200

  @performance
  Scenario: Get multiple users concurrently
    When I send GET requests to all user endpoints concurrently
    Then all requests should complete within 5 seconds
    And all responses should have status 200
    And all responses should contain valid user data

  @headers
  Scenario: Verify response headers for users endpoint
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should have header "content-type" containing "application/json"
    And the response should have header "access-control-allow-origin" as "*"

  @address-validation
  Scenario: Validate user address structure
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And the user address should have required fields "street", "suite", "city", "zipcode", "geo"
    And the user address geo should have required fields "lat", "lng"
    And the geo coordinates should be valid numeric strings

  @company-validation
  Scenario: Validate user company structure
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And the user company should have required fields "name", "catchPhrase", "bs"
    And all company fields should be non-empty strings

  @edge-cases
  Scenario: Test edge cases for user endpoints
    When I send a GET request to "/users/0"
    Then the response status should be 404
    When I send a GET request to "/users/-1"
    Then the response status should be 404
    When I send a GET request to "/users/abc"
    Then the response status should be 404
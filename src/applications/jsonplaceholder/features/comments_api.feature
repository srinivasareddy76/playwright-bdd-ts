@api @comments @jsonplaceholder
Feature: JSONPlaceholder Comments API Testing
  As a developer
  I want to test the Comments API endpoints
  So that I can ensure comment retrieval and relationships work correctly

  Background:
    Given I have initialized the JSONPlaceholder API client

  @smoke @get
  Scenario: Get all comments successfully
    When I send a GET request to "/comments"
    Then the response status should be 200
    And the response should contain an array of comments
    And the response should contain 500 comments
    And each comment should have required fields "postId", "id", "name", "email", "body"

  @smoke @get
  Scenario: Get comments for a specific post using nested route
    When I send a GET request to "/posts/1/comments"
    Then the response status should be 200
    And the response should contain an array of comments
    And all comments should belong to post 1
    And each comment should have valid email format

  @smoke @get
  Scenario: Get comments for a specific post using query parameter
    When I send a GET request to "/comments" with query parameter "postId" as "1"
    Then the response status should be 200
    And the response should contain an array of comments
    And all comments should belong to post 1
    And the response should contain the same data as nested route

  @get @positive
  Scenario Outline: Get comments for different posts
    When I send a GET request to "/posts/<postId>/comments"
    Then the response status should be 200
    And the response should contain an array of comments
    And all comments should belong to post <postId>
    And the response should contain at least 1 comment

    Examples:
      | postId |
      | 1      |
      | 25     |
      | 50     |
      | 100    |

  @get @negative
  Scenario: Get comments for non-existent post
    When I send a GET request to "/posts/999/comments"
    Then the response status should be 200
    And the response should contain an empty array

  @get @negative
  Scenario: Get comments with invalid post ID query parameter
    When I send a GET request to "/comments" with query parameter "postId" as "999"
    Then the response status should be 200
    And the response should contain an empty array

  @validation
  Scenario: Validate comment response structure
    When I send a GET request to "/comments/1"
    Then the response status should be 200
    And the comment response should have valid structure
    And the comment should have numeric postId
    And the comment should have numeric id
    And the comment should have string name
    And the comment should have valid email format
    And the comment should have string body

  @validation
  Scenario: Validate all comments have consistent structure
    When I send a GET request to "/comments"
    Then the response status should be 200
    And all comments should have consistent structure
    And all comments should have valid email formats
    And all comments should have non-empty names
    And all comments should have non-empty bodies

  @email-validation
  Scenario: Verify email format validation in comments
    When I send a GET request to "/comments"
    Then the response status should be 200
    And all comment emails should follow valid email format
    And all comment emails should contain "@" symbol
    And all comment emails should have domain part

  @relationships
  Scenario: Verify comment-post relationships
    Given I get a random post ID
    When I send a GET request to "/posts/{postId}/comments"
    And I send a GET request to "/comments" with query parameter "postId" as "{postId}"
    Then both responses should return the same comments
    And all comments should reference the correct post ID

  @data-integrity
  Scenario: Verify comment data integrity
    When I send a GET request to "/comments"
    Then the response status should be 200
    And all comment IDs should be unique
    And all comment IDs should be sequential from 1 to 500
    And comment postIds should reference valid posts (1-100)

  @performance
  Scenario: Get all comments performance test
    When I send a GET request to "/comments"
    Then the response should be received within 3 seconds
    And the response status should be 200
    And the response should contain 500 comments

  @performance
  Scenario: Get comments for multiple posts concurrently
    When I send GET requests to comments for posts 1, 25, 50, 75, 100 concurrently
    Then all requests should complete within 5 seconds
    And all responses should have status 200
    And all responses should contain valid comment arrays

  @boundary
  Scenario Outline: Test boundary values for post IDs in comments
    When I send a GET request to "/posts/<postId>/comments"
    Then the response status should be 200
    And the response should contain <expectedResult>

    Examples:
      | postId | expectedResult    |
      | 1      | comments array    |
      | 100    | comments array    |
      | 0      | empty array       |
      | 101    | empty array       |
      | -1     | empty array       |

  @headers
  Scenario: Verify response headers for comments endpoint
    When I send a GET request to "/comments"
    Then the response status should be 200
    And the response should have header "content-type" containing "application/json"
    And the response should have header "access-control-allow-origin" as "*"

  @filtering
  Scenario: Test comment filtering capabilities
    When I send a GET request to "/comments" with query parameter "postId" as "1"
    Then the response status should be 200
    And all returned comments should have postId 1
    When I send a GET request to "/comments" with query parameter "id" as "1"
    Then the response status should be 200
    And the response should contain exactly 1 comment
    And the comment should have id 1

  @edge-cases
  Scenario: Test edge cases for comments endpoints
    When I send a GET request to "/comments/0"
    Then the response status should be 404
    When I send a GET request to "/comments/501"
    Then the response status should be 404
    When I send a GET request to "/comments/-1"
    Then the response status should be 404
    When I send a GET request to "/comments/abc"
    Then the response status should be 404

  @comparison
  Scenario: Compare nested route vs query parameter results
    Given I choose a random post ID between 1 and 100
    When I send a GET request to "/posts/{postId}/comments"
    And I send a GET request to "/comments" with query parameter "postId" as "{postId}"
    Then both responses should have status 200
    And both responses should contain identical comment arrays
    And both responses should have the same number of comments
    And the comment order should be identical in both responses
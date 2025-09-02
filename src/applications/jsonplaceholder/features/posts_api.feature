@api @posts @jsonplaceholder
Feature: JSONPlaceholder Posts API Testing
  As a developer
  I want to test the Posts API endpoints
  So that I can ensure the API works correctly for all CRUD operations

  Background:
    Given I have initialized the JSONPlaceholder API client

  @smoke @get
  Scenario: Get all posts successfully
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should contain an array of posts
    And the response should contain 100 posts
    And each post should have required fields "userId", "id", "title", "body"

  @smoke @get
  Scenario: Get a specific post by ID
    When I send a GET request to "/posts/1"
    Then the response status should be 200
    And the response should contain a single post object
    And the post should have id 1
    And the post should have required fields "userId", "id", "title", "body"

  @get @positive
  Scenario Outline: Get posts by valid user ID
    When I send a GET request to "/posts" with query parameter "userId" as "<userId>"
    Then the response status should be 200
    And the response should contain an array of posts
    And all posts should belong to user "<userId>"

    Examples:
      | userId |
      | 1      |
      | 5      |
      | 10     |

  @get @negative
  Scenario: Get post with invalid ID
    When I send a GET request to "/posts/999"
    Then the response status should be 404

  @get @negative
  Scenario: Get posts with invalid user ID
    When I send a GET request to "/posts" with query parameter "userId" as "999"
    Then the response status should be 200
    And the response should contain an empty array

  @post @positive
  Scenario: Create a new post successfully
    Given I have valid post data:
      | title  | Test Post Title                    |
      | body   | This is a test post body content   |
      | userId | 1                                  |
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post
    And the created post should have an id
    And the created post title should be "Test Post Title"
    And the created post body should be "This is a test post body content"
    And the created post userId should be 1

  @post @positive
  Scenario: Create post with special characters
    Given I have post data with special characters:
      | title  | Test Post: @#$%^&*()_+-=[]{}       |
      | body   | Body with "quotes" & <tags>        |
      | userId | 1                                  |
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post

  @post @boundary
  Scenario: Create post with very long content
    Given I have post data with long content
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post

  @post @boundary
  Scenario: Create post with minimal content
    Given I have post data with minimal content:
      | title  | A |
      | body   | B |
      | userId | 1 |
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post

  @put @positive
  Scenario: Update a post completely using PUT
    Given I have update post data:
      | id     | 1                                  |
      | title  | Updated Test Post Title            |
      | body   | This is updated post content       |
      | userId | 1                                  |
    When I send a PUT request to "/posts/1" with the update data
    Then the response status should be 200
    And the response should contain the updated post
    And the updated post title should be "Updated Test Post Title"
    And the updated post body should be "This is updated post content"

  @patch @positive
  Scenario: Partially update a post using PATCH
    Given I have partial post data:
      | title | Partially Updated Title |
    When I send a PATCH request to "/posts/1" with the partial data
    Then the response status should be 200
    And the response should contain the updated post
    And the updated post title should be "Partially Updated Title"

  @delete @positive
  Scenario: Delete a post successfully
    When I send a DELETE request to "/posts/1"
    Then the response status should be 200

  @delete @negative
  Scenario: Delete a non-existent post
    When I send a DELETE request to "/posts/999"
    Then the response status should be 200

  @performance
  Scenario: Get multiple posts performance test
    When I send GET requests to multiple post endpoints concurrently
    Then all requests should complete within 5 seconds
    And all responses should have status 200

  @validation
  Scenario: Validate post response structure
    When I send a GET request to "/posts/1"
    Then the response status should be 200
    And the post response should have valid structure
    And the post should have numeric id
    And the post should have numeric userId
    And the post should have string title
    And the post should have string body

  @headers
  Scenario: Verify response headers for posts endpoint
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should have header "content-type" containing "application/json"
    And the response should have header "access-control-allow-origin" as "*"

  @pagination
  Scenario: Test posts pagination behavior
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should contain exactly 100 posts
    And the posts should be ordered by id
    And the first post should have id 1
    And the last post should have id 100
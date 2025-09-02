# RESTful API Testing Guide

This guide provides comprehensive examples and documentation for testing RESTful APIs using the Playwright BDD TypeScript framework with the JSONPlaceholder API.

## Table of Contents

1. [Overview](#overview)
2. [API Client Architecture](#api-client-architecture)
3. [JSONPlaceholder API](#jsonplaceholder-api)
4. [Getting Started](#getting-started)
5. [Basic API Operations](#basic-api-operations)
6. [Advanced Testing Scenarios](#advanced-testing-scenarios)
7. [BDD Feature Files](#bdd-feature-files)
8. [Step Definitions](#step-definitions)
9. [Data Models and Validation](#data-models-and-validation)
10. [Performance Testing](#performance-testing)
11. [Error Handling](#error-handling)
12. [Best Practices](#best-practices)

## Overview

The framework includes comprehensive RESTful API testing capabilities using:

- **JSONPlaceholder API** - Free fake REST API for testing and prototyping
- **Playwright API Client** - Built-in HTTP client with TypeScript support
- **BDD Testing** - Cucumber.js integration for behavior-driven development
- **Data Validation** - Comprehensive response validation and type checking
- **Performance Testing** - Response time and concurrent request testing

## API Client Architecture

### Base API Client

The `BaseApiClient` class provides core HTTP functionality:

```typescript
// Initialize API client
const client = new BaseApiClient('https://api.example.com');
await client.initialize();

// HTTP Methods
const response = await client.get('/endpoint');
const created = await client.post('/endpoint', data);
const updated = await client.put('/endpoint/1', data);
const patched = await client.patch('/endpoint/1', partialData);
const deleted = await client.delete('/endpoint/1');
```

### JSONPlaceholder API Client

Specialized client for JSONPlaceholder API testing:

```typescript
import { JsonPlaceholderApiClient } from './src/applications/jsonplaceholder/api/JsonPlaceholderApiClient';

const apiClient = new JsonPlaceholderApiClient();
await apiClient.initialize();

// Get all posts
const posts = await apiClient.getAllPosts();

// Get specific post
const post = await apiClient.getPostById(1);

// Create new post
const newPost = await apiClient.createPost({
  title: 'Test Post',
  body: 'Test content',
  userId: 1
});
```

## JSONPlaceholder API

JSONPlaceholder provides a free REST API with the following resources:

| Resource | Count | Description |
|----------|-------|-------------|
| Posts | 100 | Blog posts with title, body, userId |
| Comments | 500 | Comments linked to posts |
| Albums | 100 | Photo albums linked to users |
| Photos | 5000 | Photos linked to albums |
| Todos | 200 | Todo items linked to users |
| Users | 10 | User profiles with complete information |

### Base URL
```
https://jsonplaceholder.typicode.com
```

### Available Endpoints

#### Posts
```http
GET    /posts           # Get all posts
GET    /posts/1         # Get specific post
GET    /posts?userId=1  # Get posts by user
POST   /posts           # Create new post
PUT    /posts/1         # Update post (complete)
PATCH  /posts/1         # Update post (partial)
DELETE /posts/1         # Delete post
```

#### Users
```http
GET    /users           # Get all users
GET    /users/1         # Get specific user
```

#### Comments
```http
GET    /comments              # Get all comments
GET    /posts/1/comments      # Get comments for post (nested)
GET    /comments?postId=1     # Get comments for post (query)
```

#### Todos
```http
GET    /todos                 # Get all todos
GET    /todos?userId=1        # Get todos by user
GET    /todos?completed=true  # Get completed todos
```

#### Albums & Photos
```http
GET    /albums                # Get all albums
GET    /albums/1/photos       # Get photos in album
```

## Getting Started

### 1. Run API Examples

```bash
# Run comprehensive API examples
npm run examples:api

# Or run directly
node run-api-examples.js
```

### 2. Run BDD API Tests

```bash
# Run all API tests
npm run test:api:jsonplaceholder

# Run smoke tests only
npm run test:api:smoke

# Run specific resource tests
npm run test:api:posts
npm run test:api:users
npm run test:api:comments
```

### 3. Manual API Testing

```typescript
import { JsonPlaceholderApiClient } from './src/applications/jsonplaceholder/api/JsonPlaceholderApiClient';

async function testApi() {
  const client = new JsonPlaceholderApiClient();
  await client.initialize();
  
  try {
    // Test basic GET
    const posts = await client.getAllPosts();
    console.log(`Retrieved ${posts.length} posts`);
    
    // Test POST
    const newPost = await client.createPost({
      title: 'My Test Post',
      body: 'This is test content',
      userId: 1
    });
    console.log(`Created post with ID: ${newPost.id}`);
    
  } finally {
    await client.dispose();
  }
}

testApi();
```

## Basic API Operations

### GET Requests

```typescript
// Get all resources
const posts = await apiClient.getAllPosts();
const users = await apiClient.getAllUsers();
const comments = await apiClient.getAllComments();

// Get specific resource
const post = await apiClient.getPostById(1);
const user = await apiClient.getUserById(1);

// Get with query parameters
const userPosts = await apiClient.getPostsByUserId(1);
const postComments = await apiClient.getCommentsByPostId(1);
const completedTodos = await apiClient.getCompletedTodos();
```

### POST Requests (Create)

```typescript
// Create new post
const postData = {
  title: 'New Post Title',
  body: 'Post content goes here',
  userId: 1
};
const createdPost = await apiClient.createPost(postData);
console.log(`Created post with ID: ${createdPost.id}`);
```

### PUT Requests (Complete Update)

```typescript
// Update entire post
const updateData = {
  id: 1,
  title: 'Updated Title',
  body: 'Updated content',
  userId: 1
};
const updatedPost = await apiClient.updatePost(1, updateData);
```

### PATCH Requests (Partial Update)

```typescript
// Update only specific fields
const patchData = {
  title: 'New Title Only'
};
const patchedPost = await apiClient.patchPost(1, patchData);
```

### DELETE Requests

```typescript
// Delete resource
const result = await apiClient.deletePost(1);
console.log('Post deleted successfully');
```

## Advanced Testing Scenarios

### 1. Data Validation

```typescript
import { ResponseValidators } from './src/applications/jsonplaceholder/models/ApiModels';

// Validate post structure
const post = await apiClient.getPostById(1);
const validation = ResponseValidators.validatePost(post);

if (validation.isValid) {
  console.log('✓ Post structure is valid');
} else {
  console.log('✗ Validation errors:', validation.errors);
}

// Validate user structure
const user = await apiClient.getUserById(1);
const userValidation = ResponseValidators.validateUser(user);
```

### 2. Performance Testing

```typescript
// Single request timing
const startTime = Date.now();
await apiClient.getAllPosts();
const responseTime = Date.now() - startTime;
console.log(`Response time: ${responseTime}ms`);

// Concurrent requests
const promises = [];
for (let i = 1; i <= 5; i++) {
  promises.push(apiClient.getPostById(i));
}
const results = await Promise.all(promises);
console.log(`Retrieved ${results.length} posts concurrently`);
```

### 3. Error Handling

```typescript
// Test non-existent resource
try {
  const post = await apiClient.getPostById(999);
} catch (error) {
  console.log('Expected error for non-existent post');
}

// Test invalid data
const emptyPosts = await apiClient.getPostsByUserId(999);
console.log(`Empty result: ${emptyPosts.length === 0}`);
```

### 4. Relationship Testing

```typescript
// Test user-posts relationship
const user = await apiClient.getUserById(1);
const userPosts = await apiClient.getPostsByUserId(1);
console.log(`User "${user.name}" has ${userPosts.length} posts`);

// Verify all posts belong to user
const allBelongToUser = userPosts.every(post => post.userId === 1);
console.log(`All posts belong to user: ${allBelongToUser}`);

// Test post-comments relationship
const post = await apiClient.getPostById(1);
const comments = await apiClient.getCommentsByPostId(1);
console.log(`Post has ${comments.length} comments`);
```

## BDD Feature Files

### Posts API Feature

```gherkin
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

  @post @positive
  Scenario: Create a new post successfully
    Given I have valid post data:
      | title  | Test Post Title                    |
      | body   | This is a test post body content   |
      | userId | 1                                  |
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post
```

### Users API Feature

```gherkin
@api @users @jsonplaceholder
Feature: JSONPlaceholder Users API Testing

  @smoke @get
  Scenario: Get all users successfully
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should contain 10 users
    And each user should have valid email format

  @validation
  Scenario: Validate user response structure
    When I send a GET request to "/users/1"
    Then the user should have complete address information
    And the user should have company information
```

## Step Definitions

Key step definitions for API testing:

```typescript
// Setup steps
Given('I have initialized the JSONPlaceholder API client', async function() {
  apiClient = new JsonPlaceholderApiClient();
  await apiClient.initialize();
});

// Request steps
When('I send a GET request to {string}', async function(endpoint: string) {
  // Handle different endpoints
  if (endpoint === '/posts') {
    lastResponse = await apiClient.getAllPosts();
  }
  // ... other endpoints
});

// Validation steps
Then('the response status should be {int}', async function(expectedStatus: number) {
  expect(lastResponseStatus).toBe(expectedStatus);
});

Then('the response should contain {int} posts', async function(expectedCount: number) {
  expect(lastResponse.length).toBe(expectedCount);
});
```

## Data Models and Validation

### TypeScript Interfaces

```typescript
// Post model
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// User model
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
```

### Response Validators

```typescript
// Validate post structure
export class ResponseValidators {
  static validatePost(post: any): ValidationResult {
    const errors: string[] = [];
    
    if (typeof post.id !== 'number') errors.push('Post ID must be a number');
    if (typeof post.title !== 'string') errors.push('Post title must be a string');
    // ... more validations
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}
```

### Test Data Templates

```typescript
export class TestDataTemplates {
  static createSamplePost(userId: number = 1): CreatePostRequest {
    return {
      title: 'Sample Test Post',
      body: 'This is a sample post for testing purposes.',
      userId: userId
    };
  }
  
  static createMultipleSamplePosts(count: number): CreatePostRequest[] {
    return Array.from({ length: count }, (_, i) => ({
      title: `Sample Post ${i + 1}`,
      body: `Content for post ${i + 1}`,
      userId: 1
    }));
  }
}
```

## Performance Testing

### Response Time Testing

```typescript
// Test single request performance
async function testResponseTime() {
  const startTime = Date.now();
  await apiClient.getAllPosts();
  const responseTime = Date.now() - startTime;
  
  expect(responseTime).toBeLessThan(2000); // Under 2 seconds
}

// Test concurrent requests
async function testConcurrentRequests() {
  const startTime = Date.now();
  const promises = Array.from({ length: 10 }, (_, i) => 
    apiClient.getPostById(i + 1)
  );
  
  await Promise.all(promises);
  const totalTime = Date.now() - startTime;
  
  expect(totalTime).toBeLessThan(5000); // All requests under 5 seconds
}
```

### Load Testing

```typescript
// Simulate load testing
async function loadTest() {
  const requests = 50;
  const concurrency = 10;
  const batches = Math.ceil(requests / concurrency);
  
  for (let batch = 0; batch < batches; batch++) {
    const batchPromises = [];
    
    for (let i = 0; i < concurrency && (batch * concurrency + i) < requests; i++) {
      batchPromises.push(apiClient.getAllPosts());
    }
    
    await Promise.all(batchPromises);
    console.log(`Completed batch ${batch + 1}/${batches}`);
  }
}
```

## Error Handling

### HTTP Status Code Testing

```typescript
// Test different status codes
const testCases = [
  { endpoint: '/posts/1', expectedStatus: 200 },
  { endpoint: '/posts/999', expectedStatus: 404 },
  { endpoint: '/invalid', expectedStatus: 404 }
];

for (const testCase of testCases) {
  try {
    const metadata = await apiClient.getResponseMetadata(testCase.endpoint);
    expect(metadata.status).toBe(testCase.expectedStatus);
  } catch (error) {
    // Handle expected errors
  }
}
```

### Boundary Value Testing

```typescript
// Test boundary values
const boundaryTests = [
  { userId: 0, description: 'Below minimum' },
  { userId: 1, description: 'Minimum valid' },
  { userId: 10, description: 'Maximum valid' },
  { userId: 11, description: 'Above maximum' }
];

for (const test of boundaryTests) {
  const posts = await apiClient.getPostsByUserId(test.userId);
  console.log(`${test.description}: ${posts.length} posts`);
}
```

## Best Practices

### 1. Test Organization

```
src/applications/jsonplaceholder/
├── api/                    # API client classes
├── features/              # BDD feature files
├── steps/                 # Step definitions
├── models/                # Data models and validators
├── data/                  # Test data and generators
└── examples/              # Usage examples
```

### 2. Error Handling

- Always use try-catch blocks for API calls
- Test both success and failure scenarios
- Validate response status codes
- Handle network timeouts and retries

### 3. Data Validation

- Validate response structure and data types
- Check required fields are present
- Verify data relationships and constraints
- Use TypeScript interfaces for type safety

### 4. Performance Considerations

- Test response times for critical endpoints
- Use concurrent requests for load testing
- Monitor memory usage during bulk operations
- Set appropriate timeouts for different operations

### 5. Test Data Management

- Use data generators for dynamic test data
- Create reusable test data templates
- Separate test data from test logic
- Clean up test data when necessary

### 6. Maintainability

- Use descriptive test names and scenarios
- Group related tests in feature files
- Create reusable step definitions
- Document API client methods and usage

## Running the Tests

### Command Line Options

```bash
# Run all API tests
npm run test:api:jsonplaceholder

# Run smoke tests only
npm run test:api:smoke

# Run specific feature
npm run test:api:posts
npm run test:api:users
npm run test:api:comments

# Run examples
npm run examples:api

# Run with specific tags
cucumber-js --tags "@smoke and @api"
cucumber-js --tags "@positive and @posts"
cucumber-js --tags "not @skip"
```

### Environment Variables

```bash
# Set timeout for API requests
export API_TIMEOUT=30000

# Enable debug logging
export DEBUG=true

# Set concurrent request limit
export CONCURRENT_LIMIT=10
```

## Troubleshooting

### Common Issues

1. **Network Connectivity**
   - Verify internet connection
   - Check firewall settings
   - Test API availability manually

2. **Timeout Errors**
   - Increase timeout values
   - Check network latency
   - Verify API server status

3. **Validation Failures**
   - Check API response format changes
   - Verify data type expectations
   - Update validation rules if needed

4. **Rate Limiting**
   - Add delays between requests
   - Implement retry logic
   - Use connection pooling

### Debug Tips

```typescript
// Enable detailed logging
logger.setLevel('debug');

// Log request/response details
console.log('Request:', endpoint, data);
console.log('Response:', response.status, response.body);

// Validate step by step
const validation = ResponseValidators.validatePost(post);
console.log('Validation result:', validation);
```

This comprehensive guide provides everything needed to implement and maintain robust RESTful API testing using the Playwright BDD TypeScript framework with JSONPlaceholder API examples.
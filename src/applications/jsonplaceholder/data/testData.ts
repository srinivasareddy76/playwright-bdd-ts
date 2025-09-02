/**
 * Test Data for JSONPlaceholder API Tests
 * 
 * This file contains test data, test scenarios, and data generators
 * for comprehensive API testing of the JSONPlaceholder service.
 */

import { CreatePostRequest, CreateCommentRequest, CreateTodoRequest, UpdatePostRequest, PatchPostRequest } from '../models/ApiModels';

/**
 * Static test data for API testing
 */
export class ApiTestData {
  
  // ==================== POST TEST DATA ====================
  
  /**
   * Valid post data for creation tests
   */
  static readonly validPostData: CreatePostRequest = {
    title: 'Test Post Title',
    body: 'This is a test post body content for API testing purposes. It contains meaningful text to validate the API functionality.',
    userId: 1
  };

  /**
   * Post data with special characters
   */
  static readonly postWithSpecialChars: CreatePostRequest = {
    title: 'Test Post with Special Characters: @#$%^&*()_+-=[]{}|;:,.<>?',
    body: 'Body with special chars: "quotes", \'apostrophes\', & ampersands, <tags>, and émojis 🚀',
    userId: 1
  };

  /**
   * Post data with very long content
   */
  static readonly longPostData: CreatePostRequest = {
    title: 'A'.repeat(200), // Very long title
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50), // Very long body
    userId: 1
  };

  /**
   * Post data with minimal content
   */
  static readonly minimalPostData: CreatePostRequest = {
    title: 'A',
    body: 'B',
    userId: 1
  };

  /**
   * Post data with empty strings
   */
  static readonly emptyPostData: CreatePostRequest = {
    title: '',
    body: '',
    userId: 1
  };

  /**
   * Update post data
   */
  static readonly updatePostData: UpdatePostRequest = {
    id: 1,
    title: 'Updated Test Post Title',
    body: 'This is an updated test post body content.',
    userId: 1
  };

  /**
   * Partial update post data
   */
  static readonly patchPostData: PatchPostRequest = {
    title: 'Partially Updated Title'
  };

  // ==================== COMMENT TEST DATA ====================

  /**
   * Valid comment data for creation tests
   */
  static readonly validCommentData: CreateCommentRequest = {
    postId: 1,
    name: 'Test Comment',
    email: 'test@example.com',
    body: 'This is a test comment body for API testing purposes.'
  };

  /**
   * Comment data with various email formats
   */
  static readonly commentEmailVariations = [
    {
      postId: 1,
      name: 'Valid Email Test',
      email: 'user@domain.com',
      body: 'Comment with standard email format'
    },
    {
      postId: 1,
      name: 'Subdomain Email Test',
      email: 'user@sub.domain.com',
      body: 'Comment with subdomain email format'
    },
    {
      postId: 1,
      name: 'Plus Email Test',
      email: 'user+tag@domain.com',
      body: 'Comment with plus sign in email'
    },
    {
      postId: 1,
      name: 'Dot Email Test',
      email: 'first.last@domain.com',
      body: 'Comment with dot in email'
    }
  ];

  // ==================== TODO TEST DATA ====================

  /**
   * Valid todo data for creation tests
   */
  static readonly validTodoData: CreateTodoRequest = {
    userId: 1,
    title: 'Test Todo Item',
    completed: false
  };

  /**
   * Completed todo data
   */
  static readonly completedTodoData: CreateTodoRequest = {
    userId: 1,
    title: 'Completed Test Todo',
    completed: true
  };

  /**
   * Todo data variations
   */
  static readonly todoVariations = [
    {
      userId: 1,
      title: 'Short todo',
      completed: false
    },
    {
      userId: 1,
      title: 'This is a very long todo item title that contains a lot of text to test how the API handles longer content',
      completed: true
    },
    {
      userId: 1,
      title: 'Todo with special chars: @#$%^&*()',
      completed: false
    }
  ];

  // ==================== USER TEST DATA ====================

  /**
   * Valid user IDs for testing
   */
  static readonly validUserIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /**
   * Invalid user IDs for negative testing
   */
  static readonly invalidUserIds = [0, -1, 999, 1000, 99999];

  /**
   * Edge case user IDs
   */
  static readonly edgeCaseUserIds = [
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    1.5, // Decimal
    NaN,
    Infinity,
    -Infinity
  ];

  // ==================== POST ID TEST DATA ====================

  /**
   * Valid post IDs (JSONPlaceholder has 100 posts)
   */
  static readonly validPostIds = [1, 2, 3, 4, 5, 50, 99, 100];

  /**
   * Invalid post IDs for negative testing
   */
  static readonly invalidPostIds = [0, -1, 101, 999, 1000];

  // ==================== QUERY PARAMETER TEST DATA ====================

  /**
   * Query parameter test cases
   */
  static readonly queryParamTests = {
    posts: [
      { userId: 1 },
      { userId: 2 },
      { userId: 10 },
      { userId: 999 }, // Invalid user
    ],
    comments: [
      { postId: 1 },
      { postId: 50 },
      { postId: 100 },
      { postId: 999 }, // Invalid post
    ],
    todos: [
      { userId: 1 },
      { userId: 1, completed: true },
      { userId: 1, completed: false },
      { completed: true },
      { completed: false }
    ]
  };

  // ==================== HTTP STATUS CODE TEST DATA ====================

  /**
   * Expected status codes for different operations
   */
  static readonly expectedStatusCodes = {
    GET: {
      success: 200,
      notFound: 404
    },
    POST: {
      created: 201,
      badRequest: 400
    },
    PUT: {
      success: 200,
      notFound: 404
    },
    PATCH: {
      success: 200,
      notFound: 404
    },
    DELETE: {
      success: 200,
      notFound: 404
    }
  };

  // ==================== PERFORMANCE TEST DATA ====================

  /**
   * Data for performance testing
   */
  static readonly performanceTestData = {
    bulkPostIds: Array.from({ length: 50 }, (_, i) => i + 1),
    bulkUserIds: Array.from({ length: 10 }, (_, i) => i + 1),
    concurrentRequests: 10,
    timeoutThreshold: 5000 // 5 seconds
  };

  // ==================== DATA GENERATORS ====================

  /**
   * Generate random post data
   */
  static generateRandomPost(userId: number = 1): CreatePostRequest {
    const titles = [
      'Random Test Post',
      'Generated Post Title',
      'Automated Test Content',
      'Sample API Post',
      'Dynamic Test Data'
    ];

    const bodies = [
      'This is randomly generated post content for testing.',
      'Automated test data generated for API validation.',
      'Sample post body created dynamically for testing purposes.',
      'Generated content to test API functionality.',
      'Random test data for comprehensive API testing.'
    ];

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)],
      userId: userId
    };
  }

  /**
   * Generate random comment data
   */
  static generateRandomComment(postId: number = 1): CreateCommentRequest {
    const names = ['John Doe', 'Jane Smith', 'Test User', 'API Tester', 'Random Commenter'];
    const domains = ['example.com', 'test.org', 'sample.net', 'demo.io'];
    const bodies = [
      'This is a randomly generated comment.',
      'Automated comment for testing purposes.',
      'Sample comment content for API validation.',
      'Generated comment to test functionality.',
      'Random comment data for testing.'
    ];

    const name = names[Math.floor(Math.random() * names.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${name.toLowerCase().replace(' ', '.')}@${domain}`;

    return {
      postId: postId,
      name: name,
      email: email,
      body: bodies[Math.floor(Math.random() * bodies.length)]
    };
  }

  /**
   * Generate random todo data
   */
  static generateRandomTodo(userId: number = 1): CreateTodoRequest {
    const titles = [
      'Complete random task',
      'Test todo item',
      'Generated todo',
      'Sample task',
      'Automated todo'
    ];

    return {
      userId: userId,
      title: titles[Math.floor(Math.random() * titles.length)],
      completed: Math.random() < 0.5 // Random boolean
    };
  }

  /**
   * Generate bulk test data
   */
  static generateBulkPosts(count: number, userId: number = 1): CreatePostRequest[] {
    return Array.from({ length: count }, (_, index) => ({
      title: `Bulk Test Post ${index + 1}`,
      body: `This is bulk test post number ${index + 1} generated for testing purposes.`,
      userId: userId
    }));
  }

  // ==================== VALIDATION TEST DATA ====================

  /**
   * Data for testing field validation
   */
  static readonly validationTestCases = {
    posts: {
      missingTitle: { body: 'Body without title', userId: 1 },
      missingBody: { title: 'Title without body', userId: 1 },
      missingUserId: { title: 'Title', body: 'Body' },
      nullValues: { title: null, body: null, userId: null },
      undefinedValues: { title: undefined, body: undefined, userId: undefined },
      wrongTypes: { title: 123, body: true, userId: 'string' }
    },
    comments: {
      missingPostId: { name: 'Name', email: 'email@test.com', body: 'Body' },
      invalidEmail: { postId: 1, name: 'Name', email: 'invalid-email', body: 'Body' },
      missingEmail: { postId: 1, name: 'Name', body: 'Body' },
      emptyName: { postId: 1, name: '', email: 'email@test.com', body: 'Body' }
    }
  };

  // ==================== BOUNDARY TEST DATA ====================

  /**
   * Boundary value test cases
   */
  static readonly boundaryTestCases = {
    userIds: {
      minimum: 1,
      maximum: 10,
      belowMinimum: 0,
      aboveMaximum: 11
    },
    postIds: {
      minimum: 1,
      maximum: 100,
      belowMinimum: 0,
      aboveMaximum: 101
    },
    stringLengths: {
      empty: '',
      single: 'A',
      normal: 'Normal length string for testing',
      long: 'A'.repeat(1000),
      veryLong: 'A'.repeat(10000)
    }
  };
}
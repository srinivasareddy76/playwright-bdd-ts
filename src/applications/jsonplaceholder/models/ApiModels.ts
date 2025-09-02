/**
 * Data Models for JSONPlaceholder API
 * 
 * These interfaces define the structure of data returned by the JSONPlaceholder API.
 * They provide type safety and better IDE support for API responses.
 */

/**
 * User model representing a user in the system
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
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

/**
 * Post model representing a blog post
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Comment model representing a comment on a post
 */
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

/**
 * Album model representing a photo album
 */
export interface Album {
  userId: number;
  id: number;
  title: string;
}

/**
 * Photo model representing a photo in an album
 */
export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

/**
 * Todo model representing a todo item
 */
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

/**
 * API Response wrapper for consistent response handling
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timestamp: Date;
}

/**
 * Error response model for API errors
 */
export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  timestamp: Date;
  endpoint: string;
}

/**
 * Request payload for creating a new post
 */
export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

/**
 * Request payload for updating a post
 */
export interface UpdatePostRequest {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/**
 * Request payload for partially updating a post
 */
export interface PatchPostRequest {
  title?: string;
  body?: string;
  userId?: number;
}

/**
 * Request payload for creating a new comment
 */
export interface CreateCommentRequest {
  postId: number;
  name: string;
  email: string;
  body: string;
}

/**
 * Request payload for creating a new todo
 */
export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

/**
 * Query parameters for filtering posts
 */
export interface PostQueryParams {
  userId?: number;
  id?: number;
  title?: string;
}

/**
 * Query parameters for filtering comments
 */
export interface CommentQueryParams {
  postId?: number;
  id?: number;
  name?: string;
  email?: string;
}

/**
 * Query parameters for filtering todos
 */
export interface TodoQueryParams {
  userId?: number;
  id?: number;
  completed?: boolean;
}

/**
 * Query parameters for filtering albums
 */
export interface AlbumQueryParams {
  userId?: number;
  id?: number;
  title?: string;
}

/**
 * Query parameters for filtering photos
 */
export interface PhotoQueryParams {
  albumId?: number;
  id?: number;
  title?: string;
}

/**
 * Validation result for API responses
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * API endpoint configuration
 */
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  expectedStatus: number;
  requiresAuth: boolean;
}

/**
 * Test data templates for creating test objects
 */
export class TestDataTemplates {
  /**
   * Create a sample post for testing
   */
  static createSamplePost(userId: number = 1): CreatePostRequest {
    return {
      title: 'Sample Test Post',
      body: 'This is a sample post created for testing purposes. It contains test data to validate API functionality.',
      userId: userId
    };
  }

  /**
   * Create a sample comment for testing
   */
  static createSampleComment(postId: number = 1): CreateCommentRequest {
    return {
      postId: postId,
      name: 'Test Comment',
      email: 'test@example.com',
      body: 'This is a sample comment created for testing purposes.'
    };
  }

  /**
   * Create a sample todo for testing
   */
  static createSampleTodo(userId: number = 1): CreateTodoRequest {
    return {
      userId: userId,
      title: 'Sample Test Todo',
      completed: false
    };
  }

  /**
   * Create multiple sample posts for bulk testing
   */
  static createMultipleSamplePosts(count: number, userId: number = 1): CreatePostRequest[] {
    const posts: CreatePostRequest[] = [];
    
    for (let i = 1; i <= count; i++) {
      posts.push({
        title: `Sample Test Post ${i}`,
        body: `This is sample post number ${i} created for bulk testing purposes.`,
        userId: userId
      });
    }
    
    return posts;
  }

  /**
   * Create sample data for different user scenarios
   */
  static createUserScenarioData() {
    return {
      validUser: { userId: 1 },
      invalidUser: { userId: 999 },
      edgeCaseUser: { userId: 0 },
      negativeUser: { userId: -1 }
    };
  }
}

/**
 * API response validators
 */
export class ResponseValidators {
  /**
   * Validate post response structure
   */
  static validatePost(post: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!post) {
      errors.push('Post object is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (typeof post.id !== 'number') errors.push('Post ID must be a number');
    if (typeof post.userId !== 'number') errors.push('User ID must be a number');
    if (typeof post.title !== 'string') errors.push('Post title must be a string');
    if (typeof post.body !== 'string') errors.push('Post body must be a string');

    if (post.title && post.title.length === 0) warnings.push('Post title is empty');
    if (post.body && post.body.length === 0) warnings.push('Post body is empty');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate user response structure
   */
  static validateUser(user: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!user) {
      errors.push('User object is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (typeof user.id !== 'number') errors.push('User ID must be a number');
    if (typeof user.name !== 'string') errors.push('User name must be a string');
    if (typeof user.username !== 'string') errors.push('Username must be a string');
    if (typeof user.email !== 'string') errors.push('User email must be a string');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.email && !emailRegex.test(user.email)) {
      warnings.push('User email format appears invalid');
    }

    // Validate address structure
    if (user.address) {
      if (typeof user.address.street !== 'string') errors.push('Address street must be a string');
      if (typeof user.address.city !== 'string') errors.push('Address city must be a string');
      if (typeof user.address.zipcode !== 'string') errors.push('Address zipcode must be a string');
    } else {
      errors.push('User address is missing');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate comment response structure
   */
  static validateComment(comment: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!comment) {
      errors.push('Comment object is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (typeof comment.id !== 'number') errors.push('Comment ID must be a number');
    if (typeof comment.postId !== 'number') errors.push('Post ID must be a number');
    if (typeof comment.name !== 'string') errors.push('Comment name must be a string');
    if (typeof comment.email !== 'string') errors.push('Comment email must be a string');
    if (typeof comment.body !== 'string') errors.push('Comment body must be a string');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (comment.email && !emailRegex.test(comment.email)) {
      warnings.push('Comment email format appears invalid');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate todo response structure
   */
  static validateTodo(todo: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!todo) {
      errors.push('Todo object is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (typeof todo.id !== 'number') errors.push('Todo ID must be a number');
    if (typeof todo.userId !== 'number') errors.push('User ID must be a number');
    if (typeof todo.title !== 'string') errors.push('Todo title must be a string');
    if (typeof todo.completed !== 'boolean') errors.push('Todo completed must be a boolean');

    if (todo.title && todo.title.length === 0) warnings.push('Todo title is empty');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
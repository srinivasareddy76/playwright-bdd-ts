import { APIRequestContext, request } from '@playwright/test';
import { logger } from '../../../utils/logger';

/**
 * JSONPlaceholder API Client for RESTful API Testing
 * 
 * This client provides methods to interact with the JSONPlaceholder API
 * which is a free fake REST API for testing and prototyping.
 * 
 * Base URL: https://jsonplaceholder.typicode.com
 * 
 * Available Resources:
 * - Posts (100 items)
 * - Comments (500 items) 
 * - Albums (100 items)
 * - Photos (5000 items)
 * - Todos (200 items)
 * - Users (10 items)
 */
export class JsonPlaceholderApiClient {
  private context: APIRequestContext | null = null;
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private readonly defaultHeaders = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
    'User-Agent': 'Playwright-BDD-Framework/1.0'
  };

  /**
   * Initialize the API client context
   */
  async initialize(): Promise<void> {
    if (this.context) {
      return; // Already initialized
    }

    logger.info('Initializing JSONPlaceholder API client');
    
    this.context = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: this.defaultHeaders,
      timeout: 30000
    });

    logger.info(`JSONPlaceholder API client initialized with base URL: ${this.baseUrl}`);
  }

  /**
   * Dispose the API client context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
      logger.info('JSONPlaceholder API client disposed');
    }
  }

  /**
   * Ensure the client is initialized before making requests
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.context) {
      await this.initialize();
    }
  }

  // ==================== POSTS API ====================

  /**
   * Get all posts
   * @returns Promise<any[]> Array of all posts
   */
  async getAllPosts(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /posts - Fetching all posts');
    
    const response = await this.context!.get('/posts');
    const posts = await response.json();
    
    logger.info(`Retrieved ${posts.length} posts`);
    return posts;
  }

  /**
   * Get a specific post by ID
   * @param postId - The ID of the post to retrieve
   * @returns Promise<any> The post object
   */
  async getPostById(postId: number): Promise<any> {
    await this.ensureInitialized();
    logger.info(`GET /posts/${postId} - Fetching post by ID`);
    
    const response = await this.context!.get(`/posts/${postId}`);
    const post = await response.json();
    
    logger.info(`Retrieved post: ${post.title}`);
    return post;
  }

  /**
   * Get posts by user ID
   * @param userId - The ID of the user whose posts to retrieve
   * @returns Promise<any[]> Array of posts by the user
   */
  async getPostsByUserId(userId: number): Promise<any[]> {
    await this.ensureInitialized();
    logger.info(`GET /posts?userId=${userId} - Fetching posts by user ID`);
    
    const response = await this.context!.get(`/posts?userId=${userId}`);
    const posts = await response.json();
    
    logger.info(`Retrieved ${posts.length} posts for user ${userId}`);
    return posts;
  }

  /**
   * Create a new post
   * @param postData - The post data to create
   * @returns Promise<any> The created post object
   */
  async createPost(postData: {
    title: string;
    body: string;
    userId: number;
  }): Promise<any> {
    await this.ensureInitialized();
    logger.info('POST /posts - Creating new post');
    
    const response = await this.context!.post('/posts', {
      data: JSON.stringify(postData)
    });
    
    const createdPost = await response.json();
    logger.info(`Created post with ID: ${createdPost.id}`);
    return createdPost;
  }

  /**
   * Update a post using PUT (complete replacement)
   * @param postId - The ID of the post to update
   * @param postData - The complete post data
   * @returns Promise<any> The updated post object
   */
  async updatePost(postId: number, postData: {
    id: number;
    title: string;
    body: string;
    userId: number;
  }): Promise<any> {
    await this.ensureInitialized();
    logger.info(`PUT /posts/${postId} - Updating post`);
    
    const response = await this.context!.put(`/posts/${postId}`, {
      data: JSON.stringify(postData)
    });
    
    const updatedPost = await response.json();
    logger.info(`Updated post: ${updatedPost.title}`);
    return updatedPost;
  }

  /**
   * Partially update a post using PATCH
   * @param postId - The ID of the post to update
   * @param partialData - Partial post data to update
   * @returns Promise<any> The updated post object
   */
  async patchPost(postId: number, partialData: Partial<{
    title: string;
    body: string;
    userId: number;
  }>): Promise<any> {
    await this.ensureInitialized();
    logger.info(`PATCH /posts/${postId} - Partially updating post`);
    
    const response = await this.context!.patch(`/posts/${postId}`, {
      data: JSON.stringify(partialData)
    });
    
    const updatedPost = await response.json();
    logger.info(`Patched post: ${updatedPost.title}`);
    return updatedPost;
  }

  /**
   * Delete a post
   * @param postId - The ID of the post to delete
   * @returns Promise<any> Empty response object
   */
  async deletePost(postId: number): Promise<any> {
    await this.ensureInitialized();
    logger.info(`DELETE /posts/${postId} - Deleting post`);
    
    const response = await this.context!.delete(`/posts/${postId}`);
    const result = await response.json();
    
    logger.info(`Deleted post with ID: ${postId}`);
    return result;
  }

  // ==================== COMMENTS API ====================

  /**
   * Get all comments
   * @returns Promise<any[]> Array of all comments
   */
  async getAllComments(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /comments - Fetching all comments');
    
    const response = await this.context!.get('/comments');
    const comments = await response.json();
    
    logger.info(`Retrieved ${comments.length} comments`);
    return comments;
  }

  /**
   * Get comments for a specific post
   * @param postId - The ID of the post
   * @returns Promise<any[]> Array of comments for the post
   */
  async getCommentsByPostId(postId: number): Promise<any[]> {
    await this.ensureInitialized();
    logger.info(`GET /posts/${postId}/comments - Fetching comments for post`);
    
    const response = await this.context!.get(`/posts/${postId}/comments`);
    const comments = await response.json();
    
    logger.info(`Retrieved ${comments.length} comments for post ${postId}`);
    return comments;
  }

  /**
   * Get comments by post ID using query parameter
   * @param postId - The ID of the post
   * @returns Promise<any[]> Array of comments for the post
   */
  async getCommentsByPostIdQuery(postId: number): Promise<any[]> {
    await this.ensureInitialized();
    logger.info(`GET /comments?postId=${postId} - Fetching comments by query`);
    
    const response = await this.context!.get(`/comments?postId=${postId}`);
    const comments = await response.json();
    
    logger.info(`Retrieved ${comments.length} comments for post ${postId}`);
    return comments;
  }

  // ==================== USERS API ====================

  /**
   * Get all users
   * @returns Promise<any[]> Array of all users
   */
  async getAllUsers(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /users - Fetching all users');
    
    const response = await this.context!.get('/users');
    const users = await response.json();
    
    logger.info(`Retrieved ${users.length} users`);
    return users;
  }

  /**
   * Get a specific user by ID
   * @param userId - The ID of the user to retrieve
   * @returns Promise<any> The user object
   */
  async getUserById(userId: number): Promise<any> {
    await this.ensureInitialized();
    logger.info(`GET /users/${userId} - Fetching user by ID`);
    
    const response = await this.context!.get(`/users/${userId}`);
    const user = await response.json();
    
    logger.info(`Retrieved user: ${user.name}`);
    return user;
  }

  // ==================== TODOS API ====================

  /**
   * Get all todos
   * @returns Promise<any[]> Array of all todos
   */
  async getAllTodos(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /todos - Fetching all todos');
    
    const response = await this.context!.get('/todos');
    const todos = await response.json();
    
    logger.info(`Retrieved ${todos.length} todos`);
    return todos;
  }

  /**
   * Get todos by user ID
   * @param userId - The ID of the user whose todos to retrieve
   * @returns Promise<any[]> Array of todos for the user
   */
  async getTodosByUserId(userId: number): Promise<any[]> {
    await this.ensureInitialized();
    logger.info(`GET /todos?userId=${userId} - Fetching todos by user ID`);
    
    const response = await this.context!.get(`/todos?userId=${userId}`);
    const todos = await response.json();
    
    logger.info(`Retrieved ${todos.length} todos for user ${userId}`);
    return todos;
  }

  /**
   * Get completed todos
   * @returns Promise<any[]> Array of completed todos
   */
  async getCompletedTodos(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /todos?completed=true - Fetching completed todos');
    
    const response = await this.context!.get('/todos?completed=true');
    const todos = await response.json();
    
    logger.info(`Retrieved ${todos.length} completed todos`);
    return todos;
  }

  // ==================== ALBUMS API ====================

  /**
   * Get all albums
   * @returns Promise<any[]> Array of all albums
   */
  async getAllAlbums(): Promise<any[]> {
    await this.ensureInitialized();
    logger.info('GET /albums - Fetching all albums');
    
    const response = await this.context!.get('/albums');
    const albums = await response.json();
    
    logger.info(`Retrieved ${albums.length} albums`);
    return albums;
  }

  /**
   * Get photos for a specific album
   * @param albumId - The ID of the album
   * @returns Promise<any[]> Array of photos in the album
   */
  async getPhotosByAlbumId(albumId: number): Promise<any[]> {
    await this.ensureInitialized();
    logger.info(`GET /albums/${albumId}/photos - Fetching photos for album`);
    
    const response = await this.context!.get(`/albums/${albumId}/photos`);
    const photos = await response.json();
    
    logger.info(`Retrieved ${photos.length} photos for album ${albumId}`);
    return photos;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get response status and headers for any endpoint
   * @param endpoint - The API endpoint to test
   * @returns Promise<{status: number, headers: any}> Response metadata
   */
  async getResponseMetadata(endpoint: string): Promise<{
    status: number;
    statusText: string;
    headers: any;
  }> {
    await this.ensureInitialized();
    logger.info(`GET ${endpoint} - Getting response metadata`);
    
    const response = await this.context!.get(endpoint);
    
    const metadata = {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers()
    };
    
    logger.info(`Response metadata: ${metadata.status} ${metadata.statusText}`);
    return metadata;
  }

  /**
   * Test API endpoint availability
   * @param endpoint - The endpoint to test
   * @returns Promise<boolean> True if endpoint is available
   */
  async isEndpointAvailable(endpoint: string): Promise<boolean> {
    try {
      const metadata = await this.getResponseMetadata(endpoint);
      return metadata.status >= 200 && metadata.status < 400;
    } catch (error) {
      logger.error(`Endpoint ${endpoint} is not available: ${error}`);
      return false;
    }
  }

  /**
   * Validate JSON response structure
   * @param data - The response data to validate
   * @param expectedKeys - Array of expected keys in the response
   * @returns boolean True if all expected keys are present
   */
  validateResponseStructure(data: any, expectedKeys: string[]): boolean {
    if (!data || typeof data !== 'object') {
      logger.error('Response data is not a valid object');
      return false;
    }

    const missingKeys = expectedKeys.filter(key => !(key in data));
    
    if (missingKeys.length > 0) {
      logger.error(`Missing keys in response: ${missingKeys.join(', ')}`);
      return false;
    }

    logger.info('Response structure validation passed');
    return true;
  }

  /**
   * Validate array response
   * @param data - The response data to validate
   * @param expectedLength - Expected minimum length of array
   * @returns boolean True if validation passes
   */
  validateArrayResponse(data: any, expectedLength?: number): boolean {
    if (!Array.isArray(data)) {
      logger.error('Response data is not an array');
      return false;
    }

    if (expectedLength !== undefined && data.length < expectedLength) {
      logger.error(`Array length ${data.length} is less than expected ${expectedLength}`);
      return false;
    }

    logger.info(`Array response validation passed. Length: ${data.length}`);
    return true;
  }
}
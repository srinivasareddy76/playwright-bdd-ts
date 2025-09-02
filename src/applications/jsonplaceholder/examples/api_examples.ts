/**
 * Comprehensive RESTful API Testing Examples
 * 
 * This file demonstrates various API testing scenarios using the JSONPlaceholder API.
 * It showcases different HTTP methods, validation techniques, error handling,
 * and performance testing approaches.
 */

import { JsonPlaceholderApiClient } from '../api/JsonPlaceholderApiClient';
import { TestDataTemplates } from '../models/ApiModels';
import { logger } from '../../../utils/logger';

/**
 * Main class demonstrating comprehensive API testing examples
 */
export class ApiTestingExamples {
  private apiClient: JsonPlaceholderApiClient;

  constructor() {
    this.apiClient = new JsonPlaceholderApiClient();
  }

  /**
   * Initialize the API client
   */
  async initialize(): Promise<void> {
    await this.apiClient.initialize();
    logger.info('API Testing Examples initialized');
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.apiClient.dispose();
    logger.info('API Testing Examples cleaned up');
  }

  /**
   * Example 1: Basic GET Requests
   */
  async basicGetExamples(): Promise<void> {
    logger.info('=== Basic GET Request Examples ===');

    try {
      // Get all posts
      console.log('\n1. Getting all posts...');
      const allPosts = await this.apiClient.getAllPosts();
      console.log(`✓ Retrieved ${allPosts.length} posts`);
      console.log(`First post: ${allPosts[0].title}`);

      // Get specific post
      console.log('\n2. Getting specific post...');
      const post = await this.apiClient.getPostById(1);
      console.log(`✓ Retrieved post: "${post.title}"`);
      console.log(`Post body preview: ${post.body.substring(0, 50)}...`);

      // Get posts by user
      console.log('\n3. Getting posts by user...');
      const userPosts = await this.apiClient.getPostsByUserId(1);
      console.log(`✓ User 1 has ${userPosts.length} posts`);

      // Get all users
      console.log('\n4. Getting all users...');
      const users = await this.apiClient.getAllUsers();
      console.log(`✓ Retrieved ${users.length} users`);
      console.log(`First user: ${users[0].name} (${users[0].email})`);

    } catch (error) {
      logger.error(`Basic GET examples failed: ${error}`);
    }
  }

  /**
   * Example 2: CRUD Operations
   */
  async crudOperationsExample(): Promise<void> {
    logger.info('=== CRUD Operations Examples ===');

    try {
      // CREATE - Post a new post
      console.log('\n1. Creating a new post...');
      const newPostData = TestDataTemplates.createSamplePost(1);
      const createdPost = await this.apiClient.createPost(newPostData);
      console.log(`✓ Created post with ID: ${createdPost.id}`);
      console.log(`Created post title: "${createdPost.title}"`);

      // READ - Get the created post (simulated since JSONPlaceholder doesn't persist)
      console.log('\n2. Reading the created post...');
      const readPost = await this.apiClient.getPostById(1); // Using existing post for demo
      console.log(`✓ Read post: "${readPost.title}"`);

      // UPDATE - Update the post completely
      console.log('\n3. Updating the post (PUT)...');
      const updateData = {
        id: 1,
        title: 'Updated Post Title',
        body: 'This post has been updated with new content.',
        userId: 1
      };
      const updatedPost = await this.apiClient.updatePost(1, updateData);
      console.log(`✓ Updated post title: "${updatedPost.title}"`);

      // PATCH - Partially update the post
      console.log('\n4. Partially updating the post (PATCH)...');
      const patchData = { title: 'Partially Updated Title' };
      const patchedPost = await this.apiClient.patchPost(1, patchData);
      console.log(`✓ Patched post title: "${patchedPost.title}"`);

      // DELETE - Delete the post
      console.log('\n5. Deleting the post...');
      await this.apiClient.deletePost(1);
      console.log('✓ Post deleted successfully');

    } catch (error) {
      logger.error(`CRUD operations example failed: ${error}`);
    }
  }

  /**
   * Run all examples
   */
  async runAllExamples(): Promise<void> {
    console.log('🚀 Starting Comprehensive API Testing Examples');
    console.log('================================================');

    await this.initialize();

    try {
      await this.basicGetExamples();
      await this.crudOperationsExample();

      console.log('\n🎉 All API testing examples completed successfully!');
      console.log('================================================');

    } catch (error) {
      console.error('❌ API testing examples failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

/**
 * Utility function to run the examples
 */
export async function runApiExamples(): Promise<void> {
  const examples = new ApiTestingExamples();
  await examples.runAllExamples();
}

// Export for direct execution
if (require.main === module) {
  runApiExamples().catch(console.error);
}
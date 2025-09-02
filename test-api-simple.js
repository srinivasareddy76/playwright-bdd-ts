#!/usr/bin/env node

/**
 * Simple API Test
 * 
 * This script tests the API client directly without BDD framework
 */

const { JsonPlaceholderApiClient } = require('./dist/src/applications/jsonplaceholder/api/JsonPlaceholderApiClient');

async function runSimpleApiTest() {
  console.log('🧪 Running Simple API Test...');
  console.log('==============================');

  const client = new JsonPlaceholderApiClient();
  
  try {
    // Initialize client
    console.log('📡 Initializing API client...');
    await client.initialize();
    console.log('✅ API client initialized');

    // Test GET all posts
    console.log('\n📋 Testing GET all posts...');
    const posts = await client.getAllPosts();
    console.log(`✅ Retrieved ${posts.length} posts`);
    console.log(`   First post: "${posts[0].title}"`);

    // Test GET specific post
    console.log('\n📄 Testing GET specific post...');
    const post = await client.getPostById(1);
    console.log(`✅ Retrieved post: "${post.title}"`);

    // Test GET users
    console.log('\n👥 Testing GET all users...');
    const users = await client.getAllUsers();
    console.log(`✅ Retrieved ${users.length} users`);
    console.log(`   First user: ${users[0].name} (${users[0].email})`);

    // Test POST create post
    console.log('\n📝 Testing POST create post...');
    const newPost = await client.createPost({
      title: 'Test Post from Simple Test',
      body: 'This is a test post created by the simple API test.',
      userId: 1
    });
    console.log(`✅ Created post with ID: ${newPost.id}`);
    console.log(`   Title: "${newPost.title}"`);

    // Test PUT update post
    console.log('\n✏️  Testing PUT update post...');
    const updatedPost = await client.updatePost(1, {
      id: 1,
      title: 'Updated Post Title',
      body: 'This post has been updated.',
      userId: 1
    });
    console.log(`✅ Updated post: "${updatedPost.title}"`);

    // Test PATCH partial update
    console.log('\n🔧 Testing PATCH partial update...');
    const patchedPost = await client.patchPost(1, {
      title: 'Patched Title Only'
    });
    console.log(`✅ Patched post: "${patchedPost.title}"`);

    // Test DELETE
    console.log('\n🗑️  Testing DELETE post...');
    await client.deletePost(1);
    console.log('✅ Post deleted successfully');

    // Test error handling
    console.log('\n❌ Testing error handling (non-existent post)...');
    try {
      await client.getPostById(999);
      console.log('❌ Expected error but got response');
    } catch (error) {
      console.log('✅ Correctly handled non-existent post error');
    }

    console.log('\n🎉 All API tests passed successfully!');
    console.log('====================================');

  } catch (error) {
    console.error('❌ API test failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    await client.dispose();
    console.log('🧹 API client disposed');
  }
}

// Run the test
runSimpleApiTest().catch(console.error);
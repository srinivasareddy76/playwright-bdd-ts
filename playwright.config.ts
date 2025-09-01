/**
 * Playwright Configuration File
 * 
 * This file configures Playwright test runner settings for the BDD framework.
 * It integrates with the custom configuration loader to support multiple environments
 * and provides comprehensive test execution settings.
 * 
 * Key Features:
 * - Multi-browser support (Chromium, Firefox, WebKit)
 * - Environment-specific configuration loading
 * - Comprehensive reporting (HTML, JSON, JUnit)
 * - Retry and parallelization settings
 * - Screenshot and video capture on failures
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './config';

// Load environment-specific configuration
const config = loadConfig();

/**
 * Playwright configuration object with BDD framework optimizations
 */
export default defineConfig({
  /** Directory containing test features */
  testDir: './features',
  
  /** Enable full parallelization for faster test execution */
  fullyParallel: true,
  
  /** Prevent .only() calls in CI environment */
  forbidOnly: !!process.env.CI,
  
  /** Retry failed tests in CI, no retries locally for faster feedback */
  retries: process.env.CI ? 2 : 0,
  
  /** Limit workers in CI to prevent resource exhaustion */
  workers: process.env.CI ? 1 : undefined,
  
  /** Multiple reporters for comprehensive test reporting */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  /** Global test configuration */
  use: {
    /** Base URL from environment configuration */
    baseURL: config.app.baseUrl,
    
    /** Enable tracing on first retry for debugging */
    trace: 'on-first-retry',
    
    /** Capture screenshots only on test failures */
    screenshot: 'only-on-failure',
    
    /** Record videos only when tests fail */
    video: 'retain-on-failure',
    
    /** Timeout for individual actions (30 seconds) */
    actionTimeout: 30000,
    
    /** Timeout for page navigation (60 seconds) */
    navigationTimeout: 60000,
  },
  
  /** Browser projects for cross-browser testing */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  /** Web server configuration (disabled for this framework) */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'echo "No local server needed for this framework"',
        port: 3000,
        reuseExistingServer: !process.env.CI,
      },
});
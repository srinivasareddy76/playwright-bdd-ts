/**
 * SauceDemo Login Page Object
 * 
 * This page object class encapsulates all interactions with the SauceDemo
 * login page. It extends BasePage and provides specific methods for testing
 * the SauceDemo application's authentication functionality.
 * 
 * Key Features:
 * - Login form interaction methods
 * - User authentication validation
 * - Error message handling
 * - Support for different user types (standard, locked, problem, etc.)
 * - Performance measurement utilities
 * - Visual testing support
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';
import { logger } from '../../../utils/logger';

/**
 * Page object class for SauceDemo login page interactions
 * Provides comprehensive methods for testing authentication scenarios
 */
export class SauceDemoLoginPage extends BasePage {
  /** CSS selectors for page elements */
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '.error-button',
    loginContainer: '.login_container',
    loginForm: '.login-box',
    loginLogo: '.login_logo',
    inventoryContainer: '.inventory_container',
    menuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    cartIcon: '.shopping_cart_link',
    productTitle: '.title'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the SauceDemo login page
   * @param baseUrl - Optional base URL, defaults to https://saucedemo.com
   */
  async goto(baseUrl?: string): Promise<void> {
    const url = baseUrl || 'https://saucedemo.com';
    logger.info(`Navigating to SauceDemo login page: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.waitForLoginForm();
  }

  /**
   * Waits for the login form to be fully loaded and visible
   */
  async waitForLoginForm(): Promise<void> {
    await this.page.waitForSelector(this.selectors.loginContainer, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.usernameInput, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.passwordInput, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.loginButton, { state: 'visible' });
  }

  /**
   * Enters username into the username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.page.locator(this.selectors.usernameInput).clear();
    await this.page.locator(this.selectors.usernameInput).fill(username);
  }

  /**
   * Enters password into the password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.page.locator(this.selectors.passwordInput).clear();
    await this.page.locator(this.selectors.passwordInput).fill(password);
  }

  /**
   * Clicks the login button and waits for navigation or error
   * @param timeout - Optional timeout in milliseconds (default: 10000 for performance users)
   */
  async clickLoginButton(timeout: number = 10000): Promise<void> {
    logger.info('Clicking login button');
    await this.click(this.selectors.loginButton);
    
    // Wait for either success (inventory page) or error message
    await Promise.race([
      this.page.waitForSelector(this.selectors.inventoryContainer, { timeout }).catch(() => null),
      this.page.waitForSelector(this.selectors.errorMessage, { timeout }).catch(() => null)
    ]);
  }

  /**
   * Performs complete login flow with username and password
   * @param username - Username for login
   * @param password - Password for login
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    
    // Use longer timeout for performance_glitch_user
    const timeout = username.includes('performance_glitch') ? 15000 : 10000;
    await this.clickLoginButton(timeout);
  }

  /**
   * Performs logout by opening menu and clicking logout link
   */
  async logout(): Promise<void> {
    logger.info('Logging out');
    
    // Open the menu
    await this.click(this.selectors.menuButton);
    
    // Wait for menu to open and click logout
    await this.page.waitForSelector(this.selectors.logoutLink, { state: 'visible', timeout: 10000 });
    await this.click(this.selectors.logoutLink);
    
    // Wait for login form to appear with longer timeout
    try {
      await this.page.waitForSelector(this.selectors.loginContainer, { state: 'visible', timeout: 10000 });
    } catch (error) {
      logger.warn('Login form not visible after logout, but continuing...');
    }
    
    logger.info('Logged out from SauceDemo application');
  }

  // ==================== Validation Methods ====================

  /**
   * Checks if the login form is visible
   * @returns True if login form is visible, false otherwise
   */
  async isLoginFormVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.loginContainer, { state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if user is logged in by verifying inventory page
   * @returns True if logged in, false otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.inventoryContainer, { state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if the login button is enabled
   * @returns True if login button is enabled, false otherwise
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.page.locator(this.selectors.loginButton);
    return await button.isEnabled();
  }

  /**
   * Checks if a login error message is displayed
   * @returns True if error message is visible, false otherwise
   */
  async hasLoginError(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.errorMessage, { state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the text of the login error message
   * @returns Error message text or empty string
   */
  async getLoginErrorMessage(): Promise<string> {
    const errorElement = this.page.locator(this.selectors.errorMessage);
    return await errorElement.textContent() || '';
  }

  /**
   * Gets the current value of the username field
   * @returns Username field value
   */
  async getUsername(): Promise<string> {
    return await this.page.locator(this.selectors.usernameInput).inputValue();
  }

  /**
   * Gets the current value of the password field
   * @returns Password field value
   */
  async getPassword(): Promise<string> {
    return await this.page.locator(this.selectors.passwordInput).inputValue();
  }

  /**
   * Clears the error message by clicking the error button
   */
  async clearErrorMessage(): Promise<void> {
    if (await this.hasLoginError()) {
      await this.click(this.selectors.errorButton);
    }
  }

  // ==================== Assertion Methods ====================

  /**
   * Asserts that the login form is fully visible
   */
  async assertLoginFormVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
    logger.info('Login form is visible');
  }

  /**
   * Asserts that the user is successfully logged in
   */
  async assertLoggedIn(): Promise<void> {
    await expect(this.page.locator(this.selectors.inventoryContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.productTitle)).toBeVisible();
    logger.info('User is logged in - inventory page is visible');
  }

  /**
   * Asserts that the user is logged out
   */
  async assertLoggedOut(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.inventoryContainer)).not.toBeVisible();
    logger.info('User is logged out - login form is visible');
  }

  /**
   * Asserts that a login error is displayed with optional message verification
   * @param expectedMessage - Optional expected error message text
   */
  async assertLoginError(expectedMessage?: string): Promise<void> {
    await expect(this.page.locator(this.selectors.errorMessage)).toBeVisible();
    
    if (expectedMessage) {
      const actualMessage = await this.getLoginErrorMessage();
      expect(actualMessage).toContain(expectedMessage);
      logger.info(`Login error message verified: ${expectedMessage}`);
    } else {
      logger.info('Login error message is displayed');
    }
  }

  /**
   * Asserts that no login error is displayed
   */
  async assertNoLoginError(): Promise<void> {
    await expect(this.page.locator(this.selectors.errorMessage)).not.toBeVisible();
    logger.info('No login error message is displayed');
  }

  // ==================== SauceDemo Specific Methods ====================

  /**
   * Gets list of accepted usernames for SauceDemo
   * @returns Array of valid usernames
   */
  getAcceptedUsernames(): string[] {
    return [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user'
    ];
  }

  /**
   * Gets the valid password for all SauceDemo users
   * @returns Valid password string
   */
  getValidPassword(): string {
    return 'secret_sauce';
  }

  /**
   * Checks if username is for a locked account
   * @param username - Username to check
   * @returns True if user is locked out
   */
  isUserLocked(username: string): boolean {
    return username === 'locked_out_user';
  }

  /**
   * Checks if username is for a problem user
   * @param username - Username to check
   * @returns True if user is problem user
   */
  isProblemUser(username: string): boolean {
    return username === 'problem_user';
  }

  /**
   * Checks if username is for a performance glitch user
   * @param username - Username to check
   * @returns True if user has performance issues
   */
  isPerformanceUser(username: string): boolean {
    return username === 'performance_glitch_user';
  }

  /**
   * Checks if username is for an error user
   * @param username - Username to check
   * @returns True if user is error user
   */
  isErrorUser(username: string): boolean {
    return username === 'error_user';
  }

  /**
   * Checks if username is for a visual user
   * @param username - Username to check
   * @returns True if user is visual user
   */
  isVisualUser(username: string): boolean {
    return username === 'visual_user';
  }

  /**
   * Gets expected error message for different scenarios
   * @param scenario - Error scenario type
   * @returns Expected error message text
   */
  getExpectedErrorMessage(scenario: string): string {
    const errorMessages: Record<string, string> = {
      'locked_out': 'Epic sadface: Sorry, this user has been locked out.',
      'invalid_credentials': 'Epic sadface: Username and password do not match any user in this service',
      'missing_username': 'Epic sadface: Username is required',
      'missing_password': 'Epic sadface: Password is required',
      'empty_credentials': 'Epic sadface: Username is required'
    };
    
    return errorMessages[scenario] || 'Epic sadface: Username and password do not match any user in this service';
  }

  /**
   * Measures the time taken to complete login
   * @param username - Username for login
   * @param password - Password for login
   * @returns Login duration in milliseconds
   */
  async measureLoginTime(username: string, password: string): Promise<number> {
    const startTime = Date.now();
    await this.login(username, password);
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Takes a screenshot of the login page for visual testing
   * @param name - Optional screenshot name
   * @returns Screenshot buffer
   */
  async takeLoginPageScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `saucedemo-login-${Date.now()}`;
    logger.info(`Taking SauceDemo login page screenshot: ${screenshotName}`);
    return await this.page.screenshot({ 
      fullPage: true,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  }
}
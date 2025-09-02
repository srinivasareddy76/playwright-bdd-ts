/**
 * Generic Login Page Object
 * 
 * This class provides a reusable login page implementation that can work
 * with various applications. It extends BasePage and provides common login
 * functionality with flexible selectors that match multiple patterns.
 * 
 * Features:
 * - Flexible selector patterns for different applications
 * - Login/logout functionality
 * - Error handling and validation
 * - Loading state management
 * - Form validation utilities
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../../utils/logger';

/**
 * Generic login page class for handling authentication across different applications
 */
export class LoginPage extends BasePage {
  /** Flexible selectors that work with multiple applications */
  private readonly selectors = {
    usernameInput: '[data-testid="username"], #username, input[name="username"]',
    passwordInput: '[data-testid="password"], #password, input[name="password"]',
    loginButton: '[data-testid="login"], #login, button[type="submit"], input[type="submit"]',
    logoutButton: '[data-testid="logout"], #logout, .logout',
    errorMessage: '[data-testid="error"], .error, .alert-error',
    welcomeMessage: '[data-testid="welcome"], .welcome, .user-info',
    loadingSpinner: '[data-testid="loading"], .loading, .spinner',
  };

  constructor(page: Page) {
    super(page);
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigates to the login page
   * @param baseUrl - Optional base URL, defaults to '/login'
   */
  async goto(baseUrl?: string): Promise<void> {
    const url = baseUrl || '/login';
    await super.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Waits for the login page to fully load
   */
  private async waitForPageLoad(): Promise<void> {
    // Wait for the login form to be visible
    await this.waitForVisible(this.selectors.usernameInput);
    await this.waitForVisible(this.selectors.passwordInput);
    await this.waitForVisible(this.selectors.loginButton);
  }

  // ==================== Login Actions ====================

  /**
   * Performs complete login flow with username and password
   * @param username - Username for authentication
   * @param password - Password for authentication
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting to login with username: ${username}`);
    
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    
    // Wait for login to complete (either success or error)
    await this.waitForLoginResult();
  }

  /**
   * Enters username into the username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.waitForVisible(this.selectors.usernameInput);
    await this.clear(this.selectors.usernameInput);
    await this.type(this.selectors.usernameInput, username);
  }

  /**
   * Enters password into the password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitForVisible(this.selectors.passwordInput);
    await this.clear(this.selectors.passwordInput);
    await this.type(this.selectors.passwordInput, password);
  }

  /**
   * Clicks the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.waitForEnabled(this.selectors.loginButton);
    await this.click(this.selectors.loginButton);
  }

  /**
   * Waits for login operation to complete (success or error)
   */
  private async waitForLoginResult(): Promise<void> {
    try {
      // Wait for either success (redirect/welcome) or error message
      await Promise.race([
        this.waitForVisible(this.selectors.welcomeMessage, 10000),
        this.waitForVisible(this.selectors.errorMessage, 10000),
        this.waitForUrl(/dashboard|home|main/, 10000),
      ]);
    } catch (error) {
      logger.warn('Login result not detected within timeout, continuing...');
    }
  }

  // ==================== Logout Actions ====================

  /**
   * Performs logout operation
   */
  async logout(): Promise<void> {
    logger.info('Attempting to logout');
    
    if (await this.isVisible(this.selectors.logoutButton)) {
      await this.click(this.selectors.logoutButton);
      await this.waitForLogout();
    } else {
      logger.warn('Logout button not found, user may not be logged in');
    }
  }

  /**
   * Waits for logout operation to complete
   */
  private async waitForLogout(): Promise<void> {
    try {
      // Wait for redirect to login page or login form to appear
      await Promise.race([
        this.waitForUrl(/login/, 10000),
        this.waitForVisible(this.selectors.usernameInput, 10000),
      ]);
    } catch (error) {
      logger.warn('Logout completion not detected within timeout');
    }
  }

  // ==================== Status Check Methods ====================

  /**
   * Checks if user is currently logged in
   * @returns True if user is logged in, false otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for indicators that user is logged in
      const hasWelcomeMessage = await this.isVisible(this.selectors.welcomeMessage);
      const hasLogoutButton = await this.isVisible(this.selectors.logoutButton);
      const isOnLoginPage = this.getCurrentUrl().then(url => url.includes('login'));
      
      return hasWelcomeMessage || hasLogoutButton || !(await isOnLoginPage);
    } catch (error) {
      logger.error(`Error checking login status: ${error}`);
      return false;
    }
  }

  /**
   * Checks if user is currently logged out
   * @returns True if user is logged out, false otherwise
   */
  async isLoggedOut(): Promise<boolean> {
    return !(await this.isLoggedIn());
  }

  /**
   * Checks if a login error is displayed
   * @returns True if error message is visible, false otherwise
   */
  async hasLoginError(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }

  /**
   * Gets the text of the login error message
   * @returns Error message text or empty string
   */
  async getLoginErrorMessage(): Promise<string> {
    if (await this.hasLoginError()) {
      return await this.getText(this.selectors.errorMessage);
    }
    return '';
  }

  /**
   * Checks if page is in loading state
   * @returns True if loading spinner is visible, false otherwise
   */
  async isLoading(): Promise<boolean> {
    return await this.isVisible(this.selectors.loadingSpinner);
  }

  // ==================== Form Validation Methods ====================

  /**
   * Checks if the login form is fully visible
   * @returns True if all form elements are visible, false otherwise
   */
  async isLoginFormVisible(): Promise<boolean> {
    const usernameVisible = await this.isVisible(this.selectors.usernameInput);
    const passwordVisible = await this.isVisible(this.selectors.passwordInput);
    const buttonVisible = await this.isVisible(this.selectors.loginButton);
    
    return usernameVisible && passwordVisible && buttonVisible;
  }

  /**
   * Checks if the login button is enabled
   * @returns True if login button is enabled, false otherwise
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.selectors.loginButton);
  }

  /**
   * Gets the current value of the username field
   * @returns Username field value
   */
  async getUsername(): Promise<string> {
    return await this.getValue(this.selectors.usernameInput);
  }

  // ==================== Assertion Methods ====================

  /**
   * Asserts that the login form is visible
   */
  async assertLoginFormVisible(): Promise<void> {
    await this.assertElementVisible(this.selectors.usernameInput);
    await this.assertElementVisible(this.selectors.passwordInput);
    await this.assertElementVisible(this.selectors.loginButton);
  }

  /**
   * Asserts that the user is logged in
   */
  async assertLoggedIn(): Promise<void> {
    const isLoggedIn = await this.isLoggedIn();
    if (!isLoggedIn) {
      throw new Error('User is not logged in');
    }
    logger.info('User is successfully logged in');
  }

  /**
   * Asserts that the user is logged out
   */
  async assertLoggedOut(): Promise<void> {
    const isLoggedOut = await this.isLoggedOut();
    if (!isLoggedOut) {
      throw new Error('User is still logged in');
    }
    logger.info('User is successfully logged out');
  }

  /**
   * Asserts that a login error is displayed with optional message verification
   * @param expectedMessage - Optional expected error message text
   */
  async assertLoginError(expectedMessage?: string): Promise<void> {
    await this.assertElementVisible(this.selectors.errorMessage);
    
    if (expectedMessage) {
      const actualMessage = await this.getLoginErrorMessage();
      if (!actualMessage.includes(expectedMessage)) {
        throw new Error(`Expected error message to contain "${expectedMessage}", but got "${actualMessage}"`);
      }
    }
    
    logger.info('Login error message is displayed as expected');
  }
}
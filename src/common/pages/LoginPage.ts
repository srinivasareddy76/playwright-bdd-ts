import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../../utils/logger';

export class LoginPage extends BasePage {
  // Selectors
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

  // Navigation
  async goto(baseUrl?: string): Promise<void> {
    const url = baseUrl || '/login';
    await super.goto(url);
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    // Wait for the login form to be visible
    await this.waitForVisible(this.selectors.usernameInput);
    await this.waitForVisible(this.selectors.passwordInput);
    await this.waitForVisible(this.selectors.loginButton);
  }

  // Login actions
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting to login with username: ${username}`);
    
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    
    // Wait for login to complete (either success or error)
    await this.waitForLoginResult();
  }

  async enterUsername(username: string): Promise<void> {
    await this.waitForVisible(this.selectors.usernameInput);
    await this.clear(this.selectors.usernameInput);
    await this.type(this.selectors.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.waitForVisible(this.selectors.passwordInput);
    await this.clear(this.selectors.passwordInput);
    await this.type(this.selectors.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.waitForEnabled(this.selectors.loginButton);
    await this.click(this.selectors.loginButton);
  }

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

  // Logout actions
  async logout(): Promise<void> {
    logger.info('Attempting to logout');
    
    if (await this.isVisible(this.selectors.logoutButton)) {
      await this.click(this.selectors.logoutButton);
      await this.waitForLogout();
    } else {
      logger.warn('Logout button not found, user may not be logged in');
    }
  }

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

  // Status checks
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

  async isLoggedOut(): Promise<boolean> {
    return !(await this.isLoggedIn());
  }

  async hasLoginError(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }

  async getLoginErrorMessage(): Promise<string> {
    if (await this.hasLoginError()) {
      return await this.getText(this.selectors.errorMessage);
    }
    return '';
  }

  async isLoading(): Promise<boolean> {
    return await this.isVisible(this.selectors.loadingSpinner);
  }

  // Form validation
  async isLoginFormVisible(): Promise<boolean> {
    const usernameVisible = await this.isVisible(this.selectors.usernameInput);
    const passwordVisible = await this.isVisible(this.selectors.passwordInput);
    const buttonVisible = await this.isVisible(this.selectors.loginButton);
    
    return usernameVisible && passwordVisible && buttonVisible;
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.selectors.loginButton);
  }

  async getUsername(): Promise<string> {
    return await this.getValue(this.selectors.usernameInput);
  }

  // Assertions
  async assertLoginFormVisible(): Promise<void> {
    await this.assertElementVisible(this.selectors.usernameInput);
    await this.assertElementVisible(this.selectors.passwordInput);
    await this.assertElementVisible(this.selectors.loginButton);
  }

  async assertLoggedIn(): Promise<void> {
    const isLoggedIn = await this.isLoggedIn();
    if (!isLoggedIn) {
      throw new Error('User is not logged in');
    }
    logger.info('User is successfully logged in');
  }

  async assertLoggedOut(): Promise<void> {
    const isLoggedOut = await this.isLoggedOut();
    if (!isLoggedOut) {
      throw new Error('User is still logged in');
    }
    logger.info('User is successfully logged out');
  }

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
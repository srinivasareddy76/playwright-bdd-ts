import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';
import { logger } from '../../../utils/logger';

export class SauceDemoLoginPage extends BasePage {
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

  async goto(baseUrl?: string): Promise<void> {
    const url = baseUrl || 'https://saucedemo.com';
    logger.info(`Navigating to SauceDemo login page: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.waitForLoginForm();
  }

  async waitForLoginForm(): Promise<void> {
    await this.page.waitForSelector(this.selectors.loginContainer, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.usernameInput, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.passwordInput, { state: 'visible' });
    await this.page.waitForSelector(this.selectors.loginButton, { state: 'visible' });
  }

  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.page.locator(this.selectors.usernameInput).clear();
    await this.page.locator(this.selectors.usernameInput).fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.page.locator(this.selectors.passwordInput).clear();
    await this.page.locator(this.selectors.passwordInput).fill(password);
  }

  async clickLoginButton(): Promise<void> {
    logger.info('Clicking login button');
    await this.click(this.selectors.loginButton);
    
    // Wait for either success (inventory page) or error message
    await Promise.race([
      this.page.waitForSelector(this.selectors.inventoryContainer, { timeout: 5000 }).catch(() => null),
      this.page.waitForSelector(this.selectors.errorMessage, { timeout: 5000 }).catch(() => null)
    ]);
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    
    // Open the menu
    await this.click(this.selectors.menuButton);
    
    // Wait for menu to open and click logout
    await this.page.waitForSelector(this.selectors.logoutLink, { state: 'visible' });
    await this.click(this.selectors.logoutLink);
    
    // Wait for login form to appear
    await this.waitForLoginForm();
  }

  // Validation methods
  async isLoginFormVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.loginContainer, { state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.inventoryContainer, { state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.page.locator(this.selectors.loginButton);
    return await button.isEnabled();
  }

  async hasLoginError(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.selectors.errorMessage, { state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getLoginErrorMessage(): Promise<string> {
    const errorElement = this.page.locator(this.selectors.errorMessage);
    return await errorElement.textContent() || '';
  }

  async getUsername(): Promise<string> {
    return await this.page.locator(this.selectors.usernameInput).inputValue();
  }

  async getPassword(): Promise<string> {
    return await this.page.locator(this.selectors.passwordInput).inputValue();
  }

  async clearErrorMessage(): Promise<void> {
    if (await this.hasLoginError()) {
      await this.click(this.selectors.errorButton);
    }
  }

  // Assertion methods
  async assertLoginFormVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
    logger.info('Login form is visible');
  }

  async assertLoggedIn(): Promise<void> {
    await expect(this.page.locator(this.selectors.inventoryContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.productTitle)).toBeVisible();
    logger.info('User is logged in - inventory page is visible');
  }

  async assertLoggedOut(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginContainer)).toBeVisible();
    await expect(this.page.locator(this.selectors.inventoryContainer)).not.toBeVisible();
    logger.info('User is logged out - login form is visible');
  }

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

  async assertNoLoginError(): Promise<void> {
    await expect(this.page.locator(this.selectors.errorMessage)).not.toBeVisible();
    logger.info('No login error message is displayed');
  }

  // SauceDemo specific methods
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

  getValidPassword(): string {
    return 'secret_sauce';
  }

  isUserLocked(username: string): boolean {
    return username === 'locked_out_user';
  }

  isProblemUser(username: string): boolean {
    return username === 'problem_user';
  }

  isPerformanceUser(username: string): boolean {
    return username === 'performance_glitch_user';
  }

  isErrorUser(username: string): boolean {
    return username === 'error_user';
  }

  isVisualUser(username: string): boolean {
    return username === 'visual_user';
  }

  // Get expected error messages for different scenarios
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

  // Performance testing helper
  async measureLoginTime(username: string, password: string): Promise<number> {
    const startTime = Date.now();
    await this.login(username, password);
    const endTime = Date.now();
    return endTime - startTime;
  }

  // Visual testing helper
  async takeLoginPageScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `saucedemo-login-${Date.now()}`;
    logger.info(`Taking SauceDemo login page screenshot: ${screenshotName}`);
    return await this.page.screenshot({ 
      fullPage: true,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  }
}
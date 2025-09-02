import { Locator, expect } from '@playwright/test';
import { BasePage } from '../../../common/pages/BasePage';
import { logger } from '../../../utils/logger';

export class PracticeTestLoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    usernameInput: '#username',
    passwordInput: '#password',
    submitButton: '#submit',
    errorMessage: '#error',
    logoutButton: 'a[href="https://practicetestautomation.com/practice-test-login/"]',
    successMessage: '.post-content p, .post-title, h1'
  };

  // Locators
  private get usernameInput(): Locator {
    return this.page.locator(this.selectors.usernameInput);
  }

  private get passwordInput(): Locator {
    return this.page.locator(this.selectors.passwordInput);
  }

  private get submitButton(): Locator {
    return this.page.locator(this.selectors.submitButton);
  }

  private get errorMessage(): Locator {
    return this.page.locator(this.selectors.errorMessage);
  }

  private get logoutButton(): Locator {
    return this.page.locator(this.selectors.logoutButton);
  }

  private get successMessage(): Locator {
    return this.page.locator(this.selectors.successMessage);
  }

  /**
   * Navigate to the Practice Test Automation login page
   */
  async navigateToLoginPage(): Promise<void> {
    logger.info('Navigating to Practice Test Automation login page');
    await this.page.goto('https://practicetestautomation.com/practice-test-login/');
    await this.page.waitForLoadState('networkidle');
    logger.info('Successfully navigated to Practice Test Automation login page');
  }

  /**
   * Enter username in the username field
   */
  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password in the password field
   */
  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the submit button
   */
  async clickSubmit(): Promise<void> {
    logger.info('Clicking submit button');
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  /**
   * Perform complete login action
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSubmit();
    
    // Wait a moment for the page to process the login attempt
    await this.page.waitForTimeout(1000);
    logger.info(`Completed login attempt with username: ${username}`);
  }

  /**
   * Check if user is on the success page
   */
  async isOnSuccessPage(): Promise<boolean> {
    try {
      const currentUrl = this.page.url();
      const isSuccessUrl = currentUrl.includes('practicetestautomation.com/logged-in-successfully/');
      logger.info(`Current URL: ${currentUrl}, Is success page: ${isSuccessUrl}`);
      return isSuccessUrl;
    } catch (error) {
      logger.error('Error checking success page URL:', error);
      return false;
    }
  }

  /**
   * Verify the success page URL
   */
  async verifySuccessPageUrl(): Promise<void> {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('practicetestautomation.com/logged-in-successfully/');
    logger.info('Verified success page URL contains expected path');
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    try {
      await this.successMessage.first().waitFor({ state: 'visible', timeout: 5000 });
      const messages = await this.successMessage.all();
      
      for (const message of messages) {
        const text = await message.textContent();
        if (text && (text.includes('Congratulations') || text.includes('successfully logged in'))) {
          logger.info(`Found success message: ${text}`);
          return true;
        }
      }
      
      logger.warn('Success message not found');
      return false;
    } catch (error) {
      logger.error('Error checking success message visibility:', error);
      return false;
    }
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage(): Promise<void> {
    const isVisible = await this.isSuccessMessageVisible();
    expect(isVisible).toBe(true);
    logger.info('Verified success message is displayed');
  }

  /**
   * Check if logout button is visible
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    try {
      await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
      logger.info('Logout button is visible');
      return true;
    } catch (error) {
      logger.error('Logout button not visible:', error);
      return false;
    }
  }

  /**
   * Verify logout button is displayed
   */
  async verifyLogoutButton(): Promise<void> {
    const isVisible = await this.isLogoutButtonVisible();
    expect(isVisible).toBe(true);
    logger.info('Verified logout button is displayed');
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      logger.info('Error message is visible');
      return true;
    } catch (error) {
      logger.error('Error message not visible:', error);
      return false;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    const text = await this.errorMessage.textContent();
    logger.info(`Error message text: ${text}`);
    return text || '';
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(): Promise<void> {
    const isVisible = await this.isErrorMessageVisible();
    expect(isVisible).toBe(true);
    logger.info('Verified error message is displayed');
  }

  /**
   * Verify specific error message text
   */
  async verifyErrorMessageText(expectedText: string): Promise<void> {
    const actualText = await this.getErrorMessageText();
    expect(actualText).toBe(expectedText);
    logger.info(`Verified error message text: ${actualText}`);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    logger.info('Clicking logout button');
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Logged out successfully');
  }
}
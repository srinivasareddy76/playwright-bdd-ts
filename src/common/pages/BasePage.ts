import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../../utils/logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation helpers
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: options?.waitUntil || 'networkidle' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  // Element interaction helpers
  async click(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    logger.debug(`Clicking element: ${selector}`);
    await this.page.locator(selector).click(options);
  }

  async doubleClick(selector: string): Promise<void> {
    logger.debug(`Double-clicking element: ${selector}`);
    await this.page.locator(selector).dblclick();
  }

  async type(selector: string, value: string, options?: { delay?: number }): Promise<void> {
    logger.debug(`Typing into element ${selector}: ${value}`);
    await this.page.locator(selector).fill(value);
    if (options?.delay) {
      await this.page.locator(selector).type(value, { delay: options.delay });
    }
  }

  async clear(selector: string): Promise<void> {
    logger.debug(`Clearing element: ${selector}`);
    await this.page.locator(selector).clear();
  }

  async selectOption(selector: string, value: string | string[]): Promise<void> {
    logger.debug(`Selecting option in ${selector}: ${value}`);
    await this.page.locator(selector).selectOption(value);
  }

  async check(selector: string): Promise<void> {
    logger.debug(`Checking checkbox: ${selector}`);
    await this.page.locator(selector).check();
  }

  async uncheck(selector: string): Promise<void> {
    logger.debug(`Unchecking checkbox: ${selector}`);
    await this.page.locator(selector).uncheck();
  }

  // Wait helpers
  async waitForVisible(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be visible: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be hidden: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  async waitForEnabled(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be enabled: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'attached', timeout });
    await expect(this.page.locator(selector)).toBeEnabled({ timeout });
  }

  async waitForText(selector: string, text: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element ${selector} to contain text: ${text}`);
    await expect(this.page.locator(selector)).toContainText(text, { timeout });
  }

  async waitForNetworkIdle(timeout = 30000): Promise<void> {
    logger.debug('Waiting for network idle');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForUrl(url: string | RegExp, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for URL: ${url}`);
    await this.page.waitForURL(url, { timeout });
  }

  // Element query helpers
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isEnabled();
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isChecked();
  }

  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // Screenshot helpers
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    logger.info(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ fullPage: true });
  }

  async screenshotOnFailure(): Promise<void> {
    try {
      await this.takeScreenshot('failure');
      // In Cucumber context, this would be attached to the scenario
      logger.info('Screenshot captured on failure');
    } catch (error) {
      logger.error(`Failed to capture screenshot: ${error}`);
    }
  }

  // Assertion helpers
  async assertElementVisible(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  async assertElementHidden(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  async assertElementEnabled(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled({ timeout });
  }

  async assertElementDisabled(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled({ timeout });
  }

  async assertText(selector: string, expectedText: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout });
  }

  async assertTextContains(selector: string, expectedText: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText, { timeout });
  }

  async assertValue(selector: string, expectedValue: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue, { timeout });
  }

  async assertUrl(expectedUrl: string | RegExp, timeout = 10000): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, { timeout });
  }

  async assertTitle(expectedTitle: string | RegExp, timeout = 10000): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, { timeout });
  }

  // Utility methods
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async hover(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  async focus(selector: string): Promise<void> {
    await this.page.locator(selector).focus();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
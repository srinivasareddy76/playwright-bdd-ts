/**
 * Base Page Object Model Class
 * 
 * This class provides a foundation for all page objects in the BDD framework.
 * It implements common web interaction patterns, waiting strategies, and
 * assertion methods that can be inherited by specific page classes.
 * 
 * Key Features:
 * - Navigation and page lifecycle management
 * - Element interaction methods with logging
 * - Comprehensive waiting strategies
 * - Built-in assertion helpers
 * - Screenshot capture capabilities
 * - Keyboard and mouse interaction support
 * - Error handling and debugging support
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../../utils/logger';

/**
 * Base class for all page objects in the framework
 * Provides common functionality for web page interactions
 */
export class BasePage {
  /** Playwright page instance for browser interactions */
  protected page: Page;

  /**
   * Creates a new BasePage instance
   * @param page - Playwright page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigates to the specified URL
   * @param url - Target URL to navigate to
   * @param options - Navigation options including wait conditions
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: options?.waitUntil || 'networkidle' });
  }

  /**
   * Navigates back to the previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Reloads the current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  // ==================== Element Interaction Methods ====================

  /**
   * Clicks on an element identified by selector
   * @param selector - CSS selector for the target element
   * @param options - Click options including timeout and force
   */
  async click(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    logger.debug(`Clicking element: ${selector}`);
    await this.page.locator(selector).click(options);
  }

  /**
   * Double-clicks on an element
   * @param selector - CSS selector for the target element
   */
  async doubleClick(selector: string): Promise<void> {
    logger.debug(`Double-clicking element: ${selector}`);
    await this.page.locator(selector).dblclick();
  }

  /**
   * Types text into an input element
   * @param selector - CSS selector for the input element
   * @param value - Text to type
   * @param options - Typing options including delay
   */
  async type(selector: string, value: string, options?: { delay?: number }): Promise<void> {
    logger.debug(`Typing into element ${selector}: ${value}`);
    await this.page.locator(selector).fill(value);
    if (options?.delay) {
      await this.page.locator(selector).type(value, { delay: options.delay });
    }
  }

  /**
   * Clears the content of an input element
   * @param selector - CSS selector for the input element
   */
  async clear(selector: string): Promise<void> {
    logger.debug(`Clearing element: ${selector}`);
    await this.page.locator(selector).clear();
  }

  /**
   * Selects option(s) from a dropdown element
   * @param selector - CSS selector for the select element
   * @param value - Option value(s) to select
   */
  async selectOption(selector: string, value: string | string[]): Promise<void> {
    logger.debug(`Selecting option in ${selector}: ${value}`);
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Checks a checkbox element
   * @param selector - CSS selector for the checkbox element
   */
  async check(selector: string): Promise<void> {
    logger.debug(`Checking checkbox: ${selector}`);
    await this.page.locator(selector).check();
  }

  /**
   * Unchecks a checkbox element
   * @param selector - CSS selector for the checkbox element
   */
  async uncheck(selector: string): Promise<void> {
    logger.debug(`Unchecking checkbox: ${selector}`);
    await this.page.locator(selector).uncheck();
  }

  // ==================== Wait Methods ====================

  /**
   * Waits for an element to become visible
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForVisible(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be visible: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Waits for an element to become hidden
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForHidden(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be hidden: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Waits for an element to become enabled
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForEnabled(selector: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element to be enabled: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'attached', timeout });
    await expect(this.page.locator(selector)).toBeEnabled({ timeout });
  }

  /**
   * Waits for an element to contain specific text
   * @param selector - CSS selector for the element
   * @param text - Expected text content
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForText(selector: string, text: string, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for element ${selector} to contain text: ${text}`);
    await expect(this.page.locator(selector)).toContainText(text, { timeout });
  }

  /**
   * Waits for network activity to become idle
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForNetworkIdle(timeout = 30000): Promise<void> {
    logger.debug('Waiting for network idle');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Waits for the page URL to match the expected pattern
   * @param url - Expected URL string or regex pattern
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForUrl(url: string | RegExp, timeout = 30000): Promise<void> {
    logger.debug(`Waiting for URL: ${url}`);
    await this.page.waitForURL(url, { timeout });
  }

  // ==================== Element Query Methods ====================

  /**
   * Gets a Playwright locator for the specified selector
   * @param selector - CSS selector for the element
   * @returns Playwright Locator instance
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Gets the text content of an element
   * @param selector - CSS selector for the element
   * @returns Element text content
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Gets the value of an input element
   * @param selector - CSS selector for the input element
   * @returns Input element value
   */
  async getValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * Gets the value of an element attribute
   * @param selector - CSS selector for the element
   * @param attribute - Attribute name to retrieve
   * @returns Attribute value or null if not found
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Checks if an element is visible
   * @param selector - CSS selector for the element
   * @returns True if element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Checks if an element is enabled
   * @param selector - CSS selector for the element
   * @returns True if element is enabled, false otherwise
   */
  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isEnabled();
  }

  /**
   * Checks if a checkbox element is checked
   * @param selector - CSS selector for the checkbox element
   * @returns True if checkbox is checked, false otherwise
   */
  async isChecked(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isChecked();
  }

  /**
   * Gets the count of elements matching the selector
   * @param selector - CSS selector for the elements
   * @returns Number of matching elements
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // ==================== Screenshot Methods ====================

  /**
   * Captures a screenshot of the current page
   * @param name - Optional name for the screenshot
   * @returns Screenshot buffer
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    logger.info(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Captures a screenshot on test failure for debugging
   */
  async screenshotOnFailure(): Promise<void> {
    try {
      await this.takeScreenshot('failure');
      logger.info('Screenshot captured on failure');
    } catch (error) {
      logger.error(`Failed to capture screenshot: ${error}`);
    }
  }

  // ==================== Assertion Methods ====================

  /**
   * Asserts that an element is visible
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertElementVisible(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Asserts that an element is hidden
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertElementHidden(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }

  /**
   * Asserts that an element is enabled
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertElementEnabled(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled({ timeout });
  }

  /**
   * Asserts that an element is disabled
   * @param selector - CSS selector for the element
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertElementDisabled(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled({ timeout });
  }

  /**
   * Asserts that an element has exact text content
   * @param selector - CSS selector for the element
   * @param expectedText - Expected text content
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertText(selector: string, expectedText: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout });
  }

  /**
   * Asserts that an element contains specific text
   * @param selector - CSS selector for the element
   * @param expectedText - Expected text to be contained
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertTextContains(selector: string, expectedText: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText, { timeout });
  }

  /**
   * Asserts that an input element has a specific value
   * @param selector - CSS selector for the input element
   * @param expectedValue - Expected input value
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertValue(selector: string, expectedValue: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue, { timeout });
  }

  /**
   * Asserts that the page URL matches the expected pattern
   * @param expectedUrl - Expected URL string or regex pattern
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertUrl(expectedUrl: string | RegExp, timeout = 10000): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, { timeout });
  }

  /**
   * Asserts that the page title matches the expected pattern
   * @param expectedTitle - Expected title string or regex pattern
   * @param timeout - Maximum wait time in milliseconds
   */
  async assertTitle(expectedTitle: string | RegExp, timeout = 10000): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, { timeout });
  }

  // ==================== Utility Methods ====================

  /**
   * Scrolls the page to bring an element into view
   * @param selector - CSS selector for the element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Hovers over an element
   * @param selector - CSS selector for the element
   */
  async hover(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  /**
   * Focuses on an element
   * @param selector - CSS selector for the element
   */
  async focus(selector: string): Promise<void> {
    await this.page.locator(selector).focus();
  }

  /**
   * Presses a keyboard key
   * @param key - Key name to press (e.g., 'Enter', 'Escape')
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Gets the current page URL
   * @returns Current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Gets the current page title
   * @returns Current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
/**
 * Common Step Definitions
 * 
 * This module contains reusable Cucumber step definitions that can be used
 * across different test scenarios. It provides common web interaction patterns
 * including navigation, element interactions, form handling, and assertions.
 * 
 * Features:
 * - Navigation steps for different pages
 * - Element interaction (click, type, select)
 * - Form handling and input validation
 * - Wait conditions and assertions
 * - URL and page state verification
 * - Screenshot and debugging utilities
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './hooks';
import { logger } from '../../utils/logger';

// ==================== Navigation Steps ====================

/**
 * Navigates to a specific URL (absolute or relative)
 */
Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await this.initializeBrowser();
  
  const fullUrl = url.startsWith('http') ? url : `${this.config.app.baseUrl}${url}`;
  logger.info(`Navigating to: ${fullUrl}`);
  
  await this.page!.goto(fullUrl, { waitUntil: 'networkidle' });
  
  // Store the URL for later reference
  this.setTestData('currentUrl', fullUrl);
});

/**
 * Navigates to a predefined page by name
 */
Given('I am on the {string} page', async function (this: CustomWorld, pageName: string) {
  await this.initializeBrowser();
  
  const pageUrls: Record<string, string> = {
    'home': '/',
    'login': '/login',
    'dashboard': '/dashboard',
    'profile': '/profile',
    'settings': '/settings',
  };
  
  const path = pageUrls[pageName.toLowerCase()] || `/${pageName.toLowerCase()}`;
  const fullUrl = `${this.config.app.baseUrl}${path}`;
  
  logger.info(`Navigating to ${pageName} page: ${fullUrl}`);
  await this.page!.goto(fullUrl, { waitUntil: 'networkidle' });
});

// ==================== Element Interaction Steps ====================

/**
 * Clicks on an element using CSS selector
 */
When('I click on {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Clicking on element: ${selector}`);
  await this.page!.locator(selector).click();
});

/**
 * Clicks on a button by its text content
 */
When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  const selector = `button:has-text("${buttonText}"), input[type="submit"][value="${buttonText}"], [role="button"]:has-text("${buttonText}")`;
  logger.info(`Clicking button with text: ${buttonText}`);
  await this.page!.locator(selector).click();
});

/**
 * Types text into an element using CSS selector
 */
When('I type {string} into {string}', async function (this: CustomWorld, text: string, selector: string) {
  logger.info(`Typing "${text}" into element: ${selector}`);
  await this.page!.locator(selector).fill(text);
});

/**
 * Types text into a form field by field name
 */
When('I type {string} into the {string} field', async function (this: CustomWorld, text: string, fieldName: string) {
  const selector = `input[name="${fieldName}"], input[id="${fieldName}"], [data-testid="${fieldName}"], label:has-text("${fieldName}") + input`;
  logger.info(`Typing "${text}" into ${fieldName} field`);
  await this.page!.locator(selector).fill(text);
});

/**
 * Selects an option from a dropdown by text
 */
When('I select {string} from {string}', async function (this: CustomWorld, optionText: string, selector: string) {
  logger.info(`Selecting "${optionText}" from dropdown: ${selector}`);
  await this.page!.locator(selector).selectOption({ label: optionText });
});

/**
 * Checks a checkbox element
 */
When('I check the {string} checkbox', async function (this: CustomWorld, selector: string) {
  logger.info(`Checking checkbox: ${selector}`);
  await this.page!.locator(selector).check();
});

/**
 * Unchecks a checkbox element
 */
When('I uncheck the {string} checkbox', async function (this: CustomWorld, selector: string) {
  logger.info(`Unchecking checkbox: ${selector}`);
  await this.page!.locator(selector).uncheck();
});

// ==================== Wait Steps ====================

/**
 * Waits for a specified number of seconds
 */
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  logger.info(`Waiting for ${seconds} seconds`);
  await this.page!.waitForTimeout(seconds * 1000);
});

/**
 * Waits for an element to become visible
 */
When('I wait for {string} to be visible', async function (this: CustomWorld, selector: string) {
  logger.info(`Waiting for element to be visible: ${selector}`);
  await this.page!.locator(selector).waitFor({ state: 'visible' });
});

/**
 * Waits for an element to become hidden
 */
When('I wait for {string} to be hidden', async function (this: CustomWorld, selector: string) {
  logger.info(`Waiting for element to be hidden: ${selector}`);
  await this.page!.locator(selector).waitFor({ state: 'hidden' });
});

/**
 * Waits for the page to fully load
 */
When('I wait for the page to load', async function (this: CustomWorld) {
  logger.info('Waiting for page to load');
  await this.page!.waitForLoadState('networkidle');
});

// ==================== Assertion Steps ====================

/**
 * Verifies that specific text is visible on the page
 */
Then('I should see {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text is visible: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

/**
 * Verifies that specific text exists on the page
 */
Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text exists on page: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

/**
 * Verifies that specific text is not visible on the page
 */
Then('I should not see {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text is not visible: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).not.toBeVisible();
});

/**
 * Verifies that an element is visible
 */
Then('the element {string} should be visible', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is visible: ${selector}`);
  await expect(this.page!.locator(selector)).toBeVisible();
});

/**
 * Verifies that an element is hidden
 */
Then('the element {string} should be hidden', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is hidden: ${selector}`);
  await expect(this.page!.locator(selector)).toBeHidden();
});

/**
 * Verifies that an element is enabled
 */
Then('the element {string} should be enabled', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is enabled: ${selector}`);
  await expect(this.page!.locator(selector)).toBeEnabled();
});

/**
 * Verifies that an element is disabled
 */
Then('the element {string} should be disabled', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is disabled: ${selector}`);
  await expect(this.page!.locator(selector)).toBeDisabled();
});

/**
 * Verifies that a form field contains expected value
 */
Then('the {string} field should contain {string}', async function (this: CustomWorld, fieldName: string, expectedValue: string) {
  const selector = `input[name="${fieldName}"], input[id="${fieldName}"], [data-testid="${fieldName}"]`;
  logger.info(`Verifying ${fieldName} field contains: ${expectedValue}`);
  await expect(this.page!.locator(selector)).toHaveValue(expectedValue);
});

/**
 * Verifies the page title
 */
Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  logger.info(`Verifying page title: ${expectedTitle}`);
  await expect(this.page!).toHaveTitle(expectedTitle);
});

/**
 * Verifies the current URL
 */
Then('the current URL should be {string}', async function (this: CustomWorld, expectedUrl: string) {
  const fullUrl = expectedUrl.startsWith('http') ? expectedUrl : `${this.config.app.baseUrl}${expectedUrl}`;
  logger.info(`Verifying current URL: ${fullUrl}`);
  await expect(this.page!).toHaveURL(fullUrl);
});

Then('the current URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  logger.info(`Verifying URL contains: ${urlPart}`);
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain(urlPart);
});

// Element count steps
Then('I should see {int} {string} elements', async function (this: CustomWorld, count: number, selector: string) {
  logger.info(`Verifying ${count} elements match selector: ${selector}`);
  await expect(this.page!.locator(selector)).toHaveCount(count);
});

Then('I should see at least {int} {string} elements', async function (this: CustomWorld, minCount: number, selector: string) {
  logger.info(`Verifying at least ${minCount} elements match selector: ${selector}`);
  const actualCount = await this.page!.locator(selector).count();
  expect(actualCount).toBeGreaterThanOrEqual(minCount);
});

// Text content steps
Then('the element {string} should contain {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  logger.info(`Verifying element ${selector} contains text: ${expectedText}`);
  await expect(this.page!.locator(selector)).toContainText(expectedText);
});

Then('the element {string} should have exact text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  logger.info(`Verifying element ${selector} has exact text: ${expectedText}`);
  await expect(this.page!.locator(selector)).toHaveText(expectedText);
});

// Attribute steps
Then('the element {string} should have attribute {string} with value {string}', async function (this: CustomWorld, selector: string, attribute: string, expectedValue: string) {
  logger.info(`Verifying element ${selector} has attribute ${attribute} with value: ${expectedValue}`);
  await expect(this.page!.locator(selector)).toHaveAttribute(attribute, expectedValue);
});

Then('the element {string} should have class {string}', async function (this: CustomWorld, selector: string, className: string) {
  logger.info(`Verifying element ${selector} has class: ${className}`);
  await expect(this.page!.locator(selector)).toHaveClass(new RegExp(className));
});

// Screenshot steps
When('I take a screenshot', async function (this: CustomWorld) {
  logger.info('Taking screenshot');
  await this.captureScreenshot('manual');
});

When('I take a screenshot named {string}', async function (this: CustomWorld, name: string) {
  logger.info(`Taking screenshot: ${name}`);
  await this.captureScreenshot(name);
});

// Browser actions
When('I refresh the page', async function (this: CustomWorld) {
  logger.info('Refreshing the page');
  await this.page!.reload({ waitUntil: 'networkidle' });
});

When('I go back', async function (this: CustomWorld) {
  logger.info('Going back in browser history');
  await this.page!.goBack({ waitUntil: 'networkidle' });
});

When('I go forward', async function (this: CustomWorld) {
  logger.info('Going forward in browser history');
  await this.page!.goForward({ waitUntil: 'networkidle' });
});

// Keyboard actions
When('I press {string}', async function (this: CustomWorld, key: string) {
  logger.info(`Pressing key: ${key}`);
  await this.page!.keyboard.press(key);
});

When('I press {string} on element {string}', async function (this: CustomWorld, key: string, selector: string) {
  logger.info(`Pressing key ${key} on element: ${selector}`);
  await this.page!.locator(selector).press(key);
});

// Mouse actions
When('I hover over {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Hovering over element: ${selector}`);
  await this.page!.locator(selector).hover();
});

When('I double click on {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Double clicking on element: ${selector}`);
  await this.page!.locator(selector).dblclick();
});

When('I right click on {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Right clicking on element: ${selector}`);
  await this.page!.locator(selector).click({ button: 'right' });
});

// Scroll actions
When('I scroll to {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Scrolling to element: ${selector}`);
  await this.page!.locator(selector).scrollIntoViewIfNeeded();
});

When('I scroll to the top of the page', async function (this: CustomWorld) {
  logger.info('Scrolling to top of page');
  await this.page!.evaluate(() => window.scrollTo(0, 0));
});

When('I scroll to the bottom of the page', async function (this: CustomWorld) {
  logger.info('Scrolling to bottom of page');
  await this.page!.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// Data storage steps
When('I store the text of {string} as {string}', async function (this: CustomWorld, selector: string, variableName: string) {
  const text = await this.page!.locator(selector).textContent();
  this.setTestData(variableName, text);
  logger.info(`Stored text "${text}" as variable: ${variableName}`);
});

When('I store the value of {string} as {string}', async function (this: CustomWorld, selector: string, variableName: string) {
  const value = await this.page!.locator(selector).inputValue();
  this.setTestData(variableName, value);
  logger.info(`Stored value "${value}" as variable: ${variableName}`);
});

Then('the stored {string} should be {string}', async function (this: CustomWorld, variableName: string, expectedValue: string) {
  const actualValue = this.getTestData(variableName);
  expect(actualValue).toBe(expectedValue);
  logger.info(`Verified stored variable ${variableName} equals: ${expectedValue}`);
});
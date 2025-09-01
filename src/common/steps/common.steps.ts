import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './hooks';
import { logger } from '../../utils/logger';

// Navigation steps
Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await this.initializeBrowser();
  
  const fullUrl = url.startsWith('http') ? url : `${this.config.app.baseUrl}${url}`;
  logger.info(`Navigating to: ${fullUrl}`);
  
  await this.page!.goto(fullUrl, { waitUntil: 'networkidle' });
  
  // Store the URL for later reference
  this.setTestData('currentUrl', fullUrl);
});

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

// Element interaction steps
When('I click on {string}', async function (this: CustomWorld, selector: string) {
  logger.info(`Clicking on element: ${selector}`);
  await this.page!.locator(selector).click();
});

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  const selector = `button:has-text("${buttonText}"), input[type="submit"][value="${buttonText}"], [role="button"]:has-text("${buttonText}")`;
  logger.info(`Clicking button with text: ${buttonText}`);
  await this.page!.locator(selector).click();
});

When('I type {string} into {string}', async function (this: CustomWorld, text: string, selector: string) {
  logger.info(`Typing "${text}" into element: ${selector}`);
  await this.page!.locator(selector).fill(text);
});

When('I type {string} into the {string} field', async function (this: CustomWorld, text: string, fieldName: string) {
  const selector = `input[name="${fieldName}"], input[id="${fieldName}"], [data-testid="${fieldName}"], label:has-text("${fieldName}") + input`;
  logger.info(`Typing "${text}" into ${fieldName} field`);
  await this.page!.locator(selector).fill(text);
});

When('I select {string} from {string}', async function (this: CustomWorld, optionText: string, selector: string) {
  logger.info(`Selecting "${optionText}" from dropdown: ${selector}`);
  await this.page!.locator(selector).selectOption({ label: optionText });
});

When('I check the {string} checkbox', async function (this: CustomWorld, selector: string) {
  logger.info(`Checking checkbox: ${selector}`);
  await this.page!.locator(selector).check();
});

When('I uncheck the {string} checkbox', async function (this: CustomWorld, selector: string) {
  logger.info(`Unchecking checkbox: ${selector}`);
  await this.page!.locator(selector).uncheck();
});

// Wait steps
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  logger.info(`Waiting for ${seconds} seconds`);
  await this.page!.waitForTimeout(seconds * 1000);
});

When('I wait for {string} to be visible', async function (this: CustomWorld, selector: string) {
  logger.info(`Waiting for element to be visible: ${selector}`);
  await this.page!.locator(selector).waitFor({ state: 'visible' });
});

When('I wait for {string} to be hidden', async function (this: CustomWorld, selector: string) {
  logger.info(`Waiting for element to be hidden: ${selector}`);
  await this.page!.locator(selector).waitFor({ state: 'hidden' });
});

When('I wait for the page to load', async function (this: CustomWorld) {
  logger.info('Waiting for page to load');
  await this.page!.waitForLoadState('networkidle');
});

// Assertion steps
Then('I should see {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text is visible: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text exists on page: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).toBeVisible();
});

Then('I should not see {string}', async function (this: CustomWorld, text: string) {
  logger.info(`Verifying text is not visible: ${text}`);
  await expect(this.page!.locator(`text=${text}`)).not.toBeVisible();
});

Then('the element {string} should be visible', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is visible: ${selector}`);
  await expect(this.page!.locator(selector)).toBeVisible();
});

Then('the element {string} should be hidden', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is hidden: ${selector}`);
  await expect(this.page!.locator(selector)).toBeHidden();
});

Then('the element {string} should be enabled', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is enabled: ${selector}`);
  await expect(this.page!.locator(selector)).toBeEnabled();
});

Then('the element {string} should be disabled', async function (this: CustomWorld, selector: string) {
  logger.info(`Verifying element is disabled: ${selector}`);
  await expect(this.page!.locator(selector)).toBeDisabled();
});

Then('the {string} field should contain {string}', async function (this: CustomWorld, fieldName: string, expectedValue: string) {
  const selector = `input[name="${fieldName}"], input[id="${fieldName}"], [data-testid="${fieldName}"]`;
  logger.info(`Verifying ${fieldName} field contains: ${expectedValue}`);
  await expect(this.page!.locator(selector)).toHaveValue(expectedValue);
});

Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  logger.info(`Verifying page title: ${expectedTitle}`);
  await expect(this.page!).toHaveTitle(expectedTitle);
});

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
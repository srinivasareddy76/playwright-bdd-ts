import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../../common/steps/hooks';
import { SauceDemoLoginPage } from '../pages/SauceDemoLoginPage';
import { logger } from '../../../utils/logger';

// SauceDemo specific navigation
Given('I am on the SauceDemo login page', async function (this: CustomWorld) {
  await this.initializeBrowser();
  
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.goto(this.config.app.baseUrl);
  
  logger.info('Navigated to SauceDemo login page');
});

// SauceDemo login actions
When('I login with SauceDemo credentials for {string}', async function (this: CustomWorld, userType: string) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const password = sauceDemoPage.getValidPassword();
  
  await sauceDemoPage.login(userType, password);
  logger.info(`Attempted login with SauceDemo user: ${userType}`);
});

When('I logout from the application', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.logout();
  
  logger.info('Logged out from SauceDemo application');
});

When('I click the error dismiss button', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.clearErrorMessage();
  
  logger.info('Clicked error dismiss button');
});

When('I measure the login time for {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  
  const loginTime = await sauceDemoPage.measureLoginTime(username, password);
  this.setTestData('loginTime', loginTime);
  
  logger.info(`Login time for ${username}: ${loginTime}ms`);
});

When('I set the viewport to mobile size', async function (this: CustomWorld) {
  await this.page!.setViewportSize({ width: 375, height: 667 });
  logger.info('Set viewport to mobile size (375x667)');
});

// SauceDemo specific assertions
Then('I should be logged in successfully', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.assertLoggedIn();
  
  logger.info('Verified user is logged in successfully');
});

Then('I should be logged out successfully', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.assertLoggedOut();
  
  logger.info('Verified user is logged out successfully');
});

Then('I should see the products page', async function (this: CustomWorld) {
  // Check for inventory container and products title
  await expect(this.page!.locator('.inventory_container')).toBeVisible();
  await expect(this.page!.locator('.title')).toBeVisible();
  
  const title = await this.page!.locator('.title').textContent();
  expect(title).toBe('Products');
  
  logger.info('Verified products page is displayed');
});

Then('the page title should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const pageTitle = await this.page!.locator('.title').textContent();
  expect(pageTitle).toContain(expectedText);
  
  logger.info(`Verified page title contains: ${expectedText}`);
});

Then('I should see a login error message', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const hasError = await sauceDemoPage.hasLoginError();
  expect(hasError).toBe(true);
  
  logger.info('Verified login error message is displayed');
});

Then('the error message should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const errorMessage = await sauceDemoPage.getLoginErrorMessage();
  expect(errorMessage).toContain(expectedText);
  
  logger.info(`Verified error message contains: ${expectedText}`);
});

Then('the error message should be hidden', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const hasError = await sauceDemoPage.hasLoginError();
  expect(hasError).toBe(false);
  
  logger.info('Verified error message is hidden');
});

Then('the login should complete within {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  const loginTime = this.getTestData<number>('loginTime');
  const maxTimeMs = maxSeconds * 1000;
  
  expect(loginTime).toBeLessThan(maxTimeMs);
  logger.info(`Verified login completed within ${maxSeconds} seconds (actual: ${loginTime}ms)`);
});

Then('the username field should be visible and enabled', async function (this: CustomWorld) {
  const usernameField = this.page!.locator('[data-test="username"]');
  await expect(usernameField).toBeVisible();
  await expect(usernameField).toBeEnabled();
  
  logger.info('Verified username field is visible and enabled');
});

Then('the password field should be visible and enabled', async function (this: CustomWorld) {
  const passwordField = this.page!.locator('[data-test="password"]');
  await expect(passwordField).toBeVisible();
  await expect(passwordField).toBeEnabled();
  
  logger.info('Verified password field is visible and enabled');
});

Then('the login button should be visible and enabled', async function (this: CustomWorld) {
  const loginButton = this.page!.locator('[data-test="login-button"]');
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();
  
  logger.info('Verified login button is visible and enabled');
});

Then('the SauceDemo logo should be visible', async function (this: CustomWorld) {
  const logo = this.page!.locator('.login_logo');
  await expect(logo).toBeVisible();
  
  logger.info('Verified SauceDemo logo is visible');
});

Then('I should see the shopping cart icon', async function (this: CustomWorld) {
  const cartIcon = this.page!.locator('.shopping_cart_link');
  await expect(cartIcon).toBeVisible();
  
  logger.info('Verified shopping cart icon is visible');
});

Then('I should see the menu button', async function (this: CustomWorld) {
  const menuButton = this.page!.locator('#react-burger-menu-btn');
  await expect(menuButton).toBeVisible();
  
  logger.info('Verified menu button is visible');
});

Then('the page URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain(urlPart);
  
  logger.info(`Verified URL contains: ${urlPart}`);
});

Then('the page URL should not contain {string}', async function (this: CustomWorld, urlPart: string) {
  const currentUrl = this.page!.url();
  expect(currentUrl).not.toContain(urlPart);
  
  logger.info(`Verified URL does not contain: ${urlPart}`);
});

Then('the password field should mask the input', async function (this: CustomWorld) {
  const passwordField = this.page!.locator('[data-test="password"]');
  const inputType = await passwordField.getAttribute('type');
  expect(inputType).toBe('password');
  
  logger.info('Verified password field masks input');
});

Then('the password field type should be {string}', async function (this: CustomWorld, expectedType: string) {
  const passwordField = this.page!.locator('[data-test="password"]');
  const inputType = await passwordField.getAttribute('type');
  expect(inputType).toBe(expectedType);
  
  logger.info(`Verified password field type is: ${expectedType}`);
});

// Accessibility assertions
Then('the username field should have proper accessibility attributes', async function (this: CustomWorld) {
  const usernameField = this.page!.locator('[data-test="username"]');
  
  // Check for accessibility attributes
  const placeholder = await usernameField.getAttribute('placeholder');
  expect(placeholder).toBeTruthy();
  
  const name = await usernameField.getAttribute('name');
  expect(name).toBeTruthy();
  
  logger.info('Verified username field has proper accessibility attributes');
});

Then('the password field should have proper accessibility attributes', async function (this: CustomWorld) {
  const passwordField = this.page!.locator('[data-test="password"]');
  
  // Check for accessibility attributes
  const placeholder = await passwordField.getAttribute('placeholder');
  expect(placeholder).toBeTruthy();
  
  const name = await passwordField.getAttribute('name');
  expect(name).toBeTruthy();
  
  const type = await passwordField.getAttribute('type');
  expect(type).toBe('password');
  
  logger.info('Verified password field has proper accessibility attributes');
});

Then('the login button should have proper accessibility attributes', async function (this: CustomWorld) {
  const loginButton = this.page!.locator('[data-test="login-button"]');
  
  // Check for accessibility attributes
  const type = await loginButton.getAttribute('type');
  expect(type).toBe('submit');
  
  const value = await loginButton.getAttribute('value');
  expect(value).toBeTruthy();
  
  logger.info('Verified login button has proper accessibility attributes');
});

Then('all login elements should be visible', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  await sauceDemoPage.assertLoginFormVisible();
  
  // Additional checks for mobile
  const logo = this.page!.locator('.login_logo');
  await expect(logo).toBeVisible();
  
  logger.info('Verified all login elements are visible on mobile viewport');
});

// Performance and monitoring steps
When('I take a SauceDemo login screenshot', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const screenshot = await sauceDemoPage.takeLoginPageScreenshot();
  
  // Attach screenshot to test report
  this.attach(screenshot, 'image/png');
  
  logger.info('Took SauceDemo login page screenshot');
});

// Data validation steps
Then('I should see all accepted usernames are valid', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const acceptedUsernames = sauceDemoPage.getAcceptedUsernames();
  
  // Verify we have the expected usernames
  const expectedUsernames = [
    'standard_user',
    'locked_out_user', 
    'problem_user',
    'performance_glitch_user',
    'error_user',
    'visual_user'
  ];
  
  expect(acceptedUsernames).toEqual(expectedUsernames);
  logger.info(`Verified accepted usernames: ${acceptedUsernames.join(', ')}`);
});

// User type specific validations
Then('the user {string} should be identified as locked', async function (this: CustomWorld, username: string) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const isLocked = sauceDemoPage.isUserLocked(username);
  expect(isLocked).toBe(true);
  
  logger.info(`Verified ${username} is identified as locked user`);
});

Then('the user {string} should be identified as problem user', async function (this: CustomWorld, username: string) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const isProblemUser = sauceDemoPage.isProblemUser(username);
  expect(isProblemUser).toBe(true);
  
  logger.info(`Verified ${username} is identified as problem user`);
});

// Error message validation with specific SauceDemo messages
Then('I should see the locked out user error', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const expectedMessage = sauceDemoPage.getExpectedErrorMessage('locked_out');
  await sauceDemoPage.assertLoginError(expectedMessage);
  
  logger.info('Verified locked out user error message');
});

Then('I should see the invalid credentials error', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const expectedMessage = sauceDemoPage.getExpectedErrorMessage('invalid_credentials');
  await sauceDemoPage.assertLoginError(expectedMessage);
  
  logger.info('Verified invalid credentials error message');
});

Then('I should see the missing username error', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const expectedMessage = sauceDemoPage.getExpectedErrorMessage('missing_username');
  await sauceDemoPage.assertLoginError(expectedMessage);
  
  logger.info('Verified missing username error message');
});

Then('I should see the missing password error', async function (this: CustomWorld) {
  const sauceDemoPage = new SauceDemoLoginPage(this.page!);
  const expectedMessage = sauceDemoPage.getExpectedErrorMessage('missing_password');
  await sauceDemoPage.assertLoginError(expectedMessage);
  
  logger.info('Verified missing password error message');
});
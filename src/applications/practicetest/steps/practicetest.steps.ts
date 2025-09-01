import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../../common/steps/hooks';
import { PracticeTestLoginPage } from '../pages/PracticeTestLoginPage';
import { logger } from '../../../utils/logger';

// Page navigation
Given('I am on the Practice Test Automation login page', async function (this: CustomWorld) {
  await this.initializeBrowser();
  
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.navigateToLoginPage();
  
  logger.info('Navigated to Practice Test Automation login page');
});

// Success page verifications
Then('I should be redirected to the success page', async function (this: CustomWorld) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.verifySuccessPageUrl();
  
  logger.info('Verified user is redirected to success page');
});

Then('I should see the success message', async function (this: CustomWorld) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.verifySuccessMessage();
  
  logger.info('Verified success message is displayed');
});

Then('I should see the logout button', async function (this: CustomWorld) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.verifyLogoutButton();
  
  logger.info('Verified logout button is displayed');
});

// Error message verifications
Then('I should see an error message', async function (this: CustomWorld) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.verifyErrorMessage();
  
  logger.info('Verified error message is displayed');
});

Then('the error message should be {string}', async function (this: CustomWorld, expectedMessage: string) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.verifyErrorMessageText(expectedMessage);
  
  logger.info(`Verified error message text: ${expectedMessage}`);
});

// Additional helper steps
When('I logout from Practice Test Automation', async function (this: CustomWorld) {
  const practiceTestPage = new PracticeTestLoginPage(this.page!);
  await practiceTestPage.logout();
  
  logger.info('Logged out from Practice Test Automation');
});

Then('I should be back on the login page', async function (this: CustomWorld) {
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain('practice-test-login');
  
  logger.info('Verified user is back on login page');
});
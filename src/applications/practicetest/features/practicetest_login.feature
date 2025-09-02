@ui @practicetest @login
Feature: Practice Test Automation Login
  As a user of the Practice Test Automation website
  I want to be able to login with valid credentials
  So that I can access the secured area

  Background:
    Given I am on the Practice Test Automation login page

  @positive @smoke
  Scenario: Positive LogIn test
    When I login with username "student" and password "Password123"
    Then I should be redirected to the success page
    And I should see the success message
    And I should see the logout button

  @negative @invalid_username
  Scenario: Negative username test
    When I login with username "incorrectUser" and password "Password123"
    Then I should see an error message
    And the error message should be "Your username is invalid!"

  @negative @invalid_password
  Scenario: Negative password test
    When I login with username "student" and password "incorrectPassword"
    Then I should see an error message
    And the error message should be "Your password is invalid!"
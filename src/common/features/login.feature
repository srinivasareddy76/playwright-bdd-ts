@ui @login
Feature: User Login
  As a user of the application
  I want to be able to log in with my credentials
  So that I can access the protected features

  Background:
    Given I am on the login page

  @smoke @positive
  Scenario: Successful login with valid credentials
    When I login with the configured credentials
    Then I should be logged in
    And I should be redirected to the dashboard

  @negative
  Scenario: Failed login with invalid username
    When I login with username "invalid_user" and password "valid_password"
    Then I should see a login error
    And I should see an invalid credentials error
    And I should remain on the login page

  @negative
  Scenario: Failed login with invalid password
    When I enter the configured username
    And I enter password "invalid_password"
    And I click the login button
    Then I should see a login error
    And I should not be logged in

  @negative
  Scenario: Failed login with empty credentials
    When I enter username ""
    And I enter password ""
    And I click the login button
    Then I should see a login error
    And the login form should be visible

  @positive
  Scenario: Login form validation
    Then I should see the login form
    And the login button should be enabled
    And the username field should be empty

  @positive
  Scenario: Successful logout after login
    Given I am already logged in
    When I logout
    Then I should be logged out
    And I should see the login form

  @ui @accessibility
  Scenario: Login form accessibility
    Then the element "[data-testid='username']" should be visible
    And the element "[data-testid='password']" should be visible
    And the element "[data-testid='login']" should be visible
    And the element "[data-testid='username']" should have attribute "type" with value "text"
    And the element "[data-testid='password']" should have attribute "type" with value "password"

  @positive @session
  Scenario: Remember login session
    When I login with the configured credentials
    And I refresh the page
    Then I should still be logged in
    And I should not see the login form

  @negative @security
  Scenario Outline: Login with various invalid credential combinations
    When I login with username "<username>" and password "<password>"
    Then I should see a login error
    And I should remain on the login page

    Examples:
      | username     | password        |
      | admin        | wrong_password  |
      | wrong_user   | admin          |
      | ""           | admin          |
      | admin        | ""             |
      | test@test    | 123            |

  @performance
  Scenario: Login performance
    When I record the query start time
    And I login with the configured credentials
    Then the query execution time should be less than 5000 milliseconds
    And I should be logged in
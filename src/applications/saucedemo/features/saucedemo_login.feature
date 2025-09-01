@ui @saucedemo @login
Feature: SauceDemo Login Functionality
  As a user of SauceDemo application
  I want to be able to log in with different user types
  So that I can access the inventory and shopping features

  Background:
    Given I am on the SauceDemo login page

  @smoke @positive
  Scenario: Successful login with standard user
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    And the page title should contain "Products"

  @positive
  Scenario: Successful login and logout with standard user
    Given I login with username "standard_user" and password "secret_sauce"
    And I should be logged in successfully
    When I logout from the application
    Then I should be logged out successfully
    And I should see the login form

  @negative @locked_user
  Scenario: Login attempt with locked out user
    When I login with username "locked_out_user" and password "secret_sauce"
    Then I should see a login error message
    And the error message should contain "Sorry, this user has been locked out"
    And I should remain on the login page

  @negative @invalid_credentials
  Scenario: Login with invalid username
    When I login with username "invalid_user" and password "secret_sauce"
    Then I should see a login error message
    And the error message should contain "Username and password do not match any user"
    And I should remain on the login page

  @negative @invalid_credentials
  Scenario: Login with invalid password
    When I login with username "standard_user" and password "invalid_password"
    Then I should see a login error message
    And the error message should contain "Username and password do not match any user"
    And I should remain on the login page

  @negative @empty_fields
  Scenario: Login with empty username
    When I enter username ""
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see a login error message
    And the error message should contain "Username is required"

  @negative @empty_fields
  Scenario: Login with empty password
    When I enter username "standard_user"
    And I enter password ""
    And I click the login button
    Then I should see a login error message
    And the error message should contain "Password is required"

  @negative @empty_fields
  Scenario: Login with both fields empty
    When I enter username ""
    And I enter password ""
    And I click the login button
    Then I should see a login error message
    And the error message should contain "Username is required"

  @positive @problem_user
  Scenario: Login with problem user
    When I login with username "problem_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    # Note: Problem user may have visual/functional issues but login succeeds

  @positive @performance_user
  Scenario: Login with performance glitch user
    When I login with username "performance_glitch_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    # Note: This user may have slower performance but login succeeds

  @positive @error_user
  Scenario: Login with error user
    When I login with username "error_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    # Note: Error user may have issues in other parts of the app but login succeeds

  @positive @visual_user
  Scenario: Login with visual user
    When I login with username "visual_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    # Note: Visual user may have visual differences but login succeeds

  @ui @form_validation
  Scenario: Login form elements are present and functional
    Then I should see the login form
    And the username field should be visible and enabled
    And the password field should be visible and enabled
    And the login button should be visible and enabled
    And the SauceDemo logo should be visible

  @ui @error_handling
  Scenario: Error message can be dismissed
    When I login with username "invalid_user" and password "secret_sauce"
    And I should see a login error message
    When I click the error dismiss button
    Then the error message should be hidden

  @performance
  Scenario: Standard user login performance
    When I measure the login time for "standard_user" with password "secret_sauce"
    Then the login should complete within 5 seconds
    And I should be logged in successfully

  @performance
  Scenario: Performance glitch user login time
    When I measure the login time for "performance_glitch_user" with password "secret_sauce"
    Then the login should complete within 10 seconds
    And I should be logged in successfully

  @accessibility
  Scenario: Login form accessibility
    Then the username field should have proper accessibility attributes
    And the password field should have proper accessibility attributes
    And the login button should have proper accessibility attributes

  @security
  Scenario: Password field should mask input
    When I enter password "secret_sauce"
    Then the password field should mask the input
    And the password field type should be "password"

  @data_driven
  Scenario Outline: Login with different valid users
    When I login with username "<username>" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page

    Examples:
      | username              |
      | standard_user         |
      | problem_user          |
      | performance_glitch_user |
      | error_user            |
      | visual_user           |

  @data_driven @negative
  Scenario Outline: Login with invalid credentials combinations
    When I login with username "<username>" and password "<password>"
    Then I should see a login error message
    And I should remain on the login page

    Examples:
      | username      | password        |
      | invalid_user  | secret_sauce    |
      | standard_user | wrong_password  |
      | empty_user    | secret_sauce    |
      | standard_user | empty_password  |
      | invalid_user  | wrong_password  |

  @regression
  Scenario: Complete login workflow with standard user
    # Login
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be logged in successfully
    And I should see the products page
    
    # Verify we're on the right page
    And the page URL should contain "inventory.html"
    And I should see the shopping cart icon
    And I should see the menu button
    
    # Logout
    When I logout from the application
    Then I should be logged out successfully
    And I should see the login form
    And the page URL should not contain "inventory.html"

  @edge_cases
  Scenario: Login with username containing special characters
    When I login with username "user@domain.com" and password "secret_sauce"
    Then I should see a login error message
    And the error message should contain "Username and password do not match any user"

  @edge_cases
  Scenario: Login with very long username
    When I login with username "very_long_username_that_exceeds_normal_length_limits_for_testing_purposes" and password "secret_sauce"
    Then I should see a login error message
    And the error message should contain "Username and password do not match any user"

  @browser_compatibility
  Scenario: Login form works across different viewport sizes
    Given I set the viewport to mobile size
    Then I should see the login form
    And all login elements should be visible
    When I login with username "standard_user" and password "secret_sauce"
    Then I should be logged in successfully
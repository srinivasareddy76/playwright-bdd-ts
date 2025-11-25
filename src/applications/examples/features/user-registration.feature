
@sample @user-management @data-generation
Feature: User Registration with Dynamic Test Data
  As a test automation engineer
  I want to use dynamic test data generation utilities
  So that I can create comprehensive registration test scenarios

  Background:
    Given I have initialized the utility factory
    And I have configured the test data generator with seed "12345"

  @smoke @positive
  Scenario: Successful user registration with generated data
    Given I generate a new user profile using TestDataGenerator
    And I capture a screenshot before starting registration
    When I navigate to the registration page
    And I fill in the registration form with generated user data:
      | field           | source                    |
      | firstName       | generated.firstName       |
      | lastName        | generated.lastName        |
      | email           | generated.email           |
      | phone           | generated.phone           |
      | dateOfBirth     | generated.dateOfBirth     |
      | address.street  | generated.address.street  |
      | address.city    | generated.address.city    |
      | address.state   | generated.address.state   |
      | address.zipCode | generated.address.zipCode |
    And I generate a secure password using TestDataGenerator
    And I fill in the password fields with the generated password
    And I capture a screenshot of the completed form
    When I submit the registration form
    Then I should see a successful registration message
    And I should receive a confirmation email at the generated email address
    And I capture a success screenshot for reporting
    And I save the generated user data to a test data file

  @negative @validation
  Scenario: Registration validation with invalid data patterns
    Given I generate invalid test data using TestDataGenerator:
      | dataType        | pattern           |
      | invalidEmail    | malformed         |
      | invalidPhone    | wrong_format      |
      | futureDate      | future_birth_date |
      | shortPassword   | weak              |
    When I attempt to register with invalid data
    Then I should see appropriate validation errors
    And I capture failure screenshots for each validation error
    And I log the validation results using FileUtils

  @data-driven @multiple-users
  Scenario Outline: Bulk user registration with different profiles
    Given I generate a user profile for "<userType>" using TestDataGenerator
    And I load additional test data from "<dataFile>" using DataProvider
    When I register the user with profile type "<userType>"
    Then the registration should be "<expectedResult>"
    And I save the test results to the results file

    Examples:
      | userType    | dataFile           | expectedResult |
      | standard    | users/standard.json | success       |
      | premium     | users/premium.json  | success       |
      | enterprise  | users/enterprise.json | success     |
      | minor       | users/minor.json    | validation_error |

  @configuration @environment
  Scenario: Registration with environment-specific configuration
    Given I load configuration for environment "staging" using ConfigManager
    And I generate user data appropriate for the current environment
    When I register using environment-specific endpoints
    Then the registration should use the correct API endpoints
    And the data should be validated according to environment rules
    And I capture environment-specific screenshots

  @file-operations @data-persistence
  Scenario: Registration with file-based data management
    Given I create a temporary test data file using FileUtils
    And I generate multiple user profiles and save them to the file
    When I read the user data from the file for registration
    And I register each user from the file data
    Then all registrations should be processed successfully
    And I create a summary report file with registration results
    And I clean up temporary files after the test

  @date-operations @age-verification
  Scenario: Age verification during registration
    Given I generate users with different age ranges using DateUtils:
      | ageRange | description |
      | minor    | under 18    |
      | adult    | 18-65       |
      | senior   | over 65     |
    When I attempt to register users from each age group
    Then the system should apply appropriate age-based validations
    And I should see age-specific registration flows
    And I capture screenshots for each age verification scenario

  @browser-management @cross-browser
  Scenario: Cross-browser registration testing
    Given I initialize multiple browser sessions using DriverManager
    And I generate consistent test data with a fixed seed
    When I perform registration in parallel across different browsers:
      | browser  | viewport |
      | chromium | desktop  |
      | firefox  | desktop  |
      | webkit   | mobile   |
    Then the registration should work consistently across all browsers
    And I capture cross-browser screenshots for comparison
    And I generate a cross-browser compatibility report


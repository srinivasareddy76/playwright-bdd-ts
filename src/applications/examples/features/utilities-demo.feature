

@utilities-demo @sample
Feature: Utilities Demonstration
  As a test automation engineer
  I want to demonstrate the utility classes functionality
  So that I can validate they work correctly

  Background:
    Given I have initialized the utility factory

  @smoke @data-generation
  Scenario: Basic utilities functionality test
    Given I have initialized all utility classes
    And I have configured the test data generator with seed "12345"
    When I generate a new user profile using TestDataGenerator
    And I calculate subscription end dates using DateUtils
    And I create a temporary test data file using FileUtils
    And I save the generated user data to a test data file
    Then I should see a successful registration message
    And I generate a "utilities-demo" report
    And I clean up temporary files after the test

  @data-driven @positive
  Scenario: User data generation and validation
    Given I generate a new user profile using TestDataGenerator
    When I fill in the registration form with generated user data:
      | field           | source                    |
      | firstName       | generated.firstName       |
      | lastName        | generated.lastName        |
      | email           | generated.email           |
      | phone           | generated.phone           |
    Then the registration should be "success"
    And I generate a "user-validation" report

  @file-operations @utilities
  Scenario: File operations demonstration
    Given I create a temporary test data file using FileUtils
    When I generate a new user profile using TestDataGenerator
    And I save the generated user data to a test data file
    Then I generate a "file-operations" report
    And I clean up temporary files after the test



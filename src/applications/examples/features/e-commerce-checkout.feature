

@sample @e-commerce @payment-processing
Feature: E-commerce Checkout with Financial Data Generation
  As a test automation engineer
  I want to test checkout processes with realistic financial data
  So that I can validate payment processing workflows

  Background:
    Given I have initialized all utility classes
    And I have loaded e-commerce configuration using ConfigManager
    And I have set up screenshot capture for the checkout flow

  @payment @credit-card @positive
  Scenario: Successful checkout with generated credit card data
    Given I generate a valid credit card using TestDataGenerator:
      | cardType | Visa |
    And I generate a customer profile for checkout
    And I load product data from "products/electronics.json" using DataProvider
    When I add products to the shopping cart
    And I proceed to checkout
    And I fill in shipping information with generated customer data
    And I select credit card payment method
    And I enter the generated credit card details:
      | field          | source                    |
      | cardNumber     | generated.cardNumber      |
      | expiryDate     | generated.expiryDate      |
      | cvv            | generated.cvv             |
      | cardholderName | generated.cardholderName  |
    And I capture a screenshot of the payment form
    When I submit the payment
    Then the payment should be processed successfully
    And I should receive an order confirmation
    And I capture a success screenshot
    And I save the transaction details to a file using FileUtils

  @payment @multiple-cards @data-driven
  Scenario Outline: Checkout with different credit card types
    Given I generate a "<cardType>" credit card using TestDataGenerator
    And I create a test order with total amount "<amount>"
    When I process payment with the generated card
    Then the payment should be "<expectedResult>"
    And I capture screenshots for "<cardType>" payment flow
    And I log the payment result to the test report

    Examples:
      | cardType   | amount | expectedResult |
      | Visa       | 99.99  | success       |
      | MasterCard | 149.50 | success       |
      | Amex       | 299.99 | success       |
      | Discover   | 49.99  | success       |

  @date-operations @subscription @recurring
  Scenario: Subscription checkout with date calculations
    Given I generate subscription data using DateUtils:
      | subscriptionType | duration |
      | monthly         | 1 month  |
      | quarterly       | 3 months |
      | yearly          | 1 year   |
    And I calculate subscription end dates using DateUtils
    And I generate billing cycles excluding weekends and holidays
    When I create a subscription order
    And I set up recurring payment with generated credit card
    Then the subscription should be created with correct billing dates
    And I should see the next billing date calculated correctly
    And I capture subscription confirmation screenshots
    And I save subscription details with calculated dates to file

  @inventory @stock-management @file-operations
  Scenario: Checkout with inventory validation using file monitoring
    Given I set up file monitoring for inventory updates using FileUtils
    And I load current inventory from "inventory/stock-levels.json"
    And I generate a large order that may affect stock levels
    When I attempt to checkout with the generated order
    And the system updates inventory files during checkout
    Then I should detect inventory file changes using FileUtils
    And the checkout should validate stock availability
    And I should capture inventory change notifications
    And I create an inventory impact report

  @configuration @multi-environment @shipping
  Scenario: Environment-specific shipping and tax calculations
    Given I load shipping configuration for environment using ConfigManager
    And I generate addresses in different tax jurisdictions:
      | jurisdiction | taxRate |
      | California   | 8.25%   |
      | New York     | 8.00%   |
      | Texas        | 6.25%   |
      | Oregon       | 0.00%   |
    When I calculate shipping costs for each address
    And I calculate tax amounts based on jurisdiction
    Then the total amounts should be calculated correctly
    And I should see environment-specific shipping options
    And I capture tax calculation screenshots for each jurisdiction
    And I generate a tax calculation report using FileUtils

  @browser-compatibility @checkout-flow
  Scenario: Cross-browser checkout process validation
    Given I initialize browser sessions for cross-browser testing using DriverManager
    And I generate consistent test data with seed "checkout-2024"
    And I prepare identical shopping carts for each browser
    When I perform checkout simultaneously in multiple browsers:
      | browser  | device  | viewport |
      | chromium | desktop | 1920x1080 |
      | firefox  | desktop | 1920x1080 |
      | webkit   | tablet  | 768x1024  |
    Then the checkout flow should work consistently across browsers
    And payment processing should succeed in all browsers
    And I capture comparative screenshots across browsers
    And I generate a cross-browser compatibility report

  @performance @load-testing @data-generation
  Scenario: Checkout performance with bulk order generation
    Given I generate multiple customer profiles using TestDataGenerator
    And I create a performance test dataset with 100 orders
    And I set up performance monitoring using DriverManager
    When I process multiple checkouts in parallel
    And I monitor response times for each checkout step
    Then all checkouts should complete within acceptable time limits
    And I should capture performance metrics
    And I generate a performance test report with statistics
    And I clean up test data files after performance testing

  @security @payment-validation @negative
  Scenario: Security validation with invalid payment data
    Given I generate invalid credit card data patterns:
      | invalidType     | pattern        |
      | expiredCard     | past_date      |
      | invalidNumber   | wrong_checksum |
      | invalidCVV      | wrong_length   |
      | blockedCard     | test_blocked   |
    When I attempt checkout with each invalid payment method
    Then the system should reject invalid payment data
    And I should see appropriate security error messages
    And I capture security validation screenshots
    And I log security test results for compliance reporting

  @data-persistence @order-history @reporting
  Scenario: Order data persistence and reporting
    Given I create a temporary order tracking file using FileUtils
    And I generate multiple test orders with different statuses
    When I process orders and track status changes
    And I save order history to the tracking file
    Then I should be able to query order data using DataProvider
    And I generate order summary reports
    And I create order analytics with date-based filtering using DateUtils
    And I export order data in multiple formats (JSON, CSV, YAML)
    And I clean up temporary files maintaining audit trail







@sample @visual-testing @screenshots @cross-browser
Feature: Advanced Visual Testing and Screenshot Management
  As a test automation engineer
  I want to demonstrate comprehensive visual testing capabilities
  So that I can detect visual regressions and UI inconsistencies

  Background:
    Given I have initialized ScreenshotUtils with advanced configuration
    And I have set up DriverManager for multi-browser testing
    And I have configured visual comparison thresholds

  @screenshot-capture @full-page @responsive
  Scenario: Comprehensive screenshot capture across viewports
    Given I configure multiple viewport sizes for testing:
      | device    | width | height | description        |
      | mobile    | 375   | 667    | iPhone SE          |
      | tablet    | 768   | 1024   | iPad               |
      | desktop   | 1920  | 1080   | Full HD Desktop    |
      | ultrawide | 2560  | 1440   | Ultrawide Monitor  |
    When I navigate to the application homepage
    And I capture full-page screenshots for each viewport
    And I capture element-specific screenshots for key components:
      | element     | selector           | description      |
      | header      | .main-header       | Site header      |
      | navigation  | .nav-menu          | Main navigation  |
      | hero        | .hero-section      | Hero banner      |
      | footer      | .site-footer       | Site footer      |
    Then all screenshots should be captured successfully
    And screenshots should be organized by viewport and element
    And I should generate a visual testing report with all captures
    And I clean up old screenshots maintaining recent versions

  @visual-comparison @regression @baseline
  Scenario: Visual regression testing with baseline comparison
    Given I have established baseline screenshots for the application
    And I configure visual comparison with tolerance settings:
      | metric          | threshold |
      | pixel-diff      | 0.1%      |
      | layout-shift    | 5px       |
      | color-variance  | 2%        |
    When I capture current screenshots of all key pages
    And I compare current screenshots with baseline images
    And I analyze differences using ScreenshotUtils comparison
    Then I should identify any visual regressions
    And differences should be highlighted in comparison reports
    And I should generate diff images showing changes
    And I update baselines for approved changes

  @cross-browser @compatibility @parallel
  Scenario: Cross-browser visual consistency testing
    Given I initialize multiple browser sessions using DriverManager:
      | browser  | version | platform |
      | chromium | latest  | desktop  |
      | firefox  | latest  | desktop  |
      | webkit   | latest  | desktop  |
    And I generate consistent test data for all browsers
    When I navigate to the same pages in all browsers simultaneously
    And I capture identical screenshots across all browsers
    And I compare screenshots between different browsers
    Then visual rendering should be consistent across browsers
    And any browser-specific differences should be documented
    And I generate cross-browser compatibility reports
    And I capture browser-specific rendering issues

  @element-screenshots @component-testing @isolation
  Scenario: Component-level visual testing and isolation
    Given I identify key UI components for isolated testing:
      | component    | selector              | variations        |
      | button       | .btn                  | primary, secondary |
      | form-field   | .form-group           | valid, invalid     |
      | modal        | .modal-dialog         | small, large       |
      | card         | .card-component       | with/without image |
    When I capture screenshots of each component in isolation
    And I test component variations and states
    And I capture hover and focus states for interactive elements
    Then each component should render consistently
    And state changes should be visually documented
    And I should create a component visual library
    And I generate component testing reports

  @failure-screenshots @error-handling @debugging
  Scenario: Automatic failure screenshot capture and analysis
    Given I configure automatic screenshot capture on test failures
    And I set up error context capture with metadata
    When I execute tests that may fail due to various reasons:
      | failureType    | scenario                    |
      | element-missing| element not found           |
      | timeout        | page load timeout           |
      | assertion      | visual assertion failure    |
      | network        | network request failure     |
    And test failures occur during execution
    Then failure screenshots should be captured automatically
    And screenshots should include error context and metadata
    And failure analysis should be performed automatically
    And I should generate failure investigation reports

  @screenshot-annotation @markup @documentation
  Scenario: Screenshot annotation and markup for documentation
    Given I capture screenshots of key application features
    When I add annotations and markup to screenshots:
      | annotationType | description              | style     |
      | highlight      | Important UI elements    | red box   |
      | callout        | Feature explanations     | arrow     |
      | blur           | Sensitive information    | blur      |
      | text-overlay   | Step-by-step instructions| text box  |
    And I create annotated screenshot sequences for user guides
    And I generate interactive screenshot documentation
    Then annotated screenshots should clearly communicate features
    And documentation should be visually comprehensive
    And I should create reusable annotation templates
    And I export annotated screenshots for external documentation

  @performance @screenshot-optimization @storage
  Scenario: Screenshot performance optimization and storage management
    Given I configure screenshot optimization settings:
      | setting        | value    | purpose                |
      | compression    | 80%      | reduce file size       |
      | format         | WebP     | modern efficient format|
      | max-width      | 1920px   | limit resolution       |
      | quality        | high     | maintain visual quality|
    When I capture large numbers of screenshots during testing
    And I apply optimization and compression automatically
    And I implement intelligent storage management
    Then screenshot file sizes should be optimized
    And storage usage should be managed efficiently
    And screenshot quality should remain acceptable
    And I generate storage usage and optimization reports

  @sequential-screenshots @user-flow @storytelling
  Scenario: Sequential screenshot capture for user flow documentation
    Given I define a complete user journey for documentation:
      | step | action                    | screenshot-name        |
      | 1    | Landing page visit        | 01-landing-page        |
      | 2    | User registration         | 02-registration-form   |
      | 3    | Email verification        | 03-email-verification  |
      | 4    | Profile setup             | 04-profile-setup       |
      | 5    | Dashboard first visit     | 05-dashboard-welcome   |
    When I execute the user journey step by step
    And I capture screenshots at each significant step
    And I add contextual metadata to each screenshot
    Then I should have a complete visual story of the user journey
    And screenshots should be sequentially organized
    And I should generate an interactive user flow documentation
    And I create animated sequences from sequential screenshots

  @mobile-testing @device-emulation @responsive-design
  Scenario: Mobile device visual testing and responsive design validation
    Given I configure mobile device emulation using DriverManager:
      | device         | orientation | screen-size |
      | iPhone 12      | portrait    | 390x844     |
      | iPhone 12      | landscape   | 844x390     |
      | Samsung Galaxy | portrait    | 360x740     |
      | iPad Pro       | portrait    | 834x1194    |
    When I test responsive design across all device configurations
    And I capture screenshots showing responsive breakpoints
    And I validate touch-friendly interface elements
    Then responsive design should adapt correctly to each device
    And touch targets should be appropriately sized
    And I should document responsive design behavior
    And I generate mobile compatibility reports

  @accessibility @visual-accessibility @compliance
  Scenario: Visual accessibility testing and compliance validation
    Given I configure accessibility-focused screenshot capture
    When I capture screenshots with accessibility overlays:
      | overlay-type     | purpose                    |
      | color-contrast   | validate contrast ratios   |
      | focus-indicators | highlight focus states     |
      | alt-text-missing | identify missing alt text  |
      | heading-structure| show heading hierarchy     |
    And I analyze visual accessibility compliance
    And I generate accessibility violation reports
    Then accessibility issues should be visually documented
    And compliance reports should include visual evidence
    And I should create accessibility improvement recommendations
    And I track accessibility improvements over time





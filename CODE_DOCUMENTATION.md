# Code Documentation - Playwright BDD TypeScript Framework

This document provides comprehensive documentation for all relevant files in the Playwright BDD TypeScript framework, including their purpose, classes, methods, and usage.

## Table of Contents

1. [Configuration Files](#configuration-files)
2. [Application-Specific Code](#application-specific-code)
3. [Common/Shared Code](#commonshared-code)
4. [Feature Files](#feature-files)
5. [Utility Files](#utility-files)

---

## Configuration Files

### `config/index.ts`
**Purpose**: Main configuration loader that reads environment-specific settings and provides centralized configuration management with runtime overrides.

**Key Functions**:
- `loadConfig()`: Loads configuration based on APP_ENV environment variable (defaults to T5)
- `getAppEnv()`: Returns current environment name
- `isOnPremEnv()`: Checks if current environment is on-premise
- `isCloudEnv()`: Checks if current environment is cloud-based
- `loadConfigFile(envName)`: Loads and validates configuration from JSON file
- `applyEnvironmentOverrides(config)`: Applies runtime environment variable overrides
- `getEnvGroup(envName)`: Determines environment group (dev/test/uat/onprem)

**Environment Groups**:
- **dev**: D1, D2, D3 (Development environments)
- **test**: T1, T2, T3, T4, T5 (Test environments)
- **uat**: U1, U2, U3, U4 (User Acceptance Test environments)
- **onprem**: QD1, QD2, QD3, QD4 (On-premise environments)

**Runtime Overrides**: Supports environment variable overrides for:
- Application settings (APP_BASE_URL, APP_USERNAME, APP_PASSWORD)
- Oracle database (ORACLE_HOST, ORACLE_PORT, ORACLE_SERVICE_NAME, etc.)
- PostgreSQL database (POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, etc.)
- Client certificates (PFX_PATH, PFX_PASSPHRASE, CERT_ORIGIN)

**Usage**: Entry point for all configuration needs with caching and validation.

### `config/schema.ts`
**Purpose**: Defines Zod schema for validating configuration objects with comprehensive type safety and runtime validation.

**Key Schema Sections**:
- `ConfigSchema`: Main configuration schema with validation rules
- `Config`: TypeScript type inferred from schema
- `validateConfig(config)`: Validates configuration object against schema

**Configuration Structure**:
- **name**: Environment name (e.g., "Test Environment T5")
- **group**: Environment group classification (dev/test/uat/onprem)
- **app**: Application configuration (baseUrl, username, password)
- **db**: Database configurations
  - **oracle**: Oracle database settings with connection pooling
  - **postgres**: PostgreSQL settings with SSL support
- **certs**: Certificate configuration for mTLS authentication

**Validation Features**:
- URL validation for baseUrl and origin fields
- Port number validation (positive integers)
- Connection pool configuration with defaults
- Custom validation rules (e.g., serviceName OR connectString required)
- SSL configuration for secure database connections
- Default values for optional properties

**Usage**: Ensures type safety and runtime validation for all configuration objects.

### `config/env/`
**Purpose**: Contains environment-specific configuration files (T5.json, T3.json, U1.json, etc.).

**Structure**: Each file contains environment-specific settings like URLs, credentials, and feature flags.

---

## Application-Specific Code

### SauceDemo Application (`src/applications/saucedemo/`)

#### `pages/SauceDemoLoginPage.ts`
**Purpose**: Comprehensive Page Object Model implementation for SauceDemo login functionality with advanced testing features.

**Class**: `SauceDemoLoginPage extends BasePage`

**Key Properties**:
- `selectors`: CSS selectors for all page elements (username input, password input, login button, error messages, etc.)

**Navigation Methods**:
- `goto(baseUrl?)`: Navigates to SauceDemo login page with network idle wait
- `waitForLoginForm()`: Waits for complete login form visibility

**Input Methods**:
- `enterUsername(username)`: Clears and fills username field
- `enterPassword(password)`: Clears and fills password field (with logging security)
- `clickLoginButton(timeout?)`: Clicks login button with configurable timeout
- `login(username, password)`: Complete login flow with performance user handling

**Authentication Methods**:
- `logout()`: Complete logout flow (menu → logout link → verification)

**Validation Methods**:
- `isLoginFormVisible()`: Checks login form visibility
- `isLoggedIn()`: Verifies successful login by checking inventory page
- `isLoginButtonEnabled()`: Checks login button state
- `hasLoginError()`: Detects presence of error messages
- `getLoginErrorMessage()`: Retrieves error message text
- `getUsername()` / `getPassword()`: Gets current field values
- `clearErrorMessage()`: Dismisses error messages

**Assertion Methods**:
- `assertLoginFormVisible()`: Asserts complete login form visibility
- `assertLoggedIn()`: Asserts successful login state
- `assertLoggedOut()`: Asserts logout state
- `assertLoginError(expectedMessage?)`: Asserts error with optional message verification
- `assertNoLoginError()`: Asserts no error is displayed

**SauceDemo-Specific Methods**:
- `getAcceptedUsernames()`: Returns array of valid usernames
- `getValidPassword()`: Returns 'secret_sauce'
- `isUserLocked(username)`: Checks for locked_out_user
- `isProblemUser(username)`: Checks for problem_user
- `isPerformanceUser(username)`: Checks for performance_glitch_user
- `isErrorUser(username)`: Checks for error_user
- `isVisualUser(username)`: Checks for visual_user
- `getExpectedErrorMessage(scenario)`: Returns expected error messages for different scenarios

**Performance & Testing Methods**:
- `measureLoginTime(username, password)`: Measures login duration in milliseconds
- `takeLoginPageScreenshot(name?)`: Captures full-page screenshots for visual testing

**Special Features**:
- Handles performance_glitch_user with extended timeouts (15s vs 10s)
- Comprehensive error message mapping for different failure scenarios
- Visual testing support with screenshot capabilities
- Robust element waiting with fallback handling

**Usage**: Provides complete SauceDemo login testing capabilities with support for all user types and scenarios.

#### `steps/saucedemo.steps.ts`
**Purpose**: Cucumber step definitions specific to SauceDemo application testing.

**Key Step Definitions**:
- `Given('I am on the SauceDemo login page')`: Navigation step
- `When('I enter username {string} and password {string}')`: Credential input step
- `When('I click the login button')`: Login action step
- `Then('I should see the products page')`: Success verification step
- `Then('I should see error message {string}')`: Error verification step

**Usage**: Bridges Gherkin feature files with page object implementations.

### PracticeTest Application (`src/applications/practicetest/`)

#### `pages/PracticeTestLoginPage.ts`
**Purpose**: Page Object Model for PracticeTest.net login functionality.

**Class**: `PracticeTestLoginPage`
**Methods**:
- `constructor(page: Page)`: Initializes with Playwright page instance
- `navigateToLogin()`: Navigates to PracticeTest login page
- `enterUsername(username: string)`: Fills username field
- `enterPassword(password: string)`: Fills password field
- `clickSubmit()`: Submits the login form
- `getSuccessMessage()`: Gets success message after login
- `getErrorMessage()`: Gets error message for failed login
- `isLoggedIn()`: Verifies successful login state

**Usage**: Handles all PracticeTest login page interactions.

#### `steps/practicetest.steps.ts`
**Purpose**: Cucumber step definitions for PracticeTest application scenarios.

**Key Step Definitions**:
- `Given('I navigate to PracticeTest login page')`: Navigation setup
- `When('I enter PracticeTest credentials {string} and {string}')`: Credential entry
- `When('I submit the login form')`: Form submission
- `Then('I should see success message')`: Success validation
- `Then('I should see login error')`: Error validation

**Usage**: Implements BDD steps for PracticeTest scenarios.

### JSONPlaceholder API (`src/applications/jsonplaceholder/`)

#### `api/JsonPlaceholderApiClient.ts`
**Purpose**: API client for JSONPlaceholder REST API interactions.

**Class**: `JsonPlaceholderApiClient`
**Methods**:
- `constructor(baseUrl: string)`: Initializes API client with base URL
- `getPosts()`: Retrieves all posts from /posts endpoint
- `getPost(id: number)`: Retrieves specific post by ID
- `createPost(post: Post)`: Creates new post via POST request
- `updatePost(id: number, post: Post)`: Updates existing post via PUT
- `deletePost(id: number)`: Deletes post by ID
- `getUsers()`: Retrieves all users
- `getUser(id: number)`: Retrieves specific user
- `getComments(postId?: number)`: Gets comments, optionally filtered by post

**Usage**: Centralized API interaction layer for JSONPlaceholder endpoints.

#### `models/ApiModels.ts`
**Purpose**: TypeScript interfaces and types for API data models.

**Interfaces**:
- `Post`: Represents a blog post object
- `User`: Represents a user object
- `Comment`: Represents a comment object
- `Address`: Nested address object within User
- `Company`: Nested company object within User
- `Geo`: Geographic coordinates within Address

**Usage**: Provides type safety for API request/response objects.

#### `data/testData.ts`
**Purpose**: Test data factory and fixtures for API testing.

**Functions**:
- `createTestPost()`: Generates test post data
- `createTestUser()`: Generates test user data
- `createTestComment()`: Generates test comment data
- `getValidPostData()`: Returns valid post test data sets
- `getInvalidPostData()`: Returns invalid data for negative testing

**Usage**: Provides consistent test data across API test scenarios.

#### `steps/api_steps.ts`
**Purpose**: Cucumber step definitions for API testing scenarios.

**Key Step Definitions**:
- `Given('I have a valid API client')`: API client setup
- `When('I send GET request to {string}')`: GET request execution
- `When('I send POST request to {string} with data')`: POST with payload
- `Then('the response status should be {int}')`: Status code validation
- `Then('the response should contain {string}')`: Response content validation
- `Then('the response time should be less than {int}ms')`: Performance validation

**Usage**: Implements BDD steps for API testing scenarios.

---

## Common/Shared Code

### `src/common/pages/BasePage.ts`
**Purpose**: Base page class providing common functionality for all page objects.

**Class**: `BasePage`
**Methods**:
- `constructor(page: Page)`: Initializes with Playwright page instance
- `waitForElement(selector: string, timeout?: number)`: Waits for element visibility
- `clickElement(selector: string)`: Clicks element with error handling
- `fillField(selector: string, value: string)`: Fills input field
- `getText(selector: string)`: Gets text content from element
- `isElementVisible(selector: string)`: Checks element visibility
- `takeScreenshot(name: string)`: Captures screenshot for debugging
- `waitForPageLoad()`: Waits for page to fully load

**Usage**: Extended by all page object classes to inherit common functionality.

### `src/common/pages/LoginPage.ts`
**Purpose**: Generic login page implementation that can be extended by application-specific login pages.

**Class**: `LoginPage`
**Methods**:
- `constructor(page: Page)`: Inherits from BasePage
- `enterCredentials(username: string, password: string)`: Generic credential entry
- `submitForm()`: Generic form submission
- `getValidationMessage()`: Gets form validation messages
- `clearForm()`: Clears all form fields

**Usage**: Base class for application-specific login page implementations.

### `src/common/steps/common.steps.ts`
**Purpose**: Common step definitions used across multiple applications.

**Key Step Definitions**:
- `Given('I wait for {int} seconds')`: Generic wait step
- `When('I take a screenshot')`: Screenshot capture step
- `Then('the page title should be {string}')`: Title validation
- `Then('the current URL should contain {string}')`: URL validation
- `Given('I set browser viewport to {int}x{int}')`: Viewport configuration

**Usage**: Reusable steps that don't belong to specific applications.

### `src/common/steps/hooks.ts`
**Purpose**: Cucumber hooks for test setup, teardown, and lifecycle management.

**Hook Functions**:
- `BeforeAll()`: Global setup before all tests
- `Before()`: Setup before each scenario
- `After()`: Cleanup after each scenario
- `AfterAll()`: Global cleanup after all tests
- `BeforeStep()`: Pre-step actions (logging, screenshots)
- `AfterStep()`: Post-step actions (error handling)

**Usage**: Manages test lifecycle, browser instances, and cleanup operations.

### `src/common/steps/login.steps.ts`
**Purpose**: Generic login step definitions that work across applications.

**Key Step Definitions**:
- `Given('I am on the login page')`: Generic login page navigation
- `When('I enter valid credentials')`: Uses config-based credentials
- `When('I enter invalid credentials')`: Uses test data for negative scenarios
- `Then('I should be logged in successfully')`: Generic success validation
- `Then('I should see a login error')`: Generic error validation

**Usage**: Provides reusable login steps that adapt to different applications.

---

## Feature Files

### `src/applications/saucedemo/features/saucedemo_login.feature`
**Purpose**: BDD scenarios for SauceDemo login functionality testing.

**Scenarios**:
- Successful login with valid credentials
- Failed login with invalid credentials
- Login with locked user account
- Login form validation

**Usage**: Defines test scenarios in business-readable Gherkin syntax.

### `src/applications/practicetest/features/practicetest_login.feature`
**Purpose**: BDD scenarios for PracticeTest login functionality.

**Scenarios**:
- Valid login flow
- Invalid credential handling
- Form field validation
- Success/error message verification

**Usage**: Specifies PracticeTest-specific login test cases.

### `src/applications/jsonplaceholder/features/posts_api.feature`
**Purpose**: API testing scenarios for JSONPlaceholder posts endpoints.

**Scenarios**:
- GET all posts
- GET specific post by ID
- POST new post creation
- PUT post updates
- DELETE post removal
- Error handling for invalid requests

**Usage**: Defines API testing scenarios for posts functionality.

### `src/applications/jsonplaceholder/features/users_api.feature`
**Purpose**: API testing scenarios for user management endpoints.

**Scenarios**:
- Retrieve all users
- Get user by ID
- User data validation
- Error handling for non-existent users

**Usage**: Covers user-related API testing scenarios.

### `src/applications/jsonplaceholder/features/comments_api.feature`
**Purpose**: API testing scenarios for comments functionality.

**Scenarios**:
- Get all comments
- Get comments by post ID
- Comment data structure validation
- Pagination handling

**Usage**: Tests comment-related API endpoints.

### `src/common/features/login.feature`
**Purpose**: Generic login scenarios that can be used across applications.

**Scenarios**:
- Generic successful login
- Generic failed login
- Session management
- Logout functionality

**Usage**: Reusable login scenarios for multiple applications.

### `src/common/features/api_mtls.feature`
**Purpose**: Mutual TLS authentication testing scenarios.

**Scenarios**:
- mTLS certificate validation
- Client certificate authentication
- SSL/TLS handshake verification
- Certificate error handling

**Usage**: Tests secure API communication with client certificates.

### `src/common/features/db_queries.feature`
**Purpose**: Database testing scenarios for data validation.

**Scenarios**:
- Database connection testing
- SQL query execution
- Data integrity validation
- Transaction handling

**Usage**: Validates database operations and data consistency.

---

## Utility Files

### `cucumber.config.ts`
**Purpose**: Cucumber configuration file defining test execution settings.

**Configuration**:
- Feature file paths
- Step definition locations
- Report generation settings
- Parallel execution options
- Browser configuration
- Timeout settings

**Usage**: Central configuration for Cucumber test execution.

### `copy-config.js`
**Purpose**: Utility script for copying configuration files during build process.

**Functions**:
- Copies environment configs to dist folder
- Handles cross-platform file operations
- Maintains directory structure

**Usage**: Build process automation for configuration deployment.

### `package.json`
**Purpose**: Node.js project configuration with dependencies and scripts.

**Key Scripts**:
- `test:t5`: Run tests in T5 environment (SauceDemo)
- `test:t3`: Run tests in T3 environment (PracticeTest)
- `test:api`: Run API tests
- `build`: Compile TypeScript to JavaScript
- `lint`: Run ESLint code quality checks

**Usage**: Project management and script execution entry point.

---

## Architecture Overview

### Design Patterns Used

1. **Page Object Model (POM)**: Encapsulates page interactions in dedicated classes
2. **Factory Pattern**: Used in test data generation
3. **Singleton Pattern**: Configuration management
4. **Strategy Pattern**: Different implementations for different applications

### Framework Structure

```
src/
├── applications/          # Application-specific code
│   ├── saucedemo/        # SauceDemo app implementation
│   ├── practicetest/     # PracticeTest app implementation
│   └── jsonplaceholder/  # API testing implementation
├── common/               # Shared/reusable code
│   ├── pages/           # Base page classes
│   ├── steps/           # Common step definitions
│   └── features/        # Generic feature files
config/                   # Configuration management
├── env/                 # Environment-specific configs
├── index.ts            # Configuration loader
└── schema.ts           # Type definitions
```

### Key Principles

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Common functionality is shared across applications
3. **Type Safety**: TypeScript interfaces ensure compile-time validation
4. **Environment Flexibility**: Easy switching between test environments
5. **Maintainability**: Clear structure and documentation

---

## Usage Guidelines

### Adding New Applications

1. Create new directory under `src/applications/[app-name]/`
2. Implement page objects extending `BasePage`
3. Create application-specific step definitions
4. Add feature files for test scenarios
5. Update configuration with app-specific settings

### Adding New Test Scenarios

1. Write feature file in Gherkin syntax
2. Implement corresponding step definitions
3. Create or extend page objects as needed
4. Add test data if required
5. Update configuration if new endpoints/URLs needed

### Environment Management

1. Add new environment config in `config/env/[ENV].json`
2. Update npm scripts in `package.json`
3. Use cross-env for cross-platform compatibility
4. Test configuration loading with new environment

This documentation provides a comprehensive overview of the framework's codebase, making it easier for developers to understand, maintain, and extend the testing framework.
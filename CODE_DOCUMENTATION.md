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
**Purpose**: Comprehensive Cucumber step definitions specific to SauceDemo application testing with advanced testing capabilities.

**Key Step Definitions**:

**Navigation Steps**:
- `Given('I am on the SauceDemo login page')`: Initializes browser and navigates to SauceDemo login page using config baseUrl

**Authentication Steps**:
- `When('I login with SauceDemo credentials for {string}')`: Performs login with specified user type and valid password
- `When('I logout from the application')`: Executes complete logout flow through menu navigation
- `When('I enter username {string}')`: Fills username field with specified value
- `When('I enter password {string}')`: Fills password field with specified value
- `When('I click the login button')`: Clicks login button and waits for response

**Error Handling Steps**:
- `When('I click the error dismiss button')`: Dismisses error messages by clicking error button
- `Then('I should see a login error message')`: Validates presence of error message
- `Then('the error message should contain {string}')`: Validates specific error message content

**Performance Testing Steps**:
- `When('I measure the login time for {string} with password {string}')`: Measures and stores login duration
- `Then('the login should complete within {int} seconds')`: Validates login performance against threshold

**Viewport and Responsive Steps**:
- `When('I set the viewport to mobile size')`: Sets viewport to mobile dimensions (375x667)
- `Then('all login elements should be visible')`: Validates element visibility across viewport sizes

**Validation Steps**:
- `Then('I should be logged in successfully')`: Asserts successful login state
- `Then('I should be logged out successfully')`: Asserts successful logout state
- `Then('I should see the products page')`: Validates inventory page visibility
- `Then('I should remain on the login page')`: Validates user stays on login page after failed attempt
- `Then('the page title should contain {string}')`: Validates page title content
- `Then('the page URL should contain {string}')`: Validates URL content
- `Then('I should see the shopping cart icon')`: Validates cart icon presence
- `Then('I should see the menu button')`: Validates menu button presence

**Form Validation Steps**:
- `Then('the username field should be visible and enabled')`: Validates username field state
- `Then('the password field should be visible and enabled')`: Validates password field state
- `Then('the login button should be visible and enabled')`: Validates login button state
- `Then('the SauceDemo logo should be visible')`: Validates logo presence

**Accessibility Steps**:
- `Then('the username field should have proper accessibility attributes')`: Validates ARIA attributes
- `Then('the password field should have proper accessibility attributes')`: Validates password field accessibility
- `Then('the login button should have proper accessibility attributes')`: Validates button accessibility

**Security Steps**:
- `Then('the password field should mask the input')`: Validates password masking
- `Then('the password field type should be {string}')`: Validates input type attribute

**Features**:
- Integration with CustomWorld for browser management
- Configuration-based URL navigation
- Test data storage and retrieval
- Comprehensive logging for all actions
- Support for different user types and scenarios
- Performance measurement capabilities
- Responsive design testing support

**Usage**: Implements BDD steps for comprehensive SauceDemo testing including functional, performance, accessibility, and security scenarios.

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
**Purpose**: Comprehensive REST API client for JSONPlaceholder API testing with full CRUD operations and advanced features.

**Class**: `JsonPlaceholderApiClient`

**Properties**:
- `baseUrl`: 'https://jsonplaceholder.typicode.com'
- `defaultHeaders`: Content-Type, Accept, User-Agent headers
- `context`: Playwright APIRequestContext for HTTP operations

**Initialization Methods**:
- `initialize()`: Creates API request context with base URL and headers
- `dispose()`: Cleans up API context resources
- `ensureInitialized()`: Private method ensuring context is ready

**Posts API Methods**:
- `getAllPosts()`: GET /posts - Retrieves all posts (100 items)
- `getPostById(postId)`: GET /posts/{id} - Retrieves specific post
- `getPostsByUserId(userId)`: GET /posts?userId={id} - Filters posts by user
- `createPost(postData)`: POST /posts - Creates new post with title, body, userId
- `updatePost(postId, postData)`: PUT /posts/{id} - Complete post replacement
- `patchPost(postId, partialData)`: PATCH /posts/{id} - Partial post update
- `deletePost(postId)`: DELETE /posts/{id} - Removes post

**Users API Methods**:
- `getAllUsers()`: GET /users - Retrieves all users (10 items)
- `getUserById(userId)`: GET /users/{id} - Retrieves specific user
- `getUserPosts(userId)`: GET /users/{id}/posts - Gets user's posts
- `getUserAlbums(userId)`: GET /users/{id}/albums - Gets user's albums
- `getUserTodos(userId)`: GET /users/{id}/todos - Gets user's todos

**Comments API Methods**:
- `getAllComments()`: GET /comments - Retrieves all comments (500 items)
- `getCommentById(commentId)`: GET /comments/{id} - Retrieves specific comment
- `getPostComments(postId)`: GET /posts/{id}/comments - Gets comments for post
- `getCommentsByPostId(postId)`: GET /comments?postId={id} - Filters comments by post

**Albums API Methods**:
- `getAllAlbums()`: GET /albums - Retrieves all albums (100 items)
- `getAlbumById(albumId)`: GET /albums/{id} - Retrieves specific album
- `getAlbumPhotos(albumId)`: GET /albums/{id}/photos - Gets album photos
- `getUserAlbums(userId)`: GET /users/{id}/albums - Gets user's albums

**Photos API Methods**:
- `getAllPhotos()`: GET /photos - Retrieves all photos (5000 items)
- `getPhotoById(photoId)`: GET /photos/{id} - Retrieves specific photo
- `getAlbumPhotos(albumId)`: GET /photos?albumId={id} - Filters photos by album

**Todos API Methods**:
- `getAllTodos()`: GET /todos - Retrieves all todos (200 items)
- `getTodoById(todoId)`: GET /todos/{id} - Retrieves specific todo
- `getUserTodos(userId)`: GET /todos?userId={id} - Filters todos by user
- `createTodo(todoData)`: POST /todos - Creates new todo
- `updateTodo(todoId, todoData)`: PUT /todos/{id} - Updates todo
- `deleteTodo(todoId)`: DELETE /todos/{id} - Removes todo

**Response Validation Methods**:
- `validatePostResponse(post)`: Validates post object structure
- `validateUserResponse(user)`: Validates user object structure
- `validateCommentResponse(comment)`: Validates comment object structure
- `validateResponseTime(response, maxTime)`: Validates API response time
- `validateStatusCode(response, expectedCode)`: Validates HTTP status codes

**Error Handling Methods**:
- `handleApiError(error, context)`: Comprehensive error handling with logging
- `retryRequest(requestFn, maxRetries)`: Retry mechanism for failed requests
- `validateApiResponse(response)`: Response validation and error detection

**Performance Testing Methods**:
- `measureResponseTime(endpoint)`: Measures API endpoint response time
- `loadTest(endpoint, concurrency, duration)`: Basic load testing capabilities
- `benchmarkEndpoint(endpoint, iterations)`: Performance benchmarking

**Features**:
- Automatic request context management
- Comprehensive logging for all API operations
- Built-in retry mechanisms for reliability
- Response validation and error handling
- Performance measurement capabilities
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Configurable timeouts (30s default)
- Custom headers and authentication support

**Usage**: Provides complete REST API testing capabilities for JSONPlaceholder endpoints with robust error handling and performance monitoring.

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
**Purpose**: Foundation class for all page objects providing common web interaction patterns, waiting strategies, and assertion methods.

**Class**: `BasePage`

**Navigation Methods**:
- `goto(url, options?)`: Navigates to URL with configurable wait conditions (networkidle default)
- `goBack()`: Navigates back to previous page
- `reload()`: Reloads current page with networkidle wait

**Element Interaction Methods**:
- `click(selector, options?)`: Clicks element with optional timeout and force options
- `doubleClick(selector)`: Double-clicks element
- `type(selector, value, options?)`: Types text with optional delay
- `clear(selector)`: Clears input element content
- `selectOption(selector, value)`: Selects dropdown options (single or multiple)
- `check(selector)`: Checks checkbox element
- `uncheck(selector)`: Unchecks checkbox element

**Wait Methods**:
- `waitForVisible(selector, timeout?)`: Waits for element visibility (30s default)
- `waitForHidden(selector, timeout?)`: Waits for element to be hidden
- `waitForEnabled(selector, timeout?)`: Waits for element to be enabled
- `waitForDisabled(selector, timeout?)`: Waits for element to be disabled
- `waitForText(selector, text, timeout?)`: Waits for specific text content
- `waitForPageLoad(timeout?)`: Waits for page load completion

**Information Retrieval Methods**:
- `getText(selector)`: Gets element text content
- `getValue(selector)`: Gets input element value
- `getAttribute(selector, attribute)`: Gets element attribute value
- `isVisible(selector)`: Checks element visibility
- `isEnabled(selector)`: Checks if element is enabled
- `isChecked(selector)`: Checks checkbox state
- `getElementCount(selector)`: Counts matching elements

**Assertion Methods**:
- `assertVisible(selector)`: Asserts element visibility
- `assertHidden(selector)`: Asserts element is hidden
- `assertText(selector, expectedText)`: Asserts element text content
- `assertValue(selector, expectedValue)`: Asserts input value
- `assertEnabled(selector)`: Asserts element is enabled
- `assertDisabled(selector)`: Asserts element is disabled

**Utility Methods**:
- `takeScreenshot(name?)`: Captures page screenshot
- `scrollToElement(selector)`: Scrolls element into view
- `hover(selector)`: Hovers over element
- `focus(selector)`: Focuses element
- `pressKey(key)`: Presses keyboard key
- `uploadFile(selector, filePath)`: Uploads file to input

**Features**:
- Comprehensive logging for all interactions
- Configurable timeouts for all wait operations
- Error handling with detailed error messages
- Support for complex element interactions
- Built-in debugging capabilities

**Usage**: Extended by all page object classes to inherit common functionality and ensure consistent interaction patterns.

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
**Purpose**: Comprehensive BDD scenarios for SauceDemo login functionality testing covering functional, performance, accessibility, and security aspects.

**Feature Tags**: `@ui @saucedemo @login`

**Background**: 
- Navigates to SauceDemo login page before each scenario

**Scenario Categories**:

**Positive Login Scenarios** (`@positive`):
- **Successful login with standard user** (`@smoke`): Basic login validation with products page verification
- **Login and logout workflow**: Complete authentication cycle testing
- **Problem user login** (`@problem_user`): Tests login with user that has visual/functional issues
- **Performance glitch user** (`@performance_user`): Tests login with slower performance user
- **Error user login** (`@error_user`): Tests login with user that has app-specific errors
- **Visual user login** (`@visual_user`): Tests login with user that has visual differences

**Negative Login Scenarios** (`@negative`):
- **Locked out user** (`@locked_user`): Tests locked account error handling
- **Invalid credentials** (`@invalid_credentials`): Tests wrong username/password combinations
- **Empty fields validation** (`@empty_fields`): Tests required field validation

**UI and Form Validation** (`@ui @form_validation`):
- **Login form elements**: Validates presence and functionality of all form elements
- **Error message handling** (`@error_handling`): Tests error message display and dismissal

**Performance Testing** (`@performance`):
- **Standard user performance**: Validates login completes within 5 seconds
- **Performance glitch user timing**: Validates slower login within 10 seconds

**Accessibility Testing** (`@accessibility`):
- **Form accessibility**: Validates proper ARIA attributes and accessibility compliance

**Security Testing** (`@security`):
- **Password masking**: Validates password field security features

**Data-Driven Testing** (`@data_driven`):
- **Valid users outline**: Tests all valid user types using scenario outline
- **Invalid credentials combinations**: Tests various invalid credential combinations

**Regression Testing** (`@regression`):
- **Complete workflow**: End-to-end login/logout with comprehensive validations

**Edge Cases** (`@edge_cases`):
- **Special characters**: Tests username with special characters
- **Long username**: Tests boundary conditions with very long usernames

**Browser Compatibility** (`@browser_compatibility`):
- **Responsive design**: Tests login functionality across different viewport sizes

**Key Features**:
- Comprehensive tag-based test organization
- Scenario outlines for data-driven testing
- Performance benchmarking scenarios
- Accessibility and security validation
- Edge case and boundary testing
- Cross-browser and responsive testing
- Complete workflow regression testing

**Test Coverage**:
- All SauceDemo user types (6 different users)
- Positive and negative authentication flows
- Form validation and error handling
- Performance measurement and thresholds
- Accessibility compliance verification
- Security feature validation
- Responsive design compatibility

**Usage**: Provides complete test coverage for SauceDemo login functionality with business-readable scenarios that can be executed across different environments and browsers.

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
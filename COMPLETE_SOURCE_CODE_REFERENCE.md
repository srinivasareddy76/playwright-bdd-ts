# Complete Source Code Reference - Playwright BDD TypeScript Framework

## Repository Structure Overview

This document provides a complete reference to all source code files in the Playwright BDD TypeScript framework, organized by functionality and purpose.

## Configuration Files

### Core Configuration
- **`config/index.ts`** - Main configuration loader with environment management
- **`config/schema.ts`** - Zod validation schemas for configuration objects
- **`tsconfig.json`** - TypeScript compiler configuration
- **`package.json`** - Node.js dependencies and scripts
- **`playwright.config.ts`** - Playwright test runner configuration
- **`cucumber.config.ts`** - Cucumber BDD configuration

### Environment-Specific Configuration
- **`config/env/dev/D1.json`** - Development environment D1 settings
- **`config/env/test/T3.json`** - Test environment T3 (PracticeTest) settings
- **`config/env/test/T5.json`** - Test environment T5 (SauceDemo) settings
- **`config/env/uat/U1.json`** - UAT environment U1 settings
- **`config/env/onprem/QD1.json`** - On-premise environment QD1 settings

## Source Code Structure

### Common/Shared Components (`src/common/`)

#### Page Objects
- **`src/common/pages/BasePage.ts`** - Foundation class for all page objects
- **`src/common/pages/LoginPage.ts`** - Generic login page implementation

#### Step Definitions
- **`src/common/steps/hooks.ts`** - Cucumber hooks and world setup
- **`src/common/steps/common.steps.ts`** - Reusable step definitions
- **`src/common/steps/login.steps.ts`** - Generic login step definitions

#### Support Utilities
- **`src/common/support/assertions.ts`** - Custom assertion helpers
- **`src/common/support/certificates.ts`** - Client certificate handling
- **`src/common/support/env.ts`** - Environment variable utilities
- **`src/common/support/testContext.ts`** - Test context management

#### Feature Files
- **`src/common/features/login.feature`** - Generic login scenarios
- **`src/common/features/api_mtls.feature`** - mTLS API testing scenarios
- **`src/common/features/db_queries.feature`** - Database testing scenarios

### Application-Specific Code

#### SauceDemo Application (`src/applications/saucedemo/`)
- **`src/applications/saucedemo/pages/SauceDemoLoginPage.ts`** - SauceDemo login page object
- **`src/applications/saucedemo/steps/saucedemo.steps.ts`** - SauceDemo step definitions
- **`src/applications/saucedemo/features/saucedemo_login.feature`** - SauceDemo login scenarios

#### PracticeTest Application (`src/applications/practicetest/`)
- **`src/applications/practicetest/pages/PracticeTestLoginPage.ts`** - PracticeTest login page object
- **`src/applications/practicetest/steps/practicetest.steps.ts`** - PracticeTest step definitions
- **`src/applications/practicetest/features/practicetest_login.feature`** - PracticeTest login scenarios

#### JSONPlaceholder API (`src/applications/jsonplaceholder/`)
- **`src/applications/jsonplaceholder/api/JsonPlaceholderApiClient.ts`** - REST API client
- **`src/applications/jsonplaceholder/models/ApiModels.ts`** - TypeScript interfaces for API data
- **`src/applications/jsonplaceholder/data/testData.ts`** - Test data factories
- **`src/applications/jsonplaceholder/steps/api_steps.ts`** - API testing step definitions
- **`src/applications/jsonplaceholder/examples/api_examples.ts`** - API usage examples

#### JSONPlaceholder Feature Files
- **`src/applications/jsonplaceholder/features/posts_api.feature`** - Posts API testing scenarios
- **`src/applications/jsonplaceholder/features/users_api.feature`** - Users API testing scenarios
- **`src/applications/jsonplaceholder/features/comments_api.feature`** - Comments API testing scenarios

### API Framework (`src/api/`)
- **`src/api/BaseApiClient.ts`** - Base class for API clients
- **`src/api/ApiClientFactory.ts`** - Factory for creating API client instances

### Database Integration (`src/db.disabled/`)
- **`src/db.disabled/index.ts`** - Database connection manager
- **`src/db.disabled/types.ts`** - Database type definitions
- **`src/db.disabled/oracle/oraclePool.ts`** - Oracle connection pool
- **`src/db.disabled/oracle/oracleSql.ts`** - Oracle SQL utilities
- **`src/db.disabled/postgres/pgPool.ts`** - PostgreSQL connection pool
- **`src/db.disabled/postgres/pgSql.ts`** - PostgreSQL SQL utilities

### Utilities (`src/utils/`)
- **`src/utils/logger.ts`** - Logging utility with Winston
- **`src/utils/paths.ts`** - Path resolution utilities

## Execution Scripts

### Test Execution
- **`run-saucedemo-tests.js`** - SauceDemo test execution script
- **`run-api-tests.js`** - API test execution script
- **`run-api-examples.js`** - API examples execution script
- **`test-api-simple.js`** - Simple API test script
- **`verify-setup.js`** - Setup verification script

### Build and Configuration
- **`copy-config.js`** - Configuration file copying utility
- **`cucumber.config.js`** - Compiled Cucumber configuration

## Key File Descriptions

### Configuration Management
The configuration system is built around environment-specific JSON files and TypeScript modules that provide type safety and validation. The main configuration loader (`config/index.ts`) supports runtime overrides via environment variables.

### Page Object Model
All page interactions are encapsulated in page object classes that extend `BasePage.ts`. This provides consistent interaction patterns and comprehensive logging across all applications.

### Step Definitions
Cucumber step definitions are organized by application and functionality. Common steps are shared across applications, while application-specific steps handle unique requirements.

### API Testing Framework
The API testing framework provides a complete REST API testing solution with client classes, data models, and comprehensive validation capabilities.

### Feature Files
Gherkin feature files define test scenarios in business-readable language. They are organized by application and functionality, with comprehensive tag-based organization for selective test execution.

## Architecture Patterns

### Page Object Model (POM)
- Encapsulates page interactions in reusable classes
- Provides consistent interface for UI testing
- Includes comprehensive logging and error handling

### Factory Pattern
- Used for creating API clients and test data
- Provides flexible object creation with configuration
- Supports different implementations per environment

### Strategy Pattern
- Different implementations for different applications
- Configurable behavior based on environment
- Extensible design for new applications

### Singleton Pattern
- Configuration management with caching
- Logger instance management
- Database connection pooling

## Development Guidelines

### Adding New Applications
1. Create application directory under `src/applications/`
2. Implement page objects extending `BasePage`
3. Create application-specific step definitions
4. Add feature files with comprehensive scenarios
5. Update configuration files as needed

### Adding New Environments
1. Create environment JSON file in appropriate `config/env/` subdirectory
2. Update environment group mapping in `config/index.ts`
3. Add environment-specific configuration values
4. Test configuration loading and validation

### Extending API Testing
1. Create new API client extending `BaseApiClient`
2. Define TypeScript interfaces for API data
3. Implement comprehensive CRUD operations
4. Add validation and error handling
5. Create feature files for API scenarios

## Best Practices

### Code Organization
- Keep related functionality together
- Use consistent naming conventions
- Implement comprehensive error handling
- Include detailed logging for debugging

### Testing Patterns
- Use data-driven testing with scenario outlines
- Implement comprehensive assertion patterns
- Include performance and accessibility testing
- Cover positive and negative scenarios

### Configuration Management
- Use environment-specific configuration files
- Support runtime overrides via environment variables
- Implement validation for all configuration values
- Provide clear error messages for configuration issues

This reference provides a complete overview of the framework's source code structure, enabling developers to understand, maintain, and extend the framework effectively.
# Repository Tree Structure - Playwright BDD TypeScript Framework

```
playwright-bdd-ts/
├── README.md                                    # Main project documentation
├── package.json                                 # Node.js dependencies and scripts
├── package-lock.json                           # Locked dependency versions
├── tsconfig.json                               # TypeScript compiler configuration
├── playwright.config.ts                       # Playwright test runner configuration
├── cucumber.config.ts                         # Cucumber BDD configuration
├── cucumber.config.js                         # Compiled Cucumber configuration
│
├── Documentation Files/
│   ├── API_IMPLEMENTATION_SUMMARY.md          # API implementation overview
│   ├── API_TESTING_GUIDE.md                   # API testing guide
│   ├── CODE_DOCUMENTATION.md                  # Comprehensive code documentation
│   ├── COMPLETE_SOURCE_CODE_REFERENCE.md      # Complete source code reference
│   ├── CROSS_ENV_EXPLANATION.md               # Cross-platform environment variables
│   ├── DOCUMENTATION_SUMMARY.md               # Documentation overview
│   ├── FINAL_TEST_VALIDATION_SUMMARY.md       # Test validation summary
│   ├── FRAMEWORK_EXTENSION_GUIDE.md           # Framework extension guide
│   ├── FRAMEWORK_STRUCTURE.md                 # Framework structure overview
│   ├── FRAMEWORK_USER_GUIDE.md                # User guide for framework
│   ├── GETTING_STARTED.md                     # Getting started guide
│   ├── HOW_TO_RUN_VERIFICATION.md             # Verification instructions
│   ├── LOCAL_SETUP_GUIDE.md                   # Local setup instructions
│   ├── PRACTICETEST_IMPLEMENTATION.md         # PracticeTest implementation
│   ├── QUICK_ENVIRONMENT_SETUP.md             # Quick environment setup
│   ├── QUICK_SETUP_GUIDE.md                   # Quick setup guide
│   ├── README_OLD.md                          # Previous README version
│   ├── REPOSITORY_TREE_STRUCTURE.md           # This file
│   ├── SETUP_CHECKLIST.md                     # Setup checklist
│   ├── SETUP_TROUBLESHOOTING.md               # Troubleshooting guide
│   ├── T5_T3_ENVIRONMENTS_GUIDE.md            # Environment usage guide
│   ├── TEST_EXECUTION_SUMMARY.md              # Test execution summary
│   └── WINDOWS_SETUP_GUIDE.md                 # Windows-specific setup
│
├── Execution Scripts/
│   ├── copy-config.js                         # Configuration copying utility
│   ├── run-api-examples.js                    # API examples runner
│   ├── run-api-tests.js                       # API tests runner
│   ├── run-saucedemo-tests.js                 # SauceDemo tests runner
│   ├── test-api-simple.js                     # Simple API test
│   └── verify-setup.js                        # Setup verification
│
├── config/                                     # Configuration management
│   ├── index.ts                               # Main configuration loader
│   ├── index.js                               # Compiled configuration loader
│   ├── schema.ts                              # Zod validation schemas
│   ├── schema.js                              # Compiled validation schemas
│   └── env/                                   # Environment-specific configs
│       ├── dev/
│       │   └── D1.json                        # Development environment D1
│       ├── test/
│       │   ├── T3.json                        # Test environment T3 (PracticeTest)
│       │   └── T5.json                        # Test environment T5 (SauceDemo)
│       ├── uat/
│       │   └── U1.json                        # UAT environment U1
│       └── onprem/
│           └── QD1.json                       # On-premise environment QD1
│
├── secrets/                                    # Certificate and secret files
│   └── (certificate files)
│
└── src/                                        # Source code
    ├── api/                                    # API framework
    │   ├── BaseApiClient.ts                   # Base API client class
    │   └── ApiClientFactory.ts                # API client factory
    │
    ├── applications/                           # Application-specific code
    │   ├── saucedemo/                         # SauceDemo application
    │   │   ├── pages/
    │   │   │   └── SauceDemoLoginPage.ts      # SauceDemo login page object
    │   │   ├── steps/
    │   │   │   └── saucedemo.steps.ts         # SauceDemo step definitions
    │   │   └── features/
    │   │       └── saucedemo_login.feature    # SauceDemo login scenarios
    │   │
    │   ├── practicetest/                      # PracticeTest application
    │   │   ├── pages/
    │   │   │   └── PracticeTestLoginPage.ts   # PracticeTest login page object
    │   │   ├── steps/
    │   │   │   └── practicetest.steps.ts      # PracticeTest step definitions
    │   │   └── features/
    │   │       └── practicetest_login.feature # PracticeTest login scenarios
    │   │
    │   └── jsonplaceholder/                   # JSONPlaceholder API
    │       ├── api/
    │       │   └── JsonPlaceholderApiClient.ts # REST API client
    │       ├── models/
    │       │   └── ApiModels.ts               # TypeScript API interfaces
    │       ├── data/
    │       │   └── testData.ts                # Test data factories
    │       ├── steps/
    │       │   └── api_steps.ts               # API step definitions
    │       ├── examples/
    │       │   └── api_examples.ts            # API usage examples
    │       └── features/
    │           ├── posts_api.feature          # Posts API scenarios
    │           ├── users_api.feature          # Users API scenarios
    │           └── comments_api.feature       # Comments API scenarios
    │
    ├── common/                                # Shared/common code
    │   ├── pages/
    │   │   ├── BasePage.ts                    # Base page object class
    │   │   └── LoginPage.ts                   # Generic login page
    │   ├── steps/
    │   │   ├── hooks.ts                       # Cucumber hooks and world setup
    │   │   ├── common.steps.ts                # Reusable step definitions
    │   │   └── login.steps.ts                 # Generic login steps
    │   ├── support/
    │   │   ├── assertions.ts                  # Custom assertion helpers
    │   │   ├── certificates.ts                # Client certificate handling
    │   │   ├── env.ts                         # Environment utilities
    │   │   └── testContext.ts                 # Test context management
    │   └── features/
    │       ├── login.feature                  # Generic login scenarios
    │       ├── api_mtls.feature               # mTLS API scenarios
    │       └── db_queries.feature             # Database scenarios
    │
    ├── db.disabled/                           # Database integration (disabled)
    │   ├── index.ts                           # Database connection manager
    │   ├── types.ts                           # Database type definitions
    │   ├── oracle/
    │   │   ├── oraclePool.ts                  # Oracle connection pool
    │   │   └── oracleSql.ts                   # Oracle SQL utilities
    │   └── postgres/
    │       ├── pgPool.ts                      # PostgreSQL connection pool
    │       └── pgSql.ts                       # PostgreSQL SQL utilities
    │
    └── utils/                                 # Utility functions
        ├── logger.ts                          # Logging utility with Winston
        └── paths.ts                           # Path resolution utilities
```

## Key Directory Explanations

### `/config/`
Contains all configuration management files including environment-specific JSON files and TypeScript configuration loaders with validation schemas.

### `/src/applications/`
Application-specific implementations organized by application name. Each application has its own pages, steps, and features directories.

### `/src/common/`
Shared code that can be reused across different applications, including base classes, common step definitions, and utility functions.

### `/src/api/`
API testing framework with base classes and factories for creating API clients.

### `/src/db.disabled/`
Database integration code (currently disabled) for Oracle and PostgreSQL connections.

### `/src/utils/`
General utility functions for logging, path resolution, and other common operations.

## File Type Breakdown

### TypeScript Files (`.ts`)
- **Page Objects**: Classes encapsulating page interactions
- **Step Definitions**: Cucumber step implementations
- **API Clients**: REST API interaction classes
- **Utilities**: Helper functions and shared code
- **Configuration**: Type-safe configuration management

### Feature Files (`.feature`)
- **Gherkin Scenarios**: Business-readable test scenarios
- **Tag-based Organization**: Selective test execution
- **Data-driven Testing**: Scenario outlines with examples

### Configuration Files (`.json`)
- **Environment Settings**: Environment-specific configuration
- **Package Configuration**: Node.js dependencies and scripts
- **TypeScript Configuration**: Compiler settings

### JavaScript Files (`.js`)
- **Execution Scripts**: Test runners and utilities
- **Compiled Output**: TypeScript compilation results

## Architecture Overview

The framework follows a modular architecture with clear separation of concerns:

1. **Configuration Layer**: Environment-specific settings with validation
2. **Application Layer**: Application-specific implementations
3. **Common Layer**: Shared functionality and utilities
4. **API Layer**: REST API testing framework
5. **Database Layer**: Database integration (disabled)
6. **Utility Layer**: Common helper functions

This structure enables easy maintenance, extension, and testing across multiple applications and environments.
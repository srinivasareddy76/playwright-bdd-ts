# Playwright BDD TypeScript Framework Structure

## Overview
This framework has been reorganized to support multiple applications with a scalable, maintainable structure that separates application-specific code from common/shared components.

## Directory Structure

```
src/
├── applications/                    # Application-specific modules
│   └── saucedemo/                  # SauceDemo application module
│       ├── features/               # SauceDemo-specific feature files
│       │   └── saucedemo_login.feature
│       ├── pages/                  # SauceDemo-specific page objects
│       │   └── SauceDemoLoginPage.ts
│       └── steps/                  # SauceDemo-specific step definitions
│           └── saucedemo.steps.ts
├── common/                         # Shared/common components
│   ├── features/                   # Generic feature files
│   ├── pages/                      # Generic page objects
│   │   ├── BasePage.ts
│   │   └── LoginPage.ts
│   ├── steps/                      # Common step definitions
│   │   ├── common.steps.ts
│   │   ├── hooks.ts
│   │   └── login.steps.ts
│   └── support/                    # Support utilities
│       ├── assertions.ts
│       ├── certificates.ts
│       ├── env.ts
│       └── testContext.ts
└── utils/                          # Framework utilities
    ├── logger.ts
    └── paths.ts
```

## Key Benefits

### 1. Application Segregation
- Each application (e.g., SauceDemo) has its own dedicated folder
- Application-specific code is isolated from common components
- Easy to add new applications without affecting existing ones

### 2. Scalability
- New applications can be added by creating a new folder under `src/applications/`
- Each application follows the same structure: `features/`, `pages/`, `steps/`
- Common components are reused across all applications

### 3. Maintainability
- Clear separation of concerns
- Application-specific logic is contained within application folders
- Common functionality is centralized and reusable

### 4. Reusability
- Common page objects (BasePage, LoginPage) can be extended by application-specific pages
- Common step definitions handle generic scenarios
- Application-specific steps handle unique business logic

## Configuration Updates

### Cucumber Configuration
The `cucumber.config.ts` has been updated to load step definitions from both common and application-specific locations:

```typescript
require: [
  'src/common/steps/**/*.ts',
  'src/applications/**/steps/**/*.ts'
]
```

### Package.json Scripts
Test scripts have been updated to reference the new folder structure:

```json
"test:saucedemo": "... cucumber-js src/applications/saucedemo/features/saucedemo_login.feature --require 'dist/src/common/steps/**/*.js' --require 'dist/src/applications/**/steps/**/*.js' ..."
```

## Adding New Applications

To add a new application (e.g., "myapp"):

1. Create the application structure:
   ```
   src/applications/myapp/
   ├── features/
   ├── pages/
   └── steps/
   ```

2. Create application-specific page objects extending common base classes:
   ```typescript
   import { BasePage } from '../../../common/pages/BasePage';
   
   export class MyAppLoginPage extends BasePage {
     // Application-specific implementation
   }
   ```

3. Create application-specific step definitions:
   ```typescript
   import { Given, When, Then } from '@cucumber/cucumber';
   import { CustomWorld } from '../../../common/steps/hooks';
   
   Given('I am on the MyApp login page', async function (this: CustomWorld) {
     // Application-specific implementation
   });
   ```

4. Add feature files with appropriate tags:
   ```gherkin
   @ui @myapp @login
   Feature: MyApp Login
   ```

## Import Path Guidelines

- Common components: Use relative paths from `src/common/`
- Application-specific components: Use relative paths within the application folder
- Cross-application imports: Use full relative paths (e.g., `../../../common/pages/BasePage`)
- Config and utils: Use appropriate relative paths to reach root-level directories

## Testing

The framework supports running tests at different levels:

- **Application-specific**: `npm run test:saucedemo`
- **Tag-based**: `npm run test:smoke`, `npm run test:negative`
- **Environment-specific**: `APP_ENV=T3 npm run test:bdd`

All tests continue to work with the new structure while providing better organization and scalability.
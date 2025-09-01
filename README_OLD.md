# Playwright + TypeScript BDD Framework

A comprehensive test automation framework using Playwright, TypeScript, BDD (Cucumber), with Oracle/PostgreSQL database support and mTLS client certificate authentication.

## 🚀 Features

- **Playwright + TypeScript**: Modern browser automation with type safety
- **BDD with Cucumber**: Gherkin feature files for readable test scenarios
- **Page Object Model (POM)**: Maintainable and reusable page classes
- **Multi-Database Support**: Oracle (on-premise) and PostgreSQL (cloud) with connection pooling
- **mTLS Authentication**: Client certificate support for secure API testing
- **Environment Management**: Multiple environment configurations (Dev, Test, UAT, On-Premise)
- **Comprehensive Logging**: Winston-based logging with multiple levels
- **Type-Safe Configuration**: Zod schema validation for environment configs
- **CI/CD Ready**: GitHub Actions compatible with parallel execution

## 📁 Project Structure

```
playwright-bdd-ts/
├── config/                    # Environment configurations
│   ├── env/
│   │   ├── dev/              # D1, D2, D3
│   │   ├── test/             # T1, T2, T3, T4, T5 (default)
│   │   ├── uat/              # U1, U2, U3, U4
│   │   └── onprem/           # QD1, QD2, QD3, QD4
│   ├── schema.ts             # Zod configuration schema
│   └── index.ts              # Configuration loader
├── src/
│   ├── pages/                # Page Object Model classes
│   ├── api/                  # API client with mTLS support
│   ├── db/                   # Database utilities (Oracle & PostgreSQL)
│   ├── steps/                # Cucumber step definitions
│   ├── support/              # Test context and utilities
│   └── utils/                # Common utilities
├── features/                 # Gherkin feature files
├── secrets/                  # Client certificates (not committed)
└── test-results/            # Test execution results
```

## 🛠 Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Oracle Instant Client (optional, for Oracle Thick mode)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd playwright-bdd-ts
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Add client certificates:**
   ```bash
   # Place your .pfx files in the secrets/ directory
   cp your-client-cert.pfx secrets/
   # Set PFX_PASSPHRASE in .env
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with your configuration:

```bash
# Environment (defaults to T5)
APP_ENV=T5

# Database passwords (override config files)
ORACLE_PASSWORD=your_oracle_password
PG_PASSWORD=your_postgres_password

# Certificate configuration
PFX_PASSPHRASE=your_certificate_passphrase

# Optional: Force Oracle Thick mode
USE_OCI=1
```

### Environment Files

Environment-specific configurations are stored in `config/env/`:

- **Development**: D1, D2, D3 (`config/env/dev/`)
- **Test**: T1, T2, T3, T4, T5 (`config/env/test/`) - T5 is default
- **UAT**: U1, U2, U3, U4 (`config/env/uat/`)
- **On-Premise**: QD1, QD2, QD3, QD4 (`config/env/onprem/`)

Example configuration (`config/env/test/T5.json`):

```json
{
  "name": "T5",
  "group": "test",
  "app": {
    "baseUrl": "https://t5.example.com",
    "username": "t5_user",
    "password": "CHANGE_ME"
  },
  "db": {
    "oracle": {
      "host": "t5-oracle.host",
      "port": 1521,
      "serviceName": "ORCL",
      "user": "t5_oracle_user",
      "password": "CHANGE_ME"
    },
    "postgres": {
      "host": "t5-pg.host",
      "port": 5432,
      "database": "t5_appdb",
      "user": "t5_pg_user",
      "password": "CHANGE_ME"
    }
  },
  "certs": {
    "client": {
      "pfxPath": "secrets/t5-client.pfx",
      "passphrase": "CHANGE_ME",
      "origin": "https://api.t5.example.com"
    }
  }
}
```

## 🏃‍♂️ Running Tests

### Basic Commands

```bash
# Run all tests (default environment T5)
npm run test:bdd

# Run with specific environment
APP_ENV=T3 npm run test:bdd

# Run specific test types
npm run test:ui      # UI tests only
npm run test:api     # API tests only
npm run test:db      # Database tests only

# Run with custom environment
APP_ENV=U1 npm run test:bdd
```

### Tag-Based Execution

```bash
# Run smoke tests only
npm run test:bdd -- --tags "@smoke"

# Run positive test cases
npm run test:bdd -- --tags "@positive"

# Exclude flaky tests
npm run test:bdd -- --tags "not @flaky"

# Run Oracle-specific tests
npm run test:bdd -- --tags "@oracle"

# Run PostgreSQL-specific tests
npm run test:bdd -- --tags "@postgres"
```

### Environment-Specific Execution

```bash
# Development environment
APP_ENV=D1 npm run test:bdd

# UAT environment
APP_ENV=U2 npm run test:bdd

# On-premise environment
APP_ENV=QD1 npm run test:bdd
```

## 🔐 Client Certificate Setup

### mTLS Configuration

1. **Obtain client certificates** from your security team
2. **Place certificates** in the `secrets/` directory:
   ```
   secrets/
   ├── t5-client.pfx
   ├── u1-client.pfx
   └── qd1-client.pfx
   ```

3. **Configure passphrases** in `.env`:
   ```bash
   PFX_PASSPHRASE=your_certificate_passphrase
   ```

4. **Update environment configs** with correct certificate paths and origins

### Playwright mTLS Support

The framework uses Playwright's built-in client certificate support:

```typescript
// API Context with mTLS
const apiContext = await request.newContext({
  clientCertificates: [{
    pfxPath: 'secrets/client.pfx',
    passphrase: 'certificate_passphrase',
    origin: 'https://api.example.com'
  }]
});

// Browser Context with mTLS (for UI tests requiring certificates)
const browserContext = await browser.newContext({
  clientCertificates: [{
    pfxPath: 'secrets/client.pfx',
    passphrase: 'certificate_passphrase',
    origin: 'https://app.example.com'
  }]
});
```

## 🗄️ Database Support

### Oracle Database

- **Connection**: Uses `oracledb` with connection pooling
- **Mode**: Thin mode by default, Thick mode with `USE_OCI=1`
- **Features**: Sequences, procedures, functions, transactions
- **Environment**: On-premise environments (QD1, QD2, QD3, QD4)

### PostgreSQL Database

- **Connection**: Uses `pg` with connection pooling
- **Features**: JSON operations, full-text search, transactions
- **Environment**: Cloud environments (D*, T*, U*)

### Database Operations

```typescript
// Get SQL helper (automatically selects Oracle or PostgreSQL)
const sqlHelper = await getSqlHelper();

// Execute queries
const result = await sqlHelper.selectMany('SELECT * FROM users WHERE status = ?', ['active']);

// Insert data
await sqlHelper.insert('users', {
  username: 'john_doe',
  email: 'john@example.com',
  status: 'active'
});

// Transactions
const transaction = await pool.beginTransaction();
await transaction.query('INSERT INTO users ...');
await transaction.commit();
```

## 📝 Writing Tests

### Feature Files

Create `.feature` files in the `features/` directory:

```gherkin
@ui @login
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access protected features

  @smoke @positive
  Scenario: Successful login
    Given I am on the login page
    When I login with the configured credentials
    Then I should be logged in
    And I should be redirected to the dashboard
```

### Step Definitions

Step definitions are automatically loaded from `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from './hooks';

Given('I am on the login page', async function (this: CustomWorld) {
  await this.initializeBrowser();
  const loginPage = new LoginPage(this.page!);
  await loginPage.goto();
});
```

### Page Objects

Create page classes extending `BasePage`:

```typescript
export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '[data-testid="username"]',
    passwordInput: '[data-testid="password"]',
    loginButton: '[data-testid="login"]'
  };

  async login(username: string, password: string): Promise<void> {
    await this.type(this.selectors.usernameInput, username);
    await this.type(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }
}
```

## 🧪 Test Categories

### UI Tests (`@ui`)
- Login/logout functionality
- Form interactions
- Navigation
- Responsive design

### API Tests (`@api`, `@mtls`)
- REST API endpoints
- mTLS authentication
- Request/response validation
- Error handling

### Database Tests (`@db`)
- CRUD operations
- Data validation
- Performance testing
- Transaction handling

## 📊 Reporting

Test results are generated in multiple formats:

- **HTML Report**: `test-results/cucumber-report.html`
- **JSON Report**: `test-results/cucumber-report.json`
- **JUnit XML**: `test-results/junit.xml`
- **Playwright Report**: `playwright-report/`

## 🔧 Development

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Type checking
npm run build
```

### Adding New Environments

1. Create environment file: `config/env/<group>/<env>.json`
2. Add environment mapping in `config/index.ts`
3. Update `.env.example` with new environment variables

### Adding New Step Definitions

1. Create step file: `src/steps/<feature>.steps.ts`
2. Import `CustomWorld` from `./hooks`
3. Use `this.initializeBrowser()`, `this.initializeApiClient()`, etc.

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Execution
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [T1, T2, T3, T4, T5]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        env:
          APP_ENV: ${{ matrix.environment }}
          ORACLE_PASSWORD: ${{ secrets.ORACLE_PASSWORD }}
          PG_PASSWORD: ${{ secrets.PG_PASSWORD }}
          PFX_PASSPHRASE: ${{ secrets.PFX_PASSPHRASE }}
        run: npm run test:bdd
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.environment }}
          path: test-results/
```

## 🔍 Troubleshooting

### Common Issues

1. **Certificate not found**:
   - Ensure `.pfx` file is in `secrets/` directory
   - Check `PFX_PASSPHRASE` in `.env`
   - Verify certificate path in environment config

2. **Database connection failed**:
   - Check database credentials in `.env`
   - Verify network connectivity
   - For Oracle: ensure Instant Client is installed (if using Thick mode)

3. **Environment not found**:
   - Verify `APP_ENV` value matches available environments
   - Check environment file exists in `config/env/<group>/`

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run test:bdd
```

### Headful Mode

Run tests with visible browser:

```bash
HEADLESS=false npm run test:bdd
```

## 📚 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Oracle Node.js Driver](https://oracle.github.io/node-oracledb/)
- [PostgreSQL Node.js Driver](https://node-postgres.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This framework is designed for enterprise environments with strict security requirements. Always follow your organization's security policies when handling certificates and credentials.
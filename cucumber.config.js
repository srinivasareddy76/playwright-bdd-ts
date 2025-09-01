const config = {
  default: {
    require: [
      'dist/src/steps/**/*.js'
    ],
    format: [
      'progress-bar',
      'json:test-results/cucumber-report.json',
      'html:test-results/cucumber-report.html',
      'junit:test-results/junit.xml'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    failFast: false,
    strict: true,
    worldParameters: {
      environment: process.env.APP_ENV || 'T5'
    }
  },
  
  // Profile for smoke tests
  smoke: {
    require: [
      'dist/src/steps/**/*.js'
    ],
    format: [
      'progress-bar',
      'json:test-results/smoke-report.json',
      'html:test-results/smoke-report.html'
    ],
    tags: '@smoke',
    publishQuiet: true
  },
  
  // Profile for SauceDemo tests
  saucedemo: {
    require: [
      'dist/src/steps/**/*.js'
    ],
    format: [
      'progress-bar',
      'json:test-results/saucedemo-report.json',
      'html:test-results/saucedemo-report.html'
    ],
    tags: '@saucedemo',
    publishQuiet: true
  },
  
  // Profile for UI tests only
  ui: {
    require: [
      'dist/src/steps/**/*.js'
    ],
    format: [
      'progress-bar',
      'json:test-results/ui-report.json',
      'html:test-results/ui-report.html'
    ],
    tags: '@ui',
    publishQuiet: true
  }
};

module.exports = config;
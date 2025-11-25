module.exports = {
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  
  // Environment information
  environment: {
    'Test Environment': 'T3',
    'Application URL': 'https://practicetestautomation.com/practice-test-login/',
    'Browser': 'Chromium (Headless)',
    'Framework': 'Playwright BDD TypeScript',
    'Node.js': process.version,
    'Platform': process.platform,
    'Architecture': process.arch
  },
  
  // Categories for test results
  categories: [
    {
      name: 'Login Tests',
      matchedStatuses: ['passed', 'failed'],
      messageRegex: '.*login.*'
    },
    {
      name: 'UI Tests',
      matchedStatuses: ['passed', 'failed'],
      messageRegex: '.*ui.*'
    },
    {
      name: 'Positive Tests',
      matchedStatuses: ['passed'],
      messageRegex: '.*positive.*'
    },
    {
      name: 'Negative Tests',
      matchedStatuses: ['passed', 'failed'],
      messageRegex: '.*negative.*'
    }
  ]
};

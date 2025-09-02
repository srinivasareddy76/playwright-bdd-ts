import { IConfiguration } from '@cucumber/cucumber';

const config: IConfiguration = {
  require: [
    'src/common/steps/**/*.ts',
    'src/applications/**/steps/**/*.ts'
  ],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'json:test-results/cucumber-report.json',
    'html:test-results/cucumber-report.html',
    '@cucumber/pretty-formatter',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
  publishQuiet: true,
  dryRun: false,
  failFast: false,
  strict: true,
  parallel: 2,
  retry: 1,
  retryTagFilter: '@flaky',
  tags: process.env.CUCUMBER_TAGS || 'not @skip',
  worldParameters: {
    appEnv: process.env.APP_ENV || 'T5',
  },
};

export default config;
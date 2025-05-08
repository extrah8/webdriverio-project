import { config as baseConfig } from './wdio.base.conf';

export const config = {
  ...baseConfig,

  runner: 'local',

  specs: ['../test/specs/api/**/*.ts'],

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu'],
      },
    },
  ],

  services: [],

  framework: 'mocha',
  maxInstances: 1,
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  baseUrl: 'https://demoqa.com/',
};
import { config as baseConfig } from './wdio.base.conf';
import path from 'path';

const isCI = process.env.CI === 'true';
const forcedInstances = process.env.WDIO_MAX_INSTANCES
  ? parseInt(process.env.WDIO_MAX_INSTANCES, 10)
  : undefined;

export const config: WebdriverIO.Config = {
  ...baseConfig,

  specs: ['../test/specs/desktop/**/*.ts'],
  waitforTimeout: isCI ? 20_000 : (baseConfig.waitforTimeout ?? 10_000),
  connectionRetryTimeout: isCI ? 120_000 : (baseConfig.connectionRetryTimeout ?? 90_000),
  connectionRetryCount: 3,

  mochaOpts: {
    ...(baseConfig.mochaOpts || {}),
    ui: 'bdd',
    timeout: isCI ? 180_000 : 90_000,
  },

  maxInstances: forcedInstances ?? (isCI ? 1 : 3),

  capabilities: [{
    browserName: 'chrome',
    acceptInsecureCerts: true,
    'wdio:enforceWebDriverClassic': true,
    'goog:chromeOptions': {
      prefs: {
        'download.default_directory': path.resolve(__dirname, '../fixtures'),
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'safebrowsing.enabled': true,
      },
      args: [
        '--headless=new',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--ignore-certificate-errors',
        '--allow-insecure-localhost',
        '--disable-infobars',
        '--no-first-run',
        '--no-zygote'
      ],
      excludeSwitches: ['enable-logging'],
    },
    pageLoadStrategy: 'eager',
    }],
  
  reporters: [
    ...(baseConfig.reporters || []),
    ...(isCI ? [] : [
      ['video', {
        saveAllVideos: false,
        outputDir: 'video',
        maxTestNameCharacters: 200,
        videoSlowdownMultiplier: 3,
        addConsoleLogs: true
      }]
    ])
  ],
};
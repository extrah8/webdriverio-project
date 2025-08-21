import path from 'path';
import fs from 'fs';
import { addAttachment } from '@wdio/allure-reporter';

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: [],
  exclude: [],

  maxInstances: 3,
  capabilities: [
    {
      maxInstances: 2,
      browserName: 'chrome',
      'goog:chromeOptions': {
        prefs: {
          'download.default_directory': path.resolve(__dirname, '../fixtures'),
          'download.prompt_for_download': false,
          'download.directory_upgrade': true,
          'safebrowsing.enabled': true,
        },
        args: ['--log-level=3', '--silent-debugger-extension-api'],
      },
      'wdio:devtoolsOptions': {
        disableBidi: true,
      },
    },
  ],

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
    [
      'junit',
      {
        outputDir: './junit-report/',
        outputFileFormat: (options) => `junit-${options.cid}.xml`,
      },
    ],
    [
      'video',
      {
        saveAllVideos: true,
        outputDir: './video',
        videoSlowdownMultiplier: 2,
        saveFailedOnly: false,
      },
    ],
  ],

  logLevel: 'error',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [],

  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  baseUrl: 'https://demoqa.com/',

  /**
   * Attachments to Allure after each test
   */
  afterTest: async function (test, context, { error, passed }) {
    try {
      if (!browser || !browser.sessionId) return;

      // screenshot only on fail
      if (!passed) {
        try {
          const screenshot = await browser.takeScreenshot();
          addAttachment(
            `Screenshot - ${test.title}`,
            Buffer.from(screenshot, 'base64'),
            'image/png'
          );
        } catch {
          // ignore screenshot errors (ECONNREFUSED etc.)
        }
      }

      // page source (always)
      try {
        const pageSource = await browser.getPageSource();
        addAttachment('Page Source', pageSource, 'text/html');
      } catch {}

      // console logs (safe)
      try {
        const logs = await browser.getLogs('browser');
        if (logs.length) {
          addAttachment(
            'Browser Console Logs',
            JSON.stringify(logs, null, 2),
            'application/json'
          );
        }
      } catch {}

      // attach video if exists
      try {
        const videoPath = path.join('./video', `${browser.sessionId}.mp4`);
        if (fs.existsSync(videoPath)) {
          const video = fs.readFileSync(videoPath);
          addAttachment('Test Execution Video', video, 'video/mp4');
        }
      } catch {}
    } catch {
      // swallow any unexpected errors here
    }
  },
};
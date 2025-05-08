import { config as baseConfig } from './wdio.base.conf';
import path from 'path';

export const config: WebdriverIO.Config = {
  ...baseConfig,

  specs: ['../test/specs/desktop/**/*.ts'],

  capabilities: [
    {
      maxInstances: 3,
      browserName: 'chrome',
      'wdio:enforceWebDriverClassic': true,
      'goog:chromeOptions': {
        prefs: {
          'download.default_directory': path.resolve(__dirname, '../fixtures'),
          'download.prompt_for_download': false,
          'download.directory_upgrade': true,
          'safebrowsing.enabled': true,
        },
        args: [
          '--start-maximized',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--window-size=1900,1000',
          '--allow-insecure-localhost',
          '--ignore-certificate-errors',
        ],
        excludeSwitches: ['--enable-logging'],
      },
    },
    {
      maxInstances: 2,
      browserName: 'firefox',
      'moz:firefoxOptions': {
        prefs: {
          'browser.download.folderList': 2,
          'browser.download.dir': path.resolve(__dirname, '../fixtures'),
          'browser.helperApps.neverAsk.saveToDisk': 'application/pdf,application/octet-stream',
          'pdfjs.disabled': true,
        },
        args: ['-width=1900', '-height=1000'],
      },
    },
  ],
};
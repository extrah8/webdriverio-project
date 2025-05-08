import { config as baseConfig } from './wdio.base.conf';
import path from 'path';

export const config: WebdriverIO.Config = {
  ...baseConfig,

  specs: ['../test/specs/desktop/**/*.ts'],

  capabilities: [
    {
      maxInstances: 3,
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
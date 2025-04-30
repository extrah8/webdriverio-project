import path from 'path';
import fs from 'fs';
import { addAttachment } from '@wdio/allure-reporter';

export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    specs: [],
    exclude: [],

    maxInstances: 10,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        'goog:chromeOptions': {
            prefs: {
                'download.default_directory': path.resolve(__dirname, '../fixtures'),
                'download.prompt_for_download': false,
                'download.directory_upgrade': true,
                'safebrowsing.enabled': true,
            },
            args: [
                '--log-level=3',
                '--silent-debugger-extension-api'
            ]
        },
        'wdio:devtoolsOptions': {
            disableBidi: true
        }
    }],

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }],
        ['junit', {
            outputDir: './junit-report/',
            outputFileFormat: function (options) {
                return `junit-${options.cid}.xml`
            }
        }],
        ['video', {
            saveAllVideos: true,
            outputDir: './video',
            videoSlowdownMultiplier: 2,
            saveFailedOnly: false
        }]
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
        timeout: 60000
    },

    baseUrl: 'https://demoqa.com/',

afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    try {
        if (browser && browser.sessionId) {
            if (!passed) {
                const screenshot = await browser.takeScreenshot();
                addAttachment('Screenshot on Failure', Buffer.from(screenshot, 'base64'), 'image/png');
            }

            const pageSource = await browser.getPageSource();
            addAttachment('Page Source', pageSource, 'text/html');

            try {
                const logs = await browser.getLogs('browser');
                addAttachment('Browser Console Logs', JSON.stringify(logs, null, 2), 'application/json');
            } catch (err) {
                console.warn('Could not fetch browser logs:', err);
            }

            const videoPath = path.join('./video', `${browser.sessionId}.mp4`);
            if (fs.existsSync(videoPath)) {
                const video = fs.readFileSync(videoPath);
                addAttachment('Test Execution Video', video, 'video/mp4');
            }
        }
    } catch (err) {
        console.warn('afterTest hook failed:', err);
    }
}
};
import { config as baseConfig } from './wdio.base.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: ['../test/specs/desktop/**/*.ts'],
    capabilities: [
        {
            maxInstances: 5,
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--window-size=1280,800']
            }
        },
        {
            maxInstances: 5,
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['-width=1280', '-height=800']
            }
        }
    ]
};
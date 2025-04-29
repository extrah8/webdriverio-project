import { config as baseConfig } from './wdio.base.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,
    specs: ['./test/specs/mobile/**/*.ts'],
    capabilities: [
        {
            maxInstances: 2,
            browserName: 'chrome',
            'goog:chromeOptions': {
                mobileEmulation: {
                    deviceName: 'iPhone X'
                },
                args: ['--window-size=375,812']
            }
        }
    ]
};
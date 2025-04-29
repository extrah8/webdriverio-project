import { config as baseConfig } from './wdio.base.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: ['../test/specs/desktop/**/*.ts'],

    capabilities: [
        {
            maxInstances: 5,
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['-width=1280', '-height=800']
            }
        }
    ]
};
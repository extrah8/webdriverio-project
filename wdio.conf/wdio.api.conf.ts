import { config as baseConfig } from './wdio.base.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,
    specs: ['./test/specs/api/**/*.ts'],
    capabilities: [],
    services: [],
    afterTest: undefined
};
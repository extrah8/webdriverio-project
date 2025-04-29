import { config as baseConfig } from './wdio.base.conf';
import path from 'path';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    specs: ['../test/specs/desktop/**/*.ts'],
    
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        'wdio:enforceWebDriverClassic': true,
        'goog:chromeOptions': {
            prefs: {
                'download.default_directory': path.resolve(__dirname, '../fixtures'),
                'download.prompt_for_download': false,
                'download.directory_upgrade': true,
                'safebrowsing.enabled': true,
            },
            args: ['--headless','--start-maximized', '--no-sandbox', '--disable-gpu','--disable-dev-shm-usage','--window-size=1900,1000', '--allow-insecure-localhost', '--ignore-certificate-errors', '--enable-unsafe-swiftshader'],
            excludeSwitches: ['--enable-logging']
        }
    }],
};
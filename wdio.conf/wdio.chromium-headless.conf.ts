import { config as baseConfig } from './wdio.base.conf';
import path from 'path';

const isCI = process.env.CI === 'true';
const forcedInstances = process.env.WDIO_MAX_INSTANCES
  ? parseInt(process.env.WDIO_MAX_INSTANCES, 10)
  : undefined;

const ADS_KILLER = () => {
  const selectors = [
    'iframe[id^="google_ads_iframe"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="doubleclick"]',
    '.adsbygoogle',
    '[aria-label="Advertisement"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
};

const DISABLE_ANIM_CSS = `
  *,*::before,*::after{
    transition:none !important;
    animation:none !important;
    scroll-behavior:auto !important;
  }
`;

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
    retries: isCI ? 1 : 0
  },

  specFileRetries: isCI ? 1 : 0,
  specFileRetriesDeferred: true,

  maxInstances: forcedInstances ?? (isCI ? 1 : 3),

  services: [
    ['chromedriver', { logFileName: 'chromedriver.log', outputDir: 'logs', args: ['--silent'] }]
  ],

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
    unhandledPromptBehavior: 'dismiss'
  }],

  before: async function () {
    if (typeof baseConfig.before === 'function') {
      await (baseConfig as any).before!.apply(this, arguments as unknown as any);
    }
    try {
      await browser.setTimeout({ pageLoad: isCI ? 60_000 : 45_000, script: 30_000, implicit: 0 });
    } catch {}
  },

  beforeTest: async function () {
    try {
      await browser.execute((css: string) => {
        const s = document.createElement('style');
        s.setAttribute('data-ci-disable-anim', 'true');
        s.type = 'text/css';
        s.appendChild(document.createTextNode(css));
        document.head.appendChild(s);
      }, DISABLE_ANIM_CSS);
    } catch {}

    try { await browser.execute(ADS_KILLER); } catch {}

    try {
      await browser.waitUntil(
        async () => (await browser.execute(() => document.readyState)) === 'complete',
        { timeout: 15_000, interval: 250, timeoutMsg: 'Page did not reach readyState=complete' }
      );
    } catch {}
  },

  afterNavigateTo: async function () {
    try { await browser.execute(ADS_KILLER); } catch {}
  },

  beforeCommand: async function (commandName: string) {
    if (!isCI) return;
    try {
      if (commandName === 'click' || commandName === 'elementClick') {
        await browser.execute(ADS_KILLER);
      }
    } catch {}
  },

  afterTest: async function (_test, _ctx, { error }) {
    if (!error) return;
    try {
      if ((browser as any).isSessionActive && (browser as any).isSessionActive()) {
        await browser.saveScreenshot(`./allure-results/${Date.now()}-fail.png`);
      }
    } catch {}
  },

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
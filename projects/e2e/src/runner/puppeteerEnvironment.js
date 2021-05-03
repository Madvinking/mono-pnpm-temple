require('dotenv').config();
require('./enrich');

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { v4 } = require('uuid');
const NodeEnvironment = require('jest-environment-node');

const { NODE_ENV = 'local', OPEN_BROWSER = null, SLOWMO = 0, FULL_SCREEN = false, DEBUG = false } = process.env;

const dataDir = path.join(__dirname, '../tmp/my-profile-directory');
const launch = {
  args: [
    '--no-sandbox',
    `--disk-cache-dir=${dataDir}`,
    // Allow cross-domain iframe to support Stripe integration in plan-and-billing spec
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
  ],
  headless: !OPEN_BROWSER,
  slowMo: SLOWMO,
  defaultViewport: null,
  devtools: DEBUG,
};

if (NODE_ENV === 'ci') {
  launch.args.push('--disable-dev-shm-usage', '--window-size=1792,1120');
  launch.executablePath = 'google-chrome-unstable';
} else if (FULL_SCREEN) {
  launch.args.push('-start-fullscreen');
}

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    launch.userDataDir = `${dataDir}/users/${v4()}`;
    this.userDataDir = launch.userDataDir;

    try {
      this.global.browser = this.browser = await puppeteer.launch(launch);
    } catch (err) {
      console.error('failed to lunch puppeteer will with err', err);
      this.global.browser = this.browser = await puppeteer.launch(launch);
    }

    const [currentPage] = await this.browser.pages();

    this.global.page = currentPage;
  }

  async teardown() {
    await super.teardown();

    try {
      await this.browser.close();
      fs.rmdirSync(this.userDataDir, { recursive: true, maxRetries: 10 });
    } catch (err) {
      console.warn('failed on suite teardown', err);
    }
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;

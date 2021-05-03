import dotenv from 'dotenv';
import { default as chalk } from 'chalk';
import { screenshot, logger } from '../utils';
import { registerLogsListeners, rotateLogs, printLast } from './handleSuiteLogs';

dotenv.config();

let screenshotPromise = Promise.resolve();
let deregisterListeners;

beforeAll(async () => {
  try {
    await page.fullyRefreshPage();

    deregisterListeners = registerLogsListeners();
  } catch (err) {
    logger.error('error in setup-suite beforeAll', err);
  }
});

beforeEach(async () => screenshotPromise);

afterEach(async () => rotateLogs());

afterAll(async () => {
  await screenshotPromise;
  deregisterListeners();
});

jasmine.getEnv().addReporter({
  async specDone({ status, description, fullName, failedExpectations }) {
    try {
      let suiteName = fullName.replace(description, '').trim();

      // cutting the name if it's too long
      if (suiteName.length > 45) {
        suiteName = `${suiteName.slice(0, 42)}...`;
      }

      if (status === 'pending')
        process.stdout.write(
          `${suiteName.padEnd(45)} | ${description.padEnd(97)} | ${chalk.bgBlue.black.bold('skipped')}\n`,
        );

      if (status === 'passed')
        process.stdout.write(
          `${suiteName.padEnd(45)} | ${description.padEnd(97)} | ${chalk.bgGreen.black.bold('passed')}\n`,
        );

      if (status === 'failed') {
        process.stdout.write(
          `\n${suiteName.padEnd(45)} | ${description.padEnd(97)} | ${chalk.bgRed.white.bold('failed')}`,
        );
        process.stdout.write(
          '\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n',
        );

        printLast(failedExpectations);

        process.stdout.write(
          '\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n',
        );

        if (process.env.REPORT_FOLDER) {
          screenshotPromise = screenshotPromise.then(() => screenshot(`${suiteName}|${description}`));
        }
      }
    } catch (err) {
      process.stdout.write(`unable to capture information on suite ${fullName}`, err);
    }
  },
});

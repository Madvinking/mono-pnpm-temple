require('dotenv').config();

const { version } = require('../version');
const { startSummary } = require('./summary');
const { runJestMode, runThroatMode, getAllFailedSuitesFromRun } = require('./runTests');
const { printBig, delay, removeChromiumAlert } = require('./utils');

const { FLAKY_AMOUNT = 0, RETRY_ON_FAILED = null, IS_DOCKER = false } = process.env;

async function init() {
  try {
    removeChromiumAlert();

    printBig('E2E-V2 Start');

    if (IS_DOCKER) console.log(`version: ${version}`);

    let runs;

    if (+FLAKY_AMOUNT > 0) {
      printBig(`flaky time - ${FLAKY_AMOUNT}`);

      runs = await runThroatMode({ amount: +FLAKY_AMOUNT });
    } else {
      runs = [await runJestMode()];

      if (+RETRY_ON_FAILED) {
        // take time to bigPrint to output to console
        await delay(1000);

        const suitesToReRun = getAllFailedSuitesFromRun(runs[0]);

        if (suitesToReRun.length > 0) {
          printBig(`retry ${RETRY_ON_FAILED} times on ${suitesToReRun.length} :`);

          const retryRuns = await runThroatMode({ amount: +RETRY_ON_FAILED, tests: suitesToReRun });

          runs.push(...retryRuns);
        } else {
          printBig('perfect run');
        }
      }
    }

    // take time to bigPrint to output to console
    await delay(1000);
    printBig('summary');

    const failRun = startSummary(runs);

    // take time to bigPrint to output to console
    await delay(2000);

    if (failRun) {
      printBig('FA FA FA FAILED');
      process.exit(1);
    } else {
      printBig('LOOK AT YOU... SUCCESS!');

      process.exit(0);
    }
  } catch (err) {
    printBig('something went wrong with the run');
    console.error(err);
    await delay(3000);
    process.exit(1);
  }
}

init();

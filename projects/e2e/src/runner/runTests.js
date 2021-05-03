const path = require('path');
const fs = require('fs');
const { runCLI } = require('jest');
const chalk = require('chalk');
const throat = require('throat');
const jestConfig = require('../jest.config');
const { getConsoleLogOutput, shuffle } = require('./utils');

const { MAX_WORKERS = 1 } = process.env;
let testsRunCounter = 0;
const usersDataDir = path.join(__dirname, '../tmp/my-profile-directory/users');

fs.rmdirSync(usersDataDir, { recursive: true });

// return arr of runs with arr of suites in each
async function getTestsToRun({ amount, config }) {
  const testToRunConfig = { ...config };

  testToRunConfig.listTests = true;
  testToRunConfig.findRelatedTests = true;

  const getOutput = getConsoleLogOutput();

  await runCLI(testToRunConfig, ['./']);

  const tests = getOutput();

  const testStr = tests.map((t, i) => t.replace(/.+__specs__\//, `${i + 1}. `)).join('\n');

  console.log(chalk.green(`run tests:\n${testStr}`));

  return tests.map(test => new Array(amount).fill(test)).flat();
}

async function runJestMode() {
  await getTestsToRun({ amount: 1, config: jestConfig });

  if (jestConfig.reporters.length > 0) jestConfig.reporters[0][1].outputName = `e2e-v2-${(testsRunCounter += 1)}.xml`;

  const { results } = await runCLI(jestConfig, ['./']);

  return results.testResults;
}

async function runThroatMode({ amount, tests = null }) {
  if (tests) jestConfig.testRegex = tests.join('|');

  jestConfig.maxWorkers = 1;

  const testsToRun = shuffle(await getTestsToRun({ amount, config: jestConfig }));

  const arrOfResults = await Promise.all(
    testsToRun.map(
      throat(+MAX_WORKERS, async testName => {
        const testConfig = { ...jestConfig, testRegex: testName };

        if (testConfig.reporters.length > 0)
          testConfig.reporters[0][1].outputName = `e2e-v2-${(testsRunCounter += 1)}.xml`;

        return runCLI(testConfig, ['./']);
      }),
    ),
  );

  return arrOfResults.map(({ results: { testResults } }) => testResults);
}

function getAllFailedSuitesFromRun(runs) {
  return runs
    .flat()
    .filter(({ numFailingTests, skipped, failureMessage = null }) => (numFailingTests > 0 && !skipped) || failureMessage)
    .map(({ testFilePath }) => testFilePath);
}

module.exports = {
  runJestMode,
  runThroatMode,
  getAllFailedSuitesFromRun,
};

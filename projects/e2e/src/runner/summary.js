const fs = require('fs');
const chalk = require('chalk');
const { groupBy, isEmpty, orderBy } = require('lodash');
const { reportSuiteAndTestsResults } = require('./reportResults');
const { statusEnum } = require('./utils');
const path = require('path');

const { IS_DOCKER, FAILURE_THRESHOLD = 75 } = process.env;
const suitesToPrintAmount = 10;
let failRun = false;

const failedRunningSuite = [];

function getSuiteStatus(suite) {
  let status = statusEnum.FAILED;

  if (suite.skipped) status = statusEnum.SKIPPED;
  // suite.testExecError means that the suite itself failed (not ot of the tests)
  else if (!suite.testExecError && suite.numFailingTests === 0) status = statusEnum.PASSED;

  return status;
}

function getSuiteData(suite) {
  /* reduce tests on suite do 2 things:
    1) sum all suites duration in minutes to get the total run time of this suite
    2) create 3 array
      - skipped tests names
      - passed tests names and duration
      - failed tests names, duration and the failed message
  */

  return suite.testResults.reduce(
    (data, { duration, status, title }) => {
      const durationImMinutes = duration / 60000;

      if (status === statusEnum.FAILED) data.failedTests.push(title);
      else if (status === 'pending') data.skippedTests.push(title);

      data.duration = +(data.duration + durationImMinutes).toFixed(2);

      return data;
    },
    { duration: 0, skippedTests: [], failedTests: [] },
  );
}

function analyzeSuite(suite) {
  const status = getSuiteStatus(suite);
  const path = suite.testFilePath.replace(/.+\/__specs__\//, '');
  const analyzedSuite = {
    path,
    status,
    numberOfTests: suite.testResults.length,
    skippedTests: [],
    failedTests: [],
  };

  if (suite.testExecError) {
    failedRunningSuite.push({ error: suite.failureMessage, path });

    return analyzedSuite;
  }

  const [name] = suite.testResults[0].ancestorTitles;

  reportSuiteAndTestsResults(suite, name, status);

  const suiteData = getSuiteData(suite);

  return {
    ...analyzedSuite,
    name,
    ...suiteData,
  };
}

function countAndMergeTests(currentCountObj, incomingList) {
  incomingList.forEach(name => {
    if (currentCountObj[name]) currentCountObj[name] += 1;
    else currentCountObj[name] = 1;
  });

  return currentCountObj;
}

function groupSuitesByPath(group, { name, status, failedTests, skippedTests, path, duration, numberOfTests }) {
  if (!group[path]) {
    group[path] = {
      passed: 0,
      total: 0,
      errorCount: 0,
    };
  }

  if (status === statusEnum.SKIPPED) group[path].skipped = true;
  else if (status === statusEnum.PASSED) group[path].passed += 1;
  else group[path].errorCount += 1;

  group[path].total += 1;

  // Suite without a name is a suite that failed during the suite run (not in one of the tests)
  // So we cannot calculate the failedTest, duration etc
  if (!name) return group;

  // If current suite didn't fall during the suite run and all the previous one did fall
  // we can add all the extra info that we didn't have before from this suite
  if (!group[path].name && name) {
    group[path] = {
      name,
      duration: 0,
      numberOfTests,
      failedTests: {},
      skippedTests,
      ...group[path],
    };
  }

  group[path].failedTests = countAndMergeTests(group[path].failedTests, failedTests);
  group[path].duration += duration;
  group[path].percentagePass = Math.round((group[path].passed * 100) / group[path].total);

  return group;
}

function printSuiteStatuses(groupSuiteByPath) {
  const failedSuites = [];
  const skippedSuites = [];
  const passedSuites = [];
  const flakySuites = [];

  Object.entries(groupSuiteByPath).forEach(
    ([path, { name = '', duration = 0, passed, total, skipped, numberOfTests = 0, percentagePass }]) => {
      // suite name
      let suiteStatus = chalk.bold(`${name} (${numberOfTests})`.padEnd(45)) + path.padEnd(70);

      if (skipped) {
        suiteStatus += ''.padEnd(45) + chalk.bgBlue.black.bold('| skipped');
        skippedSuites.push(suiteStatus);
      } else {
        const averageDuration = +(duration / total).toFixed(2);

        suiteStatus += chalk.magenta(`${averageDuration} min`.padEnd(15));

        suiteStatus += `${passed}/${total} passed (${percentagePass}%)`.padEnd(30);

        if (percentagePass === 100) {
          suiteStatus += chalk.bgGreen.black.bold('| successful');
          passedSuites.push(suiteStatus);
        } else if (percentagePass >= FAILURE_THRESHOLD) {
          suiteStatus += chalk.bgYellow.black.bold('| flaky');
          flakySuites.push(suiteStatus);
        } else {
          failRun = true;
          suiteStatus += chalk.bgRed.white.bold('| failed');
          failedSuites.push(suiteStatus);
        }
      }
    },
  );

  console.log(
    [...failedSuites.sort(), ...flakySuites.sort(), ...skippedSuites.sort(), ...passedSuites.sort()].join('\n'),
  );
}

function printFailedAndFlakyTests(groupSuiteByPath) {
  const allSkippedTests = [];
  const allFailedTests = [];

  Object.values(groupSuiteByPath).forEach(({ name, skippedTests = [], failedTests = [], skipped }) => {
    if (!skipped && skippedTests.length) {
      allSkippedTests.push(...skippedTests.map(test => `${name.padEnd(40)} - ${test}`));
    }

    const failedArray = Object.entries(failedTests);

    if (failedArray.length) {
      const longestTestNameLength = Math.max(...failedArray.map(([testName]) => testName.length));

      allFailedTests.push(
        ...failedArray.map(([testName, amountOfTimesFailed]) =>
          chalk.red(`${name.padEnd(40)} - ${testName.padEnd(longestTestNameLength)} - ${amountOfTimesFailed} fails`),
        ),
      );
    }
  });

  if (allFailedTests.length > 0) {
    console.log(chalk.underline.blue('\n\nfaild tests:'));
    console.log(allFailedTests.join('\n'));
  }

  if (allSkippedTests.length > 0) {
    console.log(chalk.underline.blue('\n\nskipped tests:'));
    console.log(allSkippedTests.join('\n'));
  }
}

function printFailedSuites() {
  if (failedRunningSuite.length > 0) {
    console.log(chalk.underline.blue(`\n\nfailed suites:`));

    const groupedByFailedSuites = groupBy(failedRunningSuite, 'path');

    Object.values(groupedByFailedSuites).forEach(function (failedSuites) {
      failedSuites.forEach(suite => {
        console.log(suite.error);
      });
    });
  }
}

function createFailedSuitesFile(groupSuiteByPath) {
  if (!IS_DOCKER) return;

  const filePath = path.join(__dirname, '../__output__/failedSuites.txt');

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log('previous file was deleted successfully');
    } catch (err) {
      console.error('failed to remove summary file', err);
    }
  } else {
    console.log('file does not exist');
  }

  const failedSuites = Object.entries(groupSuiteByPath).filter(([, { errorCount }]) => errorCount);
  const failedSuitesTexts = orderBy(failedSuites, [([, { errorCount }]) => errorCount], 'desc').map(
    ([path, { errorCount, percentagePass }]) =>
      `${percentagePass < FAILURE_THRESHOLD ? ':x:' : ''.padEnd(7)} ${path.replace(
        '.test.js',
        '',
      )} | ${errorCount} failed`,
  );

  let failedSuitesString = failedSuitesTexts.slice(0, suitesToPrintAmount).join('\n');
  const restSuitesCount = failedSuitesTexts.slice(suitesToPrintAmount).length;

  if (restSuitesCount) {
    failedSuitesString += `\n and ${restSuitesCount} more suites`;
  }

  if (isEmpty(failedSuitesString)) return;

  try {
    failedSuitesString = `Suites in E2E-V2:\n${failedSuitesString}`;

    fs.writeFileSync(filePath, failedSuitesString);
  } catch (err) {
    console.error('failed to create summary file', err);
  }
}

function startSummary(runs) {
  const groupSuiteByPath = runs.flat().map(analyzeSuite).reduce(groupSuitesByPath, {});

  if (runs.length > 1) {
    console.log(chalk.underline.cyan.bold(`percentage to mark suite as successful: ${FAILURE_THRESHOLD}%\n\n`));
  }

  console.log(chalk.underline.blue('\n\nsuites summary:'));

  printSuiteStatuses(groupSuiteByPath);
  printFailedAndFlakyTests(groupSuiteByPath);
  printFailedSuites();
  createFailedSuitesFile(groupSuiteByPath);

  return failRun;
}

module.exports = {
  startSummary,
};

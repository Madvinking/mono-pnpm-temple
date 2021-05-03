require('dotenv').config();

const { execSync } = require('child_process');
const path = require('path');

const { JEST_TIMEOUT = 300000, SPECS = null, RUN_TYPE = '__specs__', MAX_WORKERS = 1, REPORT_FOLDER = null } = process.env;

const jestConfig = {
  roots: [`<rootDir>/src/${RUN_TYPE}`],
  setupFilesAfterEnv: ['./runner/setupFilesAfterEnv.js'],
  testEnvironment: './runner/puppeteerEnvironment.js',
  testTimeout: JEST_TIMEOUT,
  maxWorkers: +MAX_WORKERS,
  forceExit: true,
  maxConcurrency: 1,
  reporters: [],
};

if (SPECS && RUN_TYPE === '__specs__') jestConfig.testRegex = SPECS;

if (REPORT_FOLDER) {
  const outputPath = path.join(__dirname, REPORT_FOLDER);

  execSync(`mkdir -p ${outputPath} && rm -rf ${outputPath}/*`);
  jestConfig.reporters.push(['jest-junit', { outputDirectory: '__output__' }]);
}

module.exports = jestConfig;

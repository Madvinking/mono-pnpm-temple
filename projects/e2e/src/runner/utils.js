const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');

const { OPEN_BROWSER = false } = process.env;

function printBig(text) {
  console.log(figlet.textSync(text, { kerning: 'full', font: 'Standard' }));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

function removeChromiumAlert() {
  if (OPEN_BROWSER) {
    try {
      const chromiumPath = '/chrome-mac/Chromium.app';
      const macPath = path.join(path.dirname(require.resolve('puppeteer')), '/.local-chromium/');
      const [generatedDir] = fs
        .readdirSync(macPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      const chromiumAppPath = path.join(macPath, generatedDir, chromiumPath);
      const mode = `0${(fs.statSync(chromiumAppPath).mode & parseInt('777', 8)).toString(8)}`;

      if (mode !== '0777') {
        execSync(`sudo chmod 777 ${chromiumAppPath}`);
        execSync(`sudo codesign --force --deep --sign - ${chromiumAppPath}`);
      }
    } catch (err) {
      console.warn('unable to sign Chromium, u may see the annoying message when the browser start');
      console.warn(err);
    }
  }
}

function getConsoleLogOutput() {
  let text;

  // we need this because when jest output the files to run it only print to screen not return the list
  // so we save the console.log output, and turn return it to the original state
  const original = console.log;

  console.log = log => (text = log.split('\n'));

  return () => {
    console.log = original;

    return text;
  };
}

const statusEnum = {
  SKIPPED: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
};

module.exports = {
  shuffle,
  statusEnum,
  printBig,
  delay,
  removeChromiumAlert,
  getConsoleLogOutput,
};

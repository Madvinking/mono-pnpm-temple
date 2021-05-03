import { logger } from '../src/utils';

const { CHECK_CACHE_FILE = '', DEBUG } = process.env;

const consoleMessageBuffer = [];
const networkMessageBuffer = [];
const cacheMessageBuffer = [];

const ignoreRequestList = [
  'data:application/x-font-ttf',
  'data:image/png;base64',
  'data:image/svg+xml;base64',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'data:image/svg+xml',
];

const ignoreStatusCodes = [200, 201, 204, 302, 304];

const listenToConsole = ({ _type, _text }) => {
  const consoleMessage = `${_type}: ${_text}`;

  if (DEBUG) logger.log(consoleMessage);

  consoleMessageBuffer.push(consoleMessage);
};
const listenToResponse = ({ _url, _status, _request: { _resourceType, _method } }) => {
  if (!ignoreRequestList.some(url => _url.includes(url)) && !ignoreStatusCodes.includes(_status)) {
    const m = `${_method} | ${_resourceType} - ${_url} - ${_status}`;

    if (DEBUG) logger.log(m);

    networkMessageBuffer.push(m);
  }
};
const listenToCacheFile = response => {
  const url = response.url();

  if (url.includes(CHECK_CACHE_FILE)) {
    if (response.fromCache()) {
      cacheMessageBuffer.push(`${CHECK_CACHE_FILE} from cache`);
    } else {
      cacheMessageBuffer.push(`${CHECK_CACHE_FILE} NOT from cache`);
    }
  }
};

let clonedLogs = [];
let cloneConsole = [];
let cloneNetwork = [];
let cloneIsCache = [];

export const registerLogsListeners = () => {
  page.on('console', listenToConsole);
  page.on('response', listenToResponse);

  if (CHECK_CACHE_FILE) page.on('response', listenToCacheFile);

  return () => {
    page.off('console', listenToConsole);
    page.off('response', listenToResponse);

    if (CHECK_CACHE_FILE) page.off('response', listenToCacheFile);
  };
};

export const rotateLogs = async () => {
  try {
    clonedLogs = JSON.parse(JSON.stringify(logger.logs));
    logger.logs.length = 0;

    cloneNetwork = JSON.parse(JSON.stringify(networkMessageBuffer));
    networkMessageBuffer.length = 0;

    cloneConsole = JSON.parse(JSON.stringify(consoleMessageBuffer));
    await page.evaluate(() => console.clear());
    consoleMessageBuffer.length = 0;

    if (CHECK_CACHE_FILE) {
      cloneIsCache = JSON.parse(JSON.stringify(cacheMessageBuffer));
      cacheMessageBuffer.length = 0;
    }
  } catch (err) {
    logger.error('error in rotate logs', err);
  }
};

export const printLast = failedExpectations => {
  if (CHECK_CACHE_FILE && cloneIsCache.length > 0) {
    process.stdout.write(`\n----------------------------- Is Cache logs -----------------------------\n`);
    process.stdout.write(cloneIsCache.join('\n'));
    process.stdout.write('\n');
  }

  process.stdout.write(`\n----------------------------- Stacktrace logs -----------------------------\n`);

  const failed = failedExpectations.map(({ message, stack }) => `Failure: ${message}\n${stack}\n`);

  process.stdout.write(failed.join('\n\n'));

  if (clonedLogs.length > 0) {
    process.stdout.write(`\n----------------------------- Collected logs -----------------------------\n`);
    process.stdout.write(clonedLogs.join('\n'));
    process.stdout.write('\n');
  }

  if (cloneConsole.length > 0) {
    process.stdout.write(`\n----------------------------- Browser logs -----------------------------\n`);
    process.stdout.write(cloneConsole.join('\n'));
    process.stdout.write('\n');
  }

  if (cloneNetwork.length > 0) {
    process.stdout.write(`\n----------------------------- Network logs -----------------------------\n`);
    process.stdout.write(cloneNetwork.join('\n'));
    process.stdout.write('\n');
  }
};

module.exports.waitForNetworkIdle = async function ({
  idleFor = 500,
  maxRequests = 0,
  timeout = 15000,
  ignore = /(\.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2)|^data:)/,
} = {}) {
  return new Promise((resolve, reject) => {
    const page = this;
    let timeoutId;
    const pendingRequests = new Map();

    function onRequestStarted(req) {
      const url = req.url();

      if (!url.match(ignore)) {
        pendingRequests.set(req, url);

        if (pendingRequests.size > maxRequests) {
          clearTimeout(timeoutId);
        }
      }

      // https://github.com/puppeteer/puppeteer/issues/3853
      return Promise.resolve()
        .then(() => req.continue())
        .catch(() => {});
    }

    function onRequestFinished(req) {
      if (req.url().match(ignore)) return;

      if (pendingRequests.size === 0) return;

      pendingRequests.delete(req);

      if (pendingRequests.size === maxRequests) {
        timeoutId = setTimeout(onTimeoutDone, idleFor);
      }
    }

    function cleanup() {
      page.removeListener('request', onRequestStarted);
      page.removeListener('requestfinished', onRequestFinished);
      page.removeListener('requestfailed', onRequestFinished);
      clearTimeout(globalTimeoutId);
    }

    function onTimeoutDone() {
      cleanup();
      resolve();
    }

    page.on('request', onRequestStarted);
    page.on('requestfinished', onRequestFinished);
    page.on('requestfailed', onRequestFinished);

    timeoutId = setTimeout(onTimeoutDone, idleFor);

    const globalTimeoutId = setTimeout(() => {
      const pendingUrls = [...pendingRequests.values()];

      cleanup();
      reject(
        new Error(
          `waitForNetworkIdle failed after ${timeout}ms, with ${pendingUrls.length} pending requests:\n${pendingUrls.join('\n')}`,
        ),
      );
    }, timeout);
  });
};

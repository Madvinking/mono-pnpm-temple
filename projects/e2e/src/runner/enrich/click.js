const { JSHandle } = require('puppeteer/lib/cjs/puppeteer/common/JSHandle');

if (!JSHandle.prototype.getEventListeners) {
  JSHandle.prototype.getEventListeners = function () {
    return this._client.send('DOMDebugger.getEventListeners', {
      objectId: this._remoteObject.objectId,
    });
  };
}

async function waitForClick(selector, { clickCount = 1, ...options } = {}) {
  let elementHandle;

  try {
    elementHandle = await this.waitForSelector(selector, options);

    const clickEval = () => this.$eval(selector, async el => el.click());

    if (elementHandle._remoteObject.className === 'HTMLButtonElement') return await clickEval();

    if ((await elementHandle.getEventListeners()).click) return await clickEval();

    return await elementHandle.click({ clickCount });
  } catch (err) {
    const type = elementHandle && elementHandle._remoteObject && elementHandle._remoteObject.className;

    err.message = `Could not click on selector ${selector} of type: ${type}. ${err.message}`;
    throw err;
  }
}

module.exports = { waitForClick };

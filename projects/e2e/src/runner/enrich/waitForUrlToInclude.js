const { waitFor } = require('poll-until-promise');

async function waitForUrlToInclude(partial, options = { timeout: 3000, interval: 100 }) {
  return waitFor(async () => {
    const currentUrl = await this.url();

    if (!currentUrl.includes(partial)) throw new Error(`waiting for url: "${currentUrl}"\nto contain: "${partial}"`);
  }, options);
}

module.exports = {
  waitForUrlToInclude,
};

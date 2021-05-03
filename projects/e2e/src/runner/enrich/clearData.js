const { waitFor } = require('poll-until-promise');
const { logger } = require('../../src/utils/infra/logger');
const url = '';
async function clearUserData(cdpSession = null) {
  try {
    await waitFor(
      async () => {
        let closeCdpSession = false;

        if (!cdpSession) {
          cdpSession = await this.target().createCDPSession();
          closeCdpSession = true;
        }

        await Promise.all([
          cdpSession.send('Network.clearBrowserCookies'),
          this.evaluate(() => localStorage.clear()).catch(err => {
            logger.warn('fail to clear localStorage', err);
          }),

          this.evaluate(() => sessionStorage.clear()).catch(err => {
            logger.warn('fail to clear sessionStorage', err);
          }),
        ]);

        if (closeCdpSession) await cdpSession.detach();
      },
      { timeout: 20000, message: 'unable to clear user data' },
    );
  } catch (err) {
    err.message = `failed to clear user data.\n${err.message}`;

    logger.error(err);

    throw err;
  }
}

async function clearCache(cdpSession = null) {
  try {
    if (!cdpSession) cdpSession = await this.target().createCDPSession();

    // Wipe entire disk cache
    await cdpSession.send('Network.clearBrowserCache');

    // Toggle 'Disable Cache' to evict the memory cache
    await cdpSession.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdpSession.send('Network.setCacheDisabled', { cacheDisabled: false });
  } catch (err) {
    err.message = `failed to clear user cache.\n${err.message}`;

    logger.error(err);

    throw err;
  }
}

async function clearAllData() {
  const cdpSession = await this.target().createCDPSession();

  await Promise.all([
    this.clearCache(cdpSession),
    this.clearUserData(cdpSession),
    cdpSession.send('Storage.clearDataForOrigin', {
      origin: new URL(url).origin,
      storageTypes: 'all',
    }),
  ]);

  await cdpSession.detach();
}

module.exports = {
  clearUserData,
  clearCache,
  clearAllData,
};

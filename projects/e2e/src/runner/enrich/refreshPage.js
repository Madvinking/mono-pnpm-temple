const { logger } = require('../../src/utils/infra/logger');

async function refreshPage(network = true, options = { timeout: 30000 }) {
  const waitUntil = ['domcontentloaded'];

  if (network) waitUntil.push('networkidle2');

  return this.reload({ waitUntil, ...options });
}

async function fullyRefreshPage() {
  try {
    await this.clearUserData();
    await this.goto('about:blank', { waitUntil: 'domcontentloaded' });
  } catch (err) {
    err.message = `failed to fully refresh page.\n${err.message}`;

    logger.error(err);

    throw err;
  }
}

module.exports = {
  refreshPage,
  fullyRefreshPage,
};

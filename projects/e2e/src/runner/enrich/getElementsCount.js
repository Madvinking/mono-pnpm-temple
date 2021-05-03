async function getElementsCount(selector, options = { shouldWait: true }) {
  try {
    if (options.shouldWait) await this.waitForSelector(selector, options);

    const elements = await this.$$(selector);

    return elements.length;
  } catch (err) {
    err.message = `failed get number of occurrences using ${selector}, ${err.message}`;
    throw err;
  }
}

module.exports = { getElementsCount };

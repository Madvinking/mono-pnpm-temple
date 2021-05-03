async function getAttributeValue(selector, attribute, options = {}) {
  try {
    await this.waitForSelector(selector, options);

    const elementHandle = await this.$(selector);

    return this.evaluate((elementHandle, attribute) => elementHandle.getAttribute(attribute), elementHandle, attribute);
  } catch (err) {
    err.message = `failed get attribute value from ${selector}, ${err.message}`;
    throw err;
  }
}

module.exports = { getAttributeValue };

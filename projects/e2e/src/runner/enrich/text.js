async function getAllText(selector = null, options = {}) {
  try {
    await this.waitForSelector(selector, options);

    const elements = await this.$$(selector);
    const textList = await Promise.all(elements.map(element => this.evaluate(elm => elm.textContent, element)));

    return [...textList];
  } catch (err) {
    err.message = `getAllText form ${selector} failed, ${err.message}`;
    throw err;
  }
}

async function getText(selector = null, options = {}) {
  try {
    await this.waitForSelector(selector, options);

    const element = await this.$(selector);

    return await this.evaluate(elm => elm.textContent, element);
  } catch (err) {
    err.message = `getText form ${selector} failed, ${err.message}`;
    throw err;
  }
}

module.exports = {
  getAllText,
  getText,
};

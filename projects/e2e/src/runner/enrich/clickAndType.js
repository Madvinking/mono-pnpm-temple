async function clickAndType(selector, text = '', options = { clear: false, delay: 0 }) {
  try {
    if (text) {
      await this.waitForSelector(selector);
      await this.click(selector, { clickCount: options.clear ? 3 : 1 });

      if (this.keyboard) {
        await this.keyboard.type(text, { delay: options.delay });
      } else {
        await this.type(selector, text, { delay: options.delay });
      }
    }
  } catch (err) {
    err.message = `couldn't click and type element ${selector} with error:\n${err.message}`;
    throw err;
  }
}

module.exports = { clickAndType };

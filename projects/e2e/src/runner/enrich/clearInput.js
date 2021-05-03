async function clearInput(selector) {
  try {
    const inputValue = await this.$eval(selector, el => el.value);

    await this.waitForSelector(selector);
    await this.click(selector, { clickCount: 3 });

    for (let i = 0; i <= inputValue.length; i += 1) {
      if (this.keyboard) await this.keyboard.press('Backspace');
      else await this._frameManager._page.keyboard.press('Backspace');
    }
  } catch (err) {
    err.message = `couldn't click element ${selector} with error:\n${err.message}`;
    throw err;
  }
}

module.exports = { clearInput };

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);

  return `concat('${splitedQuotes}', '')`;
};

module.exports.clickByText = async function (selector = 'div', text = '', options = { normalize: false }) {
  try {
    const escapedText = escapeXpathString(text);

    const xPathSelector = options.normalize
      ? `//${selector}[normalize-space()=${escapedText}]`
      : `//${selector}[contains(text(), ${escapedText})]`;

    await this.waitForXPath(xPathSelector);

    const handlers = await this.$x(xPathSelector);

    if (handlers.length > 0) {
      await handlers[0].click();
    } else {
      throw new Error(`text not found: ${text}`);
    }
  } catch (err) {
    err.message = `Couldn't click on text : ${err.message}`;
  }
};

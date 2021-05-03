const xPathSelectorString = (selector, text, normalize) => {
  const splitedQuotes = text.replace(/'/g, `', "'", '`);

  const escapedText = `concat('${splitedQuotes}', '')`;

  return normalize
    ? `//${selector}[normalize-space()=${escapedText}]`
    : `//${selector}[contains(text(), ${escapedText})]`;
};

async function waitForText(
  selector,
  text,
  options = {
    normalize: false,
    element: null,
  },
) {
  try {
    const xPathSelector = xPathSelectorString(selector, text, options.normalize);

    const rootEl = options.element || this;

    return await rootEl.waitForXPath(xPathSelector);
  } catch (err) {
    err.message = `failed go find element using text ${text} and selector ${selector}, ${err.message}`;
    throw err;
  }
}

async function isExistsByText(
  selector,
  text,
  options = {
    normalize: false,
    element: null,
  },
) {
  const xPathSelector = xPathSelectorString(selector, text, options.normalize);

  const rootEl = options.element || this;

  const handlers = await rootEl.$x(xPathSelector);

  return handlers.length > 0;
}

module.exports = {
  waitForText,
  isExistsByText,
};

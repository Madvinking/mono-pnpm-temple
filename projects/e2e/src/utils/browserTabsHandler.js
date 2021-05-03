export const switchTab = async tabNumber => {
  try {
    const pages = await browser.pages();

    page = pages[parseInt(tabNumber, 10)];
  } catch (err) {
    err.message = `Could'nt switch to tab ${tabNumber}. Error: ${err.message}`;
    throw err;
  }
};

export const closeTab = async tabNumber => {
  try {
    const pages = await browser.pages();

    await pages[parseInt(tabNumber, 10)].close();
  } catch (err) {
    err.message = `Could'nt switch to tab ${tabNumber}. Error: ${err.message}`;
    throw err;
  }
};

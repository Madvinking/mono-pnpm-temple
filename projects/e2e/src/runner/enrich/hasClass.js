async function getClasses(selector, options = {}) {
  const element = await this.waitForSelector(selector, options);
  const classNamesHandler = await element.getProperty('className'); // Returns a jsHandle of that property
  const classNames = await classNamesHandler.jsonValue();

  return classNames.split(' ');
}

async function hasClass(selector, className, options = {}) {
  try {
    if (!className) throw "className wasn't Provided";

    const elementClasses = await this.getClasses(selector, options);

    return elementClasses.includes(className);
  } catch (err) {
    err.message = `failed go get class from ${selector}, ${err.message}`;
    throw err;
  }
}

module.exports = {
  getClasses,
  hasClass,
};

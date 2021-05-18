async function getValue(selector, options = { visible: true }) {
  return this.getPropertyValueByName(selector, 'value', options);
}

async function getDisabled(selector, options = { visible: true }) {
  const isDisabled = await this.getPropertyValueByName(selector, 'disabled', options);

  return typeof isDisabled === 'undefined' || isDisabled;
}

async function getChecked(selector, options = { visible: true }) {
  return this.getPropertyValueByName(selector, 'checked', options);
}

async function getPropertyValueByName(selector, propertyName, options = { visible: true }) {
  try {
    await this.waitForSelector(selector, options);

    const element = await this.$(selector);

    const propertyHandler = await element.getProperty(propertyName);

    const value = await propertyHandler.jsonValue();

    return value;
  } catch (err) {
    err.message = `failed get property ${propertyName} from ${selector}, ${err.message}`;
    throw err;
  }
}

module.exports = {
  getValue,
  getChecked,
  getDisabled,
  getPropertyValueByName,
};

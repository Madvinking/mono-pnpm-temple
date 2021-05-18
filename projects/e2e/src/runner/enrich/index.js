const { Page } = require('puppeteer/lib/cjs/puppeteer/common/Page');
const { Frame } = require('puppeteer/lib/cjs/puppeteer/common/FrameManager');

const fns = {
  ...require('./getPropertyValueByName'),
  ...require('./text'),
  ...require('./hasClass'),
  ...require('./getAttributeValue'),
  ...require('./getElementsCount'),
  ...require('./refreshPage'),
  ...require('./clearData'),
  ...require('./click'),
  ...require('./clickByText'),
  ...require('./clickAndType'),
  ...require('./clearInput'),
  ...require('./waitForResponseByUrl'),
  ...require('./waitForNetworkIdle'),
  ...require('./isExists'),
  ...require('./isExistsByText'),
  ...require('./cacheHandler'),
  ...require('./waitForTransitionAnimationEnd'),
  ...require('./waitForUrlToInclude'),
};

Object.entries(fns).forEach(([name, fn]) => {
  if (Page.prototype[name]) throw new Error(`${name}, function already exists on puppeteer Page class`);

  Page.prototype[name] = fn;

  if (Frame.prototype[name]) throw new Error(`${name}, function already exists on puppeteer Frame class`);

  Frame.prototype[name] = fn;
});

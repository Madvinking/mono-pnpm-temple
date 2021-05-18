const deepMerge = require('deepmerge');
const { logger } = require('../../src/utils/infra/logger');

async function getCacheItem(cacheKey, options = { prefix: '' }) {
  try {
    const storageKey = `${options.prefix}${cacheKey}`;
    const cacheValue = await this.evaluate(key => sessionStorage.getItem(key), storageKey);

    const parsedValue = JSON.parse(cacheValue).value;

    const data = parsedValue.data ? parsedValue.data : parsedValue;

    logger.log(`fetch from cache item: ${cacheKey} from cache`);

    return data;
  } catch (err) {
    const message = `Could not get cache item ${cacheKey}`;

    logger.error(message);
    err.message = `${message} ${err.message}`;
    throw err;
  }
}

async function removeCacheItem(cacheKey, options = { prefix: '' }) {
  const storageKey = `${options.prefix}${cacheKey}`;

  await this.evaluate(key => sessionStorage.removeItem(key), storageKey);
  logger.log(`remove from cache item: ${cacheKey}`);
}

async function setCacheItem(cacheKey, cacheItem, { prefix = '', wrapAsData = true } = {}) {
  try {
    const cacheExpTimeInMilliseconds = 12 * 60 * 60 * 1000;
    const item = wrapAsData ? { data: cacheItem } : cacheItem; // when setting authToken we cant wrap in data
    const valueToCache = JSON.stringify({
      value: item,
      exp: +Date.now() + cacheExpTimeInMilliseconds,
    });

    await this.evaluate((key, value) => sessionStorage.setItem(key, value), `${prefix}${cacheKey}`, valueToCache);

    logger.log(`Cached item: ${cacheKey}`);
  } catch (err) {
    const message = `Could not cache item: ${cacheKey}`;

    logger.error(message);
    err.message = `${message} ${err.message}`;
    throw err;
  }
}

async function updateCacheObject(cacheKey, cacheObject, options = { prefix: '' }) {
  try {
    const cacheItem = await this.getCacheItem(cacheKey, options);
    const valueToCache = deepMerge(cacheItem, cacheObject);

    await this.setCacheItem(cacheKey, valueToCache, options);

    logger.log(`${cacheKey} cache was updated`);
  } catch (err) {
    const message = `Could not update ${cacheKey} cache`;

    logger.error(message);
    err.message = `${message} ${err.message}`;
    throw err;
  }
}

module.exports = {
  getCacheItem,
  removeCacheItem,
  setCacheItem,
  updateCacheObject,
};

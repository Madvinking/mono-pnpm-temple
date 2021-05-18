import { cookie } from './cookie.js';
import { logger } from './logger.js';
import { v4 } from 'uuid';

const currentFetch = window.fetch;

window.fetch = function () {
  if (!arguments[1]) arguments[1] = {};
  if (!arguments[1].headers) arguments[1].headers = {};

  arguments[1].headers['x-csrf-token'] = cookie()['x-csrf-token'];
  if (!arguments[1].headers['Content-Type']) arguments[1].headers['Content-Type'] = 'application/json';

  arguments[1].headers['x-request-id'] = v4();

  if (arguments[1].body && typeof arguments[1].body !== 'string') arguments[1].body = JSON.stringify(arguments[1].body);

  return currentFetch
    .apply(this, arguments)
    .then(async response => {
      if (response.status !== 200) throw new Error(response.status);
      try {
        return await response.json();
      } catch (err) {
        throw new Error('response not in json format');
      }
    })
    .catch(err => {
      logger.error(`faild to fetch ${arguments[0]}`, err.message);
      throw err;
    });
};

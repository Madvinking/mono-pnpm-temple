import { performance } from 'perf_hooks';
import { parse } from 'url';
import { addLogIdentifier, LogIdentifiers } from '../logIdentifiers.js';
import { logger } from '../logger.js';

const generateRequestLogObject = ({ req, res, processingTimeMs }) => {
  const { url, method } = req;
  const statusCode = res && res.statusCode;
  let pathTemplate = req.route && req.route.path;

  if (typeof pathTemplate === 'object') pathTemplate = pathTemplate.toString();

  const duration = Math.round(processingTimeMs);
  const parseUrl = parse(url);
  const urlPath = parseUrl.pathname;
  const urlQuery = parseUrl.query || '';
  const message = `url:[${urlPath}], query:[${urlQuery}], method:[${method}], statusCode:[${statusCode}], duration:[${duration}]`;

  return {
    method,
    url: urlPath,
    query: urlQuery,
    duration,
    message,
    statusCode,
    pathTemplate,
    ...addLogIdentifier(LogIdentifiers.ACCESS_LOG),
  };
};

export function accessLogHandler(server) {
  server.on('request', (req, res) => {

    const requestStart = performance.now();
    res.on('finish', () => {
      try {
        const processingTimeMs = performance.now() - requestStart;

        logger.info(generateRequestLogObject({ req, res, processingTimeMs }));
      } catch (err) {
        const data = { err };

        if (res && res.statusCode) data.statusCode = res.statusCode;

        if (req && req.url) data.url = req.url;

        logger.error('failed to create access log', { ...data });
      }

    });
  });
}

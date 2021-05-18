import { performance } from 'perf_hooks';
import { parse } from 'url';
import { addLogIdentifier, LogIdentifiers } from '../logIdentifiers.js';
import { logger } from '../logger.js';
import { getRequestIdFromHeaders } from '../requestId.js';

const generateAccessLogData = ({ req, res, processingTimeMs }) => {
  const { url, method, originalUrl } = req;
  const statusCode = res && res.statusCode;
  let pathTemplate = req.route && req.route.path;

  if (typeof pathTemplate === 'object') pathTemplate = pathTemplate.toString();

  const duration = Math.round(processingTimeMs);
  const parseUrl = parse(url);
  const urlPath = parseUrl.pathname;
  const urlQuery = parseUrl.query || '';
  const message = `request-id: [${getRequestIdFromHeaders(
    req.headers,
  )}], url:[${originalUrl}], query:[${urlQuery}], method:[${method}], statusCode:[${statusCode}], duration:[${duration}]`;

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

        logger.info(generateAccessLogData({ req, res, processingTimeMs }));
      } catch (err) {
        if (res && res.statusCode) err.statusCode = res.statusCode;

        if (req && req.url) err.url = req.url;

        logger.error('failed to create access log', { err });
      }
    });
  });
}

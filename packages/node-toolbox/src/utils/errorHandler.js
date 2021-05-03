
import { logger } from '../logger.js';

process.on('unhandledRejection', err => logger.error('unhandledRejection', { err }));
process.on('uncaughtException', err => logger.error('uncaughtException', { err }));

export const errorHandler = (err, req, res, next) => {
  const { originalMessage = 'Internal Server Error', statusCode = 500, message, stack, logIdentifier = 'SERVER_ERROR', meta = {} } = err;

  if (logger)
    logger.error({
      message,
      originalMessage,
      stack,
      logIdentifier,
      ...meta,
    });
  res.status(statusCode).send({
    message,
    statusCode,
    ...meta,
  });
};


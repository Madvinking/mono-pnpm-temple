
import { logger } from '../logger.js';

process.on('unhandledRejection', err => logger.error('unhandledRejection', { err }));
process.on('uncaughtException', err => logger.error('uncaughtException', { err }));

export const errorHandler = (err, req, res, next) => {
  console.log(111111111111);
  const { originalMessage = 'Internal Server Error', statusCode = 500, message, stack, logIdentifier = 'SERVER_ERROR', meta = {} } = err;

  if (logger)
    logger.error({
      message,
      originalMessage,
      stack,
      logIdentifier,
      ...meta,
    });
  console.log(11111111);
  res.status(statusCode).send({
    message,
    statusCode,
    ...meta,
  });
};


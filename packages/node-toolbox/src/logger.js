import { Logger, ConsoleTransport, formatters, LogzioTransport, LogLevel } from '@logzio-node-toolbox/logger';
import { config } from './config.js';

export const logger = new Logger();

const {
  serviceName,
  region,
  environment,
  hostname,
  version,
  logger: {
    token,
    host,
    debug,
    color,
    logToConsole,
  }
} = config.get();

const metaData = {
  hostname,
  version,
  environment,
  region,
};


if (logToConsole) {
  logger.addTransport(
    new ConsoleTransport({
      color,
      LogLevel: debug ? LogLevel.DEBUG : LogLevel.INFO,
    }),
  );
}

logger.addFormatter([
  formatters.handleError(),
]);

if (token) {
  logger.addTransport(new LogzioTransport({
    host,
    token,
    metaData,
    type: serviceName,
    formatters: [formatters.logSize()],
  }));
}
export {
  LogLevel
}
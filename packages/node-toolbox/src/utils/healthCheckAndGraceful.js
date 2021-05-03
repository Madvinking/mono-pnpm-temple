import { createTerminus } from '@godaddy/terminus';
import { consul } from '../consul.js';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { addLogIdentifier, LogIdentifiers } from '../logIdentifiers.js';
import { tracer } from '../tracer.js';

export function healthCheckAndGraceful(server) {
  const logMetaData = addLogIdentifier(LogIdentifiers.STOPPING_SERVER);

  const {
    serviceName,
    healthChecks: { liveness, readiness },
    server: {
      gracefulShutdown: { delay, serverStopTimeout },
    },
  } = config.get();

  const cleanUp = async () => {
    try {
      logger.info(`${serviceName} starting cleanup`, logMetaData);

      const promises = [consul.close()];

      if (config.get('trace.active')) promises.push(tracer.close());

      await Promise.all(promises);
      logger.info(`${serviceName} finish cleanup`, logMetaData);
      await logger.close();

      console.log('Closing server done');
      process.exit(0);
    } catch (err) {
      console.error('Error cleanUp server', err);
      logger.error('Error cleanUp server', { ...err, ...logMetaData });
      process.exit(1);
    }
  };

  const onSendFailureDuringShutdown = () => logger.error(`${serviceName} marked as unready return 503`, logMetaData);

  const beforeShutdown = () => {
    logger.info(
      `${serviceName} started graceful shutdown, waiting for requests to drain ${delay} milSeconds`,
      logMetaData,
    );

    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const options = {
    healthChecks: {
      [liveness.path]: () => logger.debug(`${serviceName} liveness check`),
      [readiness.path]: () => logger.debug(`${serviceName} readiness check`),
      verbatim: true,
    },
    beforeShutdown,
    timeout: serverStopTimeout,
    signals: ['SIGTERM', 'SIGINT'],
    onSignal: cleanUp,
    onSendFailureDuringShutdown,
  };

  createTerminus(server, options);
}


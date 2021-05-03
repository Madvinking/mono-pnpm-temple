import { nodeHttpTracer, axiosHooksTracer, Tracer } from '@logzio-node-toolbox/tracer';

import { config } from './config.js';
import { logger } from './logger.js';

const {
  tracer: { probability, host },
  serviceName,
  region,
  environment,
  version,
} = config.get();

const tags = {
  region,
  environment,
  version,
};

export const tracer = new Tracer({ serviceName, exporterOptions: { host, probability }, tags });

export function initializeTracer(server) {
  const { active, excludedPaths = [] } = config.get('tracer');

  if (!active || !host) {
    logger.warn('TRACE IS DEACTIVATE OR MISSING HOST!', { active, host });

    return;
  }

  const livenessPath = config.get('healthChecks.liveness.path');
  const readinessPath = config.get('healthChecks.readiness.path');

  excludedPaths.push(`^${livenessPath}.*`);
  excludedPaths.push(`^${readinessPath}.*`);

  const excludedRegex = new RegExp(excludedPaths.join('|'), 'i');
  const shouldIgnore = url => excludedRegex.test(url);

  const onStartSpan = ({ req, span }) => {

  };

  const onError = ({ message, error }) => {
    logger.error(message, { error });
  };

  nodeHttpTracer({ server, tracer, shouldIgnore, onStartSpan, onError });
  axiosHooksTracer({ tracer, shouldIgnore, onStartSpan, onError });
}
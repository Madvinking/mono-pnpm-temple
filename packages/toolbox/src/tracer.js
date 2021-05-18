import { nodeHttpTracer, axiosHooksTracer, Tracer } from '@logzio-node-toolbox/tracer';
import { axios } from '@mono-pnpm-temple-pkg/modules';

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

const exporterOptions = { host, probability };
export const tracer = new Tracer({ serviceName, exporterOptions, tags });

export function initializeTracer(server) {
  const { enable, excludedPaths = [] } = config.get('tracer');

  if (!enable || !host) {
    logger.warn('TRACE IS DEACTIVATE OR MISSING HOST!', { enable, host });

    return;
  }

  const livenessPath = config.get('healthChecks.liveness.path');
  const readinessPath = config.get('healthChecks.readiness.path');

  excludedPaths.push(`^${livenessPath}.*`);
  excludedPaths.push(`^${readinessPath}.*`);

  const excludedRegex = new RegExp(excludedPaths.join('|'), 'i');
  const shouldIgnore = url => excludedRegex.test(url);

  const onStartSpan = () => { };

  const onError = ({ message, error }) => {
    logger.error(message, { error });
  };

  nodeHttpTracer({ server, tracer, shouldIgnore, onStartSpan, onError });
  axiosHooksTracer({ axios, tracer, shouldIgnore, onStartSpan, onError });
}

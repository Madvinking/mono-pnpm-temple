
import { MultiConsul } from '@logzio-node-toolbox/consul';
import { logger } from './logger.js';
import { config } from './config.js';

const { region, serviceName, environment } = config.get();

const { host, port, env = environment, baseUrl, watch, validate } = config.get('consul');
const paths = [`${env}/shared.json`];

if (region) paths.push(`${env}/${region}/shared.json`);

paths.push(`${env}/${serviceName}.json`);

if (region) paths.push(`${env}/${region}/${serviceName}.json`);

const consulOptions = {
  host,
  port,
  validateOptions: {
    ...validate,
    onRetry: () => console.warn(`CONSUL: failed to connect to consul on ${host}:${port}`),
  },
  watchOptions: watch,
  baseUrl,
  paths,
};

export const consul = new MultiConsul(consulOptions);

export async function initializeConsul() {
  await consul.validateConnected();

  const firstConsulConfig = await consul.getAll();

  config.set({ value: firstConsulConfig });

  consul.watchAll({
    onChange: ({ key, changedValue, value }) => {
      config.set({
        value,
        onError: err => {
          logger.error('CONFIG: received error when try to merge config, will merge anyway', { err });

          return true;
        },
      });
      logger.info(`CONSUL: consul ${key} value changed`, { changedValue, value });
    },
    onError: ({ error }) => {
      logger.warn({ error });
    },
  });
}
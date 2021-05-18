import { pg } from '@mono-pnpm-temple-pkg/modules';
import { config } from './config.js';
import { logger } from './logger.js';

export const pgPool = new pg.Pool(config.get('postgresdb'));

pgPool.on('error', err => logger.error('postgress error', err));

export async function postgresConnect() {
  try {
    if (!config.get('postgresdb').enable) return;
    const client = await pgPool.connect();
    logger.log('establish connectio to postges');
    client.release(true);
  } catch (err) {
    logger.error('faild to connect to postgres db', err);
    throw err;
  }
}

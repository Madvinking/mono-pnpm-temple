import { mongoose } from '@mono-pnpm-temple-pkg/modules';
import { config } from './config.js';
import { logger } from './logger.js';

export const mongoConnect = async () => {
  const { host, port, database, user, password, options, enable } = config.get('mongodb');

  if (enable) {
    await mongoose.connect(`mongodb://${host}:${port}/${database}`, {
      ...options,
      user,
      pass: password,
    });

    mongoose.connection.on('reconnected', function () {
      logger.info(`MongoDB reconnected!`);
    });
    logger.info(`successfully connected to db`);
  }
};
export const mongoTransaction = async fn => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const res = await fn(session);
    await session.commitTransaction();
    return res;
  } finally {
    session.abortTransaction();
  }
};

export const mongoCloseConnection = () => new Promise(resolve => mongoose.disconnect(() => resolve()));

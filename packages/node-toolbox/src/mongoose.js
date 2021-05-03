import mongo from 'mongoose';
import { config } from './config.js';
import { logger } from './logger.js';


export const mongoConnect = async () => {
  try {
    const { host, port, database, user, password, options } = config.get('mongodb');

    await mongo.connect(`mongodb://${host}:${port}/${database}`, {
      ...options,
      user,
      pass: password
    });

    mongo.connection.on('reconnected', function () {
      logger.info(`MongoDB reconnected!`);
    });
    logger.info(`successfully connected to db`);

  } catch (err) {
    throw err;
  }
}
export const mongoTransaction = async (fn) => {
  const session = await mongo.startSession();
  try {
    await session.startTransaction();
    const res = await fn(session);
    await session.commitTransaction();
    return res;
  } catch (err) {
    throw err;
  } finally {
    session.abortTransaction();
  }
}

export const mongoose = mongo;
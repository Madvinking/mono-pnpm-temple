import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { config } from './config.js';
import { logger } from './logger.js';
import { initializeConsul } from './consul.js';
import { initializeTracer } from './tracer.js';
import { errorHandler } from './utils/errorHandler.js';
import { registerExpressRouteDescriptor } from './utils/expressRouteDescriptor.js';
import { healthCheckAndGraceful } from './utils/healthCheckAndGraceful.js';
import { accessLogHandler } from './utils/accessLogHandler.js';
import { mongoConnect } from './mongoose.js';
import warpExpress from 'express-auto-async-handler';

export async function initService(cb = () => { }) {
  try {
    await initializeConsul();

    await mongoConnect();
    const app = express();
    // csp issue on graphql running https://github.com/graphql/graphql-playground/issues/1283
    if (process.env.ENV === 'prod') {
      app.use(helmet())
    } else {
      app.use((req, res, next) => {
        const useHelment = req.path.includes('/graphql') ? helmet({ contentSecurityPolicy: false }) : helmet();
        useHelment(req, res, next);
      });
    }
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({
      extended: true
    }));

    cb.constructor.name === "AsyncFunction" ? await cb(app) : cb(app);

    // registerExpressRouteDescriptor(app);
    app.all('*', (req, res) => res.sendStatus(404));
    app.use(errorHandler);

    logger.beautify('config service loaded with:', config.get());

    const { port, serviceName } = config.get();
    const server = app.listen(config.get('port'), () => {
      logger.log(`🚀 ${serviceName} service ready at ${port}`);
    });

    const { socket, keepAlive, headers } = config.get('server.timeout');

    server.setTimeout(socket);
    server.timeout = socket;
    server.keepAliveTimeout = keepAlive;
    server.headersTimeout = headers;

    initializeTracer(server);
    accessLogHandler(server);
    healthCheckAndGraceful(server);
    warpExpress(app);
  } catch (err) {
    logger.error('faild to init express app', { err });
  }
}

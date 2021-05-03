import './src/utils/ServerError';

jest.mock('@mono-pnpm-temple/toolbox', () => ({
  ...require('./src/logIdentifiers'),
  tracer: {
    createSpan: jest.fn(),
    finishSpan: jest.fn(),
  },
  config: {
    get: jest.fn().mockReturnValue({ serviceName: 'mock-service-name' }),
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  middlewares: {
    errorHandler: require('./src/middlewares/errorHandler'),
  },
  REQUEST_ID_LOG_FIELD: 'requestId',
  TRACE_ID_APP_HEADER: 'uber-trace-id',
  REQUEST_ID_APP_HEADER: 'x-request-id',
  addRequestIdToLog: require('./src/auth/requestId').addRequestIdToLog,
  getRequestIdFromHeaders: jest.fn(),
  getRequestIdGaiaHeader: jest.fn(),
}));

const express = require('express');
const { registerExpressRouteDescriptor } = require('../../src/utils/expressRouteDescriptor');

const routeTemplate = {
  method: 'GET',
  labels: ['APP'],
  allowUnauthenticated: false,
  pluginConfigurations: {},
  rateLimits: {},
};

const allMethods = require('http').METHODS;

const registerOn = app => {
  app.get('/path1', () => {});

  const path2Handler = () => {};

  path2Handler.options = {
    labels: ['ADMIN_CONSOLE'],
    allowUnauthenticated: true,
  };
  app.put('/path2', path2Handler);

  app.post('/path3/:param1/:param2', () => {});

  app.all('/path4/*', () => {});
};

const mocks = [
  { ...routeTemplate, internalPath: '/path1', exposedPath: '/path1' },
  {
    ...routeTemplate,
    method: 'PUT',
    internalPath: '/path2',
    exposedPath: '/path2',
    labels: ['ADMIN_CONSOLE'],
    allowUnauthenticated: true,
  },
  {
    ...routeTemplate,
    method: 'POST',
    internalPath: '/path3/{param1}/{param2}',
    exposedPath: '/path3/{param1}/{param2}',
  },
  ...allMethods.map(method => ({
    ...routeTemplate,
    method,
    internalPath: '/path4/{any}',
    exposedPath: '/path4/{any:.*}',
  })),
];

describe('express route descriptor', () => {
  test('should return route descriptor', () => {
    const app = express();

    registerOn(app);

    const routes = registerExpressRouteDescriptor({ path: '/des-route', app });

    expect(routes).toEqual(mocks);

    const { route } = app._router.stack[app._router.stack.length - 1];

    expect(route.path).toEqual('/des-route');
    expect(route.methods.get).toEqual(true);
  });

  test('should return same route descriptor if register on expree Route', () => {
    const app = express();

    const router = express.Router();

    registerOn(router);
    app.use(router);

    const routes = registerExpressRouteDescriptor({ path: '/des-route', app });

    expect(routes).toEqual(mocks);

    const { route } = app._router.stack[app._router.stack.length - 1];

    expect(route.path).toEqual('/des-route');
    expect(route.methods.get).toEqual(true);
  });

  test('throw error if no app or path', () => {
    expect(() => registerExpressRouteDescriptor({ app: 'yofi' })).toThrow('route descriptor must have app and path');
    expect(() => registerExpressRouteDescriptor({ path: 'yofi' })).toThrow('route descriptor must have app and path');
  });
});

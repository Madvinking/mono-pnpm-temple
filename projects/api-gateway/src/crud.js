import { validateCsrf, createCsrf } from './middelwares/csrf.js';
import { config, validateAuth } from '@mono-pnpm-temple-pkg/toolbox';
import proxy from 'express-http-proxy';

export function crudGateway(app) {
  app.get('/user/isLoggedIn', validateAuth, validateCsrf, createCsrf, (req, res) => {
    res.json(JSON.parse(req.headers['user-data']));
  });

  app.post('/user/logout', validateAuth, validateCsrf, createCsrf, async (req, res) => {
    res.cookie('x-auth-token', '', { maxAge: 0 });
    res.json({});
  });

  const { services } = config.get();

  const skipAuth = [
    '/login/?',
    '/signup/?',
    '/main__.*',
    '/public/?.*',
    '/app/?.+',
    '/favicon.ico',
    '/user/login/?',
    '/user/signup/?',
    '/',
  ];

  const skipAuthReg = new RegExp(skipAuth.map(a => `^${a.replace('/', '\\/')}$`).join('|'));

  app.use(async (req, res, next) => {
    console.log('skip auth', req.originalUrl, skipAuthReg.test(req.originalUrl));
    if (skipAuthReg.test(req.originalUrl)) next();
    else await validateAuth(req, res, next);
  });
  app.use(validateCsrf);

  const createCsrfList = ['/login/?', '/signup/?', '/', '/app/?'];

  const createCsrfRegEx = new RegExp(createCsrfList.map(a => `^${a.replace('/', '\\/')}$`).join('|'));

  app.use(async (req, res, next) => {
    console.log('createCsrfRegEx: ', req.originalUrl, createCsrfRegEx.test(req.originalUrl));
    if (createCsrfRegEx.test(req.originalUrl)) createCsrf(req, res, next);
    else next();
  });

  services.forEach(({ url, name }) => {
    if (name === 'app') {
      app.use(
        ['/', '/login', '/signup', '/main__*', '/public/*', 'favicon.ico'],
        proxy(url, {
          proxyReqPathResolver: ({ originalUrl }) => originalUrl,
        }),
      );
    }
    app.use(
      `/${name}/*`,
      proxy(url, {
        proxyReqPathResolver: ({ originalUrl }) => originalUrl,
      }),
    );
  });

  app.use((req, res) => res.redirect('/'));
}

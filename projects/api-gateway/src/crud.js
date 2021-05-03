import { validateCsrf, createCsrf } from './middelwares/csrf.js';
import { validateAuth } from './middelwares/auth.js';
import { config, express } from '@mono-pnpm-temple/toolbox';
import proxy from 'express-http-proxy';

export function crudGateway(app) {
  app.get('/user/isLoggedIn', validateAuth, validateCsrf, createCsrf, (req, res) => {
    res.json(JSON.parse(req.headers['user-data']));
  });

  app.post('/user/logout', validateAuth, validateCsrf, createCsrf, async (req, res) => {
    res.cookie('x-auth-token', '', { maxAge: 0 });
    res.json({});
  });

  const services = config.get('services');

  services.forEach(({ name, url, endpoints, skipAuth = [] }) => {
    // for local developmnet
    if (name === 'frontend') {
      let handler;
      if (config.get('appStaticRoutes')) {
        handler = express.static(path.join(__dirname, `../../../${config.get('appFolder')}/dist/`), {
          maxAge: '120d',
        });
      }
      else {
        handler = proxy(url, {
          proxyReqPathResolver: ({ originalUrl }) => originalUrl.startsWith('/app') ? originalUrl : '/app' + originalUrl
        });
      }

      const csrfMiddleware = (req, res, next) => {
        if (['/', '/signup', '/login'].includes(req.originalUrl)) createCsrf(req, res, next);
        else next()
      }

      app.get([...endpoints, '/main__*'], validateCsrf, csrfMiddleware, handler);
    } else {
      const authMiddleware = async (req, res, next) => {
        if (skipAuth.includes(req.originalUrl)) next();
        else await validateAuth(req, res, next);
      }
      app.use(endpoints, authMiddleware, validateCsrf, proxy(url, {
        proxyReqPathResolver: ({ originalUrl }) => originalUrl
      }));
    }
  });

  app.use((req, res) => res.redirect('/'));

}
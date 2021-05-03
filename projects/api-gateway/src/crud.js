import { validateCsrf, createCsrf } from './middelwares/csrf.js';
import { validateAuth } from './middelwares/auth.js';
import { config } from '@mono-pnpm-temple/toolbox';
import proxy from 'express-http-proxy';
export function crudGateway(app) {
  const skipAuthVaildation = ['^/$', '.*\.js$', '.*\.png$', '.*\.svelte$', '.*\.css$', '^/@vite', '^/user/signup', '^/user/login', '.+\[\[routify_url_options\]\].+'].map(r => new RegExp(r));

  app.use(async (req, res, next) => {
    if (skipAuthVaildation.some(r => r.test(req.path))) next();
    else await validateAuth(req, res, next);
  });

  app.use(validateCsrf);

  const createCsrfList = ['/', '/isLoggedIn', '/logout']

  app.use((req, res, next) => {
    if (createCsrfList.includes(req.path)) createCsrf(req, res, next);
    else next();
  });

  app.get('/user/isLoggedIn', (req, res) => {
    res.json(req.user);
  });

  app.post('/user/logout', async (req, res) => {
    res.cookie('x-auth-token', '', { maxAge: 0 });
    res.json({});
  });

  const serivces = config.get('services');


  serivces.forEach(({ name, url, endpoints }) => {

    // for local developmnet
    if (name === 'frontend' && config.get('appStaticRoutes')) {
      const staticRoute = express.static(path.join(__dirname, `../../../${config.get('appFolder')}/dist/`), {
        maxAge: '120d',
      });
      app.get(endpoints, staticRoute);
    } else {
      app.use(endpoints, proxy(url, {
        proxyReqPathResolver: ({ originalUrl }) => originalUrl
      }));
    }
  });

}
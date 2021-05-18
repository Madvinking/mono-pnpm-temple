import { initService } from '@mono-pnpm-temple-pkg/toolbox';
import { express } from '@mono-pnpm-temple-pkg/modules';
import path from 'path';

initService(async function init(app) {
  app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.startsWith('/app')) res.redirect('/app' + req.path);
    else next();
  });
  app.use(
    express.static(path.resolve('./dist/'), {
      maxAge: '120d',
    }),
  );

  app.use((req, res) => {
    res.redirect('/');
  });
});

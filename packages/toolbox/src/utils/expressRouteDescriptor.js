import { METHODS } from 'http';
import { _ } from '@mono-pnpm-temple-pkg/modules';

const defaultOptions = {
  allowUnauthenticated: false,
  pluginConfigurations: {},
  rateLimits: {},
  labels: ['APP'],
};

export function registerExpressRouteDescriptor(app) {
  // endpoint that were created with express.router() behive diffrently
  const expressRouters = app._router.stack
    .filter(({ name, handle }) => name === 'router' && handle.stack)
    .map(({ handle }) => handle.stack)
    .flat()
    .map(layer => {
      if (_.get(layer, 'route.methods._all')) {
        layer.route.stack = METHODS.map(method => ({
          ...layer.route.stack[0],
          method: method.toLowerCase(),
        }));
      }

      return layer;
    });

  const routes = app._router.stack
    .filter(({ route }) => !!route)
    .concat(...expressRouters)
    .map(({ route, ...rest }) => {
      console.log(route);
      console.log(rest);
      const { path = '/', stack = [] } = route;

      return _.uniqBy(stack, 'method').map(({ method, handle: { options = {} } }) => ({
        path,
        method: method.toUpperCase(),
        ..._.merge({}, defaultOptions, options),
      }));
    })
    .flat()
    .filter(({ skip }) => !skip)
    .reduce((acc, { path, ...rest }) => {
      const paths = Array.isArray(path) ? path : [path];

      return acc.concat(
        paths.map(path => {
          return { path, ...rest };
        }),
      );
    }, [])
    .map(({ path, ...rest }) => {
      let internalPath;
      let exposedPath;
      const splitted = path.split('/:');

      if (splitted.length > 1) {
        internalPath = `${splitted[0]}/${splitted
          .splice(1)
          .map(query => `{${query}}`)
          .join('/')}`;
        exposedPath = internalPath;
      } else {
        exposedPath = path.replace('*', `{any:.*}`);
        internalPath = path.replace('*', `{any}`);
      }

      return {
        internalPath,
        exposedPath,
        ...rest,
      };
    });

  app.get('/admin/route-descriptor', (req, res) => res.json({ apiVersion: '1.0.0', routes }));

  return routes;
}

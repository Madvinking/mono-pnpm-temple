import { ApolloGateway } from '@apollo/gateway';
import { config, validateAuth, validatePublicApiToken } from '@mono-pnpm-temple-pkg/toolbox';
import { validateCsrf, createCsrf } from './middelwares/csrf.js';
import { apolloServerExpress } from '@mono-pnpm-temple-pkg/modules';

export async function graphQlGateway(app) {
  const list = config.get('services');
  const gateway = new ApolloGateway({
    serviceList: list.filter(({ supportGraphql }) => supportGraphql).map(({ name, url }) => ({ name, url: url + '/graphql' })),
  });
  // Pass the ApolloGateway to the ApolloServer constructor
  const server = new apolloServerExpress.ApolloServer({
    gateway,
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  app.use('/graphql', validateCsrf, (req, res, next) => {
    if (req.method === 'GET') createCsrf(req, res, next);
    else validateAuth(req, res, next);
  });

  app.use('/public/graphql', validatePublicApiToken);

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  server.applyMiddleware({ app, path: '/public/graphql' });
}

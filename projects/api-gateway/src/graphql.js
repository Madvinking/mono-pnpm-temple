import { RemoteGraphQLDataSource, ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { config } from '@mono-pnpm-temple/toolbox';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    console.log('context: ', context);
    // Pass the user's id from the context to underlying services
    // as a header called `user-id`
    request.http.headers.set('user-id', context.userId);
  }
}

export async function graphQlGateway(app) {
  const list = config.get('services');
  const gateway = new ApolloGateway({
    serviceList: list.filter(({ supportGraphql }) => supportGraphql).map(({ name, url, supportGraphql }) => ({ name, url: url + '/graphql' }))
  });
  // Pass the ApolloGateway to the ApolloServer constructor
  const server = new ApolloServer({
    gateway,
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
    buildService({ name, url }) {
      console.log('buildService name, url: ', name, url);
      return new AuthenticatedDataSource({ url });
    },
    context: ({ req }) => {
      console.log('req: ', Object.keys(req));
      console.log('req.headers: ', req.headers);
      console.log('req.query: ', req.query);
      console.log('req.body: ', req.body);
      console.log('req.params: ', req.params);

      // Get the user token from the headers
      const token = req.headers.authorization || '';
      // Try to retrieve a user with the token
      // const userId = getUserId(token);
      // Add the user ID to the context
      const userId = '123';
      console.log('userId: ', userId);
      return { userId };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

}

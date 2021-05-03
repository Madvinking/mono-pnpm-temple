import { initService } from '@mono-pnpm-temple/toolbox';
import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { crud } from './crud.js';
initService(async function init(app) {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  });
  server.applyMiddleware({ app });
  crud(app);
});



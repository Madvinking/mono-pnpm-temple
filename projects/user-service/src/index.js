import { initService, apolloServer } from '@mono-pnpm-temple-pkg/toolbox';
import { typeDefs } from './grapqlSchema.js';
import { resolvers } from './graphql.js';
import { crud } from './crud.js';
initService(async function init(app) {
  apolloServer({ typeDefs, resolvers, app });
  crud(app);
});

import { graphql, apolloServerExpress, apolloFederation } from '@mono-pnpm-temple-pkg/modules';

export const dateResolver = new graphql.GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return value.getTime(); // value from the client
  },
  serialize(value) {
    return new Date(value); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === 'INT') {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});


export const apolloServer = ({ typeDefs, resolvers, app }) => {
  const server = new apolloServerExpress.ApolloServer({
    schema: apolloFederation.buildFederatedSchema([
      {
        typeDefs,
        resolvers,
      },
    ]),
    context: ({ req }) => {
      let data = {};
      if (req.headers && req.headers['user-data']) {
        data = JSON.parse(req.headers['user-data'] || '{}');
      }

      return { user: data };
    },
  });

  server.applyMiddleware({ app });
  return server;
}
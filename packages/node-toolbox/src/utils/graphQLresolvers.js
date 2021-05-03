import graphQLScalarTypepkg from 'graphql';

export const Date = new graphQLScalarTypepkg.GraphQLScalarType({
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
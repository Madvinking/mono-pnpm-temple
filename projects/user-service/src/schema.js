import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type User @key(fields: "id") {
    id: ID!
    name: String!
    lastName: String
    email: String!
    phone: String

  }

  extend type Query {
    users: [User]
    user(id: ID!): User
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SingupInput {
    name: String!
    lastName: String
    email: String!
    password: String!
    phone: String
  }

  input UpdateInput {
    id: ID!
    name: String
    lastName: String
    email: String
    password: String
    phone: String
  }

  extend type Mutation {
    login(loginInput: LoginInput): User
    signup(singupInput: SingupInput): User
    update(updateInput: UpdateInput): User
  }
`;

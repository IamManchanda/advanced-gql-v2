const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: "3a980a1e-1e13-48a7-b168-fa56bdef464d",
        username: "harry",
        createdAt: 1596721099094,
      };
    },
    settings(_, { user }) {
      return {
        user,
        theme: "Night Owl",
      };
    },
  },
  Mutation: {
    settings(_, { input }) {
      return input;
    },
  },
  Settings: {
    user() {
      return {
        id: "3a980a1e-1e13-48a7-b168-fa56bdef464d",
        username: "harry",
        createdAt: 1596721099094,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async function startDemoServer() {
  const { url } = await server.listen(3000);
  console.log(`🚀 Server ready at ${url}`);
})();

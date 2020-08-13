const {
  ApolloServer,
  PubSub,
  AuthenticationError,
  UserInputError,
  ApolloError,
} = require("apollo-server");
const gql = require("graphql-tag");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";

const typeDefs = gql`
  type User {
    id: ID!
    error: String!
    content: String! @deprecated(reason: "Why? Because I said so!")
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  type Item {
    task: String!
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
    createItem(task: String!): Item!
  }

  type Subscription {
    newItem: Item
  }
`;

const items = [];

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
    createItem(_, { task }) {
      const item = { task };
      pubSub.publish(NEW_ITEM, {
        newItem: item,
      });
      return item;
    },
  },
  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
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
  User: {
    error() {
      throw new UserInputError("Wrong Fields");
    },
    content() {
      return "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero nobis dolor vero id nemo amet laborum eum dolorum ipsum laudantium iure fugiat beatae eius repellendus magnam, accusamus maxime ab ex.";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(error) {
    console.log(error);
    return new Error("custom error");
  },
  context({ connection, req }) {
    if (connection) {
      return { ...connection.context };
    }
  },
  subscriptions: {
    onConnect(params) {},
  },
});

(async function startDemoServer() {
  const { url } = await server.listen(3000);
  console.log(`🚀 Server ready at ${url}`);
})();

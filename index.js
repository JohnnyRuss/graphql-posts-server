const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, server is closed >', err.message, err.stack);
  process.exit(1);
});

const { ApolloServer } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');

const APP_CONNECTION = process.env.APP_CONNECTION;
const PORT = process.env.PORT;

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(APP_CONNECTION)
  .then(() => {
    SERVER.listen({ port: PORT }).then((res) => {
      console.log(`server running at ${res.url}`);
    });
  })
  .catch((err) => {
    process.on('unhandledRejection', (err) => {
      console.log('Unhandled Rejection, server is closed >', err.message);
      SERVER.close(() => process.exit(1));
    });
  });

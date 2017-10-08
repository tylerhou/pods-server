import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import schema from './schema';

const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', bodyParser.json(), graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: process.env.PORT ?
  	'ws://calhacks-pods.azurewebsites.net/subscriptions'
  	: 'ws://localhost:3000/subscriptions'
}));

const ws = createServer(server);
ws.listen(process.env.PORT || 3000, () => {
  console.log(`graphQL server is now running on port ${process.env.PORT || 3000}.
    Use /graphiql for visual interaction.`)

  new SubscriptionServer({
  	execute, subscribe, schema
  }, {
  	server: ws,
  	path: '/subscriptions'
  })
});
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import fs from 'fs';

import { execute, subscribe } from 'graphql';
import { createServer } from 'https';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import schema from './schema';

const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', bodyParser.json(), graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'wss://www.calhacks-pods.com/subscriptions'
}));

let options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/fullchain.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/chain.pem'),
}

const ws = createServer(options, server);
ws.listen(443, () => {
  console.log(`graphQL server is now running on port ${process.env.PORT || 3000}.
    Use /graphiql for visual interaction.`)

  new SubscriptionServer({
  	execute, subscribe, schema
  }, {
  	server: ws,
  	path: '/subscriptions'
  })
});

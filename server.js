import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import schema from './schema';

const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', bodyParser.json(), graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(process.env.PORT || 3000, () =>
  console.log(`graphQL server is now running on port ${process.env.PORT}.
    Use /graphiql for visual interaction.`)
);

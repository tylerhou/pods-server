'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphql = require('graphql');

var _http = require('http');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();

server.use('/graphql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({
  schema: _schema2.default
}));

server.use('/graphiql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphiqlExpress)({
  endpointURL: '/graphql',
  subscriptionsEndpoint: process.env.PORT ? 'ws://calhacks-pods.azurewebsites.net/subscriptions' : 'ws://localhost:3000/subscriptions'
}));

var ws = (0, _http.createServer)(server);
ws.listen(process.env.PORT || 3000, function () {
  console.log('graphQL server is now running on port ' + process.env.PORT + '.\n    Use /graphiql for visual interaction.');

  new _subscriptionsTransportWs.SubscriptionServer({
    execute: _graphql.execute, subscribe: _graphql.subscribe, schema: _schema2.default
  }, {
    server: ws,
    path: '/subscriptions'
  });
});
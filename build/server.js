'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var _https = require('https');

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
  subscriptionsEndpoint: 'wss://www.calhacks-pods.com/subscriptions'
}));

var options = {
  key: _fs2.default.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/privkey.pem'),
  cert: _fs2.default.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/fullchain.pem'),
  ca: _fs2.default.readFileSync('/etc/letsencrypt/live/www.calhacks-pods.com/chain.pem')
};

var ws = (0, _https.createServer)(options, server);
ws.listen(443, function () {
  console.log('graphQL server is now running on port ' + (process.env.PORT || 3000) + '.\n    Use /graphiql for visual interaction.');

  new _subscriptionsTransportWs.SubscriptionServer({
    execute: _graphql.execute, subscribe: _graphql.subscribe, schema: _schema2.default
  }, {
    server: ws,
    path: '/subscriptions'
  });
});
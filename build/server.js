'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();

server.use('/graphql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({
  schema: _schema2.default
}));

server.use('/graphiql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphiqlExpress)({
  endpointURL: '/graphql'
}));

server.listen(process.env.PORT || 3000, function () {
  return console.log('graphQL server is now running on port ' + process.env.PORT + '.\n    Use /graphiql for visual interaction.');
});
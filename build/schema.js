'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = '\n  type Song {\n    id: ID!\n    artist: String!\n    title: String!\n    stream_url: String!\n  }\n\n  type Pod {\n    id: ID!\n    name: String!\n    songs: [Song]\n  }\n\n  type Query {\n    pods: [Pod]\n    pod(id: ID!): Pod\n  }\n\n  type Mutation {\n    addPod(name: String!): Pod\n    addSong(pod_id: ID!, track_id: String!): Song\n    popSong(song_id: ID!, pod_id: ID!): Song\n  }\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs, resolvers: _resolvers2.default });
exports.default = schema;
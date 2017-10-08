import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `
  type Song {
    id: ID!
    artist: String!
    title: String!
    stream_url: String!
  }

  type Pod {
    id: ID!
    name: String!
    songs: [Song]
  }

  type Query {
    pods: [Pod]
    pod(id: ID!): Pod
  }

  type Mutation {
    addPod(name: String!): Pod
    addSong(pod_id: ID!, track_id: String!): Song
    popSong(song_id: ID!, pod_id: ID!): Song
  }
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;

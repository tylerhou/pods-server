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
    playing: Boolean!
    time_offset: Int!
  }

  type Query {
    pods: [Pod]
    pod(id: ID!): Pod
  }

  type Mutation {
    addPod(name: String!): Pod
    addSong(pod_id: ID!, track_id: String!): Song
    popSong(song_id: ID!, pod_id: ID!): Song
    clearPods: [Pod]
    changePlaying(pod_id: ID!, playing: Boolean!): Boolean!
    seekPod(pod_id: ID!, time: Int!): Int!
  }

  type Subscription {
    podChanged(pod_id: ID!): Pod!
    podListChanged: [Pod]
  }
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;

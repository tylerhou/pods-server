import "isomorphic-fetch";
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

let pods = [{
  id: 0,
  name: 'testing',
  songs: [],
  playing: true,
  time_offset: 0,
}]
let nextPodId = 1;
let nextSongId = 0;

const getPodById = id => pods.find(pod => pod.id == id);
const CLIENT_PARAMETER = '?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f';

const getSoundCloudTrack = (track_id) => {
  return fetch(`https://api.soundcloud.com/tracks/${track_id}${CLIENT_PARAMETER}`)
  .then(response => response.json())
};


export const resolvers = {
  Query: {
    pods: () => {
      return pods;
    },
    pod: (root, args) => {
      return getPodById(args.id);
    }
  },
  Mutation: {
    addPod: (root, args) => {
      const pod = { id: nextPodId++, name: args.name, songs: [], playing: true, time_offset: 0 };
      pods.push(pod);
      pubsub.publish('podListChanged', { podListChanged: pods });
      return pod;
    },
    addSong: (root, args) => {
      return getSoundCloudTrack(args.track_id).then(response => {
        const song = {
          id: nextSongId++,
          stream_url: response.stream_url + CLIENT_PARAMETER,
          title: response.title,
          artist: response.user.username,
        };
        const pod = getPodById(args.pod_id);
        pod.songs.push(song);
        pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
        return song;
      }).catch(error => console.log(error));
    },
    popSong: (root, args) => {
      const pod = getPodById(args.pod_id);
      const [first, ...rest] = pod.songs;
      if (first.id == args.song_id) {
        pod.songs = rest || [];
        pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
        return first;
      }
    },
    clearPods: () => {
      let old_pods = pods;
      pods = [];
      pubsub.publish('podListChanged', { podListChanged: pods });
      return old_pods;
    },
    changePlaying: (root, args) => {
      const pod = getPodById(args.pod_id);
      pod.playing = args.playing;
      pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
      return pod;
    },
    seekPod: (root, args) => {
      const pod = getPodById(args.pod_id);
      pod.time_offset = args.time;
      pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
      return pod;
    },
  },
  Subscription: {
    podListChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('podListChanged'),
        () => true
      )
    },
    podChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('podChanged'),
        (payload, variables) => payload.pod_id == variables.pod_id
      ),
    }
  }
};

export default resolvers;

import "isomorphic-fetch";

let pods = [{
  id: 0,
  name: 'testing',
  songs: [],
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
      const pod = { id: nextPodId++, name: args.name, songs: [] };
      pods.push(pod);
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
        return song;
      }).catch(error => null);
    },
    popSong: (root, args) => {
      const pod = getPodById(args.pod_id);
      const [first, ...rest] = pod.songs;
      if (first.id == args.song_id) {
        pod.songs = rest || [];
        return first;
      }
    },
    clearPods: () => {
      let old_pods = pods;
      pods = []; nextPodId = 0;  nextSongId = 0;
      return old_pods;
    }
  },
};

export default resolvers;

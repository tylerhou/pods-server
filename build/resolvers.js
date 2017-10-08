'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = undefined;

require('isomorphic-fetch');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _pods = [{
  id: 0,
  name: 'testing',
  songs: []
}];
var nextPodId = 1;
var nextSongId = 0;

var getPodById = function getPodById(id) {
  return _pods.find(function (pod) {
    return pod.id == id;
  });
};
var CLIENT_PARAMETER = '?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f';

var getSoundCloudTrack = function getSoundCloudTrack(track_id) {
  return fetch('https://api.soundcloud.com/tracks/' + track_id + CLIENT_PARAMETER).then(function (response) {
    return response.json();
  });
};

var resolvers = exports.resolvers = {
  Query: {
    pods: function pods() {
      return _pods;
    },
    pod: function pod(root, args) {
      return getPodById(args.id);
    }
  },
  Mutation: {
    addPod: function addPod(root, args) {
      var pod = { id: nextPodId++, name: args.name, songs: [] };
      _pods.push(pod);
      return pod;
    },
    addSong: function addSong(root, args) {
      return getSoundCloudTrack(args.track_id).then(function (response) {
        var song = {
          id: nextSongId++,
          stream_url: response.stream_url + CLIENT_PARAMETER,
          title: response.title,
          artist: response.user.username
        };
        var pod = getPodById(args.pod_id);
        pod.songs.push(song);
        return song;
      }).catch(function (error) {
        return null;
      });
    },
    popSong: function popSong(root, args) {
      var pod = getPodById(args.pod_id);

      var _pod$songs = _toArray(pod.songs),
          first = _pod$songs[0],
          rest = _pod$songs.slice(1);

      if (first.id == args.song_id) {
        pod.songs = rest || [];
        return first;
      }
    }
  }
};

exports.default = resolvers;
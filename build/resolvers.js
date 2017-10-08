'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = undefined;

require('isomorphic-fetch');

var _graphqlSubscriptions = require('graphql-subscriptions');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var pubsub = new _graphqlSubscriptions.PubSub();

var _pods = [{
  id: 0,
  name: 'testing',
  songs: [],
  playing: true,
  time_offset: 0
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
      var pod = { id: nextPodId++, name: args.name, songs: [], playing: true, time_offset: 0 };
      _pods.push(pod);
      pubsub.publish('podListChanged', { podListChanged: _pods });
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
        pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
        return song;
      }).catch(function (error) {
        return console.log(error);
      });
    },
    popSong: function popSong(root, args) {
      var pod = getPodById(args.pod_id);

      var _pod$songs = _toArray(pod.songs),
          first = _pod$songs[0],
          rest = _pod$songs.slice(1);

      if (first.id == args.song_id) {
        pod.songs = rest || [];
        pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
        return first;
      }
    },
    clearPods: function clearPods() {
      var old_pods = _pods;
      _pods = [];
      pubsub.publish('podListChanged', { podListChanged: _pods });
      return old_pods;
    },
    changePlaying: function changePlaying(root, args) {
      var pod = getPodById(args.pod_id);
      pod.playing = args.playing;
      pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
      return pod;
    },
    seekPod: function seekPod(root, args) {
      var pod = getPodById(args.pod_id);
      pod.time_offset = args.time;
      pubsub.publish('podChanged', { podChanged: pod, pod_id: pod.id });
      return pod;
    }
  },
  Subscription: {
    podListChanged: {
      subscribe: (0, _graphqlSubscriptions.withFilter)(function () {
        return pubsub.asyncIterator('podListChanged');
      }, function () {
        return true;
      })
    },
    podChanged: {
      subscribe: (0, _graphqlSubscriptions.withFilter)(function () {
        return pubsub.asyncIterator('podChanged');
      }, function (payload, variables) {
        return payload.pod_id == variables.pod_id;
      })
    }
  }
};

exports.default = resolvers;

'use strict';

angular
  .module('monikersApp')
  .factory('Rooms', Rooms);

Rooms.$inject = ['$firebaseArray', '$firebaseObject', '$q', 'FBURL'];

function Rooms($firebaseArray, $firebaseObject, $q, FBURL) {
  var roomsRef = new Firebase(FBURL + 'rooms');
  var rooms = $firebaseArray(roomsRef);
  var Rooms = {
    getRoom: getRoom,
    getWords: getWords,
    getPlayers: getPlayers,
    exists: exists,
    add: add,
    addPlayer: addPlayer,
    addPlayerToTeamOne: addPlayerToTeamOne,
    joinExistingRoom: joinExistingRoom,
    addWord: addWord,
    copyWordsArray: copyWordsArray,
    getTeamNumber: getTeamNumber,
    switchTeams: switchTeams,
    getIndexId: getIndexId,
    all: rooms
  };

  return Rooms;

  function getRoom(roomKey) {
    return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded();
  }

  function getWords(roomKey, type) {
    var deferred = $q.defer();
    
    type === 'temp' ? $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords')).$loaded().then(function (listOfWords) { deferred.resolve(listOfWords);})
        : $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/words')).$loaded().then(function (listOfWords) { deferred.resolve(listOfWords);});

    return deferred.promise;
  }

  function getPlayers(roomKey) {
    var deferred = $q.defer();
    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players')).$loaded().then(function (listOfPlayers) {
      deferred.resolve(listOfPlayers);
    });
    return deferred.promise;
  }

  function exists(roomKey) {
    var deferred = $q.defer();
    $firebaseArray(roomsRef).$loaded().then(function (listOfRooms) {
          for (var i=0; i < listOfRooms.length; i++) {
            if(listOfRooms[i].$id == roomKey) {
              deferred.resolve(true);
            }
          }
      deferred.resolve(false);
    });
    return deferred.promise;
  }

  function add() {
    var deferred = $q.defer();

    rooms
      .$add({ created_at: new Date().getTime() })
      .then(function (ref) {
        deferred.resolve(ref.key());
      });

    return deferred.promise;
  }

  function addPlayer(roomKey, username) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
      .$add({ username: username , team: 'Team One'})
      .then(function (ref) {
        deferred.resolve(ref.key());
        addPlayerToTeamOne(roomKey, username);
      });

    return deferred.promise;
  }

  function addPlayerToTeamOne(roomKey, username) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/teams/teamOne'))
        .$add({ username: username })
        .then(function () {
          deferred.resolve();
        });

    return deferred.promise;
  }

  function joinExistingRoom(roomKey, username) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
        .$add({ username: username, team: 'Team One'})
        .then(function (ref) {
          deferred.resolve(ref.key());
        });

    return deferred.promise;
  }

  function addWord(roomKey, newWord) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords'))
        .$add({ word: newWord})
        .then(function (ref) {
          deferred.resolve(ref.key());
          copyWordsArray(roomKey, newWord, ref.key());
        });

    return deferred.promise;
  }

  function copyWordsArray(roomKey, newWord, wordKey) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/words'))
        .$add({ word: newWord, key: wordKey})
        .then(function () {
          deferred.resolve();
        });

    return deferred.promise;
  }
  
  function getTeamNumber (roomKey, userId) {
    return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId)).$loaded();
  }

  function switchTeams (roomKey, userId, username, currentTeam) {
   var player = $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId));
    player.team = currentTeam == 'Team One' ? 'Team Two' : 'Team One';
    player.username = username;
    player.$save();
  }

  function getIndexId (roomKey, index) {
    var deferred = $q.defer();
    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players')).$loaded().then(function (listOfPlayers) {
      deferred.resolve(listOfPlayers[index].$id);
    });
    return deferred.promise;


  }
  
}

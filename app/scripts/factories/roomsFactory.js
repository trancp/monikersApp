
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
    addPlayerToTeam: addPlayerToTeam,
    joinExistingRoom: joinExistingRoom,
    addWord: addWord,
    copyWordsArray: copyWordsArray,
    getTeamNumber: getTeamNumber,
    switchTeams: switchTeams,
    removeFromCurrentTeam: removeFromCurrentTeam,
    addToNewTeam: addToNewTeam,
    updatePlayersStatus: updatePlayersStatus,
    updateGameStatus: updateGameStatus,
    nextRound: nextRound,
    removeWordFromTempWords: removeWordFromTempWords,
    shuffleWords: shuffleWords,
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

  function exists(roomCode) {
    var deferred = $q.defer();
    const roomExists = { exists: false, roomId: '' };
    $firebaseArray(roomsRef).$loaded().then(function (listOfRooms) {
          for (var i=0; i < listOfRooms.length; i++) {
            if(listOfRooms[i].roomCode == roomCode) {
              roomExists.exists = true;
              roomExists.roomId = listOfRooms[i].$id;
              deferred.resolve(roomExists);
            }
          }
      deferred.resolve(roomExists);
    });
    return deferred.promise;
  }

  function add(roomCode) {
    var deferred = $q.defer();

    rooms
      .$add({ created_at: new Date().getTime(), roomCode: roomCode, gameStatus: { gameStarted: false, round: '1', wordIndex: 0} })
      .then(function (ref) {
        deferred.resolve(ref.key());
      });

    return deferred.promise;
  }

  function addPlayer(roomKey, username) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
      .$add({ username: username , team: 'Team One', inGame: false })
      .then(function (ref) {
        deferred.resolve(ref.key());
        addPlayerToTeam(roomKey, ref.key(), 'teamOne');
      });

    return deferred.promise;
  }

  function addPlayerToTeam(roomKey, userKey, teamNum) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/teams/' + teamNum))
        .$add({ userId: userKey })
        .then(function () {
          deferred.resolve();
        });

    return deferred.promise;
  }

  function joinExistingRoom(roomKey, username) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
        .$add({ username: username, team: 'Team One', inGame: false })
        .then(function (ref) {
          deferred.resolve(ref.key());
          addPlayerToTeam(roomKey, ref.key(), 'teamOne');
        });

    return deferred.promise;
  }

  function addWord(roomKey, newWord) {
    var deferred = $q.defer();

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords'))
        .$add({ word: newWord})
        .then(function (ref) {
          deferred.resolve(ref.key());
          copyWordsArray(roomKey);
        });

    return deferred.promise;
  }

  function copyWordsArray(roomKey) {
    $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded().then(function (room) {
      room.tempWords = shuffleWords(room.tempWords);
      room.words = room.tempWords;
      room.$save();
    });
  }

  function getTeamNumber (roomKey, userId) {
    return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId)).$loaded();
  }

  function switchTeams (roomKey, userId, currentTeam) {
    removeFromCurrentTeam(roomKey, userId, currentTeam);
    addToNewTeam(roomKey, userId, currentTeam);
    updatePlayersStatus(roomKey, userId, 'team', currentTeam);
  }

  function removeFromCurrentTeam (roomKey, userId, currentTeam) {
    var teamNum = currentTeam === 'Team One' ? 'teamOne' : 'teamTwo';
    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/teams/' + teamNum)).$loaded().then(function (teams) {
      const userSwitchingTeam =  _.findIndex(teams, function (teamMember) { return teamMember.userId === userId });
      teams.$remove(teams[userSwitchingTeam]);
    });

  }

  function addToNewTeam(roomKey, userId, currentTeam) {
    const newTeamNum = currentTeam === 'Team One' ? 'Team Two' : 'Team One';
    const teamNum = newTeamNum === 'Team One' ? 'teamOne' : 'teamTwo';
    addPlayerToTeam(roomKey, userId, teamNum);
  }

  function updatePlayersStatus(roomKey, userId, field, statusChange) {
    if (field === 'team') {
      statusChange = statusChange === 'Team One' ? 'Team Two' : 'Team One';
    }
    $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId)).$loaded().then(function (player) {
      player[field] = statusChange;
      player.$save();
    });
  }

  function updateGameStatus (roomKey, field, statusChange) {
    $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded().then(function (room) {
      room.gameStatus[field] = statusChange;
      room.$save();
    });
  }

  function nextRound (roomKey, field, nextRoundNum) {
    updateGameStatus(roomKey, field, nextRoundNum);
    resetWords(roomKey);
  }

  function resetWords(roomKey) {
    $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded().then(function (room) {
      room.words = shuffleWords(room.words);
      room.tempWords = room.words;
      room.$save();
    });
  }

  function removeWordFromTempWords (roomKey, wordKey) {
    var deferred = $q.defer();
    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords')).$loaded().then(function (words) {
      const wordToRemoveIndex =  _.findIndex(words, function (wordKeyToRemove) { return wordKeyToRemove.$id === wordKey });
      words.$remove(words[wordToRemoveIndex]);
      deferred.resolve();
    });
    return deferred.promise;
  }

  function shuffleWords (words) {
    const shuffledWordsObj = {};
    const wordKeys = _.shuffle(_.keys(words));
    const shuffledWordsArray = _.shuffle(words);
    for( var i = 0; i < shuffledWordsArray.length; i ++) {
      shuffledWordsObj[wordKeys[i]] = shuffledWordsArray[i];
    }return shuffledWordsObj;
  }
}

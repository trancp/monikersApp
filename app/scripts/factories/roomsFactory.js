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
        getWordsSubmittedByUserAndRemove: getWordsSubmittedByUserAndRemove,
        shuffleWords: shuffleWords,
        firstToGo: firstToGo,
        setUpPlayerTurns: setUpPlayerTurns,
        checkIfEveryoneIsInGame: checkIfEveryoneIsInGame,
        getGameStatusObj: getGameStatusObj,
        shuffleTempWords: shuffleTempWords,
        newGame: newGame,
        changeNewGameStatus: changeNewGameStatus,
        removeUser: removeUser,
        all: rooms
    };

    return Rooms;

    function getRoom(roomKey) {
        return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded();
    }

    function getWords(roomKey, type) {
        var deferred = $q.defer();

        type === 'temp' ? $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords')).$loaded().then(function (listOfWords) {
            deferred.resolve(listOfWords);
        })
            : $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/words')).$loaded().then(function (listOfWords) {
            deferred.resolve(listOfWords);
        });

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
        var roomExists = {exists: false, roomId: ''};
        $firebaseArray(roomsRef).$loaded().then(function (listOfRooms) {
            for (var i = 0; i < listOfRooms.length; i++) {
                if (listOfRooms[i].roomCode == roomCode) {
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
            .$add({
                created_at: new Date().getTime(),
                roomCode: roomCode,
                gameStatus: {gameStarted: false, round: '1', wordIndex: 0, teamTurn: '', readyForNewGame: false, roomMaster: null}
            })
            .then(function (ref) {
                deferred.resolve(ref.key());
            });

        return deferred.promise;
    }

    function addPlayer(roomKey, username) {
        var deferred = $q.defer();

        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
            .$add({username: username, team: 'Team One', inGame: false, submittedWords: false, isMaster: true})
            .then(function (ref) {
                deferred.resolve(ref.key());
                addPlayerToTeam(roomKey, ref.key(), 'teamOne');
                updateGameStatus(roomKey, 'roomMaster', ref.key());
            });

        return deferred.promise;
    }

    function addPlayerToTeam(roomKey, userKey, teamNum) {
        var deferred = $q.defer();

        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/teams/' + teamNum))
            .$add({userId: userKey})
            .then(function () {
                deferred.resolve();
            });

        return deferred.promise;
    }

    function joinExistingRoom(roomKey, username) {
        var deferred = $q.defer();

        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
            .$add({username: username, team: 'Team One', inGame: false, submittedWords: false, isMaster: false})
            .then(function (ref) {
                deferred.resolve(ref.key());
                addPlayerToTeam(roomKey, ref.key(), 'teamOne');
            });

        return deferred.promise;
    }

    function addWord(roomKey, newWord, userKey) {
        var deferred = $q.defer();

        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords'))
            .$add({word: newWord, submittedBy: userKey})
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

    function getTeamNumber(roomKey, userId) {
        return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId)).$loaded();
    }

    function switchTeams(roomKey, userId, currentTeam) {
        removeFromCurrentTeam(roomKey, userId, currentTeam);
        addToNewTeam(roomKey, userId, currentTeam);
        updatePlayersStatus(roomKey, userId, 'team', currentTeam);
    }

    function removeFromCurrentTeam(roomKey, userId, currentTeam) {
        var teamNum = currentTeam === 'Team One' ? 'teamOne' : 'teamTwo';
        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/teams/' + teamNum)).$loaded().then(function (teams) {
            var userSwitchingTeam = _.findIndex(teams, function (teamMember) {
                return teamMember.userId === userId
            });
            teams.$remove(teams[userSwitchingTeam]);
        });

    }

    function addToNewTeam(roomKey, userId, currentTeam) {
        var newTeamNum = currentTeam === 'Team One' ? 'Team Two' : 'Team One';
        var teamNum = newTeamNum === 'Team One' ? 'teamOne' : 'teamTwo';
        addPlayerToTeam(roomKey, userId, teamNum);
    }

    function updatePlayersStatus(roomKey, userId, field, statusChange) {
        var deferred = $q.defer();
        if (field === 'team') {
            statusChange = statusChange === 'Team One' ? 'Team Two' : 'Team One';
        }
        $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userId)).$loaded().then(function (player) {
            player[field] = statusChange;
            player.$save();
            deferred.resolve();
        });
        return deferred.promise;
    }

    function updateGameStatus(roomKey, field, statusChange) {
        var deferred = $q.defer();
        $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/gameStatus')).$loaded().then(function (gameStatus) {
            gameStatus[field] = statusChange;
            gameStatus.$save();
            deferred.resolve();
        });
        return deferred.promise;
    }

    function nextRound(roomKey, field, nextRoundNum) {
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

    function removeWordFromTempWords(roomKey, wordKey) {
        var deferred = $q.defer();
        $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords')).$loaded().then(function (words) {
            var wordToRemoveIndex = _.findIndex(words, function (wordKeyToRemove) {
                return wordKeyToRemove.$id === wordKey
            });
            words.$remove(words[wordToRemoveIndex]);
            deferred.resolve();
        });
        return deferred.promise;
    }

    function removeWord(roomKey, wordKey) {
      var deferred = $q.defer();
      $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords/' + wordKey)).$loaded().then(function (wordToRemove) {
        wordToRemove.$remove().then(function (ref) {
          deferred.resolve(ref);
        });
      });
      return deferred.promise;

    }

    function getWordsSubmittedByUserAndRemove(roomKey, userKey) {
      var deferred = $q.defer();
      $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/tempWords')).$loaded().then(function (words) {
        var wordsToRemoveKeys = [];
        for (var i=0; i<words.length; i++){
          if (words[i].submittedBy === userKey) {
            wordsToRemoveKeys.push(words[i].$id);
          }
        }
        for (var j=0; j < wordsToRemoveKeys.length; j++) {
          removeWord(roomKey, wordsToRemoveKeys[j]);
        }
        copyWordsArray(roomKey);
        updatePlayersStatus(roomKey, userKey, 'submittedWords', false);
        deferred.resolve();
      });
      return deferred.promise;
    }

    function shuffleWords(words) {
        var shuffledWordsObj = {};
        var wordKeys = _.shuffle(_.keys(words));
        var shuffledWordsArray = _.shuffle(words);
        for (var i = 0; i < shuffledWordsArray.length; i++) {
            shuffledWordsObj[wordKeys[i]] = shuffledWordsArray[i];
        }
        return shuffledWordsObj;
    }

    function firstToGo(roomKey) {
        var randomNumber = Math.floor((Math.random() * 2) + 1);
        var teamToStart = 'TeamOne';
        if (2 === randomNumber) {
            teamToStart = 'TeamTwo';
        }
        updateGameStatus(roomKey, 'teamTurn', teamToStart);
        setUpPlayerTurns(roomKey, randomNumber);
    }

    function setUpPlayerTurns(roomKey, teamToStart) {
        $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/teams')).$loaded().then(function (teams) {
            var teamOne = _.values(teams.teamOne);
            var teamTwo = _.values(teams.teamTwo);
            var teamOneOrder = _.shuffle(teamOne);
            var teamTwoOrder = _.shuffle(teamTwo);
            var startingTeam = teamTwoOrder;
            var otherTeam = teamOneOrder;
            if (1 === teamToStart) {
                startingTeam = teamOneOrder;
                otherTeam = teamTwoOrder;
            }
            var turnOrder = [];
            for (var i = 0; i < (startingTeam.length); i++) {
                turnOrder[2 * i] = startingTeam[i];
                turnOrder[2 * i + 1] = otherTeam[i];
            }
            updateGameStatus(roomKey, 'turnOrder', turnOrder);
            updateGameStatus(roomKey, 'playerTurn', 0);

        });
    }

    function checkIfEveryoneIsInGame(roomKey) {
        getRoom(roomKey).then(function (room) {
            var playersArray = _.values(room.players);
            var numPlayerStartedCount = 0;
            _.forEach(playersArray, function (player) {
                if (player.inGame) {
                    numPlayerStartedCount++;
                }
            });
            if (playersArray.length === numPlayerStartedCount && !room.gameStatus.gameStarted) {
                Rooms.updateGameStatus(roomKey, 'gameStarted', true);
                Rooms.firstToGo(roomKey);
            }
        });
    }

    function getGameStatusObj(roomKey) {
        return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/gameStatus')).$loaded();
    }

    function shuffleTempWords(roomKey) {
        $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded().then(function (room) {
            room.tempWords = shuffleWords(room.tempWords);
            room.$save();
        });
    }

    function newGame(roomKey) {
        $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey)).$loaded().then(function (room) {
            room.gameStatus.gameStarted = false;
            room.gameStatus.round = 1;
            room.gameStatus.playerTurn = 0;
            room.gameStatus.readyForNewGame = true;
            room.tempWords = {};
            room.words = {};
            room.$save();
        });

    }

    function changeNewGameStatus(roomKey) {
        getRoom(roomKey).then(function (room) {
            var playersArray = _.values(room.players);
            var numPlayerOutofGame = 0;
            _.forEach(playersArray, function (player) {
                if (!player.inGame) {
                    numPlayerOutofGame++;
                }
            });
            if (playersArray.length === numPlayerOutofGame) {
                Rooms.updateGameStatus(roomKey, 'readyForNewGame', false);
            }
        });
    }

    function removeUser(roomKey, userKey) {
      var deferred = $q.defer();
      $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey + '/players/' + userKey)).$loaded().then(function (userToRemove) {
        userToRemove.$remove().then(function (ref) {
          deferred.resolve(ref);
        });
      });
      return deferred.promise;
    }
}

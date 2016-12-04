(function () {
    'use strict';

    angular
        .module('monikersApp')
        .service('roomsService', roomsService);

    roomsService.$inject = [
        '$firebaseArray',
        '$firebaseObject',
        '$q',
        'FBURL',
        'userService',
        '_'
    ];

    function roomsService($firebaseArray, $firebaseObject, $q, FBURL, userService, _) {
        const vm = this;
        const ROOM_CODE_LENGTH = 6;
        const DEFAULT_PLAYER_STATUS = { submitted: false, teamOne: true, started: false };
        const DEFAULT_NEW_GAME_STATUS = {
            status: {
                readyToStart: false,
                started: false,
                round: '1',
                teamTurn: '',
                ended: true,
                timer: false,
                score: [0, 0],
                turnOrder: ''
            },
            wordBank: ''
        };
        const DEFAULT_NEW_GAME_PLAYER_STATUS = {
            submitted: false,
            started: false,
            words: ''
        };
        let roomData = [];
        vm.roomPlayers = [];
        const ROOMS_REF = new Firebase(FBURL + 'rooms');
        const roomsService = {
            createRoom,
            getRoom,
            getRoomByCode,
            getRoomData,
            joinRoom,
            nextPlayerturn,
            removePlayer,
            removeWords,
            setUpDefaultPlayerStatus,
            startGame,
            startNewGame,
            submitWords,
            updateGameStatus,
            updatePlayerStatus,
            updateScoreAndWords
        };

        return roomsService;

        function createRoom(userName) {
            const deferred = $q.defer();
            const newUserObjectPromise = _getRooms()
                .then(rooms => _createNewRoomCode(rooms))
                .then(roomCode => _addNewRoom(roomCode))
                .then(roomInfo => _addPlayerToRoom(roomInfo.roomId, roomInfo.roomCode, userName));
            deferred.resolve(newUserObjectPromise);
            return deferred.promise;
        }

        function getRoom() {
            return roomData;
        }

        function getRoomByCode(roomCode) {
            const deferred = $q.defer();
            $firebaseObject(ROOMS_REF)
                .$loaded()
                .then(rooms => {
                    const roomKey = _.findKey(rooms, room => _.get(room, 'roomCode') === roomCode);
                    roomData = rooms[roomKey];
                    deferred.resolve(roomKey);
                });
            return deferred.promise;
        }

        function getRoomData(roomKey) {
            return $firebaseObject(new Firebase(FBURL + 'rooms/' + roomKey))
                .$loaded();
        }

        function joinRoom(roomCode, userName) {
            const deferred = $q.defer();
            getRoomByCode(roomCode)
                .then(roomId => _addPlayerToRoom(roomId, roomCode, userName))
                .then(newUserObjectPromise => deferred.resolve(newUserObjectPromise));
            return deferred.promise;
        }

        function nextPlayerturn(roomId) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    if (_isLastPlayer(room.status.turnOrder) || 0 === _numActiveWords(room.wordBank)) {
                        room.status.round = _nextRound(room.status.round);
                        room = _reactivateWords(room);
                        room = shufflePlayers(room);
                    } else {
                        room.status.turnOrder = _setNextPlayerTurn(room.status.turnOrder);
                        room.wordBank = _.shuffle(room.wordBank);
                    }
                    room.status.timer = false;
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function _isLastPlayer(turnOrder) {
            return turnOrder.length - 1 === _.findIndex(turnOrder, { turn: true });
        }

        function _numActiveWords(wordBank) {
            return _.filter(wordBank, word => word.active).length;
        }

        function _nextRound(round) {
            const nextRound = 3 > round
                ? parseInt(round) + 1
                : 1;
            return nextRound;
        }

        function _setNextPlayerTurn(turnOrder) {
            const currentTurnPlayerIndex = _.findIndex(turnOrder, { turn: true });
            const nextTurnPlayerIndex = currentTurnPlayerIndex + 1;
            _.set(turnOrder, `[${currentTurnPlayerIndex}].turn`, false);
            _.set(turnOrder, `[${nextTurnPlayerIndex}].turn`, true);
            return turnOrder;
        }

        function _reactivateWords(room) {
            const wordBank = _.shuffle(_generateWordBank(room));
            _.set(room, 'wordBank', wordBank);
            return room;
        }

        function removePlayer(roomId, userId) {
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}`))
                .$loaded()
                .then(user => {
                    user.$remove();
                });
        }

        function removeWords(roomId, userId) {
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}/words`))
                .$loaded()
                .then(words => {
                    words.$remove();
                    updateGameStatus(roomId, 'readyToStart', false);
                });
        }

        function setUpDefaultPlayerStatus(roomId, userId) {
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}`))
                .$loaded()
                .then(user => {
                    _.assign(user, DEFAULT_PLAYER_STATUS);
                    user.$save();
                });
        }

        function shufflePlayers(room) {
            vm.teamMappedValues = _.mapValues(room.players, (player, _id) => {
                return { userName: player.userName, turn: false, _id, teamOne: player.teamOne };
            });
            vm.teamOne = _.shuffle(_.filter(vm.teamMappedValues, player => player.teamOne));
            vm.teamTwo = _.shuffle(_.filter(vm.teamMappedValues, player => !player.teamOne));
            const turnOrder = _setUpTurnOrder(room, vm.teamOne, vm.teamTwo);
            _.set(turnOrder, 'turnOrder[0].turn', true);
            _.set(room, 'status.teamTurn', turnOrder.teamTurn);
            _.set(room, 'status.turnOrder', turnOrder.turnOrder);
            return room;
        }

        function startGame(roomId, userId) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.set(room, `players.${userId}.started`, true);
                    const numOfPlayersStarted = _.filter(room.players, player => player.started).length;
                    const numOfPlayers = _.map(room.players).length;
                    if (numOfPlayersStarted === numOfPlayers) {
                        _.set(room, 'status.started', true);
                        room = shufflePlayers(room);
                    }
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function startNewGame(roomId) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.assign(room, { wordBank: DEFAULT_NEW_GAME_STATUS.wordBank });
                    _.assign(room.status, DEFAULT_NEW_GAME_STATUS.status);
                    _.forEach(room.players, player => _.assign(player, DEFAULT_NEW_GAME_PLAYER_STATUS));
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function submitWords(roomId, userId, words) {
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}/words`))
                .$loaded()
                .then(user => {
                    _.assign(user, _.map(words, word => {
                        return { word, active: true };
                    }));
                    user.$save();
                    _isGameReadyToStart(roomId);
                });
        }

        function updateGameStatus(roomId, statusField, newStatus) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.set(room, `status.${statusField}`, newStatus);
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function updatePlayerStatus(roomId, userId, statusField, newStatus) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}`))
                .$loaded()
                .then(user => {
                    _.set(user, `${statusField}`, newStatus);
                    user.$save();
                    deferred.resolve(user);
                });
            return deferred.promise;
        }

        function updateScoreAndWords(roomId, wordBank, teamsTurn) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.set(room, 'wordBank', wordBank);
                    const currentTeamScore = teamsTurn
                        ? {
                        teamScoreIndex: 0,
                        score: room.status.score[0]
                    }
                        : {
                        teamScoreIndex: 1,
                        score: room.status.score[1]
                    };
                    room.status.score[currentTeamScore.teamScoreIndex] = currentTeamScore.score + 1;
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function _addNewRoom(roomCode) {
            const deferred = $q.defer();
            $firebaseArray(ROOMS_REF)
                .$add({
                    created_at: new Date().getTime(),
                    roomCode,
                    status: {
                        readyToStart: false,
                        started: false,
                        round: '1',
                        teamTurn: '',
                        ended: false,
                        roomMaster: '',
                        timer: false,
                        numOfWords: 0,
                        score: [0, 0]
                    }
                })
                .then(roomId => {
                    deferred.resolve({
                        roomId: roomId.key(),
                        roomCode
                    });
                });
            return deferred.promise;
        }

        function _addPlayerToRoom(roomId, roomCode, userName) {
            const deferred = $q.defer();
            $firebaseArray(new Firebase(`${FBURL}rooms/${roomId}/players`))
                .$add({
                    userName
                })
                .then(userId => deferred.resolve({
                    _id: userId.key(),
                    roomCode,
                    roomId
                }));
            return deferred.promise;
        }

        function _checkIfRoomExists(rooms, generatedCode) {
            return _.includes(rooms, room => _.get(room, 'roomCode') === generatedCode);
        }

        function _createNewRoomCode(rooms) {
            if (_isRoomAtCapacity(rooms)) {
                return;
            }
            return _findUnexistingRoomCode(rooms);
        }

        function _createWordBank(roomId, wordBank) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.set(room, 'wordBank', wordBank);
                    room.$save();
                    deferred.resolve(room);
                });
            return deferred.promise;
        }

        function _findUnexistingRoomCode(rooms) {
            let generatedRoomCode = '';
            while ('' === generatedRoomCode) {
                generatedRoomCode = Math.floor((Math.random() * Math.pow(10, ROOM_CODE_LENGTH))).toString();
                generatedRoomCode = _checkIfRoomExists(rooms, generatedRoomCode)
                    ? ''
                    : generatedRoomCode;
            }
            return generatedRoomCode;
        }

        function _generateWordBank(roomData) {
            return _.flatten(_.values(_.mapValues(roomData.players, players => players.words)));
        }

        function _getRooms() {
            const deferred = $q.defer();
            $firebaseObject(ROOMS_REF)
                .$loaded()
                .then(rooms => deferred.resolve(rooms));
            return deferred.promise;
        }

        function _isEnoughWords(roomData, wordBank) {
            const wordsRequiredToPlay = _.values(roomData.players).length * roomData.status.numOfWords;
            return wordsRequiredToPlay === wordBank.length;
        }

        function _isGameReadyToStart(roomId) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(roomData => {
                    const wordBank = _.shuffle(_generateWordBank(roomData));
                    if (!_isEnoughWords(roomData, wordBank)) {
                        return;
                    }
                    return _createWordBank(roomId, wordBank)
                        .then(() => {
                            updateGameStatus(roomId, 'ended', false);
                            deferred.resolve(updateGameStatus(roomId, 'readyToStart', true))
                        });
                });
            return deferred.promise;
        }

        function _isRoomAtCapacity(rooms) {
            return rooms.length >= Math.pow(10, ROOM_CODE_LENGTH);
        }

        function _setUpTurnOrder(room, teamOne, teamTwo) {
            const bothTeams = [teamOne, teamTwo];
            const firstToGo = 0 === room.status.teamTurn || 1 === room.status.teamTurn
                ? 1 - room.status.teamTurn
                : _.random(0, 1);
            let alternateTeam = firstToGo;
            const turnOrder = _.map(new Array(teamOne.length + teamTwo.length), (value, index) => {
                const player = bothTeams[alternateTeam][Math.floor(index / 2)];
                alternateTeam = 1 - alternateTeam;
                return player;
            });
            return { turnOrder, teamTurn: firstToGo };
        }

    }
})();

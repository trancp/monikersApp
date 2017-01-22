/* globals Firebase */

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
        '_'
    ];

    function roomsService($firebaseArray, $firebaseObject, $q, FBURL, _) {
        const vm = this;
        const ROOM_CODE_LENGTH = 6;
        const DEFAULT_PLAYER_STATUS = { submitted: false, teamOne: true, started: false };
        const DEFAULT_GAME_STATUS = {
            readyToStart: false,
            started: false,
            round: '1',
            teamTurn: '',
            ended: false,
            roomMaster: '',
            timer: false,
            numOfWords: 5,
            score: [0, 0],
            turnOrder: ''
        };
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
            nextRound,
            removePlayer,
            removeWords,
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
                .then(rooms => {
                    const newRoomCode = _createNewRoomCode(rooms);
                    return _addNewRoom(newRoomCode);
                })
                .then(roomInfo => _addPlayerToRoom(roomInfo.roomId, roomInfo.roomCode, userName, true))
                .then(creatorInfo => _setPlayerStatusDefaults(creatorInfo));
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
                    if (!roomKey) {
                        deferred.reject('Invalid Room Code!');
                    }
                    roomData = rooms[roomKey];
                    deferred.resolve({ roomId: roomKey, data: roomData });
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
                .then(roomData => _addPlayerToRoom(roomData.roomId, roomCode, userName, false, roomData.data))
                .then(newUserInfo => _setPlayerStatusDefaults(newUserInfo))
                .then(newUserObjectPromise => deferred.resolve(newUserObjectPromise))
                .catch(error => deferred.reject(error));
            return deferred.promise;
        }

        function nextPlayerturn(roomId) {
            return $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    room.status.turnOrder = _setNextPlayerTurn(room.status.turnOrder);
                    room.wordBank = _.shuffle(room.wordBank);
                    room.status.timer = false;
                    room.$save();
                });
        }

        function nextRound(roomId) {
            return $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    room.status.round = _nextRound(room.status.round);
                    room = _reactivateWords(room);
                    room = shufflePlayers(room);
                    room.status.timer = false;
                    room.$save();
                });
        }

        function _isLastPlayer(turnOrder) {
            return turnOrder.length - 1 === _.findIndex(turnOrder, { turn: true });
        }

        function _numActiveWords(wordBank) {
            return _.filter(wordBank, word => word.active).length;
        }

        function _nextRound(round) {
            return 3 > round
                ? parseInt(round, 10) + 1
                : 1;
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
            return $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}/words`))
                .$loaded()
                .then(words => {
                    words.$remove();
                    updateGameStatus(roomId, 'readyToStart', false);
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
            return $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}/words`))
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
                    created_at: `${new Date()}`,
                    roomCode,
                    status: DEFAULT_GAME_STATUS
                })
                .then(roomId => {
                    deferred.resolve({
                        roomCode,
                        roomId: roomId.key()
                    });
                });
            return deferred.promise;
        }

        function _addPlayerToRoom(roomId, roomCode, userName, isCreator, roomData) {
            const userNames = _.map(_.get(roomData, 'players'), player => player.userName);
            const uniqueUsername = _generateUniqueUsername(userNames, userName, 0, userName);
            const deferred = $q.defer();
            $firebaseArray(new Firebase(`${FBURL}rooms/${roomId}/players`))
                .$add({
                    userName: uniqueUsername
                })
                .then(userId => deferred.resolve({
                    isCreator,
                    roomCode,
                    roomId,
                    _id: userId.key(),
                    userName: uniqueUsername
                }));
            return deferred.promise;
        }

        function _setPlayerStatusDefaults(userInfo) {
            const _id = userInfo._id;
            const isCreator = userInfo.isCreator;
            const roomCode = userInfo.roomCode;
            const roomId = userInfo.roomId;
            const userName = userInfo.userName;

            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}`))
                .$loaded()
                .then(room => {
                    _.assign(_.get(room, `players.${_id}`), DEFAULT_PLAYER_STATUS);
                    if (isCreator) {
                        _.set(room, 'status.roomMaster', _id);
                    }
                    room.$save();
                    deferred.resolve({ _id, roomCode, roomId, userName });
                });
            return deferred.promise;
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
            const generatedRoomCode = Math.floor((Math.random() * Math.pow(10, ROOM_CODE_LENGTH))).toString();
            const roomExists = _.find(rooms, { roomCode: generatedRoomCode });
            return roomExists
                ? _findUnexistingRoomCode(rooms)
                : generatedRoomCode;
        }

        function _generateUniqueUsername(usernames, desiredUserName, index, unmodifiedUserName) {
            const userNameExists = _.includes(usernames, desiredUserName);
            if (userNameExists) {
                const newDesiredUserName = `${unmodifiedUserName}-${index}`;
                return _generateUniqueUsername(usernames, newDesiredUserName, ++index, unmodifiedUserName);
            }
            return desiredUserName;
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
                            deferred.resolve(updateGameStatus(roomId, 'readyToStart', true));
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

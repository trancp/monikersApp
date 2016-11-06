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
        const DEFAULT_PLAYER_STATUS = {submitted: false, teamOne: true};
        let roomData = [];
        vm.roomPlayers = [];
        const ROOMS_REF = new Firebase(FBURL + 'rooms');
        const roomsService = {
            createRoom,
            get,
            getRoomByCode,
            getRoomData,
            joinRoom,
            removePlayer,
            removeWords,
            setUpDefaultPlayerStatus,
            submitWords,
            updateGameStatus,
            updatePlayerStatus
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

        function get() {
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
            const newUserObjectPromise = getRoomByCode(roomCode)
                .then(roomId => _addPlayerToRoom(roomId, roomCode, userName));
            deferred.resolve(newUserObjectPromise);
            return deferred.promise;
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

        function submitWords(roomId, userId, words) {
            $firebaseObject(new Firebase(`${FBURL}rooms/${roomId}/players/${userId}/words`))
                .$loaded()
                .then(user => {
                    _.assign(user, words);
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

        function _addNewRoom(roomCode) {
            const deferred = $q.defer();
            $firebaseArray(ROOMS_REF)
                .$add({
                    created_at: new Date().getTime(),
                    roomCode,
                    status: {
                        started: false,
                        round: '1',
                        teamTurn: '',
                        end: false,
                        roomMaster: '',
                        timer: false
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
                    const wordBank = _generateWordBank(roomData);
                    if (!_isEnoughWords(roomData, wordBank)) {
                        return;
                    }
                    return _createWordBank(roomId, wordBank)
                        .then(() => deferred.resolve(updateGameStatus(roomId, 'readyToStart', true)));
                });
            return deferred.promise;
        }

        function _isRoomAtCapacity(rooms) {
            return rooms.length >= Math.pow(10, ROOM_CODE_LENGTH);
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

        function _checkIfRoomExists(rooms, generatedCode) {
            return _.includes(rooms, room => _.get(room, 'roomCode') === generatedCode);
        }
    }
})();

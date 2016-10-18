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
        const ROOM_CODE_LENGTH = 6;
        let roomData = [];
        const ROOMS_REF = new Firebase(FBURL + 'rooms');
        const roomsService = {
            createRoom,
            get,
            getRoomByCode,
            joinRoom
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

        function joinRoom(roomCode, userName) {
            const deferred = $q.defer();
            const newUserObjectPromise = getRoomByCode(roomCode)
                .then(roomId => _addPlayerToRoom(roomId, roomCode, userName));
            deferred.resolve(newUserObjectPromise);
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

        function _getRooms() {
            const deferred = $q.defer();
            $firebaseObject(ROOMS_REF)
                .$loaded()
                .then(rooms => deferred.resolve(rooms));
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

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
        const rooms = [];
        const ROOMS_REF = new Firebase(FBURL + 'rooms');
        const roomsService = {
            createRoom,
            joinRoom
        };

        return roomsService;

        function createRoom(userName) {
            const deferred = $q.defer();
            _getRooms()
                .then(allRooms => {
                    if (_isRoomAtCapacity(allRooms)) {
                        return;
                    }
                    const roomCode = _generateRoomCode(allRooms);
                    _addNewRoom(roomCode).then(roomId => {
                        _addPlayerToRoom(roomId, userName)
                            .then(userId => deferred.resolve({ _id: userId, roomId }));
                    });
                });
            return deferred.promise;
        }

        function joinRoom(roomCode, userName) {
            const deferred = $q.defer();
            _getRoomByCode(roomCode)
                .then(roomId => {
                    _addPlayerToRoom(roomId, userName)
                        .then(userId => deferred.resolve({ _id: userId, roomId }));
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
                    deferred.resolve(roomId.key());
                });
            return deferred.promise;
        }

        function _addPlayerToRoom(roomId, userName) {
            const deferred = $q.defer();
            $firebaseArray(new Firebase(`${FBURL}rooms/${roomId}/players`))
                .$add({
                    userName
                })
                .then(userId => deferred.resolve(userId.key()));
            return deferred.promise;
        }

        function get() {
            return rooms;
        }

        function _getRoomByCode(roomCode) {
            const deferred = $q.defer();
            $firebaseObject(ROOMS_REF)
                .$loaded()
                .then(rooms => {
                    const room = _.findKey(rooms, room => _.get(room, 'roomCode') === roomCode);
                    deferred.resolve(room);
                });
            return deferred.promise;
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

        function _generateRoomCode(rooms) {
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

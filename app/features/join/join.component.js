(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('joinRoom', joinRoom());

    function joinRoom() {
        var component = {
            templateUrl: '../app/features/join/join.component.html',
            controller: JoinRoomController
        };

        return component;
    }

    JoinRoomController.$inject = [
        '$localStorage',
        '$sessionStorage',
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    function JoinRoomController($localStorage, $sessionStorage, $state, roomsService, userService, _) {
        const vm = this;

        vm.user = {};
        vm.isLoading = false;

        _.assign(vm, {
            joinRoom,
            roomCodeLengthMatched
        });

        function joinRoom() {
            if (!_.get(vm, 'user.userName') || !_.get(vm, 'user.roomCode')) {
                return;
            }

            vm.isLoading = true;

            roomsService
                .joinRoom(vm.user.roomCode, vm.user.userName)
                .then(response => {
                    $localStorage._id = response._id;
                    _setUpDefaultPlayerStatus(response.roomId, response._id);
                    _createNewUser(response._id, vm.user.userName, response.roomId, false).then(() => {
                        $state.go('room', {
                            roomCode: vm.user.roomCode,
                            userName: vm.user.userName
                        });
                    });

                });
        }

        function roomCodeLengthMatched() {
            return !_.get(vm, 'user.roomCode.length', 0);
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }

        function _setUpDefaultPlayerStatus(roomId, userId) {
            roomsService.setUpDefaultPlayerStatus(roomId, userId);
        }
    }
})();


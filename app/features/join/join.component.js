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

        _.assign(vm, {
            joinRoom
        });

        function joinRoom() {
            if (!_.get(vm, 'user.userName') || !_.get(vm, 'user.roomCode')) {
                return;
            }

            roomsService
                .joinRoom(vm.user.roomCode, vm.user.userName)
                .then(response => {
                    $localStorage._id = response._id;
                    _createNewUser(response._id, vm.user.userName, response.roomId, false);
                    $state.go('room', {
                        roomCode: vm.user.roomCode,
                        userName: vm.user.userName
                    });
                });
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            userService.createUser(userId, userName, roomId, gameMaster);
        }
    }
})();


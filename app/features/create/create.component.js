(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('createRoom', createRoom());

    function createRoom() {
        var component = {
            templateUrl: '../app/features/create/create.component.html',
            controller: CreateRoomController
        };

        return component;
    }

    CreateRoomController.$inject = [
        '$localStorage',
        '$sessionStorage',
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    function CreateRoomController($localStorage, $sessionStorage, $state, roomsService, userService, _) {
        const vm = this;

        vm.user = {};

        vm.isLoading = false;

        _.assign(vm, {
            createGame
        });

        function createGame() {
            if (!vm.user.userName) {
                return;
            }

            vm.isLoading = true;

            roomsService
                .createRoom(vm.user.userName)
                .then(response => {
                    $localStorage._id = response._id;
                    _updateGameStatus(response.roomId, 'roomMaster', response._id);
                    _setUpDefaultPlaterStatus(response.roomId, response._id);
                    _createNewUser(response._id, vm.user.userName, response.roomId, true).then(() => {
                        $state.go('room', {
                            roomCode: response.roomCode,
                            userName: vm.user.userName
                        });
                    });
                });
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }

        function _updateGameStatus(roomId, statusField, newStatus) {
            roomsService.updateGameStatus(roomId, statusField, newStatus);
        }

        function _setUpDefaultPlaterStatus(roomId, userId) {
            roomsService.setUpDefaultPlayerStatus(roomId, userId);
        }
    }
})();

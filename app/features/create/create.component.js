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
                    _createNewUser(response._id, vm.user.userName, response.roomId, true);
                    $state.go('room', {
                        roomCode: response.roomCode,
                        userName: vm.user.userName,
                    });
                });
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            userService.createUser(userId, userName, roomId, gameMaster);
        }
    }
})();

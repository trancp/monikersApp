(function () {
    'use strict';

    function CreateRoomController($state, roomsService, userService, _) {
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

            return roomsService
                .createRoom(vm.user.userName)
                .then(response => createRoomSuccess(response));
        }

        function createRoomSuccess(response) {
            return _createNewUser(response._id, vm.user.userName, response.roomId, true)
                .then(() => goToRoom(response));
        }

        function goToRoom(response) {
            return $state.go('room', {
                roomCode: response.roomCode,
                userName: vm.user.userName
            });
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }
    }

    CreateRoomController.$inject = [
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    const createRoom = {
        templateUrl: '../app/features/create/create.component.html',
        controller: CreateRoomController
    };

    angular
        .module('monikersApp')
        .component('createRoom', createRoom);
})();

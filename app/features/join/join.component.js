(function () {
    'use strict';

    function JoinRoomController($state, roomsService, userService, _) {
        const vm = this;

        vm.user = {};
        vm.isLoading = false;

        _.assign(vm, {
            clearErrorMessage,
            joinRoom
        });

        function clearErrorMessage() {
            vm.errorMessage = '';
        }

        function joinRoom() {
            if (_formValidation()) {
                return;
            }

            vm.isLoading = true;

            roomsService
                .joinRoom(vm.user.roomCode, vm.user.userName)
                .then(response => _joinRoomSuccess())
                .catch(error => _joinRoomError());
        }

        function _formValidation() {
            return !_.get(vm, 'user.userName') || !_.get(vm, 'user.roomCode');
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }

        function _goToRoom() {
            return $state.go('room', {
                roomCode: vm.user.roomCode,
                userName: response.userName
            });
        }

        function _joinRoomSuccess() {
            return _createNewUser(response._id, response.userName, response.roomId, false)
                .then(() => _goToRoom());
        }

        function _joinRoomError() {
            vm.isLoading = false;
            vm.errorMessage = error;
        }
    }

    JoinRoomController.$inject = [
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    const joinRoom = {
        templateUrl: '../app/features/join/join.component.html',
        controller: JoinRoomController
    };

    angular
        .module('monikersApp')
        .component('joinRoom', joinRoom);
})();


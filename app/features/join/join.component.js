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
                .then(response => _joinRoomSuccess(response))
                .catch(error => _joinRoomError(error));
        }

        function _formValidation() {
            return !_.get(vm, 'user.userName') || !_.get(vm, 'user.roomCode');
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }

        function _goToRoom(response) {
            return $state.go('room', {
                roomCode: vm.user.roomCode,
                userName: response.userName
            });
        }

        function _joinRoomSuccess(response) {
            return _createNewUser(response._id, response.userName, response.roomId, false)
                .then(() => _goToRoom(response));
        }

        function _joinRoomError(error) {
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


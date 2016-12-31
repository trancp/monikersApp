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
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    function JoinRoomController($state, roomsService, userService, _) {
        const vm = this;

        vm.user = {};
        vm.isLoading = false;

        _.assign(vm, {
            clearErrorMessage,
            joinRoom,
            roomCodeLengthMatched
        });

        function clearErrorMessage() {
            vm.errorMessage = '';
        }

        function joinRoom() {
            if (!_.get(vm, 'user.userName') || !_.get(vm, 'user.roomCode')) {
                return;
            }

            vm.isLoading = true;

            roomsService
                .joinRoom(vm.user.roomCode, vm.user.userName)
                .then(response => {
                    _createNewUser(response._id, response.userName, response.roomId, false).then(() => {
                        $state.go('room', {
                            roomCode: vm.user.roomCode,
                            userName: response.userName
                        });
                    });
                })
                .catch(error => {
                    vm.isLoading = false;
                    vm.errorMessage = error;
                });
        }

        function roomCodeLengthMatched() {
            return !_.get(vm, 'user.roomCode.length', 0);
        }

        function _createNewUser(userId, userName, roomId, gameMaster) {
            return userService.createUser(userId, userName, roomId, gameMaster);
        }
    }
})();


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
        '_'
    ];

    function JoinRoomController($state, roomsService, _) {
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
                    vm.user.userId = response._id;

                    $state.go('room', {
                        roomId: response.roomId,
                        userName: vm.user.userName,
                        userId: response._id
                    });
                });
        }
    }
})();


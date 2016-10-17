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
        '$state',
        'roomsService',
        '_'
    ];

    function CreateRoomController($state, roomsService, _) {
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
                    const userData = {
                        _id: response._id,
                        roomId: response.roomId
                    };
                    _.assign(vm.user, userData);
                    $state.go('room', {
                        roomId: response.roomId,
                        userName: vm.user.userName,
                        userId: response._id
                    });
                });
        }
    }
})();

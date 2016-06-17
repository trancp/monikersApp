(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('room', room());

    function room() {
        var component = {
            templateUrl: '/features/room/room.component.html',
            controller: RoomController
        };

        return component;
    }

    RoomController.$inject = ['$stateParams', 'Rooms'];

    function RoomController($stateParams, Rooms) {
        var vm = this;

        vm.$onInit = $onInit;
        vm.isLoading = false;
        vm.room = {};

        function $onInit() {
            vm.isLoading = true;

            vm.room = Rooms.getRoom($stateParams.roomIndex);
            
            console.log(vm.room);
        }
    }
})();
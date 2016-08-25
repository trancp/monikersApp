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

CreateRoomController.$inject = ['$firebaseArray', '$state', 'Ref', 'Rooms', 'Users'];

function CreateRoomController($firebaseArray, $state, Ref, Rooms, Users) {
    var vm = this;
    var roomCodeLength = 6;

    vm.user = {};
    vm.room = {};
    vm.listOfRooms = [];
    vm.isLoading = false;

    vm.createGame = createGame;
    vm.roomCapacity = roomCapacity;
    vm.generateRoomCode = generateRoomCode;

    function createGame() {
        if (!vm.user.name) {
            return;
        }

        vm.isLoading = true;

        Rooms.all.$loaded().then(function (listOfRooms) {
            if (roomCapacity(listOfRooms.length, roomCodeLength)) {
                return;
            }
            vm.room.code = generateRoomCode(listOfRooms, roomCodeLength);
            Rooms
                .add(vm.room.code)
                .then(_addPlayerToRoom);
        });

    }

    function _addPlayerToRoom(roomKey) {
        Rooms
            .addPlayer(roomKey, vm.user.name)
            .then(function (userKey) {
                $state.go('room', {roomId: roomKey, user: vm.user.name, userId: userKey});
            });
    }

    function roomCapacity(listOfRooms, codeLength) {
        if (listOfRooms >= Math.pow(10, codeLength)) {
            console.log('No more rooms available');
            return true;
        }
    }

    function generateRoomCode(listOfRooms, codeLength) {
        var code = '';
        while ('' === code) {
            for (var i = 0; i < codeLength; i++) {
                code += Math.floor((Math.random() * 10)).toString();
            }
            for (var j = 0; j < listOfRooms.length; j++) {
                if (listOfRooms[j].code === code) {
                    code = '';
                    return;
                }
            }
        }
        return code;
    }
}



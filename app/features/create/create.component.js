
'use strict';

angular
  .module('monikersApp')
  .component('createRoom', createRoom());

function createRoom() {
  var component = {
    templateUrl: '/features/create/create.component.html',
    controller: CreateRoomController
  };

  return component;
}

CreateRoomController.$inject = ['$firebaseArray', '$state', 'Ref', 'Rooms', 'Users'];

function CreateRoomController($firebaseArray, $state, Ref, Rooms, Users) {
  var vm = this;

  vm.user = {};
  vm.room = {};
  vm.isLoading = false;

  vm.createGame = createGame;
  vm.roomCapacity = roomCapacity;

  function createGame() {
    if (!vm.user.name) {
      return;
    }

    vm.isLoading = true;

    Rooms
      .add()
      .then(_addPlayerToRoom);
  }

  function _addPlayerToRoom(roomIndex) {
    Rooms
      .addPlayer(roomIndex, vm.user.name)
      .then(function () {
        $state.go('room', { roomId: roomIndex, user: vm.user.name });
      });
  }

  function roomCapacity(listOfRooms, codeLength) {
    if (listOfRooms >= Math.pow(10, codeLength)) {
      console.log('No more rooms available');
      return true;
    }
  }
}



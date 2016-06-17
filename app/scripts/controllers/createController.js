
'use strict';

angular
  .module('monikersApp')
  .controller('CreateController', CreateController);

CreateController.$inject = ['$state', 'Ref', '$firebaseArray', 'Users', 'Rooms'];

function CreateController($state , Ref, $firebaseArray, Users, Rooms) {
  const vm = this;
  const roomCodeLength = 6;

  vm.user = {};
  vm.room = {};

  vm.createGame = createGame;
  vm.roomCapacity = roomCapacity;
  vm.generateRoom = generateRoomCode;
  vm.createRoom = createRoom;
  vm.createUser = createUser;
  vm.addPlayerToRoom = addPlayerToRoom;


  function createGame() {
    if (vm.user.name) {
      Rooms.all.$loaded().then(function (rooms) {

        if(roomCapacity(rooms, roomCodeLength)){
          return;
        }
        vm.room.roomId = generateRoomCode(rooms,roomCodeLength);
        vm.user.userId = createUser(vm.user.name, vm.room.roomId);
        addPlayerToRoom(vm.room.roomId, vm.user.userId);


      });
      $state.go('home');
    }
  }

  function roomCapacity (listOfRooms, codeLength) {
    if (listOfRooms >= Math.pow(10, codeLength)) {
      console.log('No more rooms available');
      return true;
    }
  }

  function generateRoomCode (listOfRooms, codeLength) {
    var code = '';
    while ('' === code) {
      for (var i = 0; i < codeLength; i++) {
        code += Math.floor((Math.random() * 10)).toString();
      }
      for (var j=0; j < listOfRooms.length; j++) {
        if(listOfRooms[j].code === code) {
          code = '';
          return;
        }
      }
    }
    return createRoom(code);
  }

  function createRoom(roomCode) {
    console.log('Room: ' + roomCode + ' was created');
    return Rooms.add(roomCode);
  }

  function createUser(username, roomId) {
    return Users.add(username, roomId);
  }

  function addPlayerToRoom(roomId, userId) {
    Rooms.addPlayer(roomId, userId);
  }


}



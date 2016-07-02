'use strict';

angular
  .module('monikersApp')
  .component('joinRoom', joinRoom());

function joinRoom() {
  var component = {
    templateUrl: '/features/join/join.component.html',
    controller: JoinRoomController
  };

  return component;
}

JoinRoomController.$inject = ['$state', 'Rooms'];

function JoinRoomController($state, Rooms) {
  var vm = this;

    vm.form = {roomCode: '', userName: ''};

    vm.joinRoom = joinRoom;

  function joinRoom() {

    if (!vm.form.userName || !vm.form.roomCode){
      return;
    }

        Rooms.exists(vm.form.roomCode).then(function (roomExists) {
            if (!roomExists) {
                console.log('Room does not exist');
                return;
            }
            _joinExistingRoom(vm.form.roomCode, vm.form.userName);
        });
    }

    function _joinExistingRoom(roomKey, username) {
        Rooms
            .joinExistingRoom(roomKey, username)
            .then(function (userKey) {
                $state.go('room', {roomId: roomKey, user: username, userId: userKey});
            });
    }
}

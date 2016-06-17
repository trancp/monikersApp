
'use strict';

angular
  .module('monikersApp')
  .factory('Rooms', Rooms);

function Rooms ($firebaseArray, $firebaseObject, FBURL) {

  const roomsRef = new Firebase(FBURL+'rooms');
  const rooms = $firebaseArray(roomsRef.limitToLast(10));

  const Rooms = {
    getRoom: getRoom,
    add: add,
    addPlayer: addPlayer,
    all: rooms

  };

  return Rooms;

  function getRoom(id) {
    return $firebaseObject(roomsRef.child(id).limitToLast(10)).$loaded();
  }

  function add(code) {
    return rooms.$add({ code: code}).then(function (data) {
      return data.path.o[1]
    });
  }

  function addPlayer (roomId, userId) {
    var obj = $firebaseObject(roomsRef.child("-KKNFqfuNZoUT9FyzTAA").limitToLast(10));
    obj.code = "Dfs";
  }

}

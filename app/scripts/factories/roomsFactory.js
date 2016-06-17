
'use strict';

angular
  .module('monikersApp')
  .factory('Rooms', Rooms);

Rooms.$inject = ['$firebaseArray', '$firebaseObject', '$q', 'FBURL'];

function Rooms($firebaseArray, $firebaseObject, $q, FBURL) {
  var roomsRef = new Firebase(FBURL + 'rooms');
  var rooms = $firebaseArray(roomsRef.limitToLast(5));
  var Rooms = {
    getRoom: getRoom,
    add: add,
    addPlayer: addPlayer,
    all: rooms
  };

  return Rooms;

  function getRoom(index) {
    return rooms[index];
  }

  function add(code) {
    var deferred = $q.defer();

    rooms
      .$add({ created_at: new Date().getTime() })
      .then(function (ref) {
        deferred.resolve(rooms.$indexFor(ref.key()));
      });

    return deferred.promise;
  }

  function addPlayer(roomIndex, username) {
    var deferred = $q.defer();
    var roomKey = rooms.$keyAt(roomIndex);

    $firebaseArray(new Firebase(FBURL + 'rooms/' + roomKey + '/players'))
      .$add({ username: username })
      .then(function () {
        deferred.resolve();
      });

    return deferred.promise;
  }
}

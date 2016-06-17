
'use strict';

angular
  .module('monikersApp')
.factory('Users', Users);

function Users ($firebaseArray, $firebaseObject, FBURL) {

  const usersRef = new Firebase(FBURL + 'users');

  const users = $firebaseArray(usersRef.limitToLast(10));

  const Users = {

    getUser: getUser,
    add: add,
    all: users

  };

  return Users;

  function getUser (uid) {
    return $firebaseObject(usersRef.child(uid).limitToLast(10));
  }

  function add (username, roomId) {
    return $firebaseArray(usersRef.limitToLast(10)).$add({userName: username, roomId: roomId}).then(function (data) {
      return data.path.o[1];
    });
  }

}

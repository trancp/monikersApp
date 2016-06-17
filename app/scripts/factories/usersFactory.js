
'use strict';

angular
  .module('monikersApp')
  .factory('Users', Users);

Users.$inject = ['$firebaseArray', '$firebaseObject', '$q', 'FBURL'];

function Users($firebaseArray, $firebaseObject, $q, FBURL) {
  const usersRef = new Firebase(FBURL + 'users');
  const users = $firebaseArray(usersRef.limitToLast(10));
  const Users = {
    getUser: getUser,
    createUser: createUser,
    all: users
  };

  return Users;

  function getUser(uid) {
    return $firebaseObject(usersRef.child(uid).limitToLast(10));
  }

  function createUser(username) {
    var deferred = $q.defer();

    $firebaseArray(usersRef)
      .$add({ username: username })
      .then(function (data) {
        return data.path.o[1];
      });

    return deferred.promise;
  }
}

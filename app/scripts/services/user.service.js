(function () {
    'use strict';

    angular
        .module('monikersApp')
        .service('userService', userService);

    userService.$inject = [
        '$firebaseArray',
        '$firebaseObject',
        '$q',
        'FBURL',
        '_'
    ];

    function userService($firebaseArray, $firebaseObject, $q, FBURL, _) {
        const USER_REF = new Firebase(FBURL + 'users');
        let userData;
        const userService = {
            createUser,
            get,
            getUserById,
            getUserData,
            removeUser,
            updateUserStatus
        };

        return userService;

        function createUser(userId, userName, roomId, roomMaster) {
            return _addNewUser(userId, userName, roomId, roomMaster);
        }

        function get() {
            return userData;
        }

        function getUserById(userId) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}/users`))
                .$loaded()
                .then(users => {
                    userData = users[userId];
                    deferred.resolve(userData);
                });
            return deferred.promise;
        }

        function getUserData(userId) {
            return $firebaseObject(new Firebase(`${FBURL}/users/${userId}`))
                .$loaded();
        }

        function removeUser(userId) {
            $firebaseObject(new Firebase(`${FBURL}users/${userId}`))
                .$loaded()
                .then(user => {
                    user.$remove();
                });
        }

        function updateUserStatus(userId, statusField, newStatus) {
            const deferred = $q.defer();
            $firebaseObject(new Firebase(`${FBURL}users/${userId}`))
                .$loaded()
                .then(user => {
                    _.set(user, `status.${statusField}`, newStatus);
                    user.$save();
                    deferred.resolve(user);
                });
            return deferred.promise;
        }

        function _addNewUser(userId, userName, roomId, roomMaster) {
            const deferred = $q.defer();
            const newUserObject = {};
            newUserObject[userId] = {
                created_at: new Date().getTime(),
                roomId,
                status: {
                    submitted: false,
                    teamOne: true,
                    isUserTurn: false,
                    roomMaster
                },
                userName
            };
            $firebaseObject(USER_REF)
                .$loaded()
                .then(users => {
                    _.assign(users, newUserObject);
                    users.$save();
                    deferred.resolve(users);
                });
            return deferred.promise
        }
    }
})();

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
            getUserById
        };

        return userService;

        function createUser(userId, userName, roomId, roomMaster) {
            _addNewUser(userId, userName, roomId, roomMaster);
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

        function _addNewUser(userId, userName, roomId, roomMaster) {
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
                });
        }
    }
})();

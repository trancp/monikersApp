(function () {
    'use strict';

    angular
        .module('firebase.ref', ['firebase', 'firebase.config'])
        .factory('Ref', ['$window', 'FBURL', function ($window, FBURL) {
            return new $window.Firebase(FBURL);
        }]);
})();

(function () {
    'use strict';

    angular.module('firebase.config', [])
        .constant('FBURL', 'https://monikers-app.firebaseio.com/')
        .constant('SIMPLE_LOGIN_PROVIDERS', ['anonymous'])
        .constant('loginRedirectPath', '/login');
    // .constant('_', _);
})();

(function () {
  'use strict';

  angular.module('firebase.config', [])
    .constant('FBURL', 'https://monikers-dev.firebaseio.com/')
    .constant('SIMPLE_LOGIN_PROVIDERS', ['anonymous'])
    .constant('loginRedirectPath', '/login');
    // .constant('_', _);
})();

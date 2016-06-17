'use strict';

angular
  .module('monikersApp', [
    'firebase',
    'firebase.ref',
    'firebase.auth',
    'ui.router',
    'ngMaterial'
  ])
  .config([
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '../views/home.html'
        })
        .state('create', {
          url: '/create',
          template: '<create-room></create-room>'
        })
        .state('join', {
          url: '/join',
          template: '<join-room></join-room>'
        })
        .state('room', {
          url: '/room/:roomId?user',
          template: '<room></room>'
        })
        .state('game', {
          url: '/game',
          templateUrl: '../views/game.html',
          controller: 'GameController',
          controllerAs: 'gameVm'
        });

      $urlRouterProvider.otherwise('/');
    }]);

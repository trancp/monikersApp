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
          templateUrl: '../views/create.html',
          controller: 'CreateController',
          controllerAs: 'createVm'
        })
        .state('join', {
          url: '/join',
          templateUrl: '../views/join.html',
          controller: 'JoinController',
          controllerAs: 'joinVm'
        })
        .state('room', {
          url: '/room',
          templateUrl: '../views/join.html',
          controller: 'RoomController',
          controllerAs: 'roomVm'
        })
        .state('game', {
          url: '/game',
          templateUrl: '../views/game.html',
          controller: 'GameController',
          controllerAs: 'gameVm'
        });

      $urlRouterProvider.otherwise('/');
    }]);

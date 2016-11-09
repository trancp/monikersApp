(function () {
    'use strict';

    angular
        .module('monikersApp', [
            'firebase',
            'firebase.ref',
            'firebase.auth',
            'ui.router',
            'ngMaterial',
            'templates-main',
            'timer',
            'ngStorage'
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
                        templateUrl: '../app/views/home.html'
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
                        url: '/room/:roomCode/:userName',
                        template: '<room></room>',
                        resolve: {
                            roomData: ['$stateParams','roomsService', function ($stateParams, roomsService) {
                                return roomsService.getRoomByCode($stateParams.roomCode);
                            }],
                            userDate: ['$localStorage','userService', function ($localStorage, userService) {
                                return userService.getUserById($localStorage._id);
                            }]
                        }
                    })
                    .state('game', {
                        url: '/game/:roomCode/:userName',
                        template: '<game></game>',
                        resolve: {
                            roomData: ['$stateParams','roomsService', function ($stateParams, roomsService) {
                                return roomsService.getRoomByCode($stateParams.roomCode);
                            }],
                            userDate: ['$localStorage','userService', function ($localStorage, userService) {
                                return userService.getUserById($localStorage._id);
                            }]
                        }
                    });

                $urlRouterProvider.otherwise('/');
            }])
        .config(['$mdIconProvider', function ($mdIconProvider) {
            $mdIconProvider
                .icon('key', 'icons/key.svg')
                .icon('remove', 'icons/remove.svg')
                .icon('checkmark', 'icons/checkmark.svg');
        }]);
})();

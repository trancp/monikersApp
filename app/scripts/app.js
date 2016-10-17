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
            'timer'
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
                        url: '/room/:roomId?userName?userId',
                        template: '<room></room>'
                    })
                    .state('game', {
                        url: '/game/:roomId?userName?userId',
                        template: '<game></game>'
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

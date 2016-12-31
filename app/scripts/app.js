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
                        template: '<room room-information="$resolve.roomData"></room>',
                        resolve: {
                            roomData: ['$stateParams', 'roomsService', function ($stateParams, roomsService) {
                                return roomsService.getRoomByCode($stateParams.roomCode).then(roomData => {
                                    const players = _.get(roomData, 'data.players');
                                    const userId = _.findKey(players, player => _.isEqual(player.userName, $stateParams.userName));
                                    return { roomId: roomData.roomId, roomData: roomData.data, userId };
                                });
                            }]
                        }
                    })
                    .state('game', {
                        url: '/game/:roomCode/:userName',
                        template: '<game room-information="$resolve.roomData"></game>',
                        resolve: {
                            roomData: ['$stateParams', 'roomsService', function ($stateParams, roomsService) {
                                return roomsService.getRoomByCode($stateParams.roomCode).then(roomData => {
                                    const players = _.get(roomData, 'data.players');
                                    const userId = _.findKey(players, player => _.isEqual(player.userName, $stateParams.userName));
                                    return { roomId: roomData.roomId, roomData: roomData.data, userId };
                                });
                            }]
                        }
                    });

                $urlRouterProvider.otherwise('/');
            }])
        .config(['$mdIconProvider', function ($mdIconProvider) {
            $mdIconProvider
                .icon('key', 'icons/key.svg')
                .icon('remove', 'icons/remove.svg')
                .icon('checkmark', 'icons/checkmark.svg')
                .icon('arrow', 'icons/arrow.svg')
                .icon('arrowGrey', 'icons/arrowGrey.svg')
                .icon('doubleArrowLeft', 'icons/doubleArrowLeft.svg')
                .icon('doubleArrowRight', 'icons/doubleArrowRight.svg')
                .icon('gotIt', 'icons/gotIt.svg')
                .icon('pass', 'icons/pass.svg')
                .icon('gotItGrey', 'icons/gotItGrey.svg')
                .icon('passGrey', 'icons/passGrey.svg');
        }]);
})();

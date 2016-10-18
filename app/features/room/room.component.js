(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('room', roomComponent());

    function roomComponent() {
        const component = {
            templateUrl: '../app/features/room/room.component.html',
            controller: RoomComponentController
        };

        return component;
    }

    RoomComponentController.$inject = [
        '$localStorage',
        '$q',
        '$sessionStorage',
        '$state',
        '$stateParams',
        'Rooms',
        'roomsService',
        'userService',
        '_'
    ];

    function RoomComponentController($localStorage, $q, $sessionStorage, $state, $stateParams, Rooms, roomsService, userService, _) {
        const vm = this;
        const USER_ID = $localStorage._id;

        vm.isLoading = false;
        vm.room = {};
        vm.form = {};
        vm.submitted = false;
        vm.wordArray = [];
        vm.playerArray = [];
        vm.wordsToSubmit = [];
        vm.user = {};

        _.assign(vm, {
            $onInit
            // submitWords,
            // startGame,
            // readyToStart,
            // team,
            // switchTeams,
            // isUser,
            // isSubmitted,
            // participantIsMaster,
            // deleteSubmitWords,
            // removeUser
        });

        function $onInit() {
            vm.isLoading = true;

            const roomData = roomsService.get();
            const roomPlayers = _.get(roomData, 'players');
            vm.isUser = _.has(roomPlayers, USER_ID);
            if(!vm.isUser) {
                return;
            }
            vm.user = userService.get();

            // Rooms.getRoom($stateParams.roomId).then(function (obj) {
            //     vm.room = obj;
            //     vm.user = vm.room.players[$stateParams.userId];
            //     vm.submitted = _.get(vm.user, 'submittedWords');
            // });
        }

        //     function submitWords() {
        //         if (!vm.form.wordOne
        //             || !vm.form.wordTwo
        //             || !vm.form.wordThree
        //             || !vm.form.wordFour
        //             || !vm.form.wordFive) {
        //             return;
        //         }
        //
        //         vm.wordsToSubmit.push(vm.form.wordOne);
        //         vm.wordsToSubmit.push(vm.form.wordTwo);
        //         vm.wordsToSubmit.push(vm.form.wordThree);
        //         vm.wordsToSubmit.push(vm.form.wordFour);
        //         vm.wordsToSubmit.push(vm.form.wordFive);
        //
        //         _.forEach(vm.wordsToSubmit, function (word) {
        //             Rooms
        //                 .addWord($stateParams.roomId, word, $stateParams.userId);
        //         });
        //
        //         Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'submittedWords', true).then(function () {
        //             vm.submitted = true;
        //             vm.wordsToSubmit = [];
        //
        //         });
        //     }
        //
        //     function startGame() {
        //         Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'inGame', true);
        //         Rooms.checkIfEveryoneIsInGame($stateParams.roomId);
        //         $state.go('game', {roomId: $stateParams.roomId, user: $stateParams.user, userId: $stateParams.userId});
        //     }
        //
        //     function readyToStart() {
        //
        //         try {
        //             var equalTeams = _.values(vm.room.teams.teamOne).length === _.values(vm.room.teams.teamTwo).length;
        //             var enoughWords = _.values(vm.room.players).length * 5 === _.values(vm.room.words).length;
        //             return equalTeams && enoughWords;
        //         }
        //         catch (error) {
        //
        //         }
        //     }
        //
        //     function team(playerIndex) {
        //         return _.values(vm.room.players)[playerIndex].team;
        //     }
        //
        //     function switchTeams() {
        //         Rooms.switchTeams($stateParams.roomId, $stateParams.userId, vm.user.team);
        //         vm.user.team = vm.user.team == 'Team One' ? 'Team Two' : 'Team One';
        //     }
        //
        //     function isUser(playerIndex) {
        //         return _.keys(vm.room.players)[playerIndex] === $stateParams.userId;
        //     }
        //
        //     function isSubmitted() {
        //         return _.get(vm.room, 'players.' + $stateParams.userId + '.submittedWords');
        //     }
        //
        //     function participantIsMaster() {
        //         return vm.room.gameStatus.roomMaster === $stateParams.userId;
        //     }
        //
        //     function deleteSubmitWords() {
        //         vm.submitted = false;
        //         Rooms.getWordsSubmittedByUserAndRemove($stateParams.roomId, $stateParams.userId, 'staying');
        //     }
        //
        //     function removeUser(playerIndex) {
        //         var userIdToRemove = playerIndex ? _.keys(vm.room.players)[playerIndex] : $stateParams.userId;
        //         Rooms.getWordsSubmittedByUserAndRemove($stateParams.roomId, userIdToRemove, 'leaving');
        //         var userTeamToRemove = vm.room.players[userIdToRemove].team;
        //         Rooms.removeUserFromTeam($stateParams.roomId, userTeamToRemove, userIdToRemove);
        //         Rooms.removeUser($stateParams.roomId, '/players/', userIdToRemove);
        //
        //     }
        // }
        }
})();

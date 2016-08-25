(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('room', room());

    function room() {
        var component = {
            templateUrl: '../app/features/room/room.component.html',
            controller: RoomController
        };

        return component;
    }

    RoomController.$inject = ['$stateParams', 'Rooms', '$state', '$q'];

    function RoomController($stateParams, Rooms, $state, $q) {
        var vm = this;


        vm.isLoading = false;
        vm.room = {};
        vm.form = {};
        vm.submitted = false;
        vm.wordArray = [];
        vm.playerArray = [];
        vm.wordsToSubmit = [];
        vm.user = {};

        vm.$onInit = $onInit;
        vm.submitWords = submitWords;
        vm.startGame = startGame;
        vm.readyToStart = readyToStart;
        vm.team = team;
        vm.switchTeams = switchTeams;
        vm.isUser = isUser;
        vm.isSubmitted = isSubmitted;

        function $onInit() {
            vm.isLoading = true;

           Rooms.getRoom($stateParams.roomId).then(function(obj){
              vm.room = obj;
              vm.user = vm.room.players[$stateParams.userId];
            });
        }

        function submitWords() {
            if (!vm.form.wordOne
                || !vm.form.wordTwo
                || !vm.form.wordThree
                || !vm.form.wordFour
                || !vm.form.wordFive) {
                return;
            }

            vm.wordsToSubmit.push(vm.form.wordOne);
            vm.wordsToSubmit.push(vm.form.wordTwo);
            vm.wordsToSubmit.push(vm.form.wordThree);
            vm.wordsToSubmit.push(vm.form.wordFour);
            vm.wordsToSubmit.push(vm.form.wordFive);

            _.forEach(vm.wordsToSubmit, function (word) {
                Rooms
                    .addWord($stateParams.roomId, word);
            });

            Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'submittedWords', true);
            vm.submitted = true;
        }

        function startGame() {
            Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'inGame', true);
            Rooms.checkIfEveryoneIsInGame($stateParams.roomId);
            $state.go('game', { roomId: $stateParams.roomId, user: $stateParams.user, userId: $stateParams.userId });
        }

        function readyToStart() {

            try {
              var equalTeams = _.values(vm.room.teams.teamOne).length === _.values(vm.room.teams.teamTwo).length;
              var enoughWords = _.values(vm.room.players).length*5 === _.values(vm.room.words).length;
                return equalTeams && enoughWords;
            }
            catch (error) {

            }
        }

        function team(playerIndex) {
            return _.values(vm.room.players)[playerIndex].team;
        }

        function switchTeams () {
            Rooms.switchTeams($stateParams.roomId, $stateParams.userId, vm.user.team);
            vm.user.team = vm.user.team == 'Team One' ? 'Team Two' : 'Team One';
        }

        function isUser (playerIndex) {
          return _.keys(vm.room.players)[playerIndex] === $stateParams.userId;
        }

        function isSubmitted () {
          return vm.user.submittedWords;
        }
    }
})();

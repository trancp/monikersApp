(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('room', room());

    function room() {
        var component = {
            templateUrl: '/features/room/room.component.html',
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

            vm.submitted = true;
        }

        function startGame() {
            $state.go('game', { roomId: $stateParams.roomId, user: $stateParams.user, userId: $stateParams.userId });
        }

        function readyToStart() {

            try {
                console.log(_.values(vm.room.teams.teamOne).length);
                console.log(_.values(vm.room.teams.teamTwo).length);
                return _.values(vm.room.players).length*5 === _.values(vm.room.submittedWords).length
                    && _.values(vm.room.teams.teamOne).length === _.values(vm.room.teams.teamTwo).length;
            }
            catch (error) {

            }
        }

        function team(playerIndex) {
            console.log(playerIndex);
            return _.values(vm.room.players)[playerIndex].team;
        }

        function switchTeams () {
            Rooms.switchTeams($stateParams.roomId, $stateParams.userId, $stateParams.user, vm.user.team);
            vm.user.team = vm.user.team == 'Team One' ? 'Team Two' : 'Team One';
        }

        function isUser (playerIndex) {
            // var playersId = Rooms.getIndexId($stateParams.roomId, playerIndex);
            var playerUsername = _.values(vm.room.players)[playerIndex].username;
            // console.log(playerUsername);
            return playerUsername == $stateParams.user;
        }
    }
})();
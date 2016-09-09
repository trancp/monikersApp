(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('game', game());

    function game () {
        var component = {
            templateUrl : '../app/features/game/game.component.html',
            controller : GameController
        };
        return component;
    }

    GameController.$inject = ['$stateParams', 'Rooms', '$scope','$state'];

    function GameController($stateParams, Rooms, $scope, $state) {
      var vm = this;

      vm.isLoading = false;
      vm.room = {};
      vm.wordKey = '';
      vm.numPlayerStarted = 0;
      vm.isPlaying = false;
      vm.getWordIndex = false;
      vm.user = {};

      vm.$onInit = $onInit;
      vm.getWord = getWord;
      vm.nextWord = nextWord;
      vm.gotIt = gotIt;
      vm.nextRound = nextRound;
      vm.noWordsLeft = noWordsLeft;
      vm.everyoneInGame = everyoneInGame;
      vm.getUserName = getUserName;
      vm.isPlayersTurn = isPlayersTurn;
      vm.nextPlayersTurn = nextPlayersTurn;
      vm.isLastPlayer = isLastPlayer;
      vm.goBackToRoom = goBackToRoom;
      vm.getScore = getScore;
      vm.startTimer = startTimer;

      function $onInit() {
          vm.isLoading = true;

          Rooms.getRoom($stateParams.roomId).then(function(obj){
              vm.room = obj;
              _.set(vm.user, 'team',vm.room.players[$stateParams.userId].team);
          });
      }

      function getWord () {
        try {
          if(vm.room.tempWords){
            vm.wordKey = _.keys(vm.room.tempWords)[vm.index];
            return vm.room.tempWords[vm.wordKey].word;
          }
        } catch (error) {

        }

      }

      function nextWord () {
        if (vm.index == _.values(vm.room.tempWords).length-1) {
          vm.index = 0;
          return;
        }
          vm.index++;
      }

      function gotIt () {
        if (!vm.room.tempWords) {
          return;
        }
        Rooms.removeWordFromTempWords($stateParams.roomId, vm.wordKey).then(function () {
          if (vm.index == _.values(vm.room.tempWords).length-1) {
            vm.index = 0;
          }
          Rooms.updateScore($stateParams.roomId, vm.room.tempWords[vm.wordKey].word,vm.user.team)
        });

      }

      function nextRound () {
        if(parseInt(vm.room.gameStatus.round) >= 3 ){
          // Rooms.updateGameStatus($stateParams.roomId, 'wordIndex', 0);
          // Rooms.nextRound($stateParams.roomId, 'round', 1);
          // Rooms.updateGameStatus($stateParams.roomId, 'playerTurn', 0);
          // Rooms.updateGameStatus($stateParams.roomId, 'teamTurn', nextTeam());
          Rooms.newGame($stateParams.roomId);
          Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'inGame', false);
          Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'submittedWords', false);
          $state.go('room', { roomId: $stateParams.roomId, user: $stateParams.user, userId: $stateParams.userId });

          return;
        }
        Rooms.updateGameStatus($stateParams.roomId, 'endTurn', false);
        Rooms.updateGameStatus($stateParams.roomId, 'wordIndex', 0);
        var nextRound = parseInt(vm.room.gameStatus.round) + 1;
        Rooms.nextRound($stateParams.roomId, 'round', nextRound);
        Rooms.updateGameStatus($stateParams.roomId, 'playerTurn', 0);
        Rooms.updateGameStatus($stateParams.roomId, 'teamTurn', nextTeam());

      }

      function noWordsLeft () {
        return _.values(vm.room.tempWords).length === 0;
      }

      function everyoneInGame () {
        try {
          return vm.room.gameStatus.gameStarted
        } catch (error) {

        }

      }

      function getUserName (userId) {
        return vm.room.players[userId].username;
      }

      function isPlayersTurn () {
        try {
          if ((vm.room.gameStatus.turnOrder[vm.room.gameStatus.playerTurn].userId === $stateParams.userId) && !vm.isPlaying) {
            vm.index = 0;
            vm.isPlaying = true;
          }
          return vm.room.gameStatus.turnOrder[vm.room.gameStatus.playerTurn].userId === $stateParams.userId;

        } catch (error) {

        }
      }

      function nextPlayersTurn () {
        Rooms.updateGameStatus($stateParams.roomId, 'endTurn', false);
        Rooms.updateGameStatus($stateParams.roomId, 'wordIndex', 0);
        vm.isPlaying = false;
        Rooms.shuffleTempWords($stateParams.roomId);
        Rooms.updateGameStatus($stateParams.roomId, 'playerTurn', (vm.room.gameStatus.playerTurn + 1));
        Rooms.updateGameStatus($stateParams.roomId, 'teamTurn', nextTeam());
      }

      function isLastPlayer () {
        return vm.room.gameStatus.playerTurn === _.values(vm.room.players).length-1;
      }

      function nextTeam () {
        return vm.room.gameStatus.teamTurn === 'TeamOne' ? 'TeamTwo' : 'TeamOne';
      }

      function goBackToRoom() {
        Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'inGame', false).then(function () {
          Rooms.updatePlayersStatus($stateParams.roomId, $stateParams.userId, 'submittedWords', false);
          Rooms.changeNewGameStatus($stateParams.roomId);
          Rooms.updateGameStatus($stateParams.roomId, 'scores', '');
          Rooms.updateGameStatus($stateParams.roomId, 'endTurn', false);
          Rooms.updateGameStatus($stateParams.roomId, 'turnOrder', '');
          $state.go('room', { roomId: $stateParams.roomId, user: $stateParams.user, userId: $stateParams.userId });
        });

      }

      function getScore() {
        return [_.values(_.get(vm.room, 'gameStatus.scores.teamOne.words')).length, _.values(_.get(vm.room, 'gameStatus.scores.teamTwo.words')).length];
      }

      function startTimer() {
        Rooms.updateGameStatus($stateParams.roomId, 'timer', true);
      }

      $scope.$on('timer-stopped', function (){
        Rooms.updateGameStatus($stateParams.roomId, 'timer', false);
        Rooms.updateGameStatus($stateParams.roomId, 'endTurn', true);
      });

    }

})();

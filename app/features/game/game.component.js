(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('game', game());

    function game () {
        var component = {
            templateUrl : '/features/game/game.component.html',
            controller : GameController
        };
        return component;
    }

    GameController.$inject = ['$stateParams', 'Rooms'];

    function GameController($stateParams, Rooms) {
      var vm = this;

      vm.isLoading = false;
      vm.room = {};
      vm.index = 0;

      vm.$onInit = $onInit;
      vm.getWord = getWord;
      vm.nextWord = nextWord;
      vm.gotIt = gotIt;
      vm.nextRound = nextRound;

      function $onInit() {
          vm.isLoading = true;

          Rooms.getRoom($stateParams.roomId).then(function(obj){
              vm.room = obj;
          });
      }

      function getWord () {
          if(vm.room.tempWords){
              return _.values(vm.room.tempWords)[vm.index].word;
          }
      }

      function nextWord () {
        console.log(vm.index);
        if (vm.index === _.values(vm.room.tempWords).length-1) {
          vm.index = 0;
          return;
        }
          vm.index++;
      }

      function gotIt () {

      }


      function nextRound () {
        if(parseInt(vm.room.gameStatus.round) >= 3 ){
          Rooms.nextRound($stateParams.roomId, 'round', 1);
          return;
        }
        var nextRound = parseInt(vm.room.gameStatus.round) + 1;
        Rooms.nextRound($stateParams.roomId, 'round', nextRound);

      }

    }

})();

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

        function $onInit() {
            vm.isLoading = true;

            Rooms.getRoom($stateParams.roomId).then(function(obj){
                vm.room = obj;
            });
        }
        
        function getWord () {
            if(vm.room.words){
                return _.values(vm.room.words)[vm.index].word;
            }
        }
        
        function nextWord () {
            vm.index++;
        }
        
    }

})();

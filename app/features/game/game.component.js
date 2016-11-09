(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('game', game());

    function game() {
        var component = {
            templateUrl: '../app/features/game/game.component.html',
            controller: GameController
        };
        return component;
    }

    GameController.$inject = ['$localStorage', '$stateParams', 'roomsService', 'Rooms', 'userService', '$scope', '$state'];

    function GameController($localStorage, $stateParams, roomsService, Rooms, userService, $scope, $state) {
        const vm = this;
        const USER_ID = $localStorage._id;

        vm.isLoading = false;

        _.assign(vm, {
            $onInit,
            currentTeamsTurn,
            isEveryoneStarted,
            isLastPlayer,
            isLastPlayerAndLastTurn,
            isPlayersTurn,
            getActiveIndices,
            getWord,
            getWordBank,
            gotIt,
            newGame,
            nextPlayersTurn,
            passWord,
            startNewGame,
            startTimer
        });

        function $onInit() {
            vm.isLoading = true;

            vm.roomData = roomsService.getRoom();
            vm.roomPlayerIds = _.get(vm, 'roomData.players');
            vm.isUser = _.has(vm.roomPlayerIds, USER_ID);
            if (!vm.isUser) {
                return;
            }
            vm.user = userService.getUser();
            roomsService.getRoomData(vm.user.roomId).then(room => {
                _.set(vm, 'roomData', room);
                _.set(vm, 'isLoading', false);
            });
            userService.getUserData(USER_ID).then(user => _.set(vm, 'user', user));
            vm.index = 0;
            vm.indexArray = getActiveIndices(vm.roomData.wordBank);
        }

        function currentTeamsTurn() {
            const playersTurn = _.find(_.get(vm, 'roomData.status.turnOrder'), { turn: true });
            const teamsTurn = playersTurn.teamOne;
            return teamsTurn;
        }

        function isEveryoneStarted() {
            return vm.roomData.status.started;
        }

        function isLastPlayer() {
            return _.get(vm, 'roomData.status.turnOrder').length - 1 === _.findIndex(_.get(vm, 'roomData.status.turnOrder'), { turn: true });
        }

        function isLastPlayerAndLastTurn() {
            return isLastPlayer()
                && (3 === _.get(vm, 'roomData.status.round'));
        }

        function isPlayersTurn() {
            return USER_ID === _.find(_.get(vm, 'roomData.status.turnOrder'), { turn: true })._id;
        }

        function getWordBank(roomData) {
            return _.get(roomData, 'wordBank');
        }

        function getActiveIndices() {
            vm.indexArray = _.filter(_.mapValues(_.get(vm, 'roomData.wordBank'), (word, index) => {
                return { word, originalIndex: index };
            }), wordObj => wordObj.word.active);
            if (!_.get(vm, `indexArray[${vm.index}]`)) {
                vm.index = _.random(0, vm.indexArray.length - 1);
            }
            return vm.indexArray;
        }

        function getWord() {
            const originalIndex = _.get(vm, `indexArray[${vm.index}].originalIndex`);
            if (!originalIndex) {
                return;
            }
            return _.get(vm, `roomData.wordBank[${originalIndex}.word`);
        }

        function passWord() {
            vm.index = vm.index < vm.indexArray.length - 1
                ? vm.index + 1
                : 0;
        }

        function gotIt() {
            const originalIndex = _.get(vm, `indexArray[${vm.index}].originalIndex`);
            if (!originalIndex) {
                return;
            }
            _.set(_.get(vm, `roomData.wordBank[${originalIndex}]`), 'active', false);
            _updateScoreAndWords(vm.user.roomId, vm.roomData.wordBank, currentTeamsTurn()).then(room => {
                vm.indexArray = getActiveIndices(room.wordBank);
                if (!_.get(vm, `indexArray[${vm.index}]`)) {
                    vm.index = _.random(0, vm.indexArray.length - 1);
                }
            });
        }

        function _updateScoreAndWords(roomId, field, newStatus) {
            return roomsService.updateScoreAndWords(roomId, field, newStatus);
        }

        function _updateGameStatus(roomId, statusField, newStatus) {
            roomsService.updateGameStatus(roomId, statusField, newStatus);
        }

        function nextPlayersTurn() {
            roomsService.nextPlayerturn(vm.user.roomId);
        }

        function startNewGame() {
            roomsService.startNewGame(vm.user.roomId).then(() => {
                $state.go('room', {
                    roomCode: $stateParams.roomCode,
                    userName: vm.user.userName
                });
            });
        }

        function newGame() {
            $state.go('room', {
                roomCode: $stateParams.roomCode,
                userName: vm.user.userName
            });
        }

        function startTimer() {
            _updateGameStatus(vm.user.roomId, 'timer', true);
        }

        $scope.$on('timer-stopped', function () {
            _updateGameStatus(vm.user.roomId, 'timer', false);
            if (isLastPlayerAndLastTurn()) {
                _updateGameStatus(vm.user.roomId, 'ended', true);
            }
        });
    }

})();

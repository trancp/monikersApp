(function () {
    'use strict';

    function GameController($mdDialog, $stateParams, roomsService, userService, $scope, $state, _) {
        const vm = this;
        const USER_ID = vm.roomInformation.userId;

        vm.isLoading = false;
        vm.isLoadingPass = false;
        vm.isLoadingNextPlayer = false;

        _.assign(vm, {
            $onInit,
            currentTeamsTurn,
            isEveryoneStarted,
            isLastPlayer,
            isLastPlayerAndLastTurn,
            isLastRoundAndNoMoreWords,
            isPlayersTurn,
            getActiveIndices,
            getWord,
            getWordBank,
            gotIt,
            newGame,
            nextPlayersTurn,
            nextRound,
            passWord,
            startNewGame,
            startTimer
        });

        function $onInit() {
            vm.isLoading = true;
            vm.isLoadingPass = true;

            vm.roomData = _.get(vm, 'roomInformation.roomData');
            vm.roomPlayerIds = _.get(vm, 'roomData.players');
            vm.isUser = _.has(vm.roomPlayerIds, USER_ID);
            if (!vm.isUser) {
                return;
            }
            vm.user = _.get(vm, `roomData.players.${USER_ID}`);
            roomsService.getRoomData(_.get(vm, 'roomInformation.roomId')).then(room => {
                _.set(vm, 'roomData', room);
                _.set(vm, 'isLoading', false);
                _.set(vm, 'isLoadingPass', false);
            });
            userService.getUserData(USER_ID).then(user => _.set(vm, 'user', user));
            vm.index = 0;
            vm.indexArray = getActiveIndices(vm.roomData.wordBank);
        }

        function currentTeamsTurn() {
            const playersTurn = _.find(_.get(vm, 'roomData.status.turnOrder'), { turn: true });
            return playersTurn.teamOne;
        }

        function isEveryoneStarted() {
            const roomPlayers = _.map(_.get(vm, 'roomData.players'));
            const playersReady = _.filter(roomPlayers, player => player.started);
            return playersReady.length === roomPlayers.length;
        }

        function isLastPlayer() {
            return _.get(vm, 'roomData.status.turnOrder').length - 1
                === _.findIndex(_.get(vm, 'roomData.status.turnOrder'), { turn: true });
        }

        function isLastPlayerAndLastTurn() {
            return isLastPlayer()
                && (3
                === _.get(vm, 'roomData.status.round'));
        }

        function isPlayersTurn() {
            return USER_ID
                === _.find(_.get(vm, 'roomData.status.turnOrder'), { turn: true })._id;
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
            vm.isLoadingPass = true;
            vm.index = vm.index < vm.indexArray.length - 1
                ? vm.index + 1
                : 0;
            vm.isLoadingPass = false;
        }

        function gotIt() {
            const originalIndex = _.get(vm, `indexArray[${vm.index}].originalIndex`);
            if (!originalIndex) {
                return;
            }
            vm.isLoading = true;
            _.set(_.get(vm, `roomData.wordBank[${originalIndex}]`), 'active', false);
            _updateScoreAndWords(vm.user.roomId, vm.roomData.wordBank, currentTeamsTurn())
                .then(room => gotItSuccess(room));
        }

        function gotItSuccess(room) {
            vm.indexArray = getActiveIndices(room.wordBank);
            if (!_.get(vm, `indexArray[${vm.index}]`)) {
                vm.index = _.random(0, vm.indexArray.length - 1);
            }
            vm.isLoading = false;
        }

        function _updateScoreAndWords(roomId, field, newStatus) {
            return roomsService.updateScoreAndWords(roomId, field, newStatus);
        }

        function _updateGameStatus(roomId, statusField, newStatus) {
            return roomsService.updateGameStatus(roomId, statusField, newStatus);
        }

        function nextPlayersTurn() {
            if (vm.isLoading) {
                return;
            }
            vm.isLoadingNextPlayer = true;
            return roomsService.nextPlayerturn(vm.user.roomId)
                .then(() => _.set(vm, 'isLoadingNextPlayer', false));
        }

        function startNewGame(event) {
            if (vm.isLoading) {
                return;
            }
            _showConfirmDialog(event)
                .then(() => dialogSuccess());
        }

        function dialogSuccess() {
            vm.isLoadingNextPlayer = true;
            return roomsService.startNewGame(vm.user.roomId)
                .then(() => _goToRoom());
        }

        function _goToRoom() {
            return $state.go('room', {
                roomCode: $stateParams.roomCode,
                userName: vm.user.userName
            });
        }

        function newGame() {
            $state.go('room', {
                roomCode: $stateParams.roomCode,
                userName: vm.user.userName
            });
        }

        function nextRound() {
            if (vm.isLoading) {
                return;
            }
            vm.isLoadingNextPlayer = true;
            return roomsService.nextRound(vm.user.roomId)
                .then(() => _.set(vm, 'isLoadingNextPlayer', false));
        }

        function startTimer() {
            vm.isLoading = true;
            _updateGameStatus(vm.user.roomId, 'timer', true)
                .then(() => _.set(vm, 'isLoading', false));
        }

        function isLastRoundAndNoMoreWords() {
            return 3
                === _.get(vm, 'roomData.status.round')
                && !getActiveIndices().length;
        }

        function _showConfirmDialog(event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .ariaLabel('New Game')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');

            return $mdDialog.show(confirm);
        }

        $scope.$on('timer-stopped', () => {
            _updateGameStatus(vm.user.roomId, 'timer', false);
            if (isLastPlayerAndLastTurn()) {
                _updateGameStatus(vm.user.roomId, 'ended', true);
            }
        });
    }

    GameController.$inject = [
        '$mdDialog',
        '$stateParams',
        'roomsService',
        'userService',
        '$scope',
        '$state',
        '_'
    ];

    const game = {
        templateUrl: '../app/features/game/game.component.html',
        controller: GameController,
        bindings: {
            roomInformation: '<'
        }
    };

    angular
        .module('monikersApp')
        .component('game', game);
})();

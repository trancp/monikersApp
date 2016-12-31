(function () {
    'use strict';

    function RoomComponentController($mdDialog, $state, roomsService, userService, _) {
        const vm = this;
        const USER_ID = vm.roomInformation.userId;
        const NUM_OF_WORDS = 5;

        vm.isLoading = false;
        vm.room = {};
        vm.form = {};
        vm.submitted = false;
        vm.wordArray = [];
        vm.wordsToSubmit = [];
        vm.user = {};
        vm.teamsLabels = { 'Team One': true, 'Team Two': false };
        vm.players = [];
        vm.userId = USER_ID;

        _.assign(vm, {
            $onInit,
            editSubmittedWords,
            getPlayers,
            isEvenTeams,
            isGameReadyToStart,
            isGameStarted,
            hasSubmitted,
            submitWords,
            participantIsMaster,
            removeUser,
            startGame,
            switchTeams,
            showForm
        });

        function $onInit() {
            vm.isLoading = true;

            vm.roomData = _.get(vm, 'roomInformation.roomData');
            vm.roomPlayerIds = _.get(vm, 'roomData.players');
            vm.isUser = _.has(vm.roomPlayerIds, USER_ID);
            if (!vm.isUser) {
                return;
            }
            vm.user = _.get(vm, `roomData.players.${USER_ID}`);
            vm.form = _generateEmptyForm(NUM_OF_WORDS);
            // _updateGameStatus(_.get(vm, 'user.roomId'), 'numOfWords', NUM_OF_WORDS);
            roomsService.getRoomData(_.get(vm, 'roomInformation.roomId')).then(room => _.set(vm, 'roomData', room));
            userService.getUserData(USER_ID).then(user => _.set(vm, 'user', user));
            vm.isLoading = false;
        }

        function editSubmittedWords(event) {
            vm.isLoading = true;
            roomsService.removeWords(vm.user.roomId, USER_ID);
            _updatePlayerStatus(vm.user.roomId, USER_ID, 'submitted', false).then(() => {
                vm.isLoading = false;
            });
            showForm(event);
        }

        function getPlayers() {
            return _.get(vm, 'roomData.players');
        }

        function isEvenTeams() {
            const roomPlayers = _.map(_.get(vm, 'roomData.players'));
            const numPlayersOnTeamOne = _.filter(roomPlayers, players => players.teamOne).length;
            const numPlayersOnTeamTwo = _.filter(roomPlayers, players => !players.teamOne).length;
            return numPlayersOnTeamOne === numPlayersOnTeamTwo;
        }

        function isGameReadyToStart() {
            return _isEveryoneReady();
        }

        function _isEveryoneReady() {
            const roomPlayers = _.map(_.get(vm, 'roomData.players'));
            const playersReady = _.filter(roomPlayers, player => player.submitted);
            return playersReady.length === roomPlayers.length;
        }

        function isGameStarted() {
            return _.get(vm, 'roomData.status.started', false);
        }

        function hasSubmitted() {
            return vm.submitted || _.get(vm, 'user.status.submitted') || _.get(vm, `roomData.players[${USER_ID}].submitted`);
        }

        function participantIsMaster() {
            return _.get(vm, 'roomData.status.roomMaster') === USER_ID;
        }

        function removeUser(playerId) {
            roomsService.removePlayer(vm.user.roomId, playerId);
            userService.removeUser(playerId);
        }

        function startGame() {
            roomsService.startGame(vm.user.roomId, USER_ID).then(() => $state.go('game', { roomCode: vm.roomData.roomCode, userName: vm.user.userName }));
        }

        function submitWords() {
            const hasEmptyFormField = _hasEmptyFormFields(vm.form);
            if (hasEmptyFormField) {
                return;
            }
            vm.isLoading = true;
            roomsService.submitWords(vm.user.roomId, USER_ID, vm.form);
            _updatePlayerStatus(vm.user.roomId, USER_ID, 'submitted', true).then(() => {
                vm.isLoading = false;
            });
        }

        function switchTeams() {
            _updatePlayerStatus(vm.user.roomId, USER_ID, 'teamOne', !vm.user.status.teamOne);
            _updateUserStatus(USER_ID, 'teamOne', !_.get(vm, 'user.status.teamOne'));
        }

        function showForm(event) {
            return $mdDialog.show({
                clickOutsideToClose: true,
                controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => DialogController($scope, $mdDialog, vm.form)],
                templateUrl: '../app/features/room/words-form.html',
                targetEvent: event,
                locals: {
                    form: vm.form
                }
            }).then(form => {
                if (!form) {
                    return;
                }
                vm.form = form;
                submitWords();
            });

            function DialogController($scope, $mdDialog, form) {
                $scope.form = form;
                $scope.submitWords = () => {
                    const hasEmptyFormField = _hasEmptyFormFields(vm.form);
                    if (hasEmptyFormField) {
                        return;
                    }
                    $mdDialog.hide($scope.form);
                };
                $scope.exitModal = () => $mdDialog.hide();
            }
        }

        function _generateEmptyForm(numOfWords) {
            const form = {};
            for (let i = 0; i < numOfWords; i++) {
                form[`${i}`] = '';
            }
            return form;
        }

        function _hasEmptyFormFields(form) {
            return NUM_OF_WORDS !== _.compact(_.values(form)).length;
        }

        function _updateGameStatus(roomId, statusField, newStatus) {
            return roomsService.updateGameStatus(roomId, statusField, newStatus);
        }

        function _updatePlayerStatus(roomId, userId, statusField, newStatus) {
            return roomsService.updatePlayerStatus(roomId, userId, statusField, newStatus);
        }

        function _updateUserStatus(userId, statusField, newStatus) {
            return userService.updateUserStatus(userId, statusField, newStatus);
        }
    }

    RoomComponentController.$inject = [
        '$mdDialog',
        '$state',
        'roomsService',
        'userService',
        '_'
    ];

    const roomComponent = {
        templateUrl: '../app/features/room/room.component.html',
        controller: RoomComponentController,
        bindings: {
            roomInformation: '<'
        }
    };

    angular
        .module('monikersApp')
        .component('room', roomComponent);
})();

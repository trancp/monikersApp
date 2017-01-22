(function () {
    'use strict';

    function RoomComponentController($mdDialog, $scope, $state, roomsService, userService, _) {
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
            openSettingsDialog,
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
            roomsService.getRoomData(_.get(vm, 'roomInformation.roomId'))
                .then(room => getRoomDataSuccess(room));
            userService.getUserData(USER_ID)
                .then(user => _.set(vm, 'user', user));
            vm.isLoading = false;

        }

        function getRoomDataSuccess(room) {
            _.set(vm, 'roomData', room);
            vm.numOfWords = vm.roomData.status.numOfWords;
            vm.form = _generateEmptyForm(vm.numOfWords || NUM_OF_WORDS);
            $scope.$watch(() => vm.roomData.status.numOfWords, (numOfWords, prevNumWords) => _revokeSubmittedWords(numOfWords, prevNumWords));
        }

        function _revokeSubmittedWords(numOfWords, prevNumWords) {
            if (_.isEqual(numOfWords, prevNumWords)) {
                return;
            }
            _.set(vm, 'numOfWords', numOfWords);
            vm.form = _generateNewFormFields(numOfWords);
            return _removeAllSubmittedWords();
        }

        function _removeAllSubmittedWords() {
            vm.isLoading = true;
            roomsService.removeAllWords(vm.user.roomId)
                .then(() => _removeWordsSuccess());
        }

        function editSubmittedWords(event) {
            vm.isLoading = true;
            roomsService.removeWords(vm.user.roomId, USER_ID)
                .then(() => _removeWordsSuccess(event));
        }

        function _removeWordsSuccess(event) {
            _.set(vm, 'isLoading', false);
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
            return vm.submitted
                || _.get(vm, 'user.status.submitted')
                || _.get(vm, `roomData.players[${USER_ID}].submitted`);
        }

        function openSettingsDialog() {
            return $mdDialog.show({
                clickOutsideToClose: true,
                templateUrl: '../app/features/settings/settings.component.html',
                controller: 'settings',
                controllerAs: '$ctrl',
                locals: {
                    currentNumWords: vm.numOfWords
                }
            })
                .then(numOfWordsSelected => {
                    if (!numOfWordsSelected) {
                        return;
                    }
                    _updateGameStatus(_.get(vm, 'user.roomId'), 'numOfWords', numOfWordsSelected);
                });
        }

        function participantIsMaster() {
            return USER_ID
                === _.get(vm, 'roomData.status.roomMaster');
        }

        function removeUser(playerId) {
            roomsService.removePlayer(vm.user.roomId, playerId);
            userService.removeUser(playerId);
        }

        function startGame() {
            roomsService.startGame(vm.user.roomId, USER_ID)
                .then(() => _goToGame());
        }

        function _goToGame() {
            return $state.go('game', {
                roomCode: vm.roomData.roomCode,
                userName: vm.user.userName
            });
        }

        function submitWords() {
            const hasEmptyFormField = _hasEmptyFormFields(vm.form);
            if (hasEmptyFormField) {
                return;
            }
            vm.isLoading = true;
            return roomsService.submitWords(vm.user.roomId, USER_ID, vm.form)
                .then(() => _submitWordsSuccess());
        }

        function _submitWordsSuccess() {
            return _updatePlayerStatus(vm.user.roomId, USER_ID, 'submitted', true)
                .then(() => _.set(vm, 'isLoading', false));
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

        function _generateNewFormFields(numOfWords) {
            const pickFields = _.map(Array(numOfWords), (value, index) => `${index}`);
            const copyOldForm = _.pick(vm.form, pickFields);
            const emptyForm = _generateEmptyForm(numOfWords);
            return _.assign(emptyForm, copyOldForm);
        }

        function _hasEmptyFormFields(form) {
            return vm.numOfWords !== _.compact(_.values(form)).length;
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
        '$scope',
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

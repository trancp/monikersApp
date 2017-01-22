(function () {
    'use strict';

    function Settings($mdDialog, currentNumWords, _) {
        const NUM_OF_WORDS_OPTIONS = [5, 6, 7, 8, 9, 10];
        const vm = this;
        vm.numOfWords = currentNumWords || 5;
        $onInit();

        _.assign(vm, {
            cancel,
            confirm
        });

        function $onInit() {
            vm.numOfWordsOptions = NUM_OF_WORDS_OPTIONS;
        }

        function cancel() {
            return $mdDialog.hide();
        }

        function confirm() {
            return $mdDialog.hide(vm.numOfWords);
        }
    }

    Settings.$inject = [
        '$mdDialog',
        'currentNumWords',
        '_',
    ];

    angular
        .module('monikersApp')
        .controller('settings', Settings);
})();


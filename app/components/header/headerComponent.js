(function () {
    'use strict';

    angular
        .module('monikersApp')
        .component('header', header());

    function header() {
        const component = {
            templateUrl: '../app/components/header/headerComponent.html',
            controller: headerController
        };

        return component;
    }

    headerController.$inject = [];

    function headerController() {
        const vm = this;
    }
})();

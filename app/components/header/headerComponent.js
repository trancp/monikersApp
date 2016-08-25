(function () {
    "use strict";
    angular
        .module('monikersApp')
        .component('header', header());

    function header() {
        var component = {
            templateUrl: '../app/components/header/headerComponent.html',
            controller: headerController
        };

        return component;
    }

    headerController.$inject = [];

    function headerController() {
        var vm = this;
    }
})();

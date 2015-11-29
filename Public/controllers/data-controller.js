(function() {

    angular.module('gb')
        .controller('DataController', DataController);

    DataController.$inject = [];

    function DataController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();

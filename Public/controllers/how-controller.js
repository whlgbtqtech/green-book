(function() {

    angular.module('gb')
        .controller('HowController', HowController);

    HowController.$inject = [];

    function HowController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();
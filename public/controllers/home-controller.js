(function() {

    angular.module('gb')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();

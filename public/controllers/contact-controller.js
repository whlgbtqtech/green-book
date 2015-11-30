(function() {

    angular.module('gb')
        .controller('ContactController', ContactController);

    ContactController.$inject = [];

    function ContactController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();

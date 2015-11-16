/**
 * Created by kjefferson on 11/16/15.
 */

(function() {

    angular.module('greenBook')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();

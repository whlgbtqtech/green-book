/**
 * Created by kjefferson on 11/16/15.
 */

(function() {

    angular.module('greenBook')
        .controller('HowController', HowController);

    HowController.$inject = [];

    function HowController() {

        var vm = this;

        vm.hello = 'It works!';

    }

})();
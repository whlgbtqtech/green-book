/**
 * Created by kjefferson on 11/16/15.
 */

(function() {

    angular.module('greenBook')
        .config(configGB);

    configGB.$inject = ['$routeProvider'];

    function configGB($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'HomeCtrl'
        }).when('/how-to', {
            templateUrl: 'views/how-to.html',
            controller: 'HowController',
            controllerAs: 'HowCtrl'
        })

    }

})();

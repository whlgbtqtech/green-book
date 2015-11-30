(function() {

    'use strict';

    angular.module('gb')
        .config(configGB);

    configGB.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configGB($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('app', {
            templateUrl: '/index.html'
        }).state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'HomeCtrl'
        }).state('how', {
            url: '/how',
            templateUrl: 'views/how.html',
            controller: 'HowController',
            controllerAs: 'HowCtrl'
        }).state('data', {
            url: '/data',
            templateUrl: 'views/data.html',
            controller: 'DataController',
            controllerAs: 'DataCtrl'
        }).state('contact', {
            url: '/contact',
            templateUrl: 'views/contact.html',
            controller: 'ContactController',
            controllerAs: 'ContactCtrl'
        })

    }

})();


(function(angular) {
  'use strict';

  angular.module('JourneyLearner', ['ui.router', 'ngMaterial'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/maps/0');
    $stateProvider
        .state('maps', {
            url: '/maps/:mapId',
            templateUrl: 'templates/map.page.html',
            controller: 'mapControl'
        });
  });
})(angular);

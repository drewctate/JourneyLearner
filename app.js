(function() {
  'use strict';

  angular.module('JourneyLearner', ['ui.router', 'ngMaterial'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/maps/0');
    $stateProvider
        .state('maps', {
            url: '/maps/:mapId',
            templateUrl: 'modules/maplearner/map.page.html',
            controller: 'mapControl'
        });
  });
})();

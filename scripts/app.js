'use strict';

angular.module('JourneyLearner', ['ui.router', 'ngMaterial'])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
      .state('home', {
          url: '/',
          templateUrl: 'templates/map.html',
          controller: function () {
            drawMap();
          }
      });
});
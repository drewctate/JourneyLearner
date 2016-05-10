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
})
.controller('PasswordController', function PasswordController($scope) {
  $scope.password = '';
  $scope.grade = function() {
    var size = $scope.password.length;
    if (size > 8) {
      $scope.strength = 'strong';
    } else if (size > 3) {
      $scope.strength = 'medium';
    } else {
      $scope.strength = 'weak';
    }
  };
});
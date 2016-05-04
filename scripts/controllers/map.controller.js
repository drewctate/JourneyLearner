angular.module('JourneyLearner')
  .controller('mapControl', ['$scope', 'mapsAPI', function ($scope, maps) {
    $scope.map = maps.getMap();
  }]);
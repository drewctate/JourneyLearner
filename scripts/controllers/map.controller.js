angular.module('JourneyLearner')
  .controller('mapControl', ['$scope', 'mapsAPI', function ($scope, mapsAPI) {
    mapsAPI.getMap().then(function (maps) {
      $scope.maps = maps.data;
    }, function () { console.log('There was an error retrieving the maps'); });
  }]);
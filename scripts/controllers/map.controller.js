(function(angular) {
  'use strict';
  angular.module('JourneyLearner')
    .controller('mapControl', ['$scope', '$stateParams', 'mapsAPI', function ($scope, $stateParams, mapsAPI) {
      mapsAPI.getMap().then(function (maps) {
        $scope.maps = maps.data;
        $scope.curMapId = $stateParams.mapId;
      }, function () { console.log('There was an error retrieving the maps'); });
    }]);
})(angular);
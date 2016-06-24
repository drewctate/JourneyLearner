(function () {
  'use strict';
  angular.module('JourneyLearner.maplearner')
    .controller('mapControl', ['$scope', '$stateParams', '$location', 'mapsAPI', function ($scope, $stateParams, $location, mapsAPI) {
      mapsAPI.getMap().then(function (maps) {
        $scope.maps = maps.data;
        if (!$stateParams.mapId) {
          $location.url('maps/0');
        }
        $scope.curMapId = $stateParams.mapId;
      }, function () { console.log('There was an error retrieving the maps'); });
    }]);
})();

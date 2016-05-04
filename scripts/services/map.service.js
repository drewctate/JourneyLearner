angular.module('JourneyLearner')
  .service('mapsAPI', ['$http', function ($http) {
    var getMap = function (succ, fail) {
      return $http.get('http://localhost:2000/maps');
    };

    return {
      getMap: getMap
    };
  }]);
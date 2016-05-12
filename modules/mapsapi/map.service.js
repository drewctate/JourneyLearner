angular.module('JourneyLearner')
  .service('mapsAPI', ['$http', function ($http) {
    var getMap = function (succ, fail) {
      return $http.get('https://journeylearner-api.herokuapp.com/maps');
    };

    return {
      getMap: getMap
    };
  }]);
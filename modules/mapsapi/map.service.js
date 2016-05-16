angular.module('JourneyLearner')
  .service('mapsAPI', ['$http', function ($http) {
    var backEnd = 'https://journeylearner-api.herokuapp.com';
    // var backEnd = 'http://localhost:8080';

    var getMap = function () {
      return $http.get(backEnd + '/maps');
    };

    var getSignedRequest = function (file) {
      return $http.get(backEnd + '/sign_s3?file_name=' + file.name + '&file_type=' + file.type);
    };

    return {
      getMap: getMap,
      getSignedRequest: getSignedRequest
    };
  }]);
angular.module('JourneyLearner')
  .service('mapService', function () {
    var getMap = function () {
      return [{ "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                { "x": 80,  "y": 5},  { "x": 100, "y": 60},
                { "x": 300, "y": 70}, { "x": 300, "y": 200},
                { "x": 680, "y": 200}];
    };

    return {
      getMap: getMap
    };
  });
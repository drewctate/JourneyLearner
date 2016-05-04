angular.module('JourneyLearner')
  .service('mapsAPI', function () {
    var getMap = function () {
      var map = {
                title: 'Shackleton\'s Voyage',
                description: 'His fourth and most famous voyage to the Antarctic',
                author: 'Andrew Tate',
                image: 'shackleton.jpg',
                dimensions: [700, 400],
                points: [
                  { 'x': 1,   'y': 5 },
                  { 'x': 20,  'y': 20 },
                  { 'x': 40,  'y': 10 },
                  { 'x': 60,  'y': 40 },
                  { 'x': 80,  'y': 5 },
                  { 'x': 100, 'y': 60 },
                  { 'x': 300, 'y': 70 },
                  { 'x': 300, 'y': 200 },
                  { 'x': 680, 'y': 200 }
                ],
                datapoints: [
                  {
                    coords: [40, 10],
                    desc: 'This is elephant Island!'
                  }
                ]
              };
      return map;
    };

    return {
      getMap: getMap
    };
  });
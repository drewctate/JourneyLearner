angular.module('JourneyLearner')
  .directive('map', function() {
    return {
      restrict: 'E',
      template: '<span id="map"></span><md-button ng-click="drawPath(points)">Draw</md-button>',
      scope: {
        points: '='
      },
      link: function ($scope) {
        var svgContainer;

        function drawMap () {
          svgContainer = d3.select('#map').append('svg')
            .attr('id', 'map-svg');
        }

        $scope.drawPath = function (points) {
          var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('cardinal');

          var line = svgContainer.append('path')
            .attr('d', lineFunction(points))
            .attr('id', 'map-stroke');

          var totalLength = line.node().getTotalLength();

          line
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                  .duration(5000)
                  .ease('linear')
                  .attr('stroke-dashoffset', 0);
        };

        drawMap();
      }
    };
  });
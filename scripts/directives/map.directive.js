angular.module('JourneyLearner')
  .directive('map', function() {
    return {
      restrict: 'E',
      template: '<span id="map"></span>',
      scope: {
        points: '='
      },
      link: function ($scope) {
        var lineData = $scope.points;

        function drawMap (points) {
          var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('cardinal');

          var svgContainer = d3.select('#map').append('svg')
            .attr('id', 'map-svg');

          var line = svgContainer.append('path')
            .attr('d', lineFunction(lineData))
            .attr('id', 'map-stroke');

          var totalLength = line.node().getTotalLength();

          line
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                  .duration(5000)
                  .ease('linear')
                  .attr('stroke-dashoffset', 0);
        }
        drawMap();
      }
    };
  });
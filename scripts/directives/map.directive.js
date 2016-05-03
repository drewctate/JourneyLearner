angular.module('JourneyLearner')
  .directive('map', ['mapService', function(maps) {
    return {
      restrict: 'E',
      template: '<span id="map"></span>',
      link: function ($scope) {
        var lineData = maps.getMap();

        function drawMap (points) {
          var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("cardinal");

          var svgContainer = d3.select("#map").append("svg")
            .attr("width", 700)
            .attr("height", 500)
            .attr("style", "background-color: #cc9900")
            .attr("id", "mapsvg");

          var line = svgContainer.append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", "blue")
            .attr("stroke-width", 4)
            .attr("fill", "none");

          var totalLength = line.node().getTotalLength();

          line
            .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                  .duration(5000)
                  .ease("linear")
                  .attr("stroke-dashoffset", 0);
        }
        drawMap();
      }
    };
  }]);
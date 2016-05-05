angular.module('JourneyLearner')
  .directive('map', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'E',
      template: '<div id="map"></div><md-button ng-click="drawPath(points)">Draw</md-button>',
      scope: {
        points: '=',
        image: '='
      },
      link: function ($scope, $element) {
        var svgContainer;

        function drawInfoBox(x, y, info) {
          $scope.infoCoords = [x, y];
          $scope.infoText = info;
          var el = $compile('<info text="infoText" coords="infoCoords"></info>')($scope);
          $element.find('div').append(el);
        }

        function removeInfoBox() {
          $element.find('info').remove();
        }

        function drawMap () {
          svgContainer = d3.select('#map').append('svg')
            .attr('id', 'map-svg')
            .style('background-image', 'url(\'styles/img/maps/' + $scope.image + '\')');
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
                  .duration(8000)
                  .ease('linear')
                  .attr('stroke-dashoffset', 0);
        };

        drawInfoBox(8, 23, 'Here\'s where Shackleton journeyed!');
        $timeout(drawMap, 200); // wait for image info to be loaded
      }
    };
  }]);
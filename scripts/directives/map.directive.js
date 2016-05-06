angular.module('JourneyLearner')
  .directive('map', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'E',
      template: '<div id="map"></div><md-button ng-click="drawPath(points)">Draw</md-button>',
      scope: {
        map: '=curMap'
      },
      link: function ($scope, $element) {
        var svgContainer;
        var line = {};
        var lineFunction;
        var totalLength = 0;
        var curPoints = [];
        var curDataPoint = null;

        function drawInfoBox(x, y, info, duration) {
          $scope.infoCoords = [x, y];
          $scope.infoText = info;
          var el = $compile('<info text="infoText" coords="infoCoords" duration="' + duration + '"></info>')($scope);
          angular.element(document.getElementById('map')).append(el);
        }

        function removeInfoBox(delay) {
          $element.find('info').fadeOut(delay);
          $timeout(function () {$element.find('info').remove();}, delay);
        }

        function drawMap () {
          svgContainer = d3.select('#map').append('svg')
            .attr('id', 'map-svg')
            .style('background-image', 'url(\'styles/img/maps/' + $scope.map.image + '\')');
        }

        function isDataPoint(point) {
          for (var i = 0; i < $scope.map.datapoints.length; i++) {
            if (point.x == $scope.map.datapoints[i].coords[0] && point.y == $scope.map.datapoints[i].coords[1]) {
              return i;
            }
          }
          return -1;
        }

        function nextPoint() {
          var map = $scope.map;
          for (var i = curPoints.length; i < map.points.length; i++) {
            var dpindex = isDataPoint(map.points[i]);
            if (dpindex != -1) {
              curDataPoint = $scope.map.datapoints[dpindex];
              curPoints.push(map.points[i]);
              break;
            } else {
              curPoints.push(map.points[i]);
            }
            curDataPoint = null;
          }

          line.attr("d", lineFunction(curPoints));  // add new points to the line

          var prevLength = totalLength;
          totalLength = line.node().getTotalLength();

          // if drawing to datapoint instead of end, draw info box
          var endCallBack;
          if (curDataPoint) {
            endCallBack = function () {drawInfoBox(curDataPoint.coords[0], curDataPoint.coords[1], curDataPoint.desc);};
          } else {
            endCallBack = {};
          }

          line
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength - prevLength)
              .transition()
                .duration(8000)
                .ease("linear")
                .attr("stroke-dashoffset", 0)
                .each('end', endCallBack);
        }

        $scope.drawPath = function() {
          line = svgContainer.append('path')
            .attr('d', lineFunction($scope.map.points))
            .attr('id', 'map-stroke');

          removeInfoBox(500);  // remove possible info box when new path is begun
          nextPoint();
        };

        function beginPath () {
          lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('cardinal');

          $scope.map.datapoints.push({
            coords: [361, 185],
            desc: 'I\'m a test datapoint!'
          });
          $scope.map.datapoints.push({
            coords: [294, 138],
            desc: 'I\'m a test datapoint!'
          });
        }

        function init () {
          if ($scope.map) {
            drawMap();
            beginPath();
          } else {
            $timeout(init, 200);
          }
        }

        $timeout(init, 150); // wait for map info to be loaded
      }
    };
  }]);
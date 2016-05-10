(function(angular) {
  'use strict';
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
        var curDataPoint = null;
        var curDataPointIndex = 0;
        var pointLengths = [];

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

        function drawMap() {
          svgContainer = d3.select('#map').append('svg')
            .attr('id', 'map-svg')
            .style('background-image', 'url(\'styles/img/maps/' + $scope.map.image + '\')');
        }

        function nextPoint() {
          var map = $scope.map;
          var prevLength;
          var curLength = pointLengths[curDataPointIndex];
          var totalLength = pointLengths[pointLengths.length - 1];

          if (curDataPointIndex === 0) {  // begin with prevLength = 0
            prevLength = 0;
          } else {
            prevLength = pointLengths[curDataPointIndex - 1];
          }

          curDataPoint = $scope.map.datapoints[curDataPointIndex];
          // if drawing to datapoint instead of end, draw info box
          var endCallBack;
          if (curDataPoint) {
            endCallBack = function () {drawInfoBox(curDataPoint.coords[0], curDataPoint.coords[1], curDataPoint.desc);};
          } else {
            endCallBack = function () {};
          }

          line
              .attr('stroke-dasharray', curLength + ' ' + totalLength)
              .attr('stroke-dashoffset', curLength - prevLength)
              .transition()
                .duration(8000)
                .ease('linear')
                .attr('stroke-dashoffset', 0)
                .each('end', endCallBack);

          curDataPointIndex++;
        }

        function isDataPoint(point) {
          if ($scope.map.datapoints != null && $scope.map.datapoints[0] !== null) {
            for (var i = 0; i < $scope.map.datapoints.length; i++) {
              if (point.x == $scope.map.datapoints[i].coords[0] && point.y == $scope.map.datapoints[i].coords[1]) {
                return i;
              }
            }
          }
          return -1;
        }

        function buildPath() {
          var map = $scope.map;
          var dpindex;
          var end = false;
          var curPoints = [];

          while (!end) {
            for (var i = curPoints.length; i < map.points.length; i++) {
              dpindex = isDataPoint(map.points[i]);
              if (dpindex != -1) {
                curPoints.push(map.points[i]);
                break;
              } else {
                curPoints.push(map.points[i]);
              }
            }

            line.attr('d', lineFunction(curPoints));  // add new points to the line
            if (dpindex == -1) {  // reached end of points
              pointLengths[pointLengths.length] = line.node().getTotalLength();  // Add total length of line to end of array
              end = true;
            } else {
              pointLengths[dpindex] = line.node().getTotalLength();  // get length of line at datapoint
            }
          }

          // hide line initially
          line
            .attr('stroke-dasharray', pointLengths[pointLengths.length - 1] + ' ' + pointLengths[pointLengths.length - 1])
            .attr('stroke-dashoffset', pointLengths[pointLengths.length - 1]);
        }

        $scope.drawPath = function () {
          removeInfoBox(500);  // remove possible info box when new path is begun
          nextPoint();
        };

        function beginPath () {
          lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate('cardinal');

          line = svgContainer.append('path')
            .attr('id', 'map-stroke');

          buildPath();
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
})(angular);
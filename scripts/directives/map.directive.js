(function(angular) {
  'use strict';
  angular.module('JourneyLearner')
  .directive('map', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'E',
      templateUrl: 'templates/map.directive.html',
      scope: {
        map: '=curMap'
      },
      link: function ($scope, $element) {

        var curState = 'begin';
        $scope.drawBtnDisabled = false;

        var drawSpeed = 50; // in px/sec
        var svgContainer;
        var line = {};
        var lineFunction;
        var totalLength = 0;
        var curDataPoint = null;
        var curDataPointIndex = 0;
        var pointLengths = [];
        var pointDurations = [];

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
          var duration = pointDurations[curDataPointIndex];

          if (curDataPointIndex === 0) {  // begin with prevLength = 0
            prevLength = 0;
          } else {
            prevLength = pointLengths[curDataPointIndex - 1];
          }

          curDataPoint = $scope.map.datapoints[curDataPointIndex];
          // if drawing to datapoint instead of end, draw info box
          var endCallBack;
          if (curDataPoint) {
            endCallBack = function () {
              curState = 'paused';
              updateBtn();
              drawInfoBox(curDataPoint.coords[0], curDataPoint.coords[1], curDataPoint.desc);
              curDataPointIndex++;
            };
          } else {
            endCallBack = function () {
              $scope.$apply(function () {  // if this isn't house in an $apply, it doesn't update the button
                curState = 'finished';
                updateBtn();
              });
            };
          }

          line
              .attr('stroke-dasharray', curLength + ' ' + totalLength)
              .attr('stroke-dashoffset', curLength - prevLength)
              .transition()
                .duration(duration)
                .ease('linear')
                .attr('stroke-dashoffset', 0)
                .each('end', endCallBack);
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

            //  calculate durations for each drawing segment
            if (dpindex === 0) {
              pointDurations[dpindex] = pointLengths[dpindex]/drawSpeed;
            } else if (dpindex === -1 && pointLengths.length > 1) {
              pointDurations[pointDurations.length] = (pointLengths[pointLengths.length - 1] - pointLengths[pointLengths.length - 2])/drawSpeed;
            } else if (dpindex === -1) {
              pointDurations[pointDurations.length] = pointLengths[0]/drawSpeed;
            } else {
              pointDurations[dpindex] = (pointLengths[dpindex] - pointLengths[dpindex - 1])/drawSpeed;
            }
          }

          //  values in pointDurations are stored in milliseconds, math.floor is used for easier computations during animation
          for (var j = 0; j < pointDurations.length; j++) {
            pointDurations[j] = Math.floor(pointDurations[j] * 10);
            pointDurations[j] *= 100;
          }
          console.log(pointDurations);
          console.log(pointLengths);

          // hide line initially
          line
            .attr('stroke-dasharray', pointLengths[pointLengths.length - 1] + ' ' + pointLengths[pointLengths.length - 1])
            .attr('stroke-dashoffset', pointLengths[pointLengths.length - 1]);
        }

        function resetLine () {
          // set offset to total length
          line.attr('stroke-dashoffset', pointLengths[pointLengths.length - 1]);
          curDataPointIndex = 0;
        }

        $scope.drawPath = function () {
          if (curState !== 'finished') {
            curState = 'drawing';
            updateBtn();
            removeInfoBox(500);  // remove possible info box when new path is begun
            nextPoint();
          } else {
            curState = 'begin';
            updateBtn();
            resetLine();
          }
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

        function updateBtn () {
          if (curState === 'begin') {
            $scope.drawBtn = 'Begin Journey';
          } else if (curState === 'drawing') {
            $scope.drawBtn = 'Drawing';
            $scope.drawBtnDisabled = true;
          } else if (curState === 'paused') {
            $scope.drawBtn = 'Continue Journey';
            $scope.drawBtnDisabled = false;
          } else if (curState === 'finished') {
            $scope.drawBtn = 'Start Again';
            $scope.drawBtnDisabled = false;
          } else {
            $scope.drawBtn = 'Error';
            $scope.drawBtnDisabled = true;
          }
        }

        function init () {
          if ($scope.map) {
            drawMap();
            beginPath();
            updateBtn();
          } else {
            $timeout(init, 150);
          }
        }

        init();
      }
    };
  }]);
})(angular);
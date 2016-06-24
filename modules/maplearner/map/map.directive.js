(function () {
  'use strict';
  angular.module('JourneyLearner.maplearner')
  .directive('map', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'E',
      templateUrl: 'modules/maplearner/map/map.directive.html',
      scope: {
        map: '=curMap'
      },
      link: function ($scope, $element) {
        $scope.curState = 'begin';
        $scope.prevState = 'begin';
        $scope.drawBtnDisabled = false;
        $scope.sliderDisabled = false;
        $scope.avgDifference = null;
        $scope.sliderProgress = 0;

        var drawSpeed = 50, // in px/sec
            svgContainer,
            line = {},
            userLine,
            lineFunction,
            totalLength = 0,
            curDataPoint = null,
            curDataPointIndex = 0,
            pointLengths = [],
            pointDurations = [],
            firstUserDraw = true;

        function instructionBox(info, timeout) {
          var box = angular.element('#instruct');
          box.text(info);
          box.fadeIn();
          $timeout(function () {box.fadeOut();}, timeout);
        }

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
            .attr('viewBox', '0 0 700 400')
            .style('background-image', 'url(\'' + $scope.map.image + '\')');
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
              $scope.curState = 'paused';
              updateCtrls();
              drawInfoBox(curDataPoint.coords[0], curDataPoint.coords[1], curDataPoint.desc);
              curDataPointIndex++;
            };
          } else {
            endCallBack = function () {
              $scope.$apply(function () {  // if this isn't house in an $apply, it doesn't update the button
                $scope.curState = 'finished';
                updateCtrls();
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
              if (i == map.points.length - 1) end = true;
              if (dpindex != -1) {
                curPoints.push(map.points[i]);
                break;
              } else {
                curPoints.push(map.points[i]);
              }
            }

            line.attr('d', lineFunction(curPoints));  // add new points to the line
            if (dpindex == -1) {  // reached end of points, last point not datapoint
              pointLengths[pointLengths.length] = line.node().getTotalLength();  // Add total length of line to end of array
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

        function showLine () {
          line.attr('stroke-dashoffset', 0);
          curDataPointIndex = pointLengths.length - 1;
        }

        $scope.drawPath = function () {
          if (userLine) {
            userLine.attr('d', ''); //  clear previous line
          }
          if ($scope.curState !== 'finished') {
            $scope.curState = 'drawing';
            updateCtrls();
            removeInfoBox(500);  // remove possible info box when new path is begun
            nextPoint();
          } else {
            $scope.curState = 'begin';
            updateCtrls();
            resetLine();
            $scope.avgDifference = null;
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

        function updateCtrls () {
          if ($scope.curState === 'begin') {
            $scope.drawBtn = 'Begin Journey';
            $scope.drawBtnDisabled = false;
            $scope.sliderDisabled = false;
          } else if ($scope.curState === 'drawing') {
            $scope.drawBtn = 'Drawing';
            $scope.drawBtnDisabled = true;
            $scope.sliderDisabled = true;
          } else if ($scope.curState === 'paused') {
            $scope.drawBtn = 'Continue Journey';
            $scope.drawBtnDisabled = false;
            $scope.sliderDisabled = true;
          } else if ($scope.curState === 'finished') {
            $scope.drawBtn = 'Show Me Again';
            $scope.drawBtnDisabled = false;
            $scope.sliderDisabled = false;
          } else if ($scope.curState === 'userdrawing') {
            $scope.drawBtnDisabled = true;
            $scope.sliderDisabled = true;
          } else if ($scope.curState === 'slider') {
            $scope.drawBtnDisabled = true;
          } else {
            $scope.drawBtn = 'Error';
            $scope.drawBtnDisabled = true;
          }
        }

        function distanceBetween (p1, p2) {
          return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
        }

        function compareLines () {
          var segNum = 100,
              userTotalLength = userLine.node().getTotalLength(),
              userLengthSeg = userTotalLength / segNum,
              userPoints = [],
              userLengths = [],
              genTotalLength = line.node().getTotalLength(),
              genLengthSeg = genTotalLength / segNum,
              genPoints = [],
              genLengths = [],
              totalDifference = 0,
              avgDifference = 0;

          for (var i = 0; i < segNum; i++) {
            userPoints.push(userLine.node().getPointAtLength(userLengthSeg * i));
            genPoints.push(line.node().getPointAtLength(genLengthSeg * i));
          }
          var dist = 0;
          for (var j = 0; j < segNum; j++) {
            dist = distanceBetween(userPoints[j], genPoints[j]);
            totalDifference = totalDifference + dist;
          }
          avgDifference = totalDifference / segNum;

          return avgDifference;
        }

        function prepareCanvasForDraw() {
          if (userLine) {
            userLine.attr('d', ''); //  clear previous line
          }

          var mouseDown = false,
              lastXY = [],
              curUserPoints = [];
          $scope.curState = 'userdrawing';
          updateCtrls();
          $scope.avgDifference = null;
          resetLine();

          svgContainer.on('mousedown', function () {
            mouseDown = true;
            var xy = d3.mouse(this);

            curUserPoints.push({x: xy[0], y: xy[1]});
            userLine = svgContainer.append('path')
              .attr('d', lineFunction(curUserPoints))
              .attr('id', 'user-map-stroke');

            lastXY = xy;
          });

          svgContainer.on('mouseup', function () {
            // unbind event listeners
            svgContainer.on('mousedown', null);
            svgContainer.on('mousemove', null);
            svgContainer.on('mouseup', null);
            $scope.$apply(function () {
              $scope.avgDifference = compareLines();
              $scope.curState = 'finished';
              updateCtrls();
            });
            showLine();
          });

          svgContainer.on('mousemove', function () {
            if (!mouseDown) {
              return;
            }
            var xy = d3.mouse(this);
            if (Math.abs(xy[0] - lastXY[0]) > 2 || Math.abs(xy[1] - lastXY[1]) > 2) {
              curUserPoints.push({x: xy[0], y: xy[1]});
              userLine.attr('d', lineFunction(curUserPoints));
              lastXY = xy;
            }
          });
        }

        // this function sets up the canvas in preparation for the user to make their attempt.
        // It binds eventhandlers to the canvas
        $scope.userDraw = function () {
          if (firstUserDraw) {
            firstUserDraw = false;
            var message = `Are you ready for a challenge? Good! Use your mouse to draw
                  a line just like the one I did. Then, I\'ll tell you how close you got!`,
                timeout = 6000;

            instructionBox(message, timeout);
            $timeout(prepareCanvasForDraw, timeout);
          } else {
            prepareCanvasForDraw();
          }
        };

        function activateSlider () {
          var sliderMax = 300;
          var totalLength = line.node().getTotalLength();
          var slider = angular.element('md-slider');
          $scope.$watch('sliderProgress', function (newValue, oldValue) {
            line.attr('stroke-dashoffset', totalLength - (totalLength / sliderMax) * newValue);
          });

          slider
            .focus(function () {
              $scope.$apply(function () {
                $scope.prevState = $scope.curState;
                $scope.avgDifference = null;
                $scope.curState = 'slider';
                updateCtrls();
              });
            })
            .focusout(function () {
              $scope.$apply(function () {
                $scope.curState = $scope.prevState;
                updateCtrls();
              });
            })
            .on('mouseup', function () {
              slider.blur();
            });
        }

        function init () {
          if ($scope.map) {
            drawMap();
            beginPath();
            updateCtrls();
            activateSlider();
          } else {
            $timeout(init, 150);
          }
        }

        init();
      }
    };
  }]);
})();

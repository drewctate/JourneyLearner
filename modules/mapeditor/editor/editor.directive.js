(function () {
  angular.module('JourneyLearner.mapeditor')
    .directive('editor', ['$interval', 'mapsAPI', 'S3', 'Upload', '$mdDialog', function ($interval, mapsAPI, S3, Upload, $mdDialog) {
      return {
        restrict: 'E',
        templateUrl: 'modules/mapeditor/editor/editor.directive.html',
        scope: {
          map: '='
        },
        link: function ($scope) {
          var svg,
            lineFunction,
            height = 400,
            width = 700,
            circles,
            points = [],
            dataPoints = [],
            dragged = null,
            initDragged = null,
            selected = points[0];

          $scope.dataPointMode = false;
          $scope.desc = '';

          function drawMap() {
            svg = d3.select('#map-edit').append('svg')
              .attr('id', 'map-svg')
              .attr("width", width)
              .attr("height", height);

            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .on("mousedown", mousedown);

            svg.append("path")
                .datum(points)
                .attr("class", "line")
                .call(redraw);

            lineFunction = d3.svg.line()
              .interpolate('cardinal');

            d3.select(window)
                .on("mousemove", function () {mousemove(false);})
                .on("mouseup", mouseup)
                .on('keydown', keydown);
          }

          function redraw() {
            svg.select("path").attr("d", lineFunction);

            var circle = svg.selectAll("circle")
                .data(points, function(d) { return d; });

            circle.enter().append("circle")
              .attr("r", 1e-6)
              .on("mousedown", function(d) {
                selected = dragged = d;
                if (initDragged === null) {
                  initDragged = [];
                  initDragged[0] = selected[0];
                  initDragged[1] = selected[1];
                }
                redraw();
              })
              .transition()
                .duration(750)
                .ease("elastic")
                .attr("r", 6.5);

            circle
                .classed("selected", function(d) { return d === selected; })
                .attr("cx", function(d) { return d[0]; })
                .attr("cy", function(d) { return d[1]; });

            circle.exit().remove();

            if (d3.event) {
              d3.event.preventDefault();
              d3.event.stopPropagation();
            }
          }

          function infoBoxModal($scope, $mdDialog) {
            $scope.cancel = function () {
              $mdDialog.hide();
            };
            $scope.return = function (info) {
              $mdDialog.hide(info);
            };
          }

          function mousedown () {
            var newPoint = d3.mouse(svg.node());
            if ($scope.dataPointMode) {
              $mdDialog.show({
                templateUrl: 'modules/mapeditor/editor/infoboxmodal/infoboxmodal.html',
                controller: infoBoxModal,
                parent: angular.element('editor')
              }).then(function (description) {
                if (description) {
                  dataPoints.push({
                    coords: newPoint,
                    desc: description
                  });
                  selected = newPoint;
                  points.push(newPoint);
                  redraw();
                }
              });
            } else {
              points.push(selected = dragged = newPoint);
              redraw();
            }
          }

          function updateDataPoint(point, newCoords) {
            console.log('---------------------------------------');
            for (var i = 0; i < dataPoints.length; i++) {
              console.log('initDragged: ', initDragged);
              console.log('dataPoint Coords', dataPoints[i].coords)
              if (point[0] === dataPoints[i].coords[0] && point[1] === dataPoints[i].coords[1]){
                console.log('updated!');
                dataPoints[i].coords[0] = newCoords[0];
                dataPoints[i].coords[1] = newCoords[1];
              }
            }
          }

          function mousemove (mouseup) {
            if (!dragged) return;
            var m = d3.mouse(svg.node());
            var newCoords = [];
            newCoords[0] = Math.max(0, Math.min(width, m[0]));
            newCoords[1] = Math.max(0, Math.min(height, m[1]));
            if (mouseup && initDragged)
              updateDataPoint(initDragged, newCoords); // only does something if initDragged is data point
            dragged[0] = newCoords[0];
            dragged[1] = newCoords[1];
            redraw();
          }

          function mouseup () {
            if (!dragged) return;
            mousemove(true);
            dragged = null;
            initDragged = null;
          }

          function keydown () {
            if (!selected) return;
            // can't delete points while md-dialog open
            if (angular.element(document).find('md-dialog').length > 0) return;
            switch (d3.event.keyCode) {
              case 8: // backspace
              case 46: { // delete
                var i = points.indexOf(selected);
                points.splice(i, 1);
                selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
                redraw();
                break;
              }
            }
          }

          function convertPoints(points) {
            var converted = [];
            for (var i = 0; i < points.length; i++) {
              converted.push({x: points[i][0], y: points[i][1]});
            }
            return converted;
          }

          function isIn(dataPoint, points) {
            var isIn = false;
            for (var i = 0; i < points.length; i++) {
              if (points[i] == dataPoint.coords)
                isIn = true;
            }
            return isIn;
          }

          function cullDataPoints(dataPoints, points) {
            if (dataPoints.length === 0) return [];
            var culledDataPoints = [];
            for (var i = 0; i < dataPoints.length; i++) {
              if (isIn(dataPoints[i], points)) {
                culledDataPoints.push(dataPoints[i]);
              }
            }
            return culledDataPoints;
          }

          $scope.save = function () {
            var file = $scope.map.image;
            mapsAPI.getSignedRequest(file).then(function (res) {
              S3.uploadImage(res.data.signed_request, file).then(function (awsRes) {
                var newMap = {
                  name: $scope.map.name,
                  author: $scope.map.author,
                  description: $scope.map.description,
                  image: res.data.url,
                };
                newMap.points = convertPoints(points);
                Upload.imageDimensions(file).then(function (dimensions) {
                  newMap.dimensions = [dimensions.width, dimensions.height];
                });
                newMap.dataPoints = cullDataPoints(dataPoints, points);
              },
              function (err) {
                console.log('Upload to S3 failed:' + err);
              });
            });
          };

          function init () {
            $scope.map.image = null;
            drawMap();
          }

          init();
        }
      };
    }]);
})();
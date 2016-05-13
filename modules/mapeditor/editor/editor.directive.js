(function () {
  angular.module('JourneyLearner.mapeditor')
    .directive('editor', ['$interval', function ($interval) {
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
            dragged = null,
            selected = points[0];

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
                .on("mousemove", mousemove)
                .on("mouseup", mouseup)
                .on('keydown', keydown);
          }

          function redraw() {
            svg.select("path").attr("d", lineFunction);

            var circle = svg.selectAll("circle")
                .data(points, function(d) { return d; });

            circle.enter().append("circle")
                .attr("r", 1e-6)
                .on("mousedown", function(d) { selected = dragged = d; redraw(); })
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

          function mousedown () {
            points.push(selected = dragged = d3.mouse(svg.node()));
            redraw();
          }

          function mousemove () {
            if (!dragged) return;
            var m = d3.mouse(svg.node());
            dragged[0] = Math.max(0, Math.min(width, m[0]));
            dragged[1] = Math.max(0, Math.min(height, m[1]));
            redraw();
          }

          function mouseup () {
            if (!dragged) return;
            mousemove();
            dragged = null;
          }

          function keydown () {
            if (!selected) return;
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

          function init () {
            $scope.map.image = null;
            drawMap();
          }

          init();
        }
      };
    }]);
})();
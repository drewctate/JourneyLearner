var drawMap = function () {
  'use strict';
  var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                  { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                  { "x": 80,  "y": 5},  { "x": 100, "y": 60},
                  { "x": 300, "y": 70}, { "x": 300, "y": 200},
                  { "x": 680, "y": 200}];

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
};
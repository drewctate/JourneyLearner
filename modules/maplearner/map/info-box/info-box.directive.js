(function () {
  'use strict';
  angular.module('JourneyLearner.maplearner')
    .directive('info', ['$timeout', function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'modules/maplearner/map/info-box/info-box.html',
        scope: {
          coords: '=',
          text: '=',
          duration: '='
        },
        link: function ($scope, $element) {
          function parseDim (dim) {
            return parseInt(dim.substring(0, dim.length - 2)); // remove 'px' and convert to int
          }

          // definedSVGWidth corresponds to the width defined by the SVG's viewbox attribute (map.directive.js:45)
          //  and is used to compute new dimensions and coordinates for scaling.
          var definedSVGWidth = 700,
              definedSVGHeight = 400,
              svgWidth = parseDim(angular.element('#map-svg').css('width'));

          function scale (n) {
            return n / (definedSVGWidth / svgWidth);
          }

          function drawBox () {
            var svgHeight = parseDim(angular.element('#map-svg').css('height')),
                boxInitHeight = parseDim($element.css('height')),
                boxInitWidth = parseDim($element.css('width')),
                boxWidth = scale(boxInitWidth),
                boxHeight = scale(boxInitHeight),
                definedFontSize = parseDim($element.css('font-size')),
                triangle = angular.element('.triangle'),
                triangleInitHeight = parseDim(triangle.css('height')),
                triangleHeight = scale(triangleInitHeight);

            triangle.css('width', boxWidth);
            triangle.css('height', triangleHeight);
            triangle.css('bottom', -triangleHeight);

            $element.css('height', boxHeight);
            $element.css('width', boxWidth);
            $element.css('font-size', scale(definedFontSize));
            $element.css('left', scale($scope.coords[0]) - boxWidth/2);
            $element.css('top', scale($scope.coords[1]) - boxHeight - scale(30));
            $element.fadeIn(); // element is created hidden

            if ($scope.duration) {
              $timeout(function () {$element.fadeOut(500);}, $scope.duration);
              $timeout(function () {$element.remove();}, $scope.duration + 500);
            }
          }
          $timeout(drawBox, 100); // wait is required for browser to calculate correct height
        }
      };
  }]);
})();

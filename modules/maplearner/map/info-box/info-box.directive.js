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
          function drawBox () {
            var boxHeightStr = $element.css('height');
            var boxWidthStr = $element.css('width');
            var boxHeight = parseInt(boxHeightStr.substring(0, boxHeightStr.length - 2)); // remove 'px'
            var boxWidth = parseInt(boxWidthStr.substring(0, boxWidthStr.length - 2)); // remove 'px'
            console.log(boxHeight);
            $element.css('left', $scope.coords[0] - boxWidth/2);
            $element.css('top', $scope.coords[1] - (boxHeight + 30));
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

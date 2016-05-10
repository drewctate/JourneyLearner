(function(angular) {
  'use strict';
  angular.module('JourneyLearner')
    .directive('info', ['$timeout', function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'templates/info-box.html',
        scope: {
          coords: '=',
          text: '=',
          duration: '='
        },
        link: function ($scope, $element) {
          $element.css('left', $scope.coords[0] - 150/2);
          $element.css('top', $scope.coords[1] - 100);
          $element.fadeIn(); // element is created hidden
          if ($scope.duration) {
            $timeout(function () {$element.fadeOut(500);}, $scope.duration);
            $timeout(function () {$element.remove();}, $scope.duration + 500);
          }
        }
      };
  }]);
})(angular);
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
        $timeout(function () {$element.fadeOut();}, $scope.duration);
      }
    };
  }]);
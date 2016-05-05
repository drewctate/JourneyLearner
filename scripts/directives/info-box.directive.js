angular.module('JourneyLearner')
  .directive('info', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/info-box.html',
      scope: {
        coords: '=',
        text: '='
      },
      link: function ($scope, $element) {
        $element.css('left', $scope.coords[0]);
        $element.css('top', $scope.coords[1]);
      }
    };
  });
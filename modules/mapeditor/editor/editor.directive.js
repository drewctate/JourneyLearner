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

        }
      };
    }]);
})();
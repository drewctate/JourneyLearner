(function () {
  angular.module('JourneyLearner.mapeditor')
    .controller('editControl', ['$scope', function ($scope) {
      map = {};
      $scope.upload = function(file) {
        console.log (file);
      };
    }]);
})();
(function () {
  angular.module('JourneyLearner.mapeditor')
    .controller('editControl', ['$scope', function ($scope) {
      $scope.map = {};
      $scope.upload = function(file) {
        console.log(file);
      };
    }]);
})();
(function () {
  'use strict';
  angular.module('JourneyLearner.mapeditor')
    .controller('editControl', ['$scope', function ($scope) {
      $scope.map = {};
      $scope.error = '';
      $scope.saved = false;

      $scope.uploadImage = function () {
        angular.element('#file-upload').click();
      };
    }]);
})();
describe('PasswordController', function() {
  beforeEach(module('JourneyLearner'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  scope = $rootScope.$new();

  describe('$scope.grade', function() {
    it('sets the strength to "strong" if the password length is >8 chars', function() {
      var controller = $controller('PasswordController', { $scope: scope });
      $scope.password = 'longerthaneightchars';
      $scope.grade();
      expect($scope.strength).toEqual('strong');
    });
  });
});
// describe('Maps Controller', function () {
//   beforeEach(module('JourneyLearner'));
//
//   var ctrl, $scope;
//   beforeEach(inject(['$controller', function($controller){
//     ctrl = $controller('mapControl', { $scope: $scope });
//   }]));
//
//   beforeEach(module(function ($provide) {
//     $provide.value('mapsAPI', {
//       getMap: function () {
//         return {
//           data: {}
//         };
//       }
//     });
//   }));
//
//   describe('$scope.curMapId', function () {
//     var $stateParams, $scope = {};
//
//     beforeEach(function () {
//       $stateParams = {};
//       $scope.curMapId = 0;
//       $stateParams.mapId = 0;
//     });
//
//     it('should be set to $stateParams.mapId', function () {
//       expect($scope.curMapId).toBe(0);
//     });
//
//   });
// });
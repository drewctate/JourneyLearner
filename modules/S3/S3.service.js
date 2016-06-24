(function () {
  angular.module('JourneyLearner')
    .service('S3', ['$http', function ($http) {
      var uploadImage = function (signedRequest, file) {
        var p = new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", signedRequest);
          xhr.setRequestHeader('x-amz-acl', 'public-read');
          xhr.onload = function() {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
              }
          };
          xhr.onerror = function() {
              reject(xhr.response);
          };
          xhr.send(file);
        });
        return p;
      };

      return {
        uploadImage: uploadImage
      };
    }]);
})();
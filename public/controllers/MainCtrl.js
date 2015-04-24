// public/js/controllers/MainCtrl.js
app.controller('MainController', function($scope, keyService, $location) {

  $scope.tagline = 'Enter your security key below, or "demo" to see sample data.';
  $scope.viewStartDate = 'none';
  $scope.viewEndDate = 'none';
  console.log ('Resetting the key');
  $scope.login = function (key) {
    if (!$scope.agree) return;
    console.log ('setting key: ' + key);
    keyService.save(key); 
    $location.url('/items');  // redundant if called from the home page, but just in case is used elsewhere
    // $httpProvider.defaults.headers.get = { 'key' : key };
    // $httpProvider.defaults.headers.delete = { 'key' : key };
    // $httpProvider.defaults.headers.post.key = key;
    // $httpProvider.defaults.headers.put.key = key;
  }

  $scope.generateKey = function () {
    if (!$scope.agree) return;
    var GUID = 'xxxx-9xxx-Zxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    var message = 'Your new account key is: ' + GUID + '  Please store this in a safe place, ';
    message += 'as there is no way to retrieve this if you lose it. This key will be the only way to access your ';
    message += 'daily expense information.';
    alert (message);
    $scope.login (GUID);
  }

  keyService.save ('demo');  // Default security key, simple authentication to put in the header of all API requests

});

// Creating an export button:
// http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
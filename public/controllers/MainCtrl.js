// public/js/controllers/MainCtrl.js
app.controller('MainController', function($scope, keyService, $location) {

  $scope.tagline = 'Login with your user name below, or use "demo123" (same for password) to see sample data.';
  $scope.viewStartDate = 'none';
  $scope.viewEndDate = 'none';
  $scope.login = '';
  $scope.loading = false;

  $scope.attemptlogin = function (userName, pwd) {
    if (!$scope.agree) { alert ('You must agree to the terms before logging in.'); return; }     // Must agree to terms before loggin in
    $scope.loading = true;
    console.log ('logging in as: ' + userName);
    $scope.login = userName;
    keyService.login (userName, pwd, function (response) {
      if (typeof response === 'string' && response == 'false') {
        alert ("Unable to login, check your user name and password again.");
        $scope.loading = false;
      }
      else {
        // login was successful, response from the service is the key for this user
        keyService.saveKey(response); 
        keyService.saveLogin($scope.login);
        $location.url('/items');  // redundant if called from the home page, but just in case is used elsewhere
      }
    });

  }

  $scope.createCategories = function (key) {
    keyService.createAllCategories (key);
  }

  $scope.generateKey = function () {
    //  Key for expense items for a new user.  In the future revision, just grab the _id that
    //  Mongo creates and use that.
    if (!$scope.agree) return;
    var GUID = 'xxxx-9xxx-Zxxx-xxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    return GUID;
  }

  $scope.createAccount = function () {
    if (!$scope.agree) { alert ('You must agree to the terms before logging in.'); return; }     // Must agree to terms before creating an account

    $scope.lengthError = false;
    $scope.duplicateError = false; 
    $scope.userName =
      $scope.userPwd =
      $scope.userPwdConfirm = '';
    $('#myModal').foundation('reveal', 'open');
  }

  $scope.updateAccount = function () {
    if (!$scope.agree) { alert ('You must agree to the terms before updating your account.'); return; }     // Must agree to terms before creating an account

    $scope.lengthError = false;
    $scope.newPwd = $scope.newPwdConfirm = '';
    $scope.userName =
      $scope.userPwd =
      $scope.userPwdConfirm = '';
    $('#pwd-update-modal').foundation('reveal', 'open');
  }  

  $scope.help = function () {
    var note = 'If you are experiencing issues with your account, I will do my best to be ';
    note += 'of assistance.  Please contact me at:  techwrite88 at gmail.com and provide as ';
    note += 'many details of the issue as you can.'
    alert (note);
  }

  keyService.saveLogin ('demo');  // Default security key, simple authentication to put in the header of all API requests

});

// Creating an export button:
// http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
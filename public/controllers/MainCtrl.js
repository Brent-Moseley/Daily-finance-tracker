// public/js/controllers/MainCtrl.js
app.controller('MainController', function($scope, keyService, $location) {

  $scope.tagline = 'Login with your user name below, or use "demo123" (same for password) to see sample data.';
  $scope.viewStartDate = 'none';
  $scope.viewEndDate = 'none';
  $scope.login = '';
  $scope.loading = false;

  $scope.attemptlogin = function (userName, pwd) {
    if (!$scope.agree) return;     // Must agree to terms before loggin in
    $scope.loading = true;
    console.log ('logging in as: ' + userName);
    $scope.login = userName;
    keyService.login (userName, pwd, function (response) {
      if (typeof response === 'string' && response == 'false') {
        alert ("Unable to login, check your user name and password again.");
      }
      else {
        // login was successful, response from the service is the key for this user
        keyService.saveKey(response); 
        keyService.saveLogin($scope.login);
        $location.url('/items');  // redundant if called from the home page, but just in case is used elsewhere
      }
    });

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
    $scope.lengthError = false;
    $scope.duplicateError = false; 
    $scope.userName =
      $scope.userPwd =
      $scope.userPwdConfirm = '';
    $('#myModal').foundation('reveal', 'open');
  }

  $scope.lengthError = false;
  $scope.duplicateError = false;
  $scope.confirmAccount = function () {
    var userPwdConfirm = $scope.userPwdConfirm || '';
    var userPwd = $scope.userPwd || '';
    var userName = $scope.userName || '';
    if (userPwd.length < 6 || userName.length < 6) $scope.lengthError = true;
    else $scope.lengthError = false;
    if (!$scope.pass()) return;     // Check all conditions required for creating the account
    console.log ('Creating account:' + userName + userPwd);

    keyService.confirmUserUnique (userName, function (result) {
      if (result && result == 'false') {
        var key = $scope.generateKey();
        var message = 'Your new account has been created! Please keep your user ID and password safe,';
        message += 'as password reset can take up to two weeks if you lose it.  Your login will be the only way to access your ';
        message += 'daily expense information.';
        alert (message);

        keyService.createAccount (userName, userPwd, key, function (data) {
          console.log ('New User create return message: ' + data);
          $('#myModal').foundation('reveal', 'close');
        });       
      }
      else {
        // Service returned a result that says the requested user already exists.
        $scope.duplicateError = true;
      }
    });
  }

  $scope.pass = function () {
    var userPwdConfirm = $scope.userPwdConfirm;
    var userPwd = $scope.userPwd;
    var userName = $scope.userName;
    var result = (typeof userName != "undefined" &&
           typeof userPwd != "undefined" &&
           userName.length >= 6 &&
           userPwd.length >= 6 && 
           typeof userPwdConfirm != "undefined" && 
           userPwdConfirm.length != 0 && 
           userPwd == userPwdConfirm);
    return result;
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
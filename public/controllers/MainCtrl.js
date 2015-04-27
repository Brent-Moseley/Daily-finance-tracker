// public/js/controllers/MainCtrl.js
app.controller('MainController', function($scope, keyService, $location) {

  $scope.tagline = 'Enter your security key below, or "demo" to see sample data.';
  $scope.viewStartDate = 'none';
  $scope.viewEndDate = 'none';
  $scope.login = '';

  $scope.login = function (userName, pwd) {
    if (!$scope.agree) return;
    console.log ('logging in as: ' + userName);
    $scope.login = userName;
    keyService.login (userName, pwd, function (response) {
      if (typeof response === 'string' && response == 'false') {
        alert ("Unable to login, check your user name and password again.");
      }
      else {
        // login was successful, response is the key for this user
        keyService.saveKey(response); 
        keyService.saveLogin($scope.login);
        $location.url('/items');  // redundant if called from the home page, but just in case is used elsewhere
      }
    });

  }

  $scope.generateKey = function () {
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
    if (!$scope.pass()) return;
    console.log ('Creating account:' + userName + userPwd);

    keyService.confirmUserUnique (userName, function (result) {
      debugger;
      if (result && result == 'false') {
        var key = $scope.generateKey();
        var message = 'Your new account has been created. Please keep your user ID and password safe,';
        message += 'as there is no way to retrieve this if you lose it.  Your login will be the only way to access your ';
        message += 'daily expense information.';
        alert (message);

        keyService.createAccount (userName, userPwd, key, function (data) {
          debugger;
          console.log ('New User create return message: ' + data);
          // date: "/ POST OK" indicates success.  Perhaps add some error checking, though
          // not sure what we could do in the event of an error.
          $('#myModal').foundation('reveal', 'close');

          // $scope.login
        });       
      }
      else {
        $scope.duplicateError = true;
      }
    });

    
  }

  $scope.pass = function () {
    var userPwdConfirm = $scope.userPwdConfirm;
    var userPwd = $scope.userPwd;
    var userName = $scope.userName;
    console.log (userName + userPwd + userPwdConfirm);
    var result = (typeof userName != "undefined" &&
           typeof userPwd != "undefined" &&
           userName.length >= 6 &&
           userPwd.length >= 6 && 
           typeof userPwdConfirm != "undefined" && 
           userPwdConfirm.length != 0 && 
           userPwd == userPwdConfirm);
    return result;
  }

  keyService.saveLogin ('demo');  // Default security key, simple authentication to put in the header of all API requests

});

// Creating an export button:
// http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
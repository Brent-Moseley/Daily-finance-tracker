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

  $scope.duplicateError = false;
  $scope.updateError = false;
  $scope.confirmPwdChange = function() {
    console.log ('in confirm pwd change');
    var newPwdConfirm = $scope.newPwdConfirm || '';
    var userPwd = $scope.userPwd || '';
    var userName = $scope.userName || '';
    var newPwd = $scope.newPwd || '';
    if (newPwd.length < 6 || newPwdConfirm.length < 6) $scope.lengthError = true;
    else $scope.lengthError = false;
    if (!$scope.passPwdUpdate()) return;     // Check all conditions required for creating the account
    console.log ('updating account:' + userName + newPwd);

   keyService.updateAccount (userName, userPwd, newPwd, function (data) {
    if (data != 'false') {
      console.log ('user update return message: ' + data);
      var message = 'Your account has been updated! Please keep your user ID and password safe,';
      message += 'as password reset can take up to two weeks if you lose it.  Your login will be the only way to access your ';
      message += 'daily expense information.';
          alert (message);
      $('#pwd-update-modal').foundation('reveal', 'close');
    }
    else {
      console.log ('Update err');
      // Service returned a result that says the requested user already exists.
      $scope.updateError = true;
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

  $scope.passPwdUpdate = function () {
    var newPwdConfirm = $scope.newPwdConfirm;
    var userPwd = $scope.userPwd;
    var userName = $scope.userName;
    var newPwd = $scope.newPwd;
    var result = (typeof userName != "undefined" &&
           typeof userPwd != "undefined" &&
           typeof newPwd != "undefined" &&
           userName.length >= 6 &&
           userPwd.length >= 6 && 
           newPwd.length >= 6 &&
           typeof newPwdConfirm != "undefined" && 
           newPwdConfirm.length != 0 && 
           newPwd == newPwdConfirm);
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
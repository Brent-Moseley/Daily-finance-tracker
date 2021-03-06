app.directive ('accountCreationModal', ['keyService', function (keyService) {
  return {
    restrict: 'E',
    templateUrl:'/directives/partials/account-create.html',

    link: function(scope, elem, attrs){
      scope.lengthError = false;
      scope.duplicateError = false;
      scope.confirmAccount = function () {
        var userPwdConfirm = scope.userPwdConfirm || '';
        var userPwd = scope.userPwd || '';
        var userName = scope.userName || '';
        if (userPwd.length < 6 || userName.length < 6) scope.lengthError = true;
        else scope.lengthError = false;
        if (!scope.pass()) return;     // Check all conditions required for creating the account
        console.log ('Creating account:' + userName + userPwd);

        keyService.confirmUserUnique (userName, function (result) {
          if (result && result == 'false') {
            var key = scope.generateKey();
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
            scope.duplicateError = true;
          }
        });
      }

      scope.pass = function () {
        var userPwdConfirm = scope.userPwdConfirm;
        var userPwd = scope.userPwd;
        var userName = scope.userName;
        var result = (typeof userName != "undefined" &&
               typeof userPwd != "undefined" &&
               userName.length >= 6 &&
               userPwd.length >= 6 && 
               typeof userPwdConfirm != "undefined" && 
               userPwdConfirm.length != 0 && 
               userPwd == userPwdConfirm);
        return result;
      }      
    }
  }
  }]);

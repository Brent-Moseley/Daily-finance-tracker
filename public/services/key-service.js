// public/js/services/key-service.js
app.factory('keyService', ['$http', '$q', function($http, $q) {
  var key = '';
  var login = '';
  return {
    saveKey : function(newKey) {
      key = newKey;
    },

    getKey : function () {
      return key;
    },

    saveLogin : function(newLogin) {
      login = newLogin;
    },

    getLogin : function () {
      return login;
    },    

    confirmUserUnique : function (userName, callback) {
      return $http({
        method: 'GET',
        url: '/api/users?user_name=' + userName
      })
        .then(function(response) {
          if (typeof response.data === 'string') {
            callback(response.data);
          } else {
            // invalid response
            return $q.reject(response.data);
          }

          }, function(response) {
            // something went wrong
            return $q.reject(response.data);
          });      
    },

    login : function (userName, pwd, callback) {
      return $http({
        method: 'GET',
        url: '/api/users?user_name=' + userName,
        headers: {'pwd': pwd}     // put the password in the header for security reasons
      })
        .then(function(response) {
          if (response) {
            // returns the user ID / key if successful
            if (typeof response.data === 'string' || typeof response.data === 'object')
              callback(response.data);
          } else {
            // invalid response
            return $q.reject(response.data);
          }

          }, function(response) {
            // something went wrong
            return $q.reject(response.data);
          });      
    },    

    createAllCategories : function (key) {
      var categories = ['Auto', 'Bills', 'Career', 'Clothes', 'Dates', 'Debt', 'Education', 'Fun', 'Gas', 'Giving','Grocery', 'Home', 'Insurance', 'Medical', 'Mortgage', 'Misc', 'Phone', 'Rent', 'Restaurant','Savings', 'Training', 'Utilities' ];
      angular.forEach (categories, function (cat) {
        var data = JSON.stringify ({'name': cat, 'limit': 0});
        $http({
          method: 'POST',
          url: '/api/categories',
          data: data,
          headers: {'key': key}
        });  // Not waiting on a response, just hitting all posts at once.... 
      });

    },

    createAccount : function (userName, userPwd, key, callback) {
      console.log ('in user create: ' + userName);
      var keySave = key;
      var createCategories = this.createAllCategories;
      var data = JSON.stringify ({
        'userName': userName, 
        'pwd': userPwd,
        'key': key
      });
      return $http({
        method: 'POST',
        url: '/api/users',
        data: data
      })
        .then(function(response) {
          if (typeof response.data != undefined) {
          // TODO
          // Create set of categories for new user.
            
            createCategories (keySave);
            callback(response.data);
          } else {
            // invalid response
            return $q.reject(response.data);
          }

          }, function(response) {
            // something went wrong
            return $q.reject(response.data);
          });                
    },

    updateAccount : function (userName, userPwd, newPwd, callback) {
      console.log ('in user update: ' + userName);
      var data = JSON.stringify ({
        'userName': userName, 
        'pwd': userPwd,
        'newPwd': newPwd
      });
      return $http({
        method: 'PUT',
        url: '/api/users',
        data: data
      })
        .then(function(response) {
          if (typeof response.data != undefined) {
            callback(response.data);
          } else {
            // invalid response
            return $q.reject(response.data);
          }

          }, function(response) {
            // something went wrong
            return $q.reject(response.data);
          });                
    }

  };
}]);

// public/js/services/key-service.js
app.factory('keyService', function() {
  var key = '';
  return {
    // call to get all items
    save : function(newKey) {
      key = newKey;
    },

    get : function () {
      return key;
    },

    confirmUserUnique : function (userName, callback) {
      return $http({
        method: 'GET',
        url: '/api/users?' + userName
      })
      //.get('/api/items')
        .then(function(response) {
          if (typeof response.data === 'object') {
            angular.forEach (response.data, function (item) {
              // convert each date to a Date object
              //debugger;
              item.date = $filter('date')(item.date.substring(0, 10), 'MM/dd/yyyy', 'UTC');

              //item.date = new Date(item.date);
            });
            return response.data;
          } else {
            // invalid response
            return $q.reject(response.data);
          }

          }, function(response) {
            // something went wrong
            return $q.reject(response.data);
          });      
    },

    createAccount : function (userName, userPwd, key, callback) {

    }
  };
});

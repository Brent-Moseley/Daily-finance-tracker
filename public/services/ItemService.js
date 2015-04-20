// public/js/services/ItemService.js
app.factory('itemService', ['$http', '$filter', function($http, $filter, $q) {
    // the $q service gives you promises in an Angular app:  
    //   https://docs.angularjs.org/api/ng/service/$q
    //   Promises are just another way to do callbacks, via chaining.
    //   Celebrate!!
    return {
      // call to get all items
      get : function() {
        console.log ('in get');
        return $http.get('/api/items')
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


        // call to POST and create a new item
        create : function(itemData, expenseDate) {
          console.log ('in create');
          console.log (expenseDate);
          // Note this is only creating a new item (line) which
          //  will then be updated in real time when the user changes
          //  drop down options, adds a note, etc. 
          var data = JSON.stringify ({'cost': itemData, 'date': expenseDate});
          return $http.post('/api/items', data);
        },

        // call to UPDATE an item
        update : function(id, data) {
          console.log (' in service update:');
          // the data that comes in is a modification of the original
          // item object that was loaded.  Delete what should not be sent
          // to the back end. 
          delete data['_id']; 
          delete data['__v'];   // This is like row version
          delete data['$$hashKey'];
          console.log (data);
          //return $http.update('/api/items/&id=' + id);
          return $http({
            url: '/api/items/&id=' + id,
            method: "PUT",
            data: {
              'data': data
            },
            headers: {'Content-Type':'application/json'}
          }).success(function (data, status, headers, config) {
            console.log ('Successful Update:');
            console.log ('  Data:');
            console.log(data);
            console.log ('  Status:');
            console.log(status);
            console.log ('  Headers:');
            console.log(headers);
          }).error(function (data, status, headers, config) {
            console.log('Update failed');
            console.log ('  Status:');
            console.log(status);
            console.log ('  Headers:');
            console.log(headers);            
          });            
        },        

        // call to DELETE an item
        delete : function(id) {
          console.log (' in service delete');
          return $http.delete('/api/items/&id=' + id);
        }
    }       

}]);

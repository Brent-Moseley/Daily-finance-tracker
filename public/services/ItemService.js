// public/js/services/ItemService.js
app.factory('itemService', ['$http', '$filter', function($http, $filter, $q) {
    // the $q service gives you promises in an Angular app:  
    //   https://docs.angularjs.org/api/ng/service/$q
    //   Promises are just another way to do callbacks, via chaining.
    //   Celebrate!!
    //
    //   Setting up HTTP headers:  https://docs.angularjs.org/api/ng/service/$http
    // $http({
    //             method: method,
    //             url: url,
    //             data: data
    //         })
    // Mongoose queries:  http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/

    return {
      // call to get all items
      get : function(key, dateFilter, startDate, endDate) {
        // http://stackoverflow.com/questions/4024271/rest-api-best-practices-where-to-put-parameters
        console.log ('in get: ' + key);
        var query = '';
        if (dateFilter)
          query = 'start_date=' + startDate.replace(/\//g, "-") +
                  '&end_date=' + endDate.replace(/\//g, "-");
        return $http({
          method: 'GET',
          url: '/api/items?' + query,
          headers: {'key': key}
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


        // call to POST and create a new item
        create : function(itemData, expenseDate, key) {
          console.log ('in create: ' + key);
          console.log (expenseDate);
          // Note this is only creating a new item (line) which
          //  will then be updated in real time when the user changes
          //  drop down options, adds a note, etc. 
          var data = JSON.stringify ({'cost': itemData, 'date': expenseDate});
          return $http({
            method: 'POST',
            url: '/api/items',
            data: data,
            headers: {'key': key}
          });
          //$http.post('/api/items', data);
        },

        // call to UPDATE an item
        update : function(id, data, key) {
          console.log (' in service update:');
          // the data that comes in is a modification of the original
          // item object that was loaded.  Delete what should not be sent
          // to the back end. 
          delete data['_id']; 
          delete data['__v'];   // This is like row version
          delete data['$$hashKey'];
          console.log (data);
          //return $http.update('/api/items/&id=' + id);
          // Demonstrates the proper way to do this with the key in the header, though
          // this is not technically necessary here since we are updating by ID
          return $http({
            url: '/api/items/&id=' + id,
            method: "PUT",
            data: {
              'data': data
            },
            headers: {'Content-Type':'application/json', 'key': key}
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
        delete : function(id, key) {
          console.log (' in service delete');
          // Demonstrates the proper way to do this with the key in the header, though
          // this is not technically necessary here since we are deleted by ID
          return $http({
            url: '/api/items/&id=' + id,
            method: "DELETE",
            headers: {'key': key}
          });
          //return $http.delete('/api/items/&id=' + id);
        }
    }       

}]);

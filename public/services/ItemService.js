// public/js/services/ItemService.js
app.factory('itemService', ['$http', '$filter', function($http, $filter, $q) {
    // the $q service gives you promises in an Angular app:  
    //   https://docs.angularjs.org/api/ng/service/$q
    //   Promises are just another way to do callbacks, via chaining.
    //
    return {
      getCategories: function (key) {
        return $http({
          method: 'GET',
          url: '/api/categories',
          headers: {'key': key}
        })
          .then(function(response) {
            if (typeof response.data === 'object') {
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

      createCategory : function (key, name) {
        var data = JSON.stringify ({'name': name, 'limit': 0});
        return $http({
          method: 'POST',
          url: '/api/categories',
          data: data,
          headers: {'key': key}
        })
          .then(function(response) {
            debugger;
            if (typeof response.data != undefined) {
              return(response.data);
            } else {
              // invalid response
              return $q.reject(response.data);
            }

            }, function(response) {
              // something went wrong
              return $q.reject(response.data);
            });        
      },      

      updateCategory: function (data, key, callback) {
        //debugger;
        if (data._id == 0) {
          // new Category record
          console.log ('in create category for: ' + key);
          console.log (data);
          var saveDate = data;
          // Note this is only creating a new item with today's date and the amount,
          //  will then be updated in real time when the user changes
          //  drop down options, adds a note, etc. 
          var payload = {'name': data.name, 'limit': data.limit, 'key': key};
          return $http({
            method: 'POST',
            url: '/api/categories',
            data: payload,
            headers: {'key': key}
          })
            .then(function(response) {
            if (typeof response === 'object') {
              //debugger;
              console.log ('Successful new category, new id: ' + response.data);
              return response.data;
            } else {
              // invalid response
              return $q.reject(response.data);
            };          
          });
        }
        else {
          // update existing Category record
         console.log (' in category update:');
          // the data that comes in is a modification of the original
          // item object that was loaded.  Delete what should not be sent
          // to the back end.
          var payload = JSON.stringify ({'name': data.name, 'limit': data.limit, 'key': key});

          console.log (data);
          // Putting user key in the header
          // is not necessary here since we are updating by ID
          return $http({
            url: '/api/categories/&id=' + data._id,
            method: "PUT",
            data: {
              'data': payload
            },
            headers: {'Content-Type':'application/json', 'key': key}
          })          
        }
      },

      get : function(key, dateFilter, startDate, endDate) {
        var query = '';
        if (dateFilter)
          query = 'start_date=' + startDate.replace(/\//g, "-") +
                  '&end_date=' + endDate.replace(/\//g, "-");
        return $http({
          method: 'GET',
          url: '/api/items?' + query,
          headers: {'key': key}
        })
          .then(function(response) {
            if (typeof response.data === 'object') {
              angular.forEach (response.data, function (item) {
                // convert each date to the format below, using Angular date filter
                item.date = $filter('date')(item.date.substring(0, 10), 'MM/dd/yyyy', 'UTC');
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
          // Note this is only creating a new item with today's date and the amount,
          //  will then be updated in real time when the user changes
          //  drop down options, adds a note, etc. 
          var data = JSON.stringify ({'cost': itemData, 'date': expenseDate});
          return $http({
            method: 'POST',
            url: '/api/items',
            data: data,
            headers: {'key': key}
          });
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
          // Putting user key in the header
          // is not necessary here since we are updating by ID
          return $http({
            url: '/api/items/&id=' + id,
            method: "PUT",
            data: {
              'data': data
            },
            headers: {'Content-Type':'application/json', 'key': key}
          }).success(function (data, status, headers, config) {
            console.log ('Successful Update:');
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
          return $http({
            url: '/api/items/&id=' + id,
            method: "DELETE",
            headers: {'key': key}
          });
        },

        // call to DELETE a category
        deleteCat : function(id, key) {
          console.log (' in service delete category ' + id + ' ' + key);
          return $http({
            url: '/api/categories/&id=' + id,
            method: "DELETE",
            headers: {'key': key}
          })
          .then(function(response) {
            var numLeft = parseInt(response.data);
            return numLeft;
          });         
          // Need .then to handle response.  If fail, tell user they must find those items currently
          // under the category and re-assign.
          // Otherwise, if success, the category has been deleted.
        }       
    }       
}]);


// ******** Notes *********
// Mongoose queries:  http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
// http://stackoverflow.com/questions/4024271/rest-api-best-practices-where-to-put-parameters

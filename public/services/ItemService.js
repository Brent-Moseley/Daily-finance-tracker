// public/js/services/ItemService.js
app.factory('itemService', ['$http', '$filter', function($http, $filter, $q) {
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

      updateCategory: function (data, key) {
        if (data._id == 0) {
          // new Category record
          var saveDate = data;
          var payload = {'name': data.name, 'limit': data.limit, 'key': key};
          return $http({
            method: 'POST',
            url: '/api/categories',
            data: payload,
            headers: {'key': key}
          })
            .then(function(response) {
            if (typeof response === 'object') {
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
          var payload = JSON.stringify ({'name': data.name, 'limit': data.limit, 'key': key});

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
          delete data['_id']; 
          delete data['__v'];
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
          }).error(function (data, status, headers, config) {
            console.log('Update of item failed');
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
          return $http({
            url: '/api/categories/&id=' + id,
            method: "DELETE",
            headers: {'key': key}
          })
          .then(function(response) {
            var numLeft = parseInt(response.data);
            return numLeft;
          });         
        }       
    }       
}]);

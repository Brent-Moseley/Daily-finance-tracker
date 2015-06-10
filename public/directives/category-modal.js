app.directive ('categoryModal', ['itemService', function (itemService) {
  return {
    restrict: 'E',
    templateUrl:'/directives/partials/category-modal.html',

    link: function(scope, elem, attrs){

      scope.loadedCategories = [];  
      scope.totals = [];
      scope.openCategoryPopup = function () {
        scope.loadingCategories = scope.recalcCategories = true;
        var now = new Date();
     
        var startDate = moment([now.getFullYear(), now.getMonth() - 1]);  // remove -1

        // Clone the value before .endOf()
        var endDate = moment(startDate).endOf('month');

        startDate = startDate.format('L');
        endDate = endDate.format('L');
        
        scope.totals = scope.loadedCategories.reduce(function(o, v, i) {
          o[v.name] = 0;
          return o;
        }, {}); 
        // reduce down set of expense items documents to those within the current month
        // set up category total array
        // go through all transactions, adding costs into each totals "bucket"
        itemService.get(scope.key, true, startDate, endDate)
          .then(function(data) {
            // promise fulfilled
            if (data) {
              scope.catItems = data;
              console.log ('data read:');
              console.log (data);

              // Create summations for each category in totals
              angular.forEach (data, function (item) {
                scope.totals[item.category] += (parseFloat(item.cost) * 100);
              });
              angular.forEach (scope.loadedCategories, function (total) {
                scope.totals[total.name] = scope.totals[total.name] / 100;
              });
              console.log ('Totals:');
              console.log (scope.totals);

              scope.recalculate();
              if (!$('#categoryModal').hasClass('open')) $('#categoryModal').foundation('reveal', 'open');
              scope.loadingCategories = scope.recalcCategories = false;
            }
          });
      }

      scope.recalculate = function () {
        scope.modalCategories = [];

        angular.forEach (scope.loadedCategories, function (cat) {
          // Go through each default category, see if you can find current category in the object
          // returned from the back end.  If so, push onto the array its data, otherwise,
          // make defaults.
          var total = scope.totals[cat.name];
          var limit = 0;
          var css = 'green';    // Default to green

          limit = cat.limit;
          var percentLeft = (limit - total) / limit * 100;
          if (!cat.limit || cat.limit == 0) percentLeft = 100;
          if (percentLeft >= 25.01) css = 'green';   // in case of multiple limits for one category - perhaps not needed anymore
          if (percentLeft < 25.01) css = 'yellow'; 
          if (percentLeft < 10.01) css = 'red';
          scope.modalCategories.push ({
            name: cat.name,
            currentTotal: total,
            highlight: css,
            limit: limit,
            id: cat._id
          });
        });
      }
      
      scope.updateCategory = function (category) {
        itemService.updateCategory ({
          name: category.name,
          _id: category.id,
          limit: category.limit
        }, scope.key)
        .then (function (data) {
          // returns the new ID, if there is one.
          console.log (' newly assigned ID: ' + data);
          if (data) category.id = data;
          angular.forEach (scope.loadedCategories, function (cat) {
            if (cat.name == category.name) cat.limit = category.limit;
          });
          scope.recalculate ();
        });
      }

      scope.closeCategoryPopup = function () {
        $('#categoryModal').foundation('reveal', 'close');
      }      

    }  
}
}]);

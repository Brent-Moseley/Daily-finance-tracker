// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService, keyService, $timeout, $route) {
  $scope.tagline = 'Enter your daily expenses as you go about your day.';
  // Eventually create a user specific Mongo document for custom categories
  $scope.categories = ['Auto', 'Bills', 'Career', 'Cloths', 'Dates', 'Debt', 'Education', 'Fun', 'Gas', 'Giving','Grocery', 'Home', 'Insurance', 'Medical', 'Mortgage', 'Misc', 'Phone', 'Rent', 'Restaurant','Savings', 'Training', 'Utilities' ];
  $scope.viewTotal = $scope.catTotal = 0;
  $scope.selectedCat = 'none';
  $scope.key = keyService.getKey();
  $scope.login = keyService.getLogin();
  $scope.dateOptions = {
      // options -  http://api.jqueryui.com/datepicker/#option-minDate
      // minDate: 0,
      // maxDate: "+4M",
      // buttonImage: "datepicker.gif",
      //buttonImageOnly: true,
      showOn: "focus"
  };

  $scope.getAll = function() {
    itemService.get($scope.key, $scope.dateFilterEnabled, $scope.startDate, $scope.endDate)
      .then(function(data) {
        // promise fulfilled
        if (data) {
          $scope.items = data;
          console.log ('data read:');
          console.log (data);
          updatePageTotals (data);
          $scope.login = keyService.getLogin();   // get the name of current user
        }
        $scope.newOne = '';
      }, function(err) {
        console.log (' Error in get');
        console.log(err);
      });
      // Perhaps add some error handling here.
  }
  
  $scope.openCategoryPopup = function () {
    $scope.modalCategories = [];
    itemService.getCategories ($scope.key)
      .then(function (data) {
        angular.forEach ($scope.categories, function (cat) {
          // Go through each category, see if you can find current category in the object
          // returned from the back end.  If so, push onto the array its data, otherwise,
          // make defaults.
          var total = 
              limit = 
              id = 0;

          angular.forEach (data, function (datacat) {
            if (datacat.name == cat) {
              total = datacat.limit;   // need to have the back end create these
              limit = datacat.limit;
              id = datacat._id;
            }
          });
          $scope.modalCategories.push ({
            name: cat,
            currentTotal: total,
            highlight: 'green',
            limit: limit,
            id: id
          });
        });
        console.log ('Pushing this:');
        console.log ($scope.modalCategories);
        $('#categoryModal').foundation('reveal', 'open');
      }, function (err) {
        console.log ('Error in getting category data:' + err);
      });
  }

  $scope.updateCategory = function (category) {
    //debugger;
    itemService.updateCategory ({
      name: category.name,
      _id: category.id,
      limit: category.limit
    }, $scope.key)
    .then (function (data) {
      // returns the new ID, if there is one.
      console.log (' newly assigned ID: ' + data);
      if (data) category.id = data;
    });
  }

  function updatePageTotals (data) {
    var total = 0;
    angular.forEach (data, function (item) {
      total += (parseFloat(item.cost) * 100);
    });
    $scope.viewTotal = total / 100;
    $scope.calculateCatTotal();
  } 

  $scope.addOne = function (newOne) {
  	console.log ('in add one / new item');
    itemService.create (newOne, moment().format("MM-DD-YYYY"), $scope.key)
      .then(function(data) {
        $scope.getAll();
        $scope.calculateCatTotal($scope.selectedCat);
      }, function(err) {
        console.log (' Error in add One');
        console.log(err);
      });
  }

  $scope.remove = function (id) {
    console.log ('removing: ' + id);
    itemService.delete (id, $scope.key)
      .then(function(data) {
        $scope.getAll();
        $scope.calculateCatTotal($scope.selectedCat);
      }, function(err) {
        console.log (' Error in remove');
        console.log(err);
      });
  }


  $scope.timerUpdateNote = false;
  $scope.updatingCost = false;
  $scope.updateNote = function (id, index, isCost) {
    if ($scope.updatingCost && !isCost) updatePageTotals ($scope.items);  // Just went from updating cost to
                                                            // updating notes, re-calculate page total
    $scope.updatingCost = isCost;
    if ($scope.timerUpdateNote == false) {
      console.log ('Scheduling timeout for save');
      $scope.timerUpdateNote = true;
      // schedule a save for data due to note field edits, avoids constantly hitting server for updates
      // on every key stroke
      $timeout( function() {
        if ($scope.updatingCost) updatePageTotals($scope.items);
        $scope.update (id, $scope.items[index]); $scope.timerUpdateNote = false;
      }, 1000);

    }
    else console.log ('Not yet, timeout already scheduled');
  }

  $scope.update = function (id, data) {
    console.log ('request to update: ' + id);
    console.log (data);
    // Use angular.copy helper method below to create a deep copy of the
    //   data item before updating, we are going to remove the
    //   row version and a couple other properties from the item first.
    itemService.update (id, angular.copy(data), $scope.key)
      .then(function(data) {
        console.log ('Update completed');
        $scope.calculateCatTotal($scope.selectedCat);
      }, function(err) {
        console.log (' Error in update');
        console.log(err);
      });
  }

  $scope.dateFilter = function (startDate, endDate) {
    // Put the date filter parameters on the parent scope, since the reload is going
    // to reset this controller.
    $scope.$parent.dateFilterEnabled = true;
    $scope.$parent.startDate = $scope.$parent.viewStartDate = startDate;
    $scope.$parent.endDate = $scope.$parent.viewEndDate = endDate;

    $timeout( function(){ $route.reload(); }, 100);
  }

  $scope.calculateCatTotal = function (selectedCat) {
    var total = 0;
    angular.forEach ($scope.items, function (item) {
      if (item.category == selectedCat) total += (parseFloat(item.cost) * 100);
    });
    $scope.catTotal = total / 100;
  }

  $scope.getAll();  // Show items when viewing first time

});

//  Get in the zone, fast flow coding like spoken communication!!
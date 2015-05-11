// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService, keyService, $timeout, $route) {
  $scope.tagline = 'Enter your daily expenses as you go about your day.';
  // Eventually create a user specific Mongo document for custom categories
  $scope.categories = ['Auto', 'Bills', 'Career', 'Cloths', 'Dates', 'Debt', 'Education', 'Fun', 'Gas', 'Giving','Grocery', 'Home', 'Insurance', 'Medical', 'Mortgage', 'Misc', 'Phone', 'Rent', 'Restaurant','Savings', 'Training', 'Utilities' ];
  $scope.viewTotal = $scope.catTotal = 0;
  $scope.selectedCat = 'none';
  $scope.key = keyService.getKey();
  $scope.login = keyService.getLogin();
  $scope.loadingAdd = false;
  $scope.loadingCategories = false;
  $scope.recalcCategories = false;
  $scope.updatingDates = false;
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
  
  // Initially, this is always defined as a monthly amount for the current month.
  // There will be a Category Limits button below the category drop down.
  // Clicking this will bring up the Category popup.  Here will be a listing of all
  // categories, the current monthly total for each (query the backend for these), and
  // this pre-defined limit.  The total will appear via this color theme:  Green: OK,
  // yellow only 25% left, red 10% left or less.  User can then change their monthly budget
  // limits.  
  $scope.loadedCategories = [];  
  $scope.totals = [];
  $scope.openCategoryPopup = function () {
    $scope.loadingCategories = $scope.recalcCategories = true;
    var now = new Date();
 
    var startDate = moment([now.getFullYear(), now.getMonth()]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    startDate = startDate.format('L');
    endDate = endDate.format('L');
    
    $scope.totals = $scope.categories.reduce(function(o, v, i) {
      o[v] = 0;
      return o;
    }, {}); 
    // reduce down set of expense items documents to those within the current month
    // set up category total array
    // go through all transactions, adding costs into each array "bucket"
    itemService.get($scope.key, true, startDate, endDate)
      .then(function(data) {
        // promise fulfilled
        if (data) {
          $scope.catItems = data;
          console.log ('data read:');
          console.log (data);

          // Create summations for each category in totals
          angular.forEach (data, function (item) {
            $scope.totals[item.category] += (parseFloat(item.cost) * 100);
          });
          angular.forEach ($scope.categories, function (total) {
            $scope.totals[total] = $scope.totals[total] / 100;
          });
          console.log ('Totals:');
          console.log ($scope.totals);

          itemService.getCategories ($scope.key)
            .then(function (data2) {
              $scope.loadedCategories = data2;
              console.log ('Categories came back as:');
              console.log (data2);

              $scope.recalculate();
              if (!$('#categoryModal').hasClass('open')) $('#categoryModal').foundation('reveal', 'open');
              $scope.loadingCategories = $scope.recalcCategories = false;
            }, function (err) {
              console.log ('Error in getting category data:' + err);
            });
        }
      });
  }

  $scope.recalculate = function () {
    console.log ('re-calculating');
    $scope.modalCategories = [];

    angular.forEach ($scope.categories, function (cat) {
      // Go through each category, see if you can find current category in the object
      // returned from the back end.  If so, push onto the array its data, otherwise,
      // make defaults.
      var total = $scope.totals[cat];
      var limit = 
          id = 0;
      var css = 'green';    // Default to green
          console.log ('Looking for category: ' + cat);

      angular.forEach ($scope.loadedCategories, function (datacat) {
        if (datacat.name == cat) {
          console.log ('   found, adding total:' + $scope.totals[datacat.name]);
          console.log ('   Adding limit of: ' + datacat.limit);
          limit = datacat.limit;
          var percentLeft = (limit - total) / limit * 100;
          if (percentLeft >= 25.01) css = 'green';   // in case of multiple limits for one category - an old bug.
          if (percentLeft < 25.01) css = 'yellow'; 
          if (percentLeft < 10.01) css = 'red';
          id = datacat._id;
        }
      });
      $scope.modalCategories.push ({
        name: cat,
        currentTotal: total,
        highlight: css,
        limit: limit,
        id: id
      });
    });
    console.log ('Pushing this:');
    console.log ($scope.modalCategories);
  }

  $scope.closeCategoryPopup = function () {
    $('#categoryModal').foundation('reveal', 'close');
  }

  $scope.updateCategory = function (category) {
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
    $scope.loadingAdd = true;
    itemService.create (newOne, moment().format("MM-DD-YYYY"), $scope.key)
      .then(function(data) {
        $scope.getAll();
        $scope.calculateCatTotal($scope.selectedCat);
        $scope.loadingAdd = false;
      }, function(err) {
        console.log (' Error in add One');
        console.log(err);
      });
  }

  $scope.remove = function (id) {
    console.log ('removing: ' + id);
    itemService.delete (id, $scope.key)
      .then(function(data) {
        $scope.closeDeletePopup();
        $scope.getAll();
        $scope.calculateCatTotal($scope.selectedCat);
      }, function(err) {
        console.log (' Error in remove');
        console.log(err);
      });
  }

  $scope.deleteItemNote = '';
  $scope.deleting = false;
  $scope.deleteId = 0;
  $scope.requestedDelete = function (note, id) {
    $scope.deleteItemNote = note;
    $scope.deleteId = id;
    $('#deleteModal').foundation('reveal', 'open');
  }

  $scope.confirmedDelete = function () {
    $scope.deleting = true;
    $scope.remove($scope.deleteId);
  }

  $scope.closeDeletePopup = function () {
    $scope.deleting = false;
    $('#deleteModal').foundation('reveal', 'close');
  }

  $scope.closeCategoryPopup = function () {
    $('#deleteModal').foundation('reveal', 'close');
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
    $scope.$parent.dateFilterEnabled = $scope.updatingDates = true;
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
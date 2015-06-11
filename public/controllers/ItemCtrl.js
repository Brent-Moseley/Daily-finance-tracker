// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService, keyService, $timeout, $route) {
  $scope.tagline = 'Enter your daily expenses as you go about your day.';
  $scope.viewTotal = $scope.catTotal = 0;
  $scope.selectedCat = 'none';
  $scope.key = keyService.getKey();
  $scope.login = keyService.getLogin();
  $scope.loadingAdd = false;
  $scope.loadingCategories = false;
  $scope.recalcCategories = false;
  $scope.updatingDates = false;
  $scope.mainTableLoading = false;
  $scope.dateOptions = {
      showOn: "focus"
  };

  $scope.getAll = function() {
    $scope.mainTableLoading = true;
    $scope.deletePos = {'display':'none'};
    $scope.addPos = {'display':'none'};
    $scope.deletePosBG = {'display':'none'};
    itemService.get($scope.key, $scope.dateFilterEnabled, $scope.startDate, $scope.endDate)
      .then(function(data) {
        if (data) {
          $scope.items = data;
          console.log ('data read:');
          console.log ($scope.items);
          updatePageTotals (data);
          $scope.mainTableLoading = false;
          $scope.login = keyService.getLogin();   // get the name of current user
        }
        $scope.newOne = '';
      }, function(err) {
        console.log (' Error in get');
        console.log(err);
      });
  }

  var createAllCategories = function (key) {
    keyService.createAllCategories (key);
  }

  $scope.calculateAllCatTotal = function () {
    itemService.getCategories ($scope.key)
      .then (function (dataCat) {
        $scope.loadedCategories = dataCat;
      });
  }  

  $scope.calculateCatTotal = function (selectedCat) {
    var total = 0;
    angular.forEach ($scope.items, function (item) {
      if (item.category == selectedCat) total += (parseFloat(item.cost) * 100);
    });
    $scope.catTotal = total / 100;
  }

  $scope.sortDirection = {date: -1, category: -1, cost: -1};
  $scope.columnSort = function (col) {
    $scope.sortDirection[col] *= -1;
    $scope.items = $scope.items.sort(function (a,b) {
      if (a[col] == b[col]) return 0;
      if ($scope.sortDirection[col] == 1)
        return a[col] < b[col] ? -1 : 1;
      else
        return a[col] > b[col] ? -1 : 1;
    });
  }

  $scope.columnSortNum = function (col) {
    $scope.sortDirection[col] *= -1;
    $scope.items = $scope.items.sort(function (a,b) {
      if (parseFloat(a[col]) == parseFloat(b[col])) return 0;
      if ($scope.sortDirection[col] == 1)
        return parseFloat(a[col]) < parseFloat(b[col]) ? -1 : 1;
      else
        return parseFloat(a[col]) > parseFloat(b[col]) ? -1 : 1;
    });
  }  
  
  function updatePageTotals (data) {
    var total = 0;
    angular.forEach (data, function (item) {
      total += (parseFloat(item.cost) * 100);
    });
    $scope.viewTotal = total / 100;
    $scope.calculateAllCatTotal();    // keep this function in the controller
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

  $scope.deleteItemNote = '';
  $scope.deleting = false;
  $scope.deleteId = 0;
  $scope.requestedDelete = function (note, id) {
    $scope.deleteItemNote = note;
    $scope.deleteId = id;
    $('#deleteModal').foundation('reveal', 'open');
  }

  $scope.timerUpdateNote = false;
  $scope.updatingCost = false;
  $scope.updateNote = function (id, index, isCost) {
    // Updates both Note and Cost columns.
    if ($scope.updatingCost && !isCost) updatePageTotals ($scope.items);  // Just went from updating cost to
                                                            // updating notes, re-calculate page total
    $scope.updatingCost = isCost;
    if ($scope.timerUpdateNote == false) {
      $scope.timerUpdateNote = true;
      // schedule a save for data due to note field edits, avoids constantly hitting server for updates
      // on every key stroke
      $timeout( function() {
        if ($scope.updatingCost) updatePageTotals($scope.items);
        $scope.update (id, $scope.items[index]); $scope.timerUpdateNote = false;
      }, 1000);

    }
  }

  $scope.update = function (id, data) {
    console.log ('request to update: ' + id);
    console.log (data);
    // Use angular.copy helper method below to create a deep copy of the
    //   data item before updating, we are going to remove the
    //   row version and a couple other properties from the item first.
    itemService.update (id, angular.copy(data), $scope.key)
      .then(function(data) {
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

  $scope.getAll();  // Show items when viewing first time

});

// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService, keyService, $timeout, $route) {
  $scope.tagline = 'Enter your daily expenses as you go about your day.';
  // Eventually create a user specific Mongo document for custom categories
  //$scope.categories = ['Auto', 'Bills', 'Career', 'Cloths', 'Dates', 'Debt', 'Education', 'Fun', 'Gas', 'Giving','Grocery', 'Home', 'Insurance', 'Medical', 'Mortgage', 'Misc', 'Phone', 'Rent', 'Restaurant','Savings', 'Training', 'Utilities' ];
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
      // options -  http://api.jqueryui.com/datepicker/#option-minDate
      // minDate: 0,
      // maxDate: "+4M",
      // buttonImage: "datepicker.gif",
      //buttonImageOnly: true,
      showOn: "focus"
  };

  $scope.getAll = function() {
    $scope.mainTableLoading = true;
    $scope.deletePos = {'display':'none'};
    $scope.addPos = {'display':'none'};
    $scope.deletePosBG = {'display':'none'};
    itemService.get($scope.key, $scope.dateFilterEnabled, $scope.startDate, $scope.endDate)
      .then(function(data) {
        // promise fulfilled
        if (data) {
          // $scope.items = data.sort(function (a,b) {
          //   if (a.category == b.category) return 0;
          //   console.log (a.category < b.category);
          //   return a.category < b.category ? -1 : 1;
          // });
          $scope.items = data;
          console.log ('data read:');
          console.log ($scope.items);
          //createAllCategories ($scope.key);
          updatePageTotals (data);
          $scope.mainTableLoading = false;
          $scope.login = keyService.getLogin();   // get the name of current user
        }
        $scope.newOne = '';
      }, function(err) {
        console.log (' Error in get');
        console.log(err);
      });
      // Perhaps add some error handling here.
  }

  var createAllCategories = function (key) {
    debugger;
    keyService.createAllCategories (key);
    debugger;
    // Wait for back end. 
  }

  $scope.sortDirection = {date: -1, category: -1, cost: -1};
  $scope.columnSort = function (col) {
    $scope.sortDirection[col] *= -1;
    $scope.items = $scope.items.sort(function (a,b) {
      if (a[col] == b[col]) return 0;
      //console.log (a.category < b.category);
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
      //console.log (a.category < b.category);
      if ($scope.sortDirection[col] == 1)
        return parseFloat(a[col]) < parseFloat(b[col]) ? -1 : 1;
      else
        return parseFloat(a[col]) > parseFloat(b[col]) ? -1 : 1;
    });

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
 
    var startDate = moment([now.getFullYear(), now.getMonth() - 1]);  // remove -1

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    startDate = startDate.format('L');
    endDate = endDate.format('L');
    
    $scope.totals = $scope.loadedCategories.reduce(function(o, v, i) {
      o[v.name] = 0;
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
            console.log ('  Adding to: ' + item.category);
          });
          angular.forEach ($scope.loadedCategories, function (total) {
            $scope.totals[total.name] = $scope.totals[total.name] / 100;
             console.log ('  Finalizing: ' + total.name);
          });
          console.log ('Totals:');
          console.log ($scope.totals);

          // itemService.getCategories ($scope.key)     // Unnecessary, already have these. 
          //   .then(function (data2) {
          //     $scope.loadedCategories = data2;
          //     console.log ('Categories came back as:');
          //     console.log (data2);

              $scope.recalculate();
              if (!$('#categoryModal').hasClass('open')) $('#categoryModal').foundation('reveal', 'open');
              $scope.loadingCategories = $scope.recalcCategories = false;
            // }, function (err) {
            //   console.log ('Error in getting category data:' + err);
            // });
        }
      });
  }

  $scope.recalculate = function () {
    console.log ('re-calculating');
    $scope.modalCategories = [];

    // TODO:
    // Need to re-write this algorithm:  instead of adding up totals from the items in the beginning,
    // simply make an object with properties being the name of each category loaded from the back end.
    // Then go through the entire list of items (which will be from just this month) adding up each item
    // into the appropriate category. 
    // Will need to do some refactoring in the near future to break this code up into smaller files and put
    // a lot more logic into the service. Also break up the routes.js on the back end up into feature based
    // folders.  Do same when I make directives for the UI. 
    // I will need a popup to take an input for adding a category, then a back-end call to add, then a category
    // popup reload.
    // Will also need to finish delete with a popup result message, then category popup reload. 
    console.log (' Creating modal categories from:');
    console.log ($scope.loadedCategories);
    angular.forEach ($scope.loadedCategories, function (cat) {
      //debugger;
      // Go through each default category, see if you can find current category in the object
      // returned from the back end.  If so, push onto the array its data, otherwise,
      // make defaults.
      var total = $scope.totals[cat.name];
      var limit = 0;
      var css = 'green';    // Default to green
      //     console.log ('Looking for category: ' + cat);

      // angular.forEach ($scope.loadedCategories, function (datacat) {
      //   if (datacat.name == cat) {
      console.log ('    adding total:' + total);
      console.log ('   Adding limit of: ' + cat.limit);
      limit = cat.limit;
      var percentLeft = (limit - total) / limit * 100;
      if (!cat.limit || cat.limit == 0) percentLeft = 100;
      if (percentLeft >= 25.01) css = 'green';   // in case of multiple limits for one category - an old bug.
      if (percentLeft < 25.01) css = 'yellow'; 
      if (percentLeft < 10.01) css = 'red';
        //}
      //});
      $scope.modalCategories.push ({
        name: cat.name,
        currentTotal: total,
        highlight: css,
        limit: limit,
        id: cat._id
      });
    });
    console.log ('Pushing this final:');
    console.log ($scope.modalCategories);
  }

  $scope.catNameAdd = '';
  $scope.adding = false;
  $scope.addSuccessMsg = '';
  $scope.addCategory = function (e) {
    $scope.deletePosBG = '';
    $scope.addSuccessMsg = '';
    $scope.closeText = 'Cancel';
    var posx = posy = 0;
    // Great article about mouse positioning:  http://www.quirksmode.org/js/events_properties.html 
    if (e.pageX || e.pageY)   {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY)  {
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    // posx and posy contain the mouse position relative to the document    
    var modalTop = $('#categoryModal').css('top')
    modalTop = modalTop.substring(0, modalTop.length-2);   // annoying position fix because relative to modal
    $scope.addPos = {'z-index': 10, 'top': posy - modalTop - 100, 'display':'block'};
    $scope.deletePosBG = {'z-index': 9, 'display':'block'};    
  }

  $scope.addCategoryConfirm = function (name) {
    if ($scope.addDupMsg.length > 0) return;
    itemService.createCategory ($scope.key, name)
      .then(function(data) {
        debugger;
        $scope.addSuccessMsg = 'Category successfully added.'
        $scope.closeText = 'Close';
      });
  }

  $scope.closeCategoryPopup = function () {
    $('#categoryModal').foundation('reveal', 'close');
  }

  $scope.checkCatDup = function (newCategory) {
    console.log ('Checking this: ' + newCategory);
    $scope.addDupMsg = '';
    angular.forEach ($scope.loadedCategories, function (cat) {
       if (cat.name == newCategory) $scope.addDupMsg = 'This category already exists, please create another.';
    });
  } 

  $scope.categoryId = 0;
  $scope.deleteErrorMsg = '';
  $scope.deletePosBG = '';
  $scope.deleteSuccessMsg = '';
  $scope.openCatDeleteConfirm = function (id, name, e) {
    // have clientX, clientY, offsetX, offsetY, pageX, pageY (seems to be absolute positioning), screenX, screenY (relative?)
    $scope.categoryId = id;
    $scope.deleteErrorMsg = '';
    $scope.deletePosBG = '';
    $scope.deleteSuccessMsg = '';
    $scope.deleteCategoryNote = name;
    $scope.closeText = 'Cancel';
    
    var posx = posy = 0;
    // #categoryModal.top
    // Great article about mouse positioning:  http://www.quirksmode.org/js/events_properties.html 
    if (e.pageX || e.pageY)   {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY)  {
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    // posx and posy contain the mouse position relative to the document    
    var modalTop = $('#categoryModal').css('top')
    modalTop = modalTop.substring(0, modalTop.length-2);   // annoying position fix because relative to modal
    $scope.deletePos = {'z-index': 10, 'top': posy - modalTop, 'display':'block'};
    $scope.deletePosBG = {'z-index': 9, 'display':'block'};
    //$scope.closeCategoryPopup();
    //$('#deleteCategoryModal').foundation('reveal', 'open');
  }

  $scope.closeCatAddPopup = function () {
    //$('#deleteCategoryModal').foundation('reveal', 'close');
    $scope.addPos = {'display':'none'};
    $scope.deletePosBG = {'display':'none'};
    itemService.getCategories ($scope.key)
      .then (function (dataCat) {
        debugger;
        $scope.loadedCategories = dataCat;
        $scope.openCategoryPopup();
      });    
  }  

  $scope.closeCatDeletePopup = function () {
    //$('#deleteCategoryModal').foundation('reveal', 'close');
    $scope.deletePos = {'display':'none'};
    $scope.deletePosBG = {'display':'none'};
    itemService.getCategories ($scope.key)
      .then (function (dataCat) {
        debugger;
        $scope.loadedCategories = dataCat;
        $scope.openCategoryPopup();
      });
  }

  $scope.removeCategory = function () {
    var id = $scope.categoryId;
    console.log ('removing category: ' + id + ' ' + $scope.deleteItemNote);

    itemService.deleteCat (id, $scope.key)
      .then(function(data) {
        debugger;
        if (data > 0) {
          $scope.deleteErrorMsg = data.toString() + ' items are assigned to this category. ';
          $scope.deleteErrorMsg += 'Please re-assign those items before deleting this category.';
          $scope.closeText = 'Close';
        }
        else {
          $scope.deleteSuccessMsg = 'Category successfully deleted.'
          $scope.closeText = 'Close';
          //$scope.closeCatDeletePopup();
          //$scope.openCategoryPopup();
        }
      });


    // $('#deleteCategoryModal').foundation('reveal', 'close');
    // itemService.deleteCat ($scope.categoryId, $scope.key)
    //   .then(function(data) {
    //     //$scope.closeCatDeletePopup();
    //     //$scope.getAll();
    //     console.log ('Return from delete category: ' + data);
    //     $scope.openCategoryPopup();  // Maybe
    //     $scope.calculateCatTotal($scope.selectedCat);
    //   }, function(err) {
    //     console.log(err.data);
    //     // if error, data will contain a message about how many Items need to be updated to
    //     // another category first.
    //   });    
  }  

  $scope.updateCategory = function (category) {
    itemService.updateCategory ({
      name: category.name,
      _id: category.id,
      limit: category.limit
    }, $scope.key)
    .then (function (data) {
      // returns the new ID, if there is one.
      console.log (' newly assigned ID: ' + data);   //???
      if (data) category.id = data;    /// Should never have this....
      angular.forEach ($scope.loadedCategories, function (cat) {
        if (cat.name == category.name) cat.limit = category.limit;
      });
      $scope.recalculate ();
    });
  }

  function updatePageTotals (data) {
    var total = 0;
    angular.forEach (data, function (item) {
      total += (parseFloat(item.cost) * 100);
    });
    $scope.viewTotal = total / 100;
    $scope.calculateAllCatTotal();
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
    //$('#deleteModal').css({'display' : 'block'});
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
    // Updates both Note and Cost columns.
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

  $scope.calculateAllCatTotal = function () {
    itemService.getCategories ($scope.key)
      .then (function (dataCat) {
        $scope.loadedCategories = dataCat;
      });
  }

  $scope.getAll();  // Show items when viewing first time

});

//  Get in the zone, fast flow coding like spoken communication!!
//
// Evidence
// I love coding and development!!
// The evidence is very strong, especially from the last year, but also the last 20
// that this is one of the top careers out there, and that this is the MOST lucrative, stable,
// rewarding career I can be doing, by far!!  It is WELL worth every hour of hard work I put into it.

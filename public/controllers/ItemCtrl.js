// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService, keyService, $timeout) {
  $scope.tagline = 'Enter your daily expenses as you go about your day.';
  $scope.categories = ['Auto', 'Bills', 'Career', 'Cloths', 'Dates', 'Debt', 'Education', 'Fun', 'Gas', 'Giving','Grocery', 'Home', 'Medical', 'Misc','Restaurant','Savings' ];
  $scope.key = keyService.get();
  console.log ('In item controller now, ' + $scope.key);
  $scope.dateOptions = {
      // options:  http://api.jqueryui.com/datepicker/#option-minDate
      // minDate: 0,
      // maxDate: "+4M",
      // buttonImage: "datepicker.gif",
      //buttonImageOnly: true,
      showOn: "focus"
  };

  $scope.getAll = function() {
    itemService.get($scope.key)
      .then(function(data) {
          // promise fulfilled
          if (data) {
            $scope.items = data;
            console.log ('data read:');
            console.log (data);
          }
          $scope.newOne = '';
      }, function(err) {
        console.log (' Error in get All');
        console.log(err); // Error
      });
      // Add some error handling here.
  }
  
  $scope.addOne = function (newOne) {
  	console.log ('in add One');
    //console.log (moment().format("MM-DD-YYYY"));
    itemService.create (newOne, moment().format("MM-DD-YYYY"), $scope.key)
      .then(function(data) {
        $scope.getAll();
      }, function(err) {
        console.log (' Error in add One');
        console.log(err); // Error: "It broke"
      });
  }

  $scope.remove = function (id) {
    console.log ('removing: ' + id);
    itemService.delete (id, $scope.key)
      .then(function(data) {
        $scope.getAll();
      }, function(err) {
        console.log (' Error in remove');
        console.log(err); // Error: "It broke"
      });
  }

  $scope.timerUpdateNote = false;
  $scope.updateNote = function (id, index) {
    if ($scope.timerUpdateNote == false) {
      console.log ('Scheduling');
      $scope.timerUpdateNote = true;
      // schedule a save for data due to note field edits, saves on constantly hitting server for updates
      // on every key stroke
      $timeout( function() {$scope.update (id, $scope.items[index]); $scope.timerUpdateNote = false;}, 1000);

    }
    else console.log ('Not yet');
  }

  $scope.update = function (id, data) {
    console.log ('request to update: ' + id);
    console.log (data);
    // Use angular.copy helper method below to create a deep copy of the
    //   data item before updating, we are going to remove the
    //   row version and a couple other properties from it first.
    itemService.update (id, angular.copy(data), $scope.key)
      .then(function(data) {
        console.log ('Update completed');
      }, function(err) {
        console.log (' Error in update');
        console.log(err); // Error: "It broke"
      });
  }

  // $scope.currentNotes = [];
  // $scope.currentName = '';
  // $scope.viewNotes = function (name, notes) {
  //   $scope.currentNotes = notes;
  //   $scope.currentName = name;
  //   $('#modalNotes').foundation('reveal', 'open');
  // }

  $scope.getAll();  // Show items when viewing first time

});

//  Get in the zone, fast flow coding like spoken communication!!
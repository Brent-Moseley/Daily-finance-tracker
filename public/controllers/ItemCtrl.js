// public/js/controllers/ItemCtrl.js
app.controller('ItemController', function($scope, itemService) {

  $scope.tagline = 'Here are your items:';

  $scope.getAll = function() {
    itemService.get()
      .then(function(data) {
          // promise fulfilled
          if (data) {
            //  Start using lodash instead of underscore.js
            var rocks = _.where(data, {size: 'Rock'});
            var pebbles = _.where(data, {size: 'Pebble'});
            var sand = _.where(data, {size: 'Sand'});
            var none = _.where(data, {size: ''}); 
            var arranged = rocks.concat(pebbles, sand, none);   

            $scope.items = arranged;
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
    itemService.create (newOne)
      .then(function(data) {
        $scope.getAll();
      }, function(err) {
        console.log (' Error in add One');
        console.log(err); // Error: "It broke"
      });
  }

  $scope.remove = function (id) {
    console.log ('removing: ' + id);
    itemService.delete (id)
      .then(function(data) {
        $scope.getAll();
      }, function(err) {
        console.log (' Error in remove');
        console.log(err); // Error: "It broke"
      });
  }

  $scope.update = function (id, data) {
    console.log ('request to update: ' + id);
    console.log (data);
    // Use angular.copy helper method below to create a deep copy of the
    //   data item before updating, we are going to remove the
    //   row version and a couple other properties from it first.
    itemService.update (id, angular.copy(data))
      .then(function(data) {
        console.log ('Update completed');
      }, function(err) {
        console.log (' Error in update');
        console.log(err); // Error: "It broke"
      });
  }

  $scope.currentNotes = [];
  $scope.currentName = '';
  $scope.viewNotes = function (name, notes) {
    $scope.currentNotes = notes;
    $scope.currentName = name;
    $('#modalNotes').foundation('reveal', 'open');
  }

  $scope.getAll();  // Show items when viewing first time

});
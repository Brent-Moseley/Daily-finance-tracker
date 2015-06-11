app.directive ('expenseDeleteModal', ['itemService', function (itemService) {
  return {
    restrict: 'E',
    templateUrl:'/directives/partials/expense-delete-modal.html',

    link: function(scope, elem, attrs){

      scope.confirmedDelete = function () {
        scope.deleting = true;
        scope.remove(scope.deleteId);
      }

      scope.remove = function (id) {
        console.log ('removing: ' + id);
        itemService.delete (id, scope.key)
          .then(function(data) {
            scope.closeDeletePopup();
            scope.getAll();
            scope.calculateCatTotal(scope.selectedCat);
          }, function(err) {
            console.log (' Error in remove');
            console.log(err);
          });
      }

      scope.closeDeletePopup = function () {
        scope.deleting = false;
        $('#deleteModal').foundation('reveal', 'close');
      }

    }  
}
}]);

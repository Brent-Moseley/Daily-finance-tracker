app.directive ('categoryDeleteModal', ['itemService', function (itemService) {
  return {
    restrict: 'E',
    templateUrl:'/directives/partials/cat-delete-modal.html',

    link: function(scope, elem, attrs){

      scope.categoryId = 0;
      scope.deleteErrorMsg = '';
      scope.deletePosBG = '';
      scope.deleteSuccessMsg = '';
      scope.openCatDeleteConfirm = function (id, name, e) {
        scope.categoryId = id;
        scope.deleteErrorMsg = '';
        scope.deletePosBG = '';
        scope.deleteSuccessMsg = '';
        scope.deleteCategoryNote = name;
        scope.closeText = 'Cancel';
        
        var posx = posy = 0;
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
        scope.deletePos = {'z-index': 10, 'top': posy - modalTop, 'display':'block'};
        scope.deletePosBG = {'z-index': 9, 'display':'block'};
      }
      
      scope.removeCategory = function () {
        var id = scope.categoryId;
        console.log ('removing category: ' + id + ' ' + scope.deleteItemNote);

        itemService.deleteCat (id, scope.key)
          .then(function(data) {
            if (data > 0) {
              scope.deleteErrorMsg = data.toString() + ' items are assigned to this category. ';
              scope.deleteErrorMsg += 'Please re-assign those items before deleting this category.';
              scope.closeText = 'Close';
            }
            else {
              scope.deleteSuccessMsg = 'Category successfully deleted.'
              scope.closeText = 'Close';
            }
          });  
        }    

      scope.closeCatDeletePopup = function () {
        scope.deletePos = {'display':'none'};
        scope.deletePosBG = {'display':'none'};
        itemService.getCategories (scope.key)
          .then (function (dataCat) {
            scope.loadedCategories = dataCat;
            scope.openCategoryPopup();
          });
      }      

    }  
}
}]);

app.directive ('categoryAddModal', ['itemService', function (itemService) {
  debugger;
  return {
    restrict: 'E',
    templateUrl:'/directives/partials/cat-add-modal.html',

    link: function(scope, elem, attrs){

      scope.catNameAdd = '';
      scope.adding = false;
      scope.addSuccessMsg = '';
      scope.addCategory = function (e) {
        scope.deletePosBG = '';
        scope.addSuccessMsg = '';
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
        modalTop = modalTop.substring(0, modalTop.length-2);   // position fix because relative to modal
        scope.addPos = {'z-index': 10, 'top': posy - modalTop - 100, 'display':'block'};
        scope.deletePosBG = {'z-index': 9, 'display':'block'};    
      }

      scope.checkCatDup = function (newCategory) {
        scope.addDupMsg = '';
        angular.forEach (scope.loadedCategories, function (cat) {
           if (cat.name == newCategory) scope.addDupMsg = 'This category already exists, please create another.';
        });
      } 

      scope.addCategoryConfirm = function (name) {
        if (scope.addDupMsg.length > 0) return;
        itemService.createCategory (scope.key, name)
          .then(function(data) {
            scope.addSuccessMsg = 'Category successfully added.'
            scope.closeText = 'Close';
          });
      }

      scope.closeCatAddPopup = function () {
        scope.addPos = {'display':'none'};
        scope.deletePosBG = {'display':'none'};
        itemService.getCategories (scope.key)
          .then (function (dataCat) {
            scope.loadedCategories = dataCat;
            scope.openCategoryPopup();
          });    
      }  
      debugger;
    }  
}
}]);

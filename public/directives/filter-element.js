app.directive('filterElement', ['$filter', function($filter){
  // This directive is currently restricted to use only within an element ex: <input rs-filter-element="<filter name to be used>" />

  // We can use this now when the model name is dynamic and unknown during run-time such as in an ng-repeat.
  // Just place the directive into the prefered element(s) with the filter name you want to use.  Then create a filter
  // or use an existing one to adjust the value of the input as its typed.  Below is an example of its use with a dynamically
  // created ng-repeat input.  ng-model must be assigned to use as well.

  return {
    restrict:'A',
    require: '?ngModel',
    //scope: {},

    link: function( scope, elem, attrs, ngModel ){
      if(!ngModel) return;
        var conditional = attrs.filterElement.conditional ?
          attrs.filterElement.conditional : null;

      scope.$watch(attrs.ngModel, function(value){
        if(value == undefined || !attrs.filterElement) return;

        // Initialize the following values
        // These values are used to set the cursor of the input.
        var initialCursorPosition = elem[0].selectionStart;
        var initialValueLength = elem[0].value.length;
        var difference = false;
        // Sets ngModelView and ngViewValue
        ngModel.$setViewValue($filter(attrs.filterElement)( value, conditional ));
        attrs.$$element[0].value = $filter(attrs.filterElement)( value, conditional );
        // The following items are used to adjust the cursor for two separate conditions:
        // 1. filters that add elements as the user types such as in a date field xx/xx/xxxx
        // 2. filters that only allow certain characters.
        if(elem[0].value.length > initialValueLength) difference = true;
      });
    }
  }
}]);

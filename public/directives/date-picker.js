
/*global angular */
/*
 jQuery UI Datepicker plugin wrapper

 @note If ≤ IE8 make sure you have a polyfill for Date.toISOString()
 @param [ui-date] {object} Options to pass to $.fn.datepicker() merged onto uiDateConfig
 */

angular.module('ui.date', [])

.constant('uiDateConfig', {})

.directive('uiDate', ['uiDateConfig', '$timeout', '$route', function (uiDateConfig, $timeout, $route) {
  var options = {};
  angular.extend(options, uiDateConfig);
  return {
    require:'?ngModel',
    restrict: 'A',
    link:function (scope, element, attrs, controller) {
      //debugger;
      var grid = attrs.grid;

      if (!controller) return;

      var getOptions = function () {
        return angular.extend({}, uiDateConfig, scope.$eval(attrs.uiDate));
      };
      var initDateWidget = function () {
        var showing = false;
        var opts = getOptions();


        // If we have a controller (i.e. ngModelController) then wire it up
        if (controller) {

          // Set the view value in a $apply block when users selects
          // (calling directive user's function too if provided)
          var _onSelect = opts.onSelect || angular.noop;
          opts.onSelect = function (value, picker) {
            scope.$apply(function() {
              showing = true;
              // Change to format for DB after modifying
              var dd = new Date(element.datepicker("getDate"));
              var datestr = (dd.getMonth() + 1) + '/' + dd.getDate() + '/' + dd.getFullYear();
              if (grid) {
                scope.items[scope.editing].date = datestr;
                scope.$parent.update(scope.items[scope.editing]._id , scope.items[scope.editing]);
              }
              else {
                scope[attrs.ngModel] = datestr;
              }
            });
          };
          opts.beforeShow = function() {
            showing = true;
          };
          opts.onClose = function(value, picker) {
            element.blur();
            scope.$apply(function() {
              showing = false;
              // Re-load the table, since is sorted by date and dates have changed.
              if (grid) $timeout( function(){ $route.reload(); }, 100);
            });
          };
          element.on('blur', function() {
            // if ( !showing ) {
            //   scope.$apply(function() {
            //     element.datepicker("setDate", element.datepicker("getDate"));
            //     controller.$setViewValue(element.datepicker("getDate"));
            //   });
            // }
          });
          element.on('focus', function() {
            scope.$parent.$parent.editing = scope.$index;  // save the index of date being edited
          });
        }
        // If we don't destroy the old one it doesn't update properly when the config changes
        element.datepicker('destroy');
        // Create the new datepicker widget
        element.datepicker(opts);
      };
      // Watch for changes to the directives options
      scope.$watch(getOptions, initDateWidget, true);

      scope.$watch('item.date', function(value, old) {
        //debugger;
        element.datepicker("setDate", value);
      });
    }
  };
}
]);

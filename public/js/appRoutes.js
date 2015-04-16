// public/js/appRoutes.js
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    // These are the Angular routes, not to be confused with the Express routes on the server side
    // home page
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })

    // items page that will use the ItemController
    .when('/items', {
        templateUrl: 'views/item.html',
        controller: 'ItemController'
    });
}]);

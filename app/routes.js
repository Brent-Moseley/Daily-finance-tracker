// app/routes.js

// These are the routes in the Express middleware.  Everything in app
// is the Express / Mongo / Node backend.  Everything in public is the Angular front end.

// Set up a simple get route that include the API key below and just shows all transactions
// and users.   
module.exports = function(app) {
  // server routes ===========================================================
  // handle things like api calls
  // authentication routes
  //

  // Require in the api (CRUD Operations)
  require('./api/user')(app);  
  require('./api/item')(app);
  require('./api/category')(app);

  // frontend routes =========================================================
  // route to handle default requests
  app.get('*', function(req, res) {
      res.sendfile('./public/views/index.html'); // load our public/index.html file
                                                 // default route
  });
};

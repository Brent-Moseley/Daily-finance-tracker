// app/routes.js

// These are the routes in the Express middleware.  Everything in app
// is the Express / Mongo / Node backend.  Everything in public is the Angular front end.
// Identity.  Deep love - I love coding, I love design and architecture!  And I love 
//   all the rewards of doing it!

// Require in the models
var Item = require('./models/item');
var User = require('./models/user');

// Set up a simple get route that include the API key below and just shows all transactions
// and users.   
module.exports = function(app) {
  // server routes ===========================================================
  // handle things like api calls
  // authentication routes
  //
  // sample api route
  // Need to break this code up soon into controllers for each model
  // *************  Items model stuff *****************

  app.get('/items_as_admin', function (req, res) {
    // a good viewer for the response object:  http://jsonlint.com/
    console.log ('Items as admin:');
    if (req.query.key != '26cd-900a-Zcab-aa7bdf') res.send('Refused');
    else {
        //  Special admin key given, just return all data!!
      Item.find().exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items); // return all items in JSON format
      });
    }
  });

  app.get('/api/items', function(req, res) {
    // use mongoose to get all items in the database
    console.log ('Request for all items:');
    console.log (req.headers);     // find out if there is logging that can be turned on
    console.log (req.headers.key);
    console.log ('query key:' + req.query.key);

    if (!req.query.start_date || !req.query.end_date)
      // No start or end date provided, return all expense items by default
      Item.find({'key': req.headers.key}).sort('date').exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items); // return all items in JSON format
      });
    else {
      // Changed date format for query string, convert back to / format.
      start = req.query.start_date.replace(/-/g, '/');
      end = req.query.end_date.replace(/-/g, '/');
      console.log ('start and end date range:')
      console.log (start);
      console.log (end);            
      var queryString = "this.date >= new Date('" + start + "') && this.date <= new Date('" + end + "')";
      console.log ('Query string: ' + queryString);
      Item.find({'key': req.headers.key, $where: queryString })
        .sort('date').exec(function(err, items) {
        if (err)
            res.send(err);

        else res.json(items); // return items in JSON format
      });
    }            
  });

  // route to handle creating new expense items (app.post)
  app.post('/api/items', function(req, res) {
    req.body.key = req.headers.key;
    var next = new Item(req.body);

    console.log ('create new:');
    console.log (req.header);
    console.log (req.body);
    next.save(function (err) {
      if (err) { console.error(err); res.send('ERROR posting'); }
      else { console.log ('Successful add'); res.send('/ POST OK'); }
    });
  });

  // route to handle delete
  app.delete('/api/items/:id', function(req, res) {
    console.log (' in delete');
    console.log (req.params.id.substring(4));
    // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
    // strip off the first 4 characters
    Item.findById(req.params.id.substring(4)).remove(function (err) {
      if (err) { console.error(err); res.send('Unable to Delete'); }
      else { console.log ('successful delete'); res.send('/ DELETE OK'); }
    })
  });        

  // route to handle update
  app.put('/api/items/:id', function(req, res) {
    console.log (' in update' + req.params.id);
    console.log (req.header);
    console.log (req.body.data);
    // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
    var conditions = { '_id': req.params.id.substring(4)};
    console.log ('conditions:');
    console.log (conditions);
    Item.update(conditions, req.body.data, function (err, rowsAffected) {
      console.log ('Returned from update, rows affected: ' + rowsAffected);
      console.log ('err: ' + err);
      if (err) { console.error(err); res.send('Unable to Update'); }
      else { console.log ('successful update'); res.send('/ UPDATE OK'); }
    });
  }); 

  
  // *************  Users model stuff ***********************************
  // Does a user lookup. If only a user name is provided, returns true or false
  // depending on whether or not that user exists.
  // If a user name and password is provided, returns the key (user ID) if
  // login is allowed, otherwise returns empty string. This key is then used in
  // all further web service calls for getting and retrieving items, etc.
  app.get('/users_as_admin', function (req, res) {
    // a good viewer for the response object:  http://jsonlint.com/
    console.log ('Users as admin:');
    if (req.query.key != '26cd-900a-Zcab-aa7bdf') res.send('Refused');
    else {
        //  Special admin key given, just return all data!!
      User.find().exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items); // return all items in JSON format
      });
    }
  });

  app.get('/api/users', function(req, res) {
    console.log ('Checking for user:');
    var userName = req.query.user_name;
    var pwd = req.headers.pwd;
    var key = '';
    console.log (userName + ' ' + pwd);

    if (!pwd)
      //  Did not specify a pwd, so assume just checking existence of user
      User.find({'userName': userName}).exec(function(err, user) {
        console.log ('Found this:' + user);
        if (err || user.length == 0)
            res.send("false");

        else res.json("true"); // return all items in JSON format
      });
    else {
      User.find({'userName': userName}).exec(function(err, user) {
        console.log ('Trying to log in, Found this user:' + user[0]);
        console.log ('Checking against pwd: ' + pwd);
        console.log ('err:' + err);
        if (err || !user || user.length == 0 || user[0].pwd != pwd) {
          console.log ('Failed login');
          res.send("false");   // unable to log in
        }
        else {
          console.log ('login OK, so sending key:' + user[0].key);
          res.json(user[0].key); // log successful, return the key
        }
      });
    };
  });

  // A post to users will create a new user account, given a user name, password,
  // and a key. 
  // Will need to create a put in the future to allow updating of the password.
  // User delete is not provided at this time, and may not be at any point. If
  // desired at some point, just make the password a long GUID so it is almost 
  // impossible to log in.
  app.post('/api/users', function(req, res) {
    console.log ('Creating new user: ');
    console.log (req.body);
    var next = new User(req.body);

    next.save(function (err) {
      if (err) { console.error(err); res.send('ERROR posting'); }
      else { console.log ('Successful user add'); res.send('/ POST OK'); }
    });
  });

  // frontend routes =========================================================
  // route to handle default requests
  app.get('*', function(req, res) {
      res.sendfile('./public/views/index.html'); // load our public/index.html file
                                                 // default route
  });

};


// *****  Notes *****
// good doc:  https://www.packtpub.com/books/content/understanding-express-routes
//  http://stackoverflow.com/questions/17315915/angularjs-unknown-provider-configuring-httpprovider
// Mongoose queries:  http://mongoosejs.com/docs/queries.html
// http://docs.mongodb.org/manual/tutorial/query-documents/
// http://docs.mongodb.org/manual/reference/operator/query/where/
// http://mongoosejs.com/docs/queries.html
// http://docs.mongodb.org/manual/tutorial/query-documents/
// http://docs.mongodb.org/manual/reference/operator/query/where/
// http://mongoosejs.com/docs/queries.html
// alternate to MongoDB:  http://www.rethinkdb.com/

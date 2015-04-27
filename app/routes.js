 // app/routes.js

 // good doc:  https://www.packtpub.com/books/content/understanding-express-routes
 // This is the routes for the Express middleware, on the back end.  Everything in app
 // is the Express / Mongo / Node backend.  Everything in public is the Angular front end.
 // Identity.  Deep love - I love coding, I love design and architecture!  And I love 
 //   all the rewards of doing it!
var Item = require('./models/item');
var User = require('./models/user');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        //
        //  http://stackoverflow.com/questions/17315915/angularjs-unknown-provider-configuring-httpprovider
        // sample api route
        // Mongoose queries:  http://mongoosejs.com/docs/queries.html
        // Need to break this code up soon.

        // *************  Items model stuff *****************
        app.get('/api/items', function(req, res) {
          // use mongoose to get all items in the database
          console.log ('Request for all items:');
          console.log (req.headers);
          console.log (req.headers.key);
          console.log ('query:');
          if (!req.query.start_date || !req.query.end_date)
            Item.find({'key': req.headers.key}).sort('date').exec(function(err, items) {
              if (err)
                  res.send(err);

              else res.json(items); // return all items in JSON format
            });
          else {
            start = req.query.start_date.replace(/-/g, '/');
            end = req.query.end_date.replace(/-/g, '/');
            console.log (start);
            console.log (end);            
            //Item.find({'key': req.headers.key}, 'date': {$gte: ISODate(start), $lte: ISODate(end)}})
            var queryString = "this.date >= new Date('" + start + "') && this.date <= new Date('" + end + "')";
            console.log ('Query string: ' + queryString);
            Item.find({'key': req.headers.key, $where: queryString })
              .sort('date').exec(function(err, items) {

            // http://docs.mongodb.org/manual/tutorial/query-documents/
            // http://docs.mongodb.org/manual/reference/operator/query/where/
            // http://mongoosejs.com/docs/queries.html
            if (err)
                res.send(err);

            else res.json(items); // return all items in JSON format
            });
          }            
        });

        // route to handle creating goes here (app.post)
        app.post('/api/items', function(req, res) {    // note post vs create
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

        // route to handle delete goes here (app.delete)
        app.delete('/api/items/:id', function(req, res) {
          console.log (' in delete');
          console.log (req.params.id.substring(4));
          // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
          Item.findById(req.params.id.substring(4)).remove(function (err) {
            if (err) { console.error(err); res.send('Unable to Delete'); }
            else { console.log ('successful delete'); res.send('/ DELETE OK'); }
          })
        });        

        // route to handle update
        app.put('/api/items/:id', function(req, res) {    // Note this is put, not update
          console.log (' in update' + req.params.id);
          console.log (req.header);
          console.log (req.body.data);
          console.log (req.params.id.substring(4));
          // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
          //Item.findById(req.params.id.substring(4)).update(req.params.data, function (err, rowsAffected) {
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
        // Does a user lookup, if only a user name is provided, returns true or false
        // depending on whether or not that user exists.
        // If a user name and password is provided, returns the key (user ID) if
        // login is allowed, otherwise returns empty string. This key is then used in
        // all further web service calls for getting and retrieving items, etc.
        app.get('/api/users', function(req, res) {
          console.log ('Checking user:');
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
              console.log ('Trying to log in, Found this:' + user);
              console.log ('Checking against pwd: ' + pwd);
              console.log (user[0].pwd);
              console.log ('err:' + err);
              if (err || !user || user[0].pwd != pwd) {
                console.log ('Failed login');
                res.send("false");   // unable to log in
              }
              else {
                console.log ('OK, so sending key:' + user[0].key);
                res.json(user[0].key); // log successful, return the key
              }
            });

            // http://docs.mongodb.org/manual/tutorial/query-documents/
            // http://docs.mongodb.org/manual/reference/operator/query/where/
            // http://mongoosejs.com/docs/queries.html
            // if (err)
            //     res.send(err);

            // else res.json(items); // return all items in JSON format
          };
        });

        // A post to users will create a new user account, given a user name, password,
        // and a key. 
        // Will need to create a put in the future to allow updating of the password.
        // User delete is not provided at this time, and may not be at any point. If
        // desired at some point, just make the password a long GUID so it is almost 
        // impossible to log in.
        app.post('/api/users', function(req, res) {    // note post vs create
          //req.body.key = req.headers.key;
          console.log ('Creating new user: ');
          console.log (req.body);
          var next = new User(req.body);

          next.save(function (err) {
            if (err) { console.error(err); res.send('ERROR posting'); }
            else { console.log ('Successful user add'); res.send('/ POST OK'); }
          });
        });
        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
                                                       // default route
        });

    };


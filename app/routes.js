 // app/routes.js

 // good doc:  https://www.packtpub.com/books/content/understanding-express-routes
 // This is the routes for the Express middleware, on the back end.  Everything in app
 // is the Express / Mongo / Node backend.  Everything in public is the Angular front end.
var Item = require('./models/item');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        //
        //  http://stackoverflow.com/questions/17315915/angularjs-unknown-provider-configuring-httpprovider
        // sample api route
        // Mongoose queries:  http://mongoosejs.com/docs/queries.html
        app.get('/api/items', function(req, res) {
          // use mongoose to get all items in the database
          console.log ('Request for all items:');
          console.log (req.headers);
          console.log (req.headers.key);
          Item.find({'key': req.headers.key}).sort('date').exec(function(err, items) {
            //  .find({'key': req.headers.key})
            // .where('key').in([req.headers.key, ''])
            // if there is an error retrieving, send the error. 
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(items); // return all items in JSON format
          });
          // http://mongoosejs.com/docs/queries.html
        });

        // route to handle creating goes here (app.post)
        app.post('/api/items', function(req, res) {    // note post vs create
          req.body.key = req.headers.key;
          var next = new Item(req.body);

          //next.notes.push({text : 'Test A'});
          //next.notes.push({text : 'Test B'});

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

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
                                                       // default route
        });

    };


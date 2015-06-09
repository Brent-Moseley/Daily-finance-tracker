  
var Item = require('./../models/item');

module.exports = function(app) {
  // **********  Items stuff **************************
  //
  app.get('/items_as_admin', function (req, res) {
    console.log ('**** Get items as admin:');
    if (req.query.key != '26cd-900a-Zcab-aa7bdf') res.send('Refused');   // Do mask for github public repo, and the right RESTful return code
    else {
        //  Special admin key given, just return all data.
      Item.find().exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items); // return all items in JSON format
      });
    }
  });

  app.get('/api/items', function(req, res) {
    // use mongoose to get all items in the database
    console.log ('**** Request for all items:');
    console.log (req.headers.key);
    console.log ('query key:' + req.headers.key);

    if (!req.query.start_date || !req.query.end_date)
      // No start or end date provided, return all expense items by default
      Item.find({'key': req.headers.key}).sort('date').exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items); // return all items in JSON format
      });
    else {
      // Date format for query string was changed by the UI, convert back to / format.
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
    req.body.key = req.headers.key;  // key is similar to user ID, add into body
    var next = new Item(req.body);

    console.log ('**** create new item:');
    console.log (req.header);
    console.log (req.body);
    next.save(function (err) {
      if (err) { console.error(err); res.send('ERROR posting'); }
      else { console.log ('Successful add'); res.send('/ POST OK'); }
    });
  });

  // route to handle delete
  app.delete('/api/items/:id', function(req, res) {
    console.log (' **** in delete item');
    console.log (req.params.id.substring(4));
    // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
    Item.findById(req.params.id.substring(4)).remove(function (err) {
      if (err) { console.error(err); res.send('Unable to Delete'); }
      else { console.log ('successful delete'); res.send('/ DELETE OK'); }
    })
  });

  app.get('/delete_as_admin', function (req, res) {
    // special admin route to delete by ID.  Meant to be used in conjunction with
    // items_as_admin. Can just use Mongo console to.
    console.log ('**** delete Item as admin:' + req.query.id);
    if (req.query.key != '26cd-900a-Zcab-aa7bdf') res.send('Refused');
    else {
      Item.findById(req.query.id).remove(function(err, items) {
        if (err)
          res.send(err);

        else res.send('Success!');
      });
    }
  });    

  // route to handle update
  app.put('/api/items/:id', function(req, res) {
    console.log ('**** in update item:' + req.params.id);
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
}

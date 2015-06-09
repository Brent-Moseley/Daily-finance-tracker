var Item = require('./../models/item');
var Category = require('./../models/category');

module.exports = function(app) {
  // **********  Categories stuff **************************
  //
  app.get('/api/categories', function(req, res) {
    // use mongoose to get all categories in the database
    console.log ('**** Request for categories for:' + req.headers.key);
    Category.find({'key': req.headers.key}).sort('name').exec(function(err, items) {
      if (err)
          res.send(err);
      res.json(items);
    });
  });

  // route to handle creating new category (app.post)
  app.post('/api/categories', function(req, res) {
    req.body.key = req.headers.key;
    var next = new Category(req.body);
    console.log ('**** create new category:');
    console.log (req.header);
    console.log (req.body);
    next.save(function (err, obj) {
      if (err) { console.error(err); res.send('ERROR posting'); }
      else { 
        console.log ('Successful add of category: ' + obj.id); 
        res.send(obj.id); 
      }
    });
  });


  // route to handle update
  app.put('/api/categories/:id', function(req, res) {
    console.log (' **** in update for category' + req.params.id);
    var body = JSON.parse(req.body.data);
    console.log (body);
    // id value will come in this format: "&id=5474bd2f118b2d00008b1ab8"
    var conditions = { '_id': req.params.id.substring(4)};
    Category.update(conditions, body, function (err, rowsAffected) {
      console.log ('Returned from category update, rows affected: ' + rowsAffected);
      console.log ('err: ' + err);
      if (err) { console.error(err); res.send('Unable to Update'); }
      else { console.log ('successful category update'); res.send('/ UPDATE OK'); }  // confirm RESTful return value here
    });
  }); 

  // route to handle delete
  app.delete('/api/categories/:id', function(req, res) {
    console.log ('****  in delete category:');
    console.log (req.params.id.substring(4));

    // First make sure the category exists...
    Category.findById(req.params.id.substring(4), function (err, cat) {
      if (!err) {
        console.log ('Found: ' + cat.name);

        //  Do a lookup on all items that are using this category.
        //  If > 0, send a message asking the user to re-assign all those before deleting the
        //  category (in a future version, do an auto-reassign via their chosen new category). 
        Item.find({'category' : cat.name})
          .where('key').equals(req.headers.key)
          .exec(function (err, items) {
            if (err) console.log ('Error:  Unable to search for items with in this category!');
            else {
              console.log ('%d Items were found under this category.', items.length);
              if (items.length == 0) {
                console.log ('OK to delete: ' + req.params.id.substring(4));
                // OK to delete this category, do the actual remove now.
                Category.findById(req.params.id.substring(4)).remove(function (err) {
                  if (err) { console.error(err); res.send('Unable to Delete'); }
                  else { 
                    console.log ('successful delete'); 
                    res.status(200).send('0'); // indicate success, zero items found under deleted category
                  }
                });
              }
              // If not 0, returns the number of items left in the category so UI can inform user.
              else res.status(200).send(items.length.toString());
            }
        });
      }
    }); 
  });  
};
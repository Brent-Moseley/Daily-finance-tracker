//https://github.com/focusaurus/express_code_structure
// http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application/7350875#7350875 
var User = require('./../models/user');

module.exports = function(app) {
  // *************  Users model stuff ***********************************
  app.get('/users_as_admin', function (req, res) {
    // a good viewer for the response object:  http://jsonlint.com/
    console.log ('**** Users as admin:');
    if (req.query.key != '26*****') res.send('Refused');   // Do mask for github public repo
    else {
        //  Special admin key given, just return all data.  Can also use Mongo console
      User.find().exec(function(err, items) {
        if (err)
          res.send(err);

        else res.json(items);
      });
    }
  });

  // Does a user lookup. If only a user name is provided, returns true or false
  // depending on whether or not that user exists.
  // If a user name and password is provided, returns the key (user ID) if
  // login is allowed, otherwise returns empty string. This key is then used in
  // all further web service calls for getting and retrieving items, etc.
  app.get('/api/users', function(req, res) {
    console.log ('**** Checking for user:');
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

        else res.json("true");
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
  // User delete is not provided at this time, and may not be at any point. 
  // Mongo console can be used to delete users if need comes up.
  app.post('/api/users', function(req, res) {
    console.log ('**** Creating new user: ');
    console.log (req.body);
    var next = new User(req.body);

    next.save(function (err) {
      if (err) { console.error(err); res.send('ERROR posting'); }
      else { console.log ('Successful user add'); res.send('/ POST OK'); }
    });
  });

  // route to handle update
  app.put('/api/users', function(req, res) {
    console.log ('**** in update password for:');
    console.log (req.body.userName);
    console.log (req.body);
    
    // First just see if we can locate the user with the right user name and pwd.
    // If so, do an update with the new pwd
    User.findOne({'userName': req.body.userName}).where('pwd').equals(req.body.pwd)
      .exec(function(err, user) {
        console.log ('Found this:' + user);
        if (err || !user || user.length == 0)
            res.send("false");

        else {
          user.pwd = req.body.newPwd;
          user.save();
          console.log ('Updating to: ' + req.body.newPwd);
          res.json("true");
        }
      });
  });

};

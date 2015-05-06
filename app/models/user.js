// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining User model....');   
// PROD DB mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD
// Above line probably not needed - already connected to the DB via the items model.


// define the User model
module.exports = mongoose.model('User', {
      userName : {type : String, default: ''},
      pwd : {type : String, default: ''},
      pin: {type : String, default: ''},       // used for password reset
      key: {type : String, default: 'demo'}    // key is like a user ID
    },
    'users');    // collection name

// NOTES:
//  MongoDB data types:
// http://docs.mongodb.org/manual/core/document/
// http://docs.mongodb.org/manual/reference/bson-types/
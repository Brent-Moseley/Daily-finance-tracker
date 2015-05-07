// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting to DB....');   // Make sure database is created and 
                                  // mongo db is running in a terminal: mongod
//  TEST LOCAL DB URL:
//mongoose.connect('mongodb://localhost/daily-financial-tracker');  // NOTE:  this will create for you if does not exist.
// PROD DB URL:
mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD


// Imagine doing something big like Payment Manager / Organization Mgr / Session Mgr!!
//  I have worked on some very big projects! 
// Example of embedded schema, for future use:
var NoteSchema = new mongoose.Schema({
  text: {type : String, default: ''}
});

// define the Item model
// module.exports allows us to pass this model to other files where it is needed.
console.log (' Defining Item model....');
module.exports = mongoose.model('Item', {
      date : {type : Date, default: ''},
      category : {type : String, default: ''},
      cost : {type : String, default: ''},
      note : {type : String, default: ''},
      key: {type : String, default: 'demo'}    // Just use simple security key for now.....
                                               // use JWT later (see below)
      //notes : [NoteSchema]
    },
    'expenses');    // the collection name

// *****  Notes *****
// Angular app architecting:
//   https://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make
// Doc on creating a DB and collection:
// http://docs.mongodb.org/manual/tutorial/getting-started/
// http://stackoverflow.com/questions/11117854/many-to-many-mapping-with-mongoose
// http://docs.mongodb.org/manual/core/data-modeling-introduction/
// http://thecodebarbarian.wordpress.com/2013/06/06/61/     ***  Best tutorial
// Data types in MongoDB:   http://docs.mongodb.org/manual/reference/bson-types/
// 
// JWT:  https://egghead.io/series/angularjs-authentication-with-jwt
// Example JWT:  https://auth0.com/blog/2014/12/02/using-json-web-tokens-as-api-keys/
//   Implement a bit later

// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting....');   // Make sure database is created and 
                                  // mongo db is running in a terminal: mongod
// TEST DB   mongoose.connect('mongodb://localhost/daily-financial-tracker');  // NOTE:  may create for you if does not exist.
mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD


// Imagine doing something big like Payment Manager / Organization Mgr / Session Mgr!!
//  I have worked on some very big projects! 
var NoteSchema = new mongoose.Schema({
  text: {type : String, default: ''}
});

// define our item model
// module.exports allows us to pass this to other files when it is called
// Data types in MongoDB:   http://docs.mongodb.org/manual/reference/bson-types/
module.exports = mongoose.model('Item', {
      date : {type : Date, default: ''},
      category : {type : String, default: ''},
      cost : {type : String, default: ''},
      note : {type : String, default: ''},
      key: {type : String, default: 'demo'}    // Just use simple security key for now.....
                                               // use JWT later (see below)
      //notes : [NoteSchema]
    },
    'expenses');    // expenses is the collection name

    // Doc on creating a DB and collection:
    // http://docs.mongodb.org/manual/tutorial/getting-started/
    // http://stackoverflow.com/questions/11117854/many-to-many-mapping-with-mongoose
    // http://docs.mongodb.org/manual/core/data-modeling-introduction/
    // http://thecodebarbarian.wordpress.com/2013/06/06/61/     ***  Best tutorial
    // 
    // JWT:  https://egghead.io/series/angularjs-authentication-with-jwt
    // Example JWT:  https://auth0.com/blog/2014/12/02/using-json-web-tokens-as-api-keys/
    //   Implement a bit later

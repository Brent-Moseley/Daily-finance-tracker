// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting....');   // Make sure database is created and 
                                  // mongo db is running in a terminal: mongod
mongoose.connect('mongodb://localhost/daily-financial-tracker');  // NOTE:  may create for you if does not exist.

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
      //notes : [NoteSchema]
    },
    'expenses');    // expenses is the collection name

    // Doc on creating a DB and collection:
    // http://docs.mongodb.org/manual/tutorial/getting-started/
    // http://stackoverflow.com/questions/11117854/many-to-many-mapping-with-mongoose
    // http://docs.mongodb.org/manual/core/data-modeling-introduction/
    // http://thecodebarbarian.wordpress.com/2013/06/06/61/     ***  Best tutorial
    // 

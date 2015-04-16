// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting....');   // Make sure database is created and 
                                  // mongo db is running in a terminal: mongod
mongoose.connect('mongodb://localhost/task-list-2d');  // NOTE:  may create for you if does not exist.

var NoteSchema = new mongoose.Schema({
  text: {type : String, default: ''}
});

// define our item model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Item', {
      name : {type : String, default: ''},
      size : {type : String, default: ''},
      status : {type : String, default: ''},
      notes : [NoteSchema]
    },
    'testData');    // testData is the collection name

    // Doc on creating a DB and collection:
    // http://docs.mongodb.org/manual/tutorial/getting-started/
    // http://stackoverflow.com/questions/11117854/many-to-many-mapping-with-mongoose
    // http://thecodebarbarian.wordpress.com/2013/06/06/61/     ***  Best tutorial
    // 

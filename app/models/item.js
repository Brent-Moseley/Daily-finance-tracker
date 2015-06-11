// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting to DB....'); 

// PROD DB URL:
mongoose.connect('***********');   // PROD, Do mask for github public repo

// define the Item model
console.log (' Defining Item model....');
module.exports = mongoose.model('Item', {
      date : {type : Date, default: ''},
      category : {type : String, default: ''},
      cost : {type : String, default: ''},
      note : {type : String, default: ''},
      key: {type : String, default: 'demo'}    // Just use simple security key for now.....
                                               // use JWT later (see below)
    },
    'expenses');    // the collection name
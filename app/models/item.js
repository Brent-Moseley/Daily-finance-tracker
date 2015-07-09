// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Connecting to DB....'); 

mongoose.connect('mongodb://localhost/daily-financial-tracker');  // NOTE:  for tdd testing purposes.

// PROD DB URL:
//mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD, Do mask for github public repo

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
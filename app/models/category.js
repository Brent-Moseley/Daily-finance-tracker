// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining Category model....');   

// define the Category model
module.exports = mongoose.model('Category', {
      name : {type : String, default: ''},
      limit : {type : Number, default: -1},
      key: {type : String, default: 'demo'}    // key is like a user ID, defines who this belongs to
    },
    'categories');    // collection name

// NOTES:
//  Permitted schema types:  http://mongoosejs.com/docs/guide.html
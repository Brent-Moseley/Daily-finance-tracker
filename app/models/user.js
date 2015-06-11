// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining User model....');   

// define the User model
module.exports = mongoose.model('User', {
      userName : {type : String, default: ''},
      pwd : {type : String, default: ''},
      categories: [String],
      key: {type : String, default: 'demo'}    // key is like a user ID
    },
    'users');    // collection name

// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining User model....');   
//mongoose.connect('mongodb://localhost/daily-financial-tracker');  // NOTE:  may create for you if does not exist.
// PROD DB mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD


// define our item model
// module.exports allows us to pass this to other files when it is called
// Data types in MongoDB:   http://docs.mongodb.org/manual/reference/bson-types/
module.exports = mongoose.model('User', {
      userName : {type : String, default: ''},
      pwd : {type : String, default: ''},
      key: {type : String, default: 'demo'}    // key is like a user ID
    },
    'expenses');    // expenses is the collection name


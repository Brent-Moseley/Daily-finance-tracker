// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining User model....');   
// PROD DB mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD
// Above line probably not needed - already connected to the DB via the items model.


// define the User model
// When letting the user add a new category, will have to add it to the string array below
// and add a new category record for it in the catgeory model so it can have a limit.
// UI controller will define the default set of categories for new users
// and will recurse through the user's category array to populate drop downs and the popup.
// Will also need the category delete to remove from the array and the category model.
// That plus an add button on the popup.

module.exports = mongoose.model('User', {
      userName : {type : String, default: ''},
      pwd : {type : String, default: ''},
      categories: [String],
      key: {type : String, default: 'demo'}    // key is like a user ID
    },
    'users');    // collection name

// NOTES:
//  MongoDB data types:
// http://docs.mongodb.org/manual/core/document/
// http://docs.mongodb.org/manual/reference/bson-types/
// Mongoose Schema types:  http://mongoosejs.com/docs/schematypes.html 
// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');
console.log (' Defining Category model....');   
// PROD DB mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/exIbeb2e');   // PROD
// Above line probably not needed - already connected to the DB via the items model.


// define the User model
// Initially, this is always defined as a monthly amount for the current month.
// There will be a Category Limits button below the category drop down.
// Clicking this will bring up the Category popup.  Here will be a listing of all
// categories, the current monthly total for each (query the backend for these), and
// this pre-defined limit.  The total will appear via this color theme:  Green: OK,
// yellow only 25% left, red 10% left or less.  User can then change their monthly budget
// limits. 
module.exports = mongoose.model('Category', {
      name : {type : String, default: ''},
      limit : {type : Number, default: -1},
      key: {type : String, default: 'demo'}    // key is like a user ID, defines who this belongs to
    },
    'categories');    // collection name

// NOTES:
//  Permitted schema types:  http://mongoosejs.com/docs/guide.html
// Run this file from the test folder:   mocha test.js

// NOTE:  Partial test suite!!!
// TODO:  Basic test setup from 2D Task List template project,
//  creates tests for this project in the near future.

var assert = require("assert");   // Mocha assertion library
var expect = require('chai').expect;
var assert = require('chai').assert;
var Item = require('../app/models/item');  // Include the models
var User = require('../app/models/user');
var Category = require('../app/models/category');


//  Just a basic test to make sure mocha is set up correctly
//  To run from the test directory: mocha 

// Test the model:
// Uses Chai test functions:
describe('User', function(){
  var user;
  beforeEach(function () {
    user = new User();
  });  
	it('should have a User object of type User', function(){
	  assert.typeOf(user, 'Object', 'user is an Object');
    expect(user).to.be.an.instanceof(User, 'user is an instance of User');
	})
  // expect calls below are a part of the Mocha BDD styles:
  //   http://chaijs.com/api/bdd/
  it('should have a User object with a userName property of type string', function(){
    expect(user).to.have.property('userName').to.be.a('string');
  })   
  it('should have a User object with a pwd property of type string', function(){
    expect(user).to.have.property('pwd').to.be.a('string');
  }) 
  it('should have a User object with a key property of type string', function(){
    expect(user).to.have.property('key').to.be.a('string');
  })    
  it('should have a User object with a categories property of type array of strings', function(){
    expect(user).to.have.property('categories').to.be.instanceof(Array);
  })    

  afterEach(function () {
    // No cleanup stuff to do here yet.
  });  
})

describe('Item', function(){
  var item;
  beforeEach(function () {
    item = new Item();
  });  
  it('should have an Item object of type Item', function(){
    assert.typeOf(item, 'Object', 'user is an Object');
    expect(item).to.be.an.instanceof(Item, 'item is an instance of Item');
  })
  // expect calls below are a part of the Mocha BDD styles:
  //   http://chaijs.com/api/bdd/
  it('should have an Item object with a date property of type Date', function(){
    // MongoDB seems to default date fields to null, so check for that. 
    expect(item).to.have.property('date').to.be.null;
  })   
  it('should have an Item object with a category property of type string', function(){
    expect(item).to.have.property('category').to.be.a('string');
  }) 
  it('should have an Item object with a cost property of type string', function(){
    expect(item).to.have.property('cost').to.be.a('string');
  })    
  it('should have an Item object with a note property of type string', function(){
    expect(item).to.have.property('note').to.be.a('string');
  }) 
  it('should have an Item object with a key property of type string', function(){
    expect(item).to.have.property('key').to.be.a('string');
  })   
})

describe('Category', function(){
  var category;
  beforeEach(function () {
    category = new Category();
  });  
  it('should have a Category object of type Category', function(){
    assert.typeOf(category, 'Object', 'category is an Object');
    expect(category).to.be.an.instanceof(Category, 'category is an instance of Category');
  })
  // expect calls below are a part of the Mocha BDD styles:
  //   http://chaijs.com/api/bdd/
  it('should have a Category object with a name property of type string', function(){
    expect(category).to.have.property('name').to.be.a('string');
  }) 
  it('should have a Category object with a limit property of type string and defaulting to -1', function(){
    expect(category).to.have.property('limit').to.be.a('number').to.equal(-1);
  }) 
  it('should have a Category object with a key property of type string', function(){
    expect(category).to.have.property('key').to.be.a('string');
  })
})


//  https://visualstudiomagazine.com/articles/2009/09/01/eliminate-database-dependencies-in-test-driven-development.aspx

//  Future expansion of tests:  use sinon to create mocks of server calls to the api to do things
//  such as create users, login users, add new items, read them back, create categories, etc. 
//  Need test cases for all the conditions the code should handle, such as invalid password, 
//  trying to create a user that already exists, logging in successfully, change a user password,
//  etc.  Mock the server responses to make sure the logic works correctly and does not  
//  break in the future.  
//  Right now, writing tests for end to end functionality in the UI for creating new users,
//  logging in, creating new items, updating, deleting, adding categories, etc.  
//  Using Mocha, Chai, Chai as Promised, Protractor.

//  Test http calls to api using mocks:
// https://www.airpair.com/javascript/posts/unit-testing-ajax-requests-with-mocha
// http://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
// https://davidbeath.com/posts/testing-http-responses-in-nodejs.html

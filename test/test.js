// Run this file from the test folder:   mocha test.js

var assert = require("assert");   // Mocha assertion library
var expect = require('chai').expect;
var assert = require('chai').assert;
var Item = require('../app/models/item');  // Include the model

//  Just a basic test to make sure mocha is set up correctly
//  To run from the test directory: mocha 
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the Array value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

// Test the model:
// Need Chai for this:
describe('User', function(){
  var user;
  var notes;
  beforeEach(function () {
      user = new Item();
      user.notes.push({text : 'Test 1'});   // Temp added note
      notes = user.notes[0];
  });  
	it('should have a User object of type Item', function(){
	  assert.typeOf(user, 'Object', 'user is an Item');
    expect(user).to.be.an.instanceof(Item, 'user is an instance of Item');
	})
  // expect calls below are a part of the Mocha BDD styles:
  //   http://chaijs.com/api/bdd/
  it('should have a User object with a name property', function(){
    expect(user).to.have.property('name');
  })  
  it('should have a User object with a name property of type string', function(){
    expect(user).to.have.property('name').to.be.a('string').to.not.be.a('boolean');
  })   
  it('should have a User object with a size property of type string', function(){
    expect(user).to.have.property('size').to.be.a('string');
  }) 
  it('should have a User object with a status property of type string', function(){
    expect(user).to.have.property('status').to.be.a('string');
  })    
  it('should have a User object with a notes property', function(){
    expect(user).to.have.property('notes');
  })    
  it('should have a User object with notes that has a text property', function(){
    expect(notes).to.have.property('text');
    expect(user).to.have.deep.property('notes[0].text', 'Test 1');
  })

  afterEach(function () {
    // No cleanup stuff to do here yet.
  });  
})


//   http://stackoverflow.com/questions/19298118/what-is-the-role-of-describe-in-mocha
//   http://chaijs.com/guide/styles/#expect


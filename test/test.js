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

//  New development mindset.  Mindset is key for our kind of work:
//    Think and imagine more of what I want to do, imagine, create, do.  
//    Visualize awesome past accomplishments and creations, play with it, 
//    then start on something new!  Try to get stuff completed.

// Momentum - energy, motion, drive, impetus
//   The Mighty MO is the main thing to progress and evolving.
//   Ask good questions, get the curiosity going, absorb like a sponge!
//   Experimenting, exploring, playful mindset.  Amass experience.
// Coaching culture, more discussions, talk about what I am working on a lot more!  
//   Writing code and debugging is communication (with structure) and talking through / discussing
//   with others seems to be a great way to improve speed and flow plus comprehension, overall view. 
//   Speed seems to be the way to get into productivity the best, to get into the zone.  
//   I love what I do, so enjoy my work. Gotta be tougher in solving problems and use that.   
//   The simple truth is that the best way is by driving hard to get stuff done, as fast and 
//   efficiently as possible.  And this means really good, strong daily, weekly, and monthly goals.  
//   Self belief:  I am brilliant, I kick ass!!
//   The real test:  show me what you've created
//   To bring it all together in understanding:  What is all going on here?  Why does this work?

// Create
// make
// craft
// produce
// build
// invent
// design
// imagine
// conceive
// innovate
// start
// get going
// update
// renew
// remodel
// refresh
// solve
// software detective
// kung fu engineer
// fix
// brilliant
// intelligent
// clever
// organized
// absorb
// understanding
// attitude
// leadership


// test/test-helper.js

// Load in our actual project
//require('../public/controllers/ItemCtrl');
// Unnecessary since page is running locally at 8080

// Dependencies

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');  // Lets you use .eventually
//chai.use('sinon-chai');
chai.use(chaiAsPromised);

var sinon = require('sinon');

//require('angular-mocks');    //Get working later, mock out services

beforeEach(function() {
  // Create a new sandbox before each test
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  // Cleanup the sandbox to remove all the stubs
  this.sinon.restore();
});

module.exports = {
  rootUrl: 'http://localhost:8080/#',
  expect: chai.expect
};
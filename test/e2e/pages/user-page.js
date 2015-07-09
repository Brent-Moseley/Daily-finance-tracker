// test/e2e/pages/items-page.js

var helpers = require('../../test-helper');

function UserPage() {    // Simulate a class for a test page, you can call new on this and this is the object constructor then.
  this.get = function() {  // Class member get
    browser.get(helpers.rootUrl + '/');    // should be root URL
  }

  // Protractor grab all the necessary page elements for creating and then logging in as a user.
  //  https://github.com/angular/protractor/blob/master/docs/locators.md
  this.agreeBox = element(by.model('agree'));
  this.userName = element(by.model('userName'));
  this.userPwd = element(by.model('pwd'));
  this.userPwdPopup = element(by.model('userPwd'));
  this.userPwdConfirm = element(by.model('userPwdConfirm'));
  this.createAccount = $('a:contains(Create)')[0];
  this.logIn = $('a:contains(Log In)')[0]



  // this.itemRepeater = by.repeater('item in items'); // Find element by ng-repeat
  // this.firstItem = element(this.itemRepeater.row(0));  // get the first row in the repeater
  // this.lastItem = element.all(this.itemRepeater).last();  // get all elements in repeater, then find last
  // this.size = element.all(this.itemRepeater).last().element(by.model('item.size'));  // get the size drop down on the last row
  // this.status = element.all(this.itemRepeater).last().element(by.model('item.status'));
  // this.lastCol = element.all(this.itemRepeater).last().$$('td').last(); // within last row, find all 'td's and get last of those 
  // this.itemCreateSubmit = element(by.css('.button'));  // get element by css class 'button'
  // this.itemCreateNameField = element(by.model('newOne'));  // get element by ng-model
  //this.itemCreateSubmit = this.widgetCreateForm.element(by.buttonText('Create');
}

//   by.binding('name').first().getText().then(function(text) {});    getText returns a promise
//   can do click() on elements
//   browser.get
//   browser.waitForAngular();    helpful after a simulated user interaction click()
//   Jasmine will wait if you pass it a promise, so can do expect(header.getText())
//   chai-as-promised will use to.eventually to wait for promises to resolve
// 

module.exports = UserPage;


// NOTES:
//  http://sinonjs.org/
//  https://docs.angularjs.org/guide/e2e-testing

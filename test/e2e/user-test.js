// e2e/items-test.js
//  First make sure Selenium web driver is started:  webdriver-manager start
// To run this test, go to the TaskList2D/test/e2e folder and then run: protractor conf.js 

var helpers = require('../test-helper');   // include the test helper
var expect = helpers.expect;              // connects to chai.expect
var UserPage = require('./pages/user-page');  // require the test page

describe('creating user page', function() {
  beforeEach(function() {
    // this creates a test "page" with just the elements we want to test.
    this.page = new UserPage();
    this.page.get();   // invoke the browser
  });

  it('should create a new user', function() {
    // Test below is only useful when starting with a clean DB:
    //expect(this.page.firstItem).to.be.undefined;

    // Nice example of seeing if a popup comes up:
    //expect(this.page.itemCreateForm.isDisplayed()).to.eventually.be.true;

    var testUser = 'Testxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    //this.page.userName.sendKeys(testUser);
    //this.page.userPwd.sendKeys(testUser);
    //this.page.agreeBox.click();
    this.page.createAccount.click();
    browser.waitForAngular();
    this.popup = new UserPage();
    this.page.userName.sendKeys(testUser);
    this.page.userPwdPopup.sendKeys(testUser);
    this.page.userPwdConfirm.sendKeys(testUser);
    this.page.createAccount.click();

    browser.waitForAngular();
    var ptor = protractor.getInstance();
    var alertDialog = ptor.switchTo().alert();
    debugger;
    alertDialog.accept();  // Use to accept (simulate clicking ok)


    // this.page.itemCreateSubmit.click();
    // expect(this.page.lastItem.getText()).to.eventually.contain('Tester Adding');
    // this.page.size.click();                              // Click the size down down
    // element.all(by.cssContainingText('option', 'Sand')).last().click();  // ... and click 'Sand'
    // this.page.status.click();                                            // Click status drop down
    // element.all(by.cssContainingText('option', 'Started')).last().click();  // ... and click 'Started'
  });

  it ('should contain the new item', function () {
    expect(this.page.lastItem.getText()).to.eventually.contain('Tester Adding');
    expect(this.page.lastCol.getText()).to.eventually.contain('X');

  });

  it ('should have size == rock and status == started', function () {
    var allText = this.page.lastItem.getText();
    expect(allText).to.eventually.contain('Sand');
    expect(allText).to.eventually.contain('Started');
  });

  it('should remove the new item', function() {
    // Still contains the added row when loaded this second time, and contains a remove button
    expect(this.page.lastCol.click());    // Click the remove button without errors
  });  
   
  it('should not find the new item', function() {
    // And after deletion, no longer contains the new item, eventually used for page load
    expect(this.page.lastItem.getText()).to.eventually.not.contain('Tester Adding');
  });    
});



// UI testing:  need Karma, AngularMocks, Sinon, maybe Protractor and Chai as Promised
// http://angular.github.io/protractor/#/tutorial
// npm install protractor 
// npm install -g protractor     May have to be run on every machine
// protractor --version
// webdriver-manager start     NOTE:   Running this server in Tasklist2D project for now, since installed correctly there. 
// webdriver-manager update
// Status of Selenium web driver:  http://localhost:4444/wd/hub
// To run UI tests:  protractor conf.js      in e2e directory
// Angular testing:   https://quickleft.com/blog/angularjs-unit-testing-for-real-though/     *****
//   http://chaijs.com/api/bdd/
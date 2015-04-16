// e2e/items_test.js

var helpers = require('../test-helper');
var expect = helpers.expect;
var ItemsPage = require('./pages/items-page');

describe('creating items', function() {
  beforeEach(function() {
    this.page = new ItemsPage();
    this.page.get();
  });

  it('should create a new item', function() {
    expect(this.page.firstItem).to.be.undefined;
    //expect(this.page.itemCreateForm.isDisplayed()).to.eventually.be.true;
    this.page.itemCreateNameField.sendKeys('Tester Adding');
    this.page.itemCreateSubmit.click();
    expect(this.page.firstWidget.getText()).to.eventually.equal('Tester Adding');
  });
});
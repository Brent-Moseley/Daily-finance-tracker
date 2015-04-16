// Javascript inheritance example

function Vehicle (make, model, hasRockets) {
  this.make = make || '';
  this.model = model || '';
  this.hasRockets = hasRockets || false;

  this.specs = function () {
  	p ('Vehicle specs are:');
  	p (this.make);
  	p (this.model);
  	p (this.hasRockets);
  	return;
  }

}

function Car (make, model, hasRockets, owner, VIN) {
  this.base = Vehicle;
  this.base (make, model, hasRockets);
  this.owner = owner;
  this.VIN = VIN;

  this.showOwner = function () {
  	return this.owner;
  }
}

function p (str) {
	console.log (str)
}

//Car.prototype = new Vehicle('','', false);
var another = new Vehicle('Mazda', 'RX9', true);

var ford = new Car ('Ford', 'Mustang', false, 'BCM', 'J4324ghg34343');

p ('Make is:');
p (ford.showOwner());
p (ford.specs());

p ('Another vehicle:');
p (another.specs());



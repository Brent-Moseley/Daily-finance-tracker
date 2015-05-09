app.filter('numberCurrency', function() {
  return function (amount) {
    if( !amount ){
      return '';
    }else{
      // Remove anything that is not a number
      amount = amount.toString().replace(/[^\d|\.]/g, '');

      if( !amount ){
        return '';
      }else{

        if(! /[^\.]/g.test(amount)){ return amount.replace(/.*/, '0.');}
        // decimals all by themselves are allowed without some 0's.
          // only one decimal at a time, or else you get "#." back
        if(amount.match(/\.+/g) !== null && (amount.match(/\.+/g).pop().length != 1 || amount.match(/\.+/g).length != 1)){
          return amount.match(/\d+\.\d*/).pop();
        }else{
          // if amount shows up here with a decimal then treat it different and cut off any numbers past two places of demimal.
          if(/\./g.test(amount)){
            return amount.match(/\d+\.\d{0,2}/).pop();
          }else{
            return amount;
          }
        }
      }
    }
  };
});
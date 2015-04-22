// public/js/services/key-service.js
app.factory('keyService', function() {
  var key = '';
  return {
    // call to get all items
    save : function(newKey) {
      key = newKey;
    },

    get : function () {
      return key;
    }
  };
});

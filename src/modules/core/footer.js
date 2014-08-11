define(function(require) {
  var Backbone = require('backbone');

  return Backbone.View.extend({
    template : require('tmpl!src/modules/templates/footer-start')
  });

});
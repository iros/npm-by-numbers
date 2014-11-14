define(function(require) {
  var Backbone = require('backbone');
  var template = require('tmpl!src/modules/templates/about');

  return Backbone.View.extend({

    template : template

  });
});
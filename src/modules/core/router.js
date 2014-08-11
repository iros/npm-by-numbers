define(function(require) {

  "use strict";

  var Backbone = require('backbone');
  var layout = require('src/modules/core/baselayout');

  var Router = Backbone.Router.extend({

    routes: {
      "": "index"
    },

    initialize: function() {
      layout.render();
    },

    index: function() {
      console.log("index");
    }

  });

  return new Router();

});
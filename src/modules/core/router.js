define(function(require) {

  "use strict";

  var Backbone = require('backbone');
  var layout = require('src/modules/core/baselayout');

  var Router = Backbone.Router.extend({

    routes: {
      "": "index",
      "breakdown/:breakdown": "breakdown"
    },

    initialize: function() {
      var self = this;

      // render layout
      layout.render();

      // navigate if we get a routing event.
      layout.on('navigate', function(path) {
        self.navigate(path, { trigger: true });
      });
    },

    index: function() {
      // nothing happens here.... for now.
    },

    breakdown: function(breakdown) {

      layout.renderQuestions(breakdown); // in case we aren't starting from index page
      layout.updateBreakdown(breakdown);
    }

  });

  return new Router();

});
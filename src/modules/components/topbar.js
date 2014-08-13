define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var controlTemplate = require('tmpl!src/modules/templates/topbar-controls');

  return Backbone.View.extend({
    template : require('tmpl!src/modules/templates/topbar-start'),

    initialize: function() {

    },

    setData: function(data) {
      this.data = data;
    },

    updateGrid: function(breakdown, dims) {

      var self = this;

      self.$el.find('.category').stop().fadeOut(function() {

        self.$el.html(controlTemplate({
          data : self.data,
          dims: dims,
          breakdown: breakdown
        }));

        self.$el.find('.category').each(function(idx, el) {
          $(el).css('opacity', 0).animate({ opacity: 1, duration: 200 }).delay(200 * idx);
        });

      });
    }

  });
});

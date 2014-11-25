define(function(require) {
  var $ = require('jquery');
  var Layout = require("layoutmanager");
  var controlTemplate = require('tmpl!src/modules/web/templates/vis-topbar-controls');

  return Layout.extend({
    manage: true,
    template : "",

    initialize: function() {

    },

    setData: function(data) {
      this.data = data;
    },

    afterRender: function() {
      this.$el = $('#vis-topbar');
      this.el = this.$el[0];
    },

    show: function() {
      this.$el.fadeIn();
    },

    setBreakdown: function(breakdown, dims) {

      var self = this;

      var existing = self.$el.find('.category');

      function makeNew() {
        self.$el.html(controlTemplate({
          data : self.data,
          dims: dims,
          breakdown: breakdown
        }));

        self.$el.find('.category').each(function(idx, el) {
          $(el).css('opacity', 0).animate({ opacity: 1, duration: 200 }).delay(200 * idx);
        });
      }

      if (existing.size() > 0) {
        existing.stop().fadeOut(makeNew);
      } else {
        makeNew();
      }

    }

  });
});

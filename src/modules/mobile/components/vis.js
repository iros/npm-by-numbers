define(function(require) {

  var d3 = require('d3');
  var Layout = require('layoutmanager');
  require('../services/treemap');

  return Layout.extend({
    template: require('tmpl!../templates/vis'),

    initialize: function(options) {
    },

    setData: function(data) {
      this.data = data;
    },

    afterRender: function() {
      var rawNode = this.el;

      var width = this.$el.parent().width();
      var height = this.$el.parent().height();

      this.chart = d3.select(rawNode).select('.treemap')
        .append('svg')
        .attr({
          width: width,
          height: height
        });

      this.treemap = this.chart.chart('TreemapChart', {
        width: width,
        height: height
      });
    },

    hide: function() {
      if (this._hidden) {
        return;
      } else {
        this._hidden = true;
        this.$el.slideUp();
      }
    },

    show: function() {
      if (!this._hidden) {
        return;
      } else {
        this._hidden = false;
        this.$el.slideDown();
      }
    },

    update: function(breakdown) {
      this.treemap.breakdown(breakdown)
        .draw(this.data);
    }

  });

});

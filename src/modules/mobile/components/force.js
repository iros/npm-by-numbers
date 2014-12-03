define(function(require) {

  var d3 = require('d3');
  var Layout = require('layoutmanager');
  require('../services/sillyforce');

  return Layout.extend({
    template: require('tmpl!../templates/sillyforce'),

    initialize: function(options) {
    },

    afterRender: function() {
      var rawNode = this.el;

      var width = this.$el.parent().width();
      var height = this.$el.parent().height();

      this.chart = d3.select(rawNode)
        .append('svg')
        .attr({
          width: width,
          height: height
        });

      this.forcechart = this.chart.chart('SillyForce', {
        width: width,
        height: height
      });

      this.forcechart.draw();
      this.forcechart.start();
    },

    hide: function() {
      if (this._hidden) {
        return;
      } else {
        this._hidden = true;
        this.forcechart.stop();
        this.$el.fadeOut();
      }
    },

    show: function() {
      if (!this._hidden) {
        return;
      } else {
        this._hidden = false;
        this.forcechart.start();
        this.$el.show();
      }
    }

  });

});

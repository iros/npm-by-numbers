define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var d3 = require('d3');

  var LayoutMath = require('src/modules/services/math');
  var DataModeler = require('src/modules/services/datamodeler');

  // get our chart.
  require('src/modules/services/waffle-chart');

  // get data!
  var getStats = $.ajax('data/stats_reduced.json');

  // var defaultBreakdown = 'versions';

  return Backbone.View.extend({

    tagName: "div",

    initialize: function() {
      var self = this;

      self.data = {};
      self.dataModeler = null;
      self.waffleChart = null;

      $.when(getStats).then(function(stats) {
        self.data.stats = stats;
        self.trigger('data-fetched');
      });

      self.on('grid-switch', self.updateGrid);
    },

    _computeGridForBreakdown: function(breakdown) {

      // when computing specific breakdown data
      if (typeof this.data.stats.dimensions[breakdown] !== "undefined") {

        return LayoutMath.findMultiBreakdownDims(
          this.dims.width, this.dims.height,
          this.data.stats.dimensions[breakdown],
          50,   //padding
          100,   // pkgs per dot
          this.data.stats.order[breakdown]);  // breakdwn order

      // when computing all breakdown data
      } else if (breakdown === "total" || typeof breakdown === "undefined") {
        var groups = {
          total : this.data.stats.total
        };

        return LayoutMath.findMultiBreakdownDims(
          this.dims.width, this.dims.height,
          groups,
          0,     //padding
          100,   // pkgs per dot
          ["total"]);  // breakdown order is default... just total.
      }
    },

    // reacts to grid change
    updateGrid: function(breakdown) {
      var self = this;

      self.dataModeler.setBreakdown(breakdown);
      var dims = self._computeGridForBreakdown(breakdown);
      self.waffleChart.dimensions(dims);
      self.waffleChart.draw(self.dataModeler.dots);
    },

    afterRender: function() {
      var self = this;

      // self.$el.attr('xmlns', 'http://www.w3.org/2000/svg');
      // self.$el.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      self.dims = {
        width: this.$el.parent().width(),
        height: this.$el.parent().height()
      };

      self.svg = d3.select(this.el).append('svg');

      this.svg.attr('width', self.dims.width);
      this.svg.attr('height', self.dims.height);

      this.on('data-fetched', function() {
        self.dataModeler = new DataModeler(self.data.stats);

        var dims = self._computeGridForBreakdown();
        //console.log(d.dots, dims);

        self.waffleChart = self.svg
          .chart('waffleChart', { dims: dims });

        self.waffleChart.draw(self.dataModeler.dots);

      });
    }
  });
});
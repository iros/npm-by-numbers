define(function(require) {

  var Backbone = require('backbone');
  var d3 = require('d3');

  var LayoutMath = require('src/modules/services/layoutmath');
  var DataModeler = require('src/modules/services/datamodeler');

  // get our chart.
  require('src/modules/services/waffle-chart');

  // var defaultBreakdown = 'versions';

  return Backbone.View.extend({

    tagName: "div",

    initialize: function() {
      var self = this;

      self.dataModeler = null;
      self.waffleChart = null;
      self.gridDims = null;
      self.breakdown = null;

      self.on('grid-switch', self.updateGrid);
    },

    /**
     * Sets the dataset for current visualization
     * @param {Object} data Stats object
     */
    setData: function(data) {
      this.data = data;
    },

    /**
     * Get the current waffle chart grid breakdown
     * @return {Object} Grid dimensions
     */
    getDimensions: function() {
      return this.gridDims;
    },

    _computeGridForBreakdown: function(breakdown) {

      // when computing specific breakdown data
      if (typeof this.data.dimensions[breakdown] !== "undefined") {

        return LayoutMath.findMultiBreakdownDims(
          this.dims.width, this.dims.height,
          this.data.dimensions[breakdown],
          50,   //padding
          100,   // pkgs per dot
          this.data.order[breakdown]);  // breakdwn order

      // when computing all breakdown data
      } else if (breakdown === "total" || typeof breakdown === "undefined") {
        var groups = {
          total : this.data.total
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
      self.breakdown = breakdown;

      self.dataModeler.setBreakdown(breakdown);
      self.gridDims = self._computeGridForBreakdown(breakdown);
      self.waffleChart.dimensions(self.gridDims);
      self.waffleChart.draw(self.dataModeler.dots);
    },

    afterRender: function() {
      var self = this;

      // first time activities:
      // * set the svg dimensions based on parents
      // * create a data modeler to build our data into something meaningful.
      // * render starting waffle chart

      self.dims = {
        width: this.$el.parent().width(),
        height: this.$el.parent().height()
      };

      self.svg = d3.select(this.el).append('svg');

      this.svg.attr('width', self.dims.width);
      this.svg.attr('height', self.dims.height);


      self.dataModeler = new DataModeler(self.data);

      self.gridDims = self._computeGridForBreakdown();

      self.waffleChart = self.svg
        .chart('waffleChart', { dims: self.gridDims });

      self.waffleChart.draw(self.dataModeler.dots);

    }
  });
});
define(function(require) {

  var Backbone = require('backbone');
  var d3 = require('d3');
  var $ = require('jquery');

  var LayoutMath = require('src/modules/services/layoutmath');
  var DataModeler = require('src/modules/services/datamodeler');
  var VisTopBar = require('src/modules/components/vis-topbar');

  // get our chart.
  require('src/modules/services/waffle-chart');

  return Backbone.View.extend({

    template: require('tmpl!src/modules/templates/vis'),

    initialize: function() {
      var self = this;

      self.dataModeler = null;
      self.waffleChart = null;
      self.gridDims = null;
      self.breakdown = null;

      self.firstSwitch = true;

      self.on('grid-switch', self.updateGrid);
    },

    afterRender: function() {
      var self = this;
      window.vis = self;

      self.$el = $('section#vis');
      self.el = this.$el[0];
      self.$el.html(this.template());

      // first time activities:
      // * set the svg dimensions based on parents
      // * create a data modeler to build our data into something meaningful.
      // * render starting waffle chart

      self.dims = {
        width: this.$el.width(),
        height: this.$el.height() - 50 // top vis bar
      };

      self.bases = {
        waffle: d3.select('#waffle'),
        visTopbar: d3.select("#vis-topbar")
      };

      // make chart container:
      self.svg = this.bases.waffle.append('svg');

      this.svg.attr('width', self.dims.width);
      this.svg.attr('height', self.dims.height);

      // get data modeler
      self.dataModeler = new DataModeler(self.data);
      var reverseQuestionDict = self.dataModeler.reverseQuestionDictionary();

      self.gridDims = self._computeGridForBreakdown();

      // create waffle chart
      self.waffleChart = self.svg
        .chart('waffleChart', { dims: self.gridDims })
        .highlightDictionary(self.data.question_order, reverseQuestionDict);

      // draw waffle chart
      self.waffleChart.draw(self.dataModeler.dots);

      this.visTopBar = new VisTopBar();
      this.visTopBar.setData(self.data);
      this.insertView('#vis-topbar', this.visTopBar).render();
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
          60,   //padding
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

    /**
     * Updates the grid when a breakdown changes
     * @param  {String} breakdown Name of breakdown: versions, ages or dependents
     * @param {[String]} highlightProperties Optional names of properties to highlight.
     */
    setBreakdown: function(breakdown, highlightProperties) {
      if (breakdown !== this.breakdown) {
        this.breakdown = breakdown;

        this.dataModeler.setBreakdown(breakdown);

        this.gridDims = this._computeGridForBreakdown(breakdown);

        this.waffleChart
          .dimensions(this.gridDims);

        if (highlightProperties) {
          this.waffleChart.highlight(highlightProperties);
        }

        if (this.firstSwitch) {
          // scoot vis down 50px
          $('#waffle').animate({ top: "60px" });
          this.firstSwitch = false;
        }
        this.visTopBar.show();
        this.visTopBar.setBreakdown(breakdown, this.gridDims);
      }
    },

    highlightProperties: function(highlightProperties) {

      this.waffleChart
        .highlight(highlightProperties);

      // this.waffleChart.draw(this.dataModeler.dots);
    },

    updateChart: function() {
      this.waffleChart.draw(this.dataModeler.dots);
    },


  });
});
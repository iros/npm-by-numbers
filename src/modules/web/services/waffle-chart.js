define(function(require) {
  var d3 = require('d3');
  // var _ = require('underscore');

  require('d3Chart');

  var colors = require('src/modules/web/services/colors');

  d3.chart('waffleChart', {

    transform: function(data) {
      var self = this;

      self.data = data;
      return self.data;
    },

    /**
     * Update/gets grids for this chart
     * @param  {Object} dims Dimensions object containing radius and grids
     * @return {Object}      current dimensions.
     */
    dimensions: function(dims) {
      var self = this;

      if (arguments.length) {
        self.dims = dims;

        // for every grid, count which item we're on.
        self.gridCounts = {};
        self.dims.grids.forEach(function(grid) {
          self.gridCounts[grid.group] = 0;
        });

      } else {
        return self.dims;
      }

      return this;
    },

    /**
     * Sets the possible highlights for various breakdowns.
     * @param  {Objet} dictionary available breakdowns
     * @param {Object} lookupTable A lookup table between categories and their question names.
    * @return {[Object]}            Dictionary
     */
    highlightDictionary: function(dictionary, lookupTable) {
      if (arguments.length) {
        this.dictionary = dictionary;
        this.dictLookupTable=lookupTable;
      } else {
        return this.dictionary;
      }
      return this;
    },

    /**
     * Sets the property to highlight circles by
     * @param  {Array} highlightProperties Any property we can color by
     * @return {[String]}                 The current property we're highlighting by
     */
    highlight: function(highlightProperties) {
      var self = this;

      if (arguments.length) {
        self.highlightBy = highlightProperties;
      } else {
        return self.highlightBy;
      }

      return this;
    },

    /**
     * Determines the breakdown we're looking at
     * @param  {String} breakdown name of breakdown
     * @return {[String]}           current breakdown name
     */
    breakdown: function(breakdown) {
      var self = this;

      if (arguments.length) {
        self._breakdown = breakdown;
      } else {
        return self._breakdown;
      }

      return this;
    },

    /**
     * Initializes a waffle chart of N different dots in M different
     * breakdowns
     * @param  {Object} dimentions Expected: { radius : M, grids : { ... }}
     * @param  {Array} data        Array of dot points
     */
    initialize: function(options) {

      var self = this;
      self._first = true;

      self.base.classed('waffleChart', true);

      self.dimensions(options.dims);

      self.highlightBy = [];

      self._breakdown = 'total'; // current grid breakdown;

      self.bases = {
        dots : self.base.append('g')
          .classed('dots', true)
      };

      self.layer('dots', self.bases.dots, {
        dataBind: function(data) {
          return this.selectAll('circle')
            .data(data, function(d) { return d.id; });
        },

        insert: function() {
          return this.append('circle')
            .attr('r', 0)
            .attr('stroke', '#B0C6CC')
            .attr('fill', colors.lightblue);
        },

        events: {
          merge: function() {
            var chart = this.chart();
            var total = chart.data.length;

            this.each(function(d, i) {
              var selection = d3.select(this);
              var idx = self.gridCounts[d.breakdown];
              var grid = self.dims.grids[d.breakdown_idx];

              var x = grid.offset + ((idx % grid.cols) * grid.gridx) + self.dims.radius;
              var y = (Math.floor(idx / grid.cols) * grid.gridy) + self.dims.radius;

              // if first time painting, animate from a good starting point
              if (self._first) {

                selection.attr({
                  cx: x,
                  cy: grid.height
                });
              }

              selection.attr('idx', i);
              var attrs = {};

              // determine fill color by highlight. if we have highlighting
              // attributes, iterate over them until you find the first one
              // and set the color based on that. If it wasn't found or if
              // we aren't highlighting anything, then just color by default color
              if (chart.highlightBy.length > 0) {
                var found = false;

                for(var m = 0; m < chart.highlightBy.length; m++) {

                  if (d[chart.highlightBy[m]] === 1) {

                    // which category does this belong to?
                    var cat = self.dictLookupTable[chart.highlightBy[m]];
                    var catidx;
                    if (cat) {
                      var catOptions = self.dictionary[cat];

                      // find position in highlight dictionary
                      catidx = catOptions.indexOf(chart.highlightBy[m]);
                    } else {
                      catidx = Math.floor(colors.highlightProperties.length / 2);
                    }

                    attrs.fill = colors.highlightProperties[catidx];
                    found = true;
                  }
                }

                if (!found) {
                  attrs.fill = colors.regular;
                }
              } else {
                attrs.fill = colors.regular;
              }

              // only reposition if we are switching breakdowns. Otherwise
              // we are probably only coloring, so we want to keep those
              // circles in place.
              if (d.category !== chart._breakdown) {
                attrs.cx = x;
                attrs.cy = y;
                attrs.r = self.dims.radius - 2; // some spaceage between circles
              }

              selection.transition()
                .delay(i * 1)
                .attr(attrs);

              self.gridCounts[d.breakdown]++;

              // If this is our last circle, save the current breakdown
              // for future use.
              if (i+1 === total) {
                chart._breakdown = d.category;
              }
            });

            self._first = false;
          },

          enter: function() {
            this.attr('fill', colors.regular);
          },

          update: function() {
          },

          exit: function() {
            this.remove();
          }
        }
      });

    }
  });

});
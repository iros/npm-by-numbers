define(function(require) {
  var d3 = require('d3');
  // var _ = require('underscore');

  require('d3Chart');

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
            .attr('r', self.dims.radius - 2); // some spaceage.
        },

        events: {
          merge: function() {
            this.each(function(d, i) {
              var selection = d3.select(this);
              var idx = self.gridCounts[d.breakdown];
              var grid = self.dims.grids[d.breakdown_idx];

              var x = grid.offset + ((idx % grid.cols) * grid.gridx) + self.dims.radius;
              var y = (Math.floor(idx / grid.cols) * grid.gridy) + self.dims.radius;

              // if first time painting, animate from a good starting point
              if (self._first) {

                // var x_start = x - self.dims.radius * 10;
                // var y_start = y - self.dims.radius * 10;

                selection.attr({
                  cx: x,
                  cy: grid.height
                });
              }

              selection.transition()
                .delay(i * 1)
                .attr({
                  cx : x,
                  cy : y
                });

              self.gridCounts[d.breakdown]++;
            });

            self._first = false;
          },

          enter: function() {

          },

          update: function() {

          },

          exit: function() {

          }
        }
      });

    }
  });

});
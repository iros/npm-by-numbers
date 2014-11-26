define(function(require) {
  var d3 = require('d3');
  require('d3Chart');

  var colors = require('src/modules/web/services/colors');

  d3.chart('TreemapChart', {
    transform: function(data) {
      this.rawdata = data;

      if (this._previousBreakdown !== this._breakdown) {
        this.data = this.transformBreakdown();
      }

      // build data for breakdown
      return this.data;
    },

    initialize: function(options) {

      var self = this;

      self.width = options.width;
      self.height = options.height;

      self.base.classed('treemap', true);

      // starting treemap breakdown, by version.
      self._breakdown = null;

      self.treemapLayout = d3.layout.treemap()
        .padding(3)
        .size([self.width, self.height])
        .mode('slice')
        .value(function(d) { return d.value; })
        .sort(function(d, d2) {
          return d2.idx - d.idx;
        });

      self.bases = {
        rects : self.base.append('g')
          .classed('rects', true)
      };

      self.layer('rect', self.bases.rects, {
        dataBind: function(data) {
          var chart = this.chart();
          return this.datum(data).selectAll('g.node')
            .data(chart.treemapLayout.nodes, function(d) {
              return d.id;
            });
        },

        insert: function() {
          return this.append('g')
            .classed('node', true);
        },
        events: {
          enter: function() {

            // move group to correct location
            this.attr('transform', function(d) {
              return 'translate('+d.x+','+d.y+')';
            });

            // append a rect at 0,0 with 0 width and height
            this.append('rect')
              .attr({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                fill: function(d, i) { return d.color; }
              });

            this.append('text')
              .attr({
                x: function(d) {
                  if (d.dx > 10) {
                    return 5;
                  } else {
                    return d.dx / 2;
                  }
                },
                y: function(d) {
                  return 15;
                }
              })
              .text(function(d) {
                if (d.dx > 9) {
                  return d.idx;
                } else {
                  return '';
                }
              })
              .style({
                'opacity': 0,
                'text-anchor': function(d) {
                  if (d.dx > 10) {
                    return 'start';
                  } else {
                    return 'middle';
                  }
                },
                'font-size':'0.7em'
              });
          },

          "merge": function() {
            var self = this;

            this.select('rect').transition().attr({
              width: function(d) { return d.dx; },
              height: function(d) { return d.dy; }
            }).each("end", function() {
              self.select('text').style('opacity', 1);
            });

          },
          "exit": function() {
            var self = this;
            this.select('text').remove();
            this.select('rect').transition().attr({
              width: 0,
              height: 0
            }).each("end", function() {
              this.remove();
              self.remove();
            });
          }
        }
      });
    },

    breakdown: function(breakdown) {
      if (typeof breakdown === "undefined") {
        return this._breakdown;
      } else {
        this._previousBreakdown = this._breakdown;
        this._breakdown = breakdown;
      }
      return this;
    },

    transformBreakdown: function() {
      var currentBreakdown = this.breakdown();
      var breakdownOrder = this.rawdata.order[currentBreakdown];

      var root = {
        name : "Root",
        color: 'white',
        children: []
      };

      for (var i = 0; i < breakdownOrder.length; i++) {
        var key = breakdownOrder[i];
        var name = this.rawdata.names[currentBreakdown][i];
        var value = this.rawdata.dimensions[currentBreakdown][key];

        root.children[i] = {
          idx: i,
          id: key,
          name : name,
          value: value,
          color: colors.basic[i+1]
        };
      }

      return root;
    }

  });

});

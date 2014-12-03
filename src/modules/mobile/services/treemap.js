define(function(require) {
  var d3 = require('d3');
  require('d3Chart');

  var colors = require('../../web/services/colors');

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
      self.cols = options.cols || 3;
      self.rows = options.rows || 2;

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
        legend: self.base.append('g')
          .classed('legend', true)
          .attr('transform', 'translate(3,15)'), // because text.
        rects : self.base.append('g')
          .classed('rects', true)
          .attr('transform', 'translate(0,'+self.height / 2+')')
      };

      self.layer('legend', self.bases.legend, {
        dataBind: function(data) {
          var chart = this.chart();
          return this.selectAll('g.item')
            .data(chart.data.children, function(d) {
              return d.id;
            });
        },

        insert : function() {
          return this.append('g')
            .classed('item', true);
        },

        events: {
          enter: function() {
            var chart = this.chart();
            this.attr('transform', function(d, i) {
              var col = i % chart.cols; // cols
              var row = Math.floor(i / chart.cols); //rows

              return 'translate('+ (col * chart.width/chart.cols) +
                ','+ (row * chart.height / (chart.cols * chart.rows)) +')';
            });

            this.append('rect')
              .attr({
                x: 0,
                y: 0,
                width: 15,
                height: 15,
                fill: function(d) { return d.color; }
              });

            this.append('text')
              .attr({
                x: 20,
                y: 10
              }).text(function(d) {
                return d.name + ' ('+ d.percent +')';
              });
          },

          exit: function() {
            this.remove();
          }
        }
      });

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
          },

          "merge": function() {
            this.select('rect').transition().attr({
              width: function(d) { return d.dx; },
              height: function(d) { return d.dy; }
            });
          },
          "exit": function() {
            var self = this;
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
          percent: d3.format('0%')(value / this.rawdata.total),
          color: colors.basic[i+1]
        };
      }

      return root;
    }

  });

});

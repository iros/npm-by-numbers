define(function(require) {
  var d3 = require('d3');
  // var _ = require('underscore');

  require('d3Chart');

  var colors = require('src/modules/services/colors');

  d3.chart('waffleLabelsChart', {

    initialize: function() {

      this.bases = {
        labels: this.base.append('g')
          .classed('labels', true)
      };

      this.layer('labels', this.bases.labels, {
        dataBind: function(data) {
          return this.selectAll('g')
            .classed('breakdown', true)
            .data(data.grids);
        },

        insert: function() {
          return this.append('g');
        },

        events: {

          // for every grid breakdown, create a group that will
          // contain all our labels. Translate it along the x axis
          // based on the columns and rows that we have.
          merge: function() {
            var chart = this.chart();
            var groups = this.attr('transform', function(d) {
              return 'translate(' + (d.offset + (d.cols * d.gridx) + (chart.dims.radius/2)) + ',10)';
            });


            // if we have highlighted properties, then add labels
            // for those.
            if (chart.highlightBy) {
              groups.each(function(d) {
                var groupLabels = d3.select(this).selectAll('text')
                  .data(chart.highlightBy);

                var enteringGroupLablels = groupLabels.enter();

                enteringGroupLablels.append('text')
                  .attr('y', function(dd) {
                    return chart.questionBreakdownValues[d.group].scale(dd);
                  })
                  .style('fill', function(dd) {
                    return chart.questionBreakdownValues[d.group].colorscale(dd);
                  })
                  .style('text-anchor', 'start')
                  .style('opacity', 0)
                  .text(function(dd) {
                    // return total amout
                    if (chart.questionBreakdownValues[d.group].questionValuesP[dd] > 0) {
                      return d3.format(',0')(chart.questionBreakdownValues[d.group].questionValues[dd]);
                    } else {
                      return '';
                    }
                  })
                  .transition()
                  .delay(function(dd) {
                    return d.gridx * d.gridy;
                  })
                  .style('opacity', 1);

                enteringGroupLablels.append('text')
                  .attr('y', function(dd) {
                    return chart.questionBreakdownValues[d.group].scale(dd) + 15;
                  })
                  .style('fill', function(dd) {
                    return chart.questionBreakdownValues[d.group].colorscale(dd);
                  })
                  .style('text-anchor', 'start')
                  .style('opacity', 0)
                  .text(function(dd) {
                    // return total amout
                    if (chart.questionBreakdownValues[d.group].questionValuesP[dd] > 0) {
                      return "(" + d3.format('0%')(chart.questionBreakdownValues[d.group].questionValuesP[dd]) + ")";
                    } else {
                      return '';
                    }
                  })
                  .transition()
                  .delay(function(dd) {
                    return d.gridx * d.gridy;
                  })
                  .style('opacity', 1);
              });

            }

          },

          update: function() {
            // remove existing text elements
            this.selectAll('text').remove();
          },

          exit: function() {
            console.log(this);
            this.remove();
          }
        }
      });

    },

    transform: function(data) {
      var self = this;
      self.data = data;

      if (self.highlightBy && self.highlightBy.length) {

        if (!self.questionBreakdownValues) {
          self.questionBreakdownValues = {};
        }

        // what are all the options available for that question?
        var questionOptions = self.data.question_order[self._question];

        // what's the data, per breakdown, for each question order?
        //
        var breakdowns = self.data.order[self._breakdown];
        breakdowns.forEach(function(cat, idx) {

          // only compute scales for a category we don't have yet.
          if (!self.questionBreakdownValues[cat]) {
            self.questionBreakdownValues[cat] = {};
            var breakdownCategoryData = self.data.questions[self._breakdown][cat];

            var sum = 0;

            self.questionBreakdownValues[cat].valuesForScales = [0];
            self.questionBreakdownValues[cat].questionValues = {};
            self.questionBreakdownValues[cat].questionValuesP = {};

            questionOptions.forEach(function(qo) {
              sum += breakdownCategoryData[qo];
              self.questionBreakdownValues[cat].valuesForScales.push(sum);
              self.questionBreakdownValues[cat].questionValues[qo] = breakdownCategoryData[qo];

              // percent of total.
              self.questionBreakdownValues[cat].questionValuesP[qo] = breakdownCategoryData[qo] / self.data.dimensions[self._breakdown][cat];
            });

            var heightScale = d3.scale.linear()
              .domain([0, self.data.dimensions[self._breakdown][cat]])

              // total number of rows (cat count / number of cols)
              // divided by total number of rows for group
              // then that ratio times the total height of the container.
              .range([0, (Math.ceil((self.data.dimensions[self._breakdown][cat] / 100) /
                           self.dims.grids[idx].cols) / self.dims.grids[idx].rows) *
                           self.dims.grids[idx].height]);

            var heightPositions = self.questionBreakdownValues[cat].valuesForScales.map(function(mm) {
              return heightScale(mm);
            });

            // make a scale that maps all possible answer positions
            // for eac breakdown.
            self.questionBreakdownValues[cat].scale = d3.scale.ordinal()
              .domain(questionOptions)
              .range(heightPositions);

            // add color, because we can
            self.questionBreakdownValues[cat].colorscale = d3.scale.ordinal()
              .domain(questionOptions)
              .range(colors.highlightProperties);
          }
        });
      }

      return self.dims;
    },

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
     * Sets or gets the type of breakdown
     * @param  {String} breakdown Breakdown type (age, version, dependents)
     * @return {[String]}           Name of current breakdown
     */
    breakdown: function(breakdown) {
      var self = this;
      if (arguments.length) {
        self._breakdown = breakdown;
        delete self.questionBreakdownValues;
      } else {
        return self._breakdown;
      }
      return this;
    },

    /**
     * Set or get the question being reviewd
     * @param  {String} question question
     * @return {[String]}          question
     */
    question: function(question) {
      var self = this;

      if (arguments.length) {
        if (self._question !== question) {
          delete self.questionBreakdownValues;
          self._question = question;
        }
      } else {
        return self._question;
      }
      return self;
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
  });

});

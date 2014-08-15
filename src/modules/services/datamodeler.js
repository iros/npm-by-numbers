define(function(require) {

  var _ = require('underscore');

  /**
   * Generates a number of dots, per breakdown.
   * @param  {int} total    total number of dots
   * @param {int}  perdot   number of packages per dot
   * @return {Array}        dot objects
   */
  function _generateDots(total, perdot) {
    var dots = [], count = 0, i;

    for(i = 0 ; i < total; i+= perdot) {
      dots.push({ id : count, breakdown: 'total', breakdown_idx: 0 });
      count += 1;
    }

    return dots;
  }

  /**
   * Reshapes dot data to match a specific breakdown.
   * @param {Object} data the stats object.
   */
  var DataModeler = function(data, breakdown) {
    this.breakdown = breakdown || "versions";   // default breakdown
    this.perdot = 100;                          // 100 packages per dot.

    this.data = data;
    this.breakdowns = _.keys(data.order);
    this.total = data.total;

    this.dots = _generateDots(this.total, this.perdot);
  };

  /**
   * Updates the data dot points to a specific breakdown. We keep the dots with the
   * same index, so that we can animate them, but we change the data
   * properties so that we can color and position accordingly. It's kind of a
   * crazy hack, but it works really well and leaves us with a lot of continuity
   * between breakdowns.
   * @param {String} breakdown The name of the breakdown to switch to: versions,age,dependents.
   */
  DataModeler.prototype.setBreakdown = function(breakdown) {
    var self = this;

    var category, count = 0, dot, properties, dots = [];

    // get the breakdown categories:
    var categories = this.data.order[breakdown];

    for(var i = 0; i < categories.length; i++) {
      category = categories[i];

      var subset_data = this.data.questions[breakdown][category];
      var subset_size = this.data.dimensions[breakdown][category];

      // make counters for all our questions.
      var counters = {}, questions = [];
      _.each(this.data.question_order, function(answers, question) {
        questions.push(question);
        counters[question] = {
          current_category : self.data.question_order[question][0],
          current_category_idx: 0,
          current: 0,
          total: 0 };
      });

      for (var j = 0; j < Math.round(subset_size / this.perdot); j++) {

        // get the dot we're modifying (we're reusing them, so that the ids
        // stay the same.)
        dot = this.dots[count++];

        if (typeof dot === "undefined") {
          dot = { id : count-1 };
        } else {
          // save the ID, drop the rest
          dot = { id : dot.id };
        }

        // save the specific breakdown category here
        dot.category = breakdown;
        dot[breakdown] = category;
        dot.breakdown = category;
        dot.breakdown_idx = this.data.order[breakdown].indexOf(category);

        var currCount = (j+1) * this.perdot;
        var k;

        // copy over orderless properties
        properties = self.data.questions_no_order;
        for (k = 0; k < properties.length; k++) {

          if (currCount < subset_data[properties[k]]) {
            dot[properties[k]] = 1;
          } else {
            dot[properties[k]] = 0;
          }
        }

        // copy over properties with an order
        for(k = 0; k < questions.length; k++) {

          var question = questions[k];
          var questionCategory = counters[question].current_category;
          var questionOrder = this.data.question_order[question];

          currCount = counters[question].current;

          // if we still fall under the value
          if (currCount < subset_data[questionCategory]) {
            dot[questionCategory] = 1;

          } else {
            // we no longer fall under the value, advance categories
            var c = ++counters[question].current_category_idx;
            questionCategory = this.data.question_order[question][c];

            // if we have a next category, update it.
            if (typeof questionCategory !== "undefined") {
              counters[question].current_category = questionCategory; //reset category
              currCount = counters[question].current = this.perdot; // reset counter

              if (subset_data[questionCategory] !== 0) {
                dot[questionCategory] = 1;
              } else {
                dot[questionCategory] = 0;
              }
            }
          }

          // mark all others as false
          for(var m = 0; m < questionOrder.length; m++) {
            if (questionOrder[m] !== questionCategory) {
              dot[questionOrder[m]] = 0;
            }
          }

          counters[question].current += this.perdot;
          counters[question].total   += this.perdot;
        }

        dots.push(dot);
      }
    }

    this.dots = dots;
    this.breakdown = breakdown;
  };

  /**
   * Builds a reverse lookup dictionary for questions, so that each question
   * subset(category) points to its original question group.
   * @return {Object} question group dict.
   */
  DataModeler.prototype.reverseQuestionDictionary = function() {
    var qs = {};

    _.each(this.data.question_order, function(answerArray, question) {
      _.each(answerArray, function(q) {
        qs[q] = question;
      });
    });

    return qs;
  };

  return DataModeler;

});

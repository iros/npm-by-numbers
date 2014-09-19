define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var d3 = require('d3');
  var colors = require('src/modules/services/colors');

  return Backbone.View.extend({
    template: require('tmpl!src/modules/templates/question-breakdown'),

    events: {
      'click' : 'onQuestionBreakdownSelect'
    },

    initialize: function(options) {

      options = options || {};

      this.data = null;
      this.isOpen = false;
      this.question = null;
      this.breakdown = null;
      this.selectedSubsets = [];

      this.pFormat = d3.format('0.1%');
      this.cFormat = d3.format('0,');

      if (options.question) {
        this.question = options.question;
      }
    },

    afterRender: function() {

      // create a width scale that we'll use to setup our data.
      this.scale = d3.scale.linear()
        .range([0, this.$el.width()])
        .domain([0, this.data.total]);

        // if we got a question during initialization, do the thing.
        if (this.question) {
          this.setQuestion(this.question);
        }
    },

    onQuestionBreakdownSelect: function(ev) {
      var target = $(ev.target).closest('.breakdown');
      var questionSubset = target.data('questionsubset');

      if (this.selectedSubsets.indexOf(questionSubset) !== -1) {
        target.removeClass('selected');
        this.selectedSubsets.splice(this.selectedSubsets.indexOf(questionSubset), 1);
      } else {
        target.addClass('selected');
        this.selectedSubsets.push(questionSubset);
      }

      this.trigger('highlight-subset', this.selectedSubsets);
      return false;
    },

    /**
     * Saves the data for the view
     * @param {Object} data breakdown data
     */
    setData: function(data) {
      this.data = data;
      return this;
    },

    /**
     * Sets the current breakdown.
     * We don't actually need to update the question bar if this happens
     * because presumably we are looking at the same breakdown
     * although, we may want to clear the question bar in the future
     * since the questions don't actually overlap. TODO.
     * @param {String} breakdown Breakdown type
     */
    setBreakdown: function(breakdown) {
      this.breakdown = breakdown;
    },

    /**
     * Returns current question
     * @return {String} current question
     */
    getQuestion: function() {
      return this.question;
    },

    /**
     * Updates the bar to the correct question.
     * @param {[type]} question [description]
     */
    setQuestion: function(question) {

      // open if closed or new question
      if (!this.isOpen || question !== this.question) {

        this.question = question;
        this.selectedSubsets = [];

        // Is this an ordered question?
        var questionOrder = this.data.question_order[this.question];
        if (typeof questionOrder !== "undefined") {

          // if (!this.isOpen) {
          //   this.show();
          // }

          // get the breakdowns we are looking at
          var offset = 0;
          var templateData = [];
          var width = this.$el.width() - 16; // full length of container - padding

          // update scale to have the max of our single breakdown width
          this.scale.range([0, width]);

          for(var i = 0; i < questionOrder.length; i++) {
            var questionSubset = questionOrder[i];
            var count = this.data.questions.all[questionSubset];

            // compute the width of this box, based on count
            var barwidth = this.scale(count);

            templateData.push({
              barwidth: barwidth,
              width: width,
              offset: offset,
              questionSubset: questionSubset,
              name: this.data.names[question][i],
              value: this.cFormat(count),
              percentage: this.pFormat(count / this.data.total),
              color: colors.highlightProperties[i]
            });

            offset += width;
          }

          this.$el.css('display', 'none');
          this.$el.html(this.template({ data : { points : templateData }}));
          this.$el.slideDown();

        } else {
          // this is not an ordered question, that just has a single breakdown.
          this.$el.hide();
        }

      }

      return this;
    }
  });

});
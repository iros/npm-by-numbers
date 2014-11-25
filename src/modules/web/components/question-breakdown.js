define(function(require) {
  var $ = require('jquery');
  var _ = require('lodash');
  var d3 = require('d3');
  var colors = require('src/modules/web/services/colors');
  var Layout = require("layoutmanager");

  return Layout.extend({
    template: require('tmpl!src/modules/web/templates/question-breakdown'),
    manage: true,

    events: {
      'click' : '_onOptionSelectClick'
    },

    initialize: function(options) {

      var self = this;
      options = options || {};

      self.data = null;
      self.isOpen = false;
      self.question = null;
      self.breakdown = null;
      self.selectedOptions = [];

      self.pFormat = d3.format('0.1%');
      self.cFormat = d3.format('0,');

      if (options.question) {
        self.question = options.question;
      }
    },

    afterRender: function() {

      // create a width scale that we'll use to setup our data.
      this.scale = d3.scale.linear()
        .range([0, this.$el.width()])
        .domain([0, this.data.total]);

        // if we got a question during initialization, do the thing.
        if (this.question) {
          this.showQuestionOptions(this.question);
        }
    },

    /**
     * Allows for the selection of a specific subset of options. It deselects
     * everything else that was selected that doesn't need to remain selected.
     * If the requested options are the same as what is currently selected, then
     * they are all deselected.
     * @param  {[type]} whichOptions [description]
     * @return {[type]}              [description]
     */
    toggleOptionGroup: function(whichOptions) {
      var self = this;

      // find what we should remove
      self.selectedOptions.forEach(function(selectedOption) {

        // if this option isn't marked for selection, remove it.
        if (whichOptions.indexOf(selectedOption) === -1) {
          var target = self.$el.find('[data-questionsubset=' + selectedOption + ']');
          target.removeClass('selected');
        }

      });

      if (!_.isArray(whichOptions)) {
        whichOptions = [whichOptions];
      }

      // if the current selected subsets is equal to the whichOptions we should
      // highlight, then we need to just disable all of them.
      if (_.isEqual(self.selectedOptions, whichOptions)) {
        self.toggleOptionGroup([]);

      // there is some difference, so let's highlight all the ones we're
      // supposed to.
      } else {
        whichOptions.forEach(function(whichOption) {
          // find the option element
          var target = self.$el.find('[data-questionsubset=' + whichOption + ']');
          target.addClass('selected');

        });

        self.selectedOptions = whichOptions;
      }

      self.trigger('highlight-subset', self.selectedOptions);
      return self;
    },

    /**
     * Toggles the state of a single option. Turns it on if it isn't in the
     * currently selected options, and turns it off otherwise.
     * @param  {String} whichOption option to highlight or to deselect.
     * @return {[type]}             [description]
     */
    toggleOption: function(whichOption) {

      // find the option element
      var target = this.$el.find('[data-questionsubset=' + whichOption + ']');

      // if it already is highlighted, remove it
      if (this.selectedOptions.indexOf(whichOption) !== -1) {
        target.removeClass('selected');
        this.selectedOptions.splice(this.selectedOptions.indexOf(whichOption), 1);

      // else mark it selected and add it to the selected subsets.
      } else {
        target.addClass('selected');
        this.selectedOptions.push(whichOption);
      }

      this.trigger('highlight-subset', this.selectedOptions);
      return this;
    },

    _onOptionSelectClick: function(ev) {
      var target = $(ev.target).closest('.breakdown');
      var whichOption = target.data('questionsubset');

      this.toggleOption(whichOption, false);
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
     * Builds the menu of options relevant to the question selected
     * by the user and displays it.
     * @param {String} question the question id.
     */
    showQuestionOptions: function(question) {

      // open if closed or new question
      if (!this.isOpen || question !== this.question) {

        this.question = question;
        this.selectedOptions = [];

        // Is this an ordered question?
        var questionOrder = this.data.question_order[this.question];
        if (typeof questionOrder !== "undefined") {

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
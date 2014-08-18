define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var QuestionsView = require('src/modules/components/questions-view');

  return Backbone.View.extend({
    template : require('tmpl!src/modules/templates/footer-start'),

    events: {
      'click a.start': 'onStart',
      'click .grid-menu li': 'gridSwitch'
    },

    initialize: function() {
      this.questionsView = null;
      this.questionsRendered = false;
    },

    /**
     * Saves data
     * @param {Object} data Data
     */
    setData: function(data) {
      this.data = data;
    },

    /**
     * Returns true if questions are rendered. false otherwise.
     * @return {Boolean} true if rendered, false otherwise.
     */
    areQuestionsRendered: function() {
      return this.questionsRendered;
    },

    /**
     * Returns current breakdown (versions, age, or dependents)
     * @return {String} current breakdown
     */
    getBreakdown: function() {
      return this.breakdown;
    },

    /**
     * Renders questions for appropriate breakdown
     * @param  {String} breakdown breakdown name
     */
    renderQuestions: function(breakdown) {

      var self = this;

      // replace footer with controls footer
      self.$el.html(require('tmpl!src/modules/templates/footer-controls')());

      // render default
      self.questionsView = new QuestionsView({ breakdown: breakdown });

      self.questionsView.on('question-switch', function(q) {
        self.trigger('question-switch', breakdown, q); // pass it on
      });

      self.insertView('.questions ul', self.questionsView).render();

      if (breakdown) {
        self.updateBreakdown(breakdown);
      }

      self.questionsRendered = true;
      self.breakdown = breakdown;
    },

    onStart: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.renderQuestions();

      // trigger breakdown update
      this.trigger('navigate', 'breakdown/versions');

      return false;
    },

    updateBreakdown: function(breakdown) {

      // remove selected from current
      var current = this.$el.find('li.selected');
      current.removeClass('selected');

      // mark new selected based on breakdown
      var newselected = this.$el.find('li[data-grid=' + breakdown + ']');
      newselected.addClass('selected');

      // update questions
      this.questionsView.updateBreakdown(breakdown);

      return breakdown;
    },

    gridSwitch: function(ev) {

      var breakdown = $(ev.target).data('grid');

      this.updateBreakdown(breakdown);

      // trigger breakdown update
      this.trigger('navigate', 'breakdown/' + breakdown);

      return false;
    }

  });

});
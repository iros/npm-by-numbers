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

    setData: function(data) {
      this.data = data;
    },

    areQuestionsRendered: function() {
      return this.questionsRendered;
    },

    renderQuestions: function(breakdown) {

      var self = this;

      // replace footer with controls footer
      self.$el.html(require('tmpl!src/modules/templates/footer-controls')());

      // render default
      self.questionsView = new QuestionsView({ breakdown: breakdown });

      self.questionsView.on('question-switch', function(q) {
        self.trigger('question-switch', q);
      });

      self.insertView('.questions ul', self.questionsView).render();

      if (breakdown) {
        self.updateQuestions(breakdown);
      }

      self.questionsRendered = true;
    },

    onStart: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.renderQuestions();

      // trigger breakdown update
      this.trigger('navigate', 'breakdown/versions');

      return false;
    },

    updateQuestions: function(breakdown) {

      // remove selected from current
      var current = this.$el.find('li.selected');
      current.removeClass('selected');

      // mark new selected based on breakdown
      var newselected = this.$el.find('li[data-grid=' + breakdown + ']');
      newselected.addClass('selected');

      // update questions
      this.questionsView.questionChange(breakdown);

      return breakdown;
    },

    gridSwitch: function(ev) {

      var breakdown = $(ev.target).data('grid');

      this.updateQuestions(breakdown);

      // trigger breakdown update
      this.trigger('navigate', 'breakdown/' + breakdown);

      return false;
    }

  });

});
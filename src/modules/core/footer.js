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
    },

    onStart: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      // replace footer with controls footer
      this.$el.html(require('tmpl!src/modules/templates/footer-controls')());

      // render default
      this.questionsView = new QuestionsView();
      this.insertView('.questions ul', this.questionsView).render();

      return false;
    },

    gridSwitch: function(ev) {

      // remove selected from current
      var target = $(ev.target);
      target.parent().find('.selected').removeClass('selected');
      target.addClass('selected');

      // tell the questions view to update its grid
      var questionType = target.data('grid');
      this.questionsView.trigger('change-questions', questionType);

      this.trigger('grid-switch', target.data('grid'));

      return false;
    }

  });

});
define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var questionTemplates = {
    versions: require('tmpl!src/modules/templates/questions-versions'),
    age: require('tmpl!src/modules/templates/questions-age'),
    dependents: require('tmpl!src/modules/templates/questions-dependents')
  };


  return Backbone.View.extend({
    events: {
      'click li a' : 'questionClick'
    },

    initialize: function(options) {
      this.breakdown = options.breakdown;
      this.template = questionTemplates[options.breakdown || 'versions'];
    },

    // when someone tells us to update the questions, change to the
    // appropriate breakdown
    updateBreakdown: function(breakdown) {

      var self = this;

      if (self.breakdown !== breakdown) {
        self.$el.fadeOut(function() {

          self.breakdown = breakdown;
          self.$el.html(questionTemplates[breakdown]());
          self.$el.fadeIn();

        });
      }

    },

    questionClick: function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var target = $(ev.target);
      var q = target.data('question');
      target.addClass('selected');
      if (this.current) {
        this.current.removeClass('selected');
      }
      this.current = target;
      this.trigger('question-switch', q);
      console.log(q);
      return false;
    }
  });
});
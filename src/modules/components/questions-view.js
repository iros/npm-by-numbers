define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var questionTemplates = {
    intro: require('tmpl!src/modules/templates/questions-intro'),
    versions: require('tmpl!src/modules/templates/questions-versions'),
    age: require('tmpl!src/modules/templates/questions-age'),
    dependents: require('tmpl!src/modules/templates/questions-dependents')
  };


  return Backbone.View.extend({

    template: questionTemplates.intro,

    events: {
      'click a.start': 'onStart',
      'click li a' : 'questionClick'
    },

    initialize: function(options) {
      options = options || {};
      this.breakdown = options.breakdown || 'intro';
      this.template = questionTemplates[this.breakdown];
    },

    setData: function(data) {
      this.data = data;
    },

    // when someone tells us to update the questions, change to the
    // appropriate breakdown
    setBreakdown: function(breakdown) {

      var self = this;

      if (self.breakdown !== breakdown) {
        self.$el.fadeOut(function() {

          self.breakdown = breakdown;
          self.$el.html(questionTemplates[breakdown]());
          self.$el.fadeIn();

        });
      }

    },

    onStart: function() {
      this.trigger('navigate', 'breakdown/versions');
    },

    /**
     * what happens when a user clicks on a question?
     * Mark that question link as seleted and trigger the question switch
     * event, that will go up the chain to the footer parent view.
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
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
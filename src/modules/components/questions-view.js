define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var Accordion = require('src/modules/services/accordion');
  var QuestionBreakdownView = require('src/modules/components/question-breakdown');

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
      'click li a' : 'questionClick',
      'click .content li.highlights' : 'factClick'
    },

    initialize: function(options) {
      options = options || {};
      this.breakdown = options.breakdown || 'intro';
      this.template = questionTemplates[this.breakdown];
      this.question = null;
    },

    setData: function(data) {
      this.data = data;
    },

    // when someone tells us to update the questions, change to the
    // appropriate breakdown
    setBreakdown: function(breakdown) {
      var self = this;

      if (self.breakdown !== breakdown) {

        // remove current accordion from questions if one exists
        if (self.accordion) {
          self.accordion.destroy();
        }

        // fade out questions
        self.$el.fadeOut(function() {

          // get new questions
          self.breakdown = breakdown;
          self.$el.html(questionTemplates[breakdown]());

          // enable questions as accordions!
          self.accordion = new Accordion(self.$el.find('ul'));
          self.accordion.setData(self.data);

          self.accordion.on('question-selected', function(question) {

            self.question = question;

            var contentEl = self.accordion.getContentEl();

            self.questionBreakdownView = new QuestionBreakdownView({
              question : question
            });

            // append element first, so that we have a width for it
            // then render it.
            self.questionBreakdownView.$el.appendTo(contentEl);
            self.questionBreakdownView.setData(self.data).render();

            // when a breakdown is selected, trigger highlight subset with
            // the selected breakdown.
            self.questionBreakdownView.on('highlight-subset', function(subset) {
              self.trigger('highlight-subset', subset);
            });


          });

          self.accordion.on('question-closed', function(d) {
            if (self.questionBreakdownView) {
              self.questionBreakdownView.off();
              self.questionBreakdownView.remove();
              self.questionBreakdownView.$el.remove();
            }
          });

          // and fade them in
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
     * @param  {jQuery.Event} ev [description]
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
      return false;
    },

    /**
     * what happens when someone clicks a fact that is a part of the question content?
     * We should be highlighting some part of the chart, so let's do that.
     * @param  {jQuery.Event} e event
     * @return {[type]}   [description]
     */
    factClick: function(ev) {
      ev.stopPropagation();
      ev.preventDefault();

      var target = $(ev.target);
      var q = target.data('highlighted').split(",");

      this.trigger('highlight-subset', q);
      if (this.questionBreakdownView) {
        this.questionBreakdownView.toggleOptionGroup(q);
      }
      return false;
    }

  });
});
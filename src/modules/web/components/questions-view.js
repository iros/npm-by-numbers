define(function(require) {
  var $ = require('jquery');
  var Accordion = require('../services/accordion');
  var QuestionBreakdownView = require('../components/question-breakdown');
  var Layout = require("layoutmanager");

  var questionTemplates = {
    intro: require('tmpl!../templates/questions-intro'),
    versions: require('tmpl!../templates/questions-versions'),
    age: require('tmpl!../templates/questions-age'),
    dependents: require('tmpl!../templates/questions-dependents')
  };


  return Layout.extend({

    manage: true,

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
    setBreakdown: function(breakdown, question) {
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

          // when a question is opened
          self.accordion.on('question-selected', function(question) {
            self.fillQuestionBody(question);
            self.trigger('question-switch', self.breakdown, question);
          });

          // when a question is closed
          self.accordion.on('question-closed', self.closeQuestion, self);

          // and fade them in
          var onFadeIn = function(){};

          if (typeof question!== "undefined") {
            onFadeIn = function() {
              self.accordion.openByName(question).then(function() {
                self.fillQuestionBody(question);
              });
            };
          }
          self.$el.fadeIn(onFadeIn);

        });
      }
    },



    closeQuestion: function(question) {
      var self = this;
      if (self.questionBreakdownView) {
        self.questionBreakdownView.off();
        self.questionBreakdownView.remove();
        self.questionBreakdownView.$el.remove();
      }
      return self;
    },

    fillQuestionBody: function(question) {
      var self = this;
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

      return true;
    },

    onStart: function() {
      this.trigger('navigate', 'breakdown/versions');
    },

    /**
     * what happens when a user clicks on a question?
     * Mark that question link as seleted and trigger the question switch
     * event which will go up to the layout.
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

      var target = $(ev.target).closest('li.highlights');
      var q = target.data('highlighted').split(",");

      this.trigger('highlight-subset', q);
      if (this.questionBreakdownView) {
        this.questionBreakdownView.toggleOptionGroup(q);
      }
      return false;
    }

  });
});

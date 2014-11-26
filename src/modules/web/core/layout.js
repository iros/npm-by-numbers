define(function(require) {

  var Layout = require("layoutmanager");
  Layout.configure({ manage: true });

  var TopbarView = require('src/modules/web/components/topbar');
  var VisView = require('src/modules/web/components/vis');
  var QuestionView = require('src/modules/web/components/questions-view');
  var AboutView = require('src/modules/shared/components/about');
  var currentQuestion;

  // Use main layout and set Views.
  var topbarView = new TopbarView();
  var visView = new VisView();
  var questionView = new QuestionView();
  var aboutView = new AboutView();

  var layout;
  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/web/layouts/main"),

    views: {
      '#topbar': topbarView,
      '#vis' : visView,
      '#questions': questionView
    },

    initialize: function() {
      layout = this;
    },

    setData: function(data) {
      this.data = data;
      topbarView.setData(data);
      visView.setData(data);
      questionView.setData(data);
    },

    updateQuestion: function(question, highlights, clear) {
      // clear highlight
      if (clear) {
        visView.highlightProperties([]);
      }
      // set question
      if (question) {
        visView.setQuestion(question);
      }

      // highlight breakdown
      if (highlights) {
        visView.highlightProperties(highlights);
      }

      // if this is just a single highlight
      if (question && this.data.questions_no_order.indexOf(question) > -1) {
        visView.highlightProperties([question]);
      }
    },

    updateChart: function() {
      visView.updateChart();
    },

    updateBreakdown: function(breakdown, question) {

      this.breakdown = breakdown;

      // update the waffle chart
      if (question) {
        visView.setBreakdown(breakdown, question);
      } else {
        visView.setBreakdown(breakdown);
      }

      // update the top tabs
      topbarView.setBreakdown(breakdown);

      // update the question bar
      if (question) {
        questionView.setBreakdown(breakdown, question);
      } else {
        questionView.setBreakdown(breakdown);
      }

    },

    hide: function(what) {
      if (typeof what === "undefined") {
        this.$el.find('#questions').hide();
        this.$el.find('#vis').hide();
        this.$el.find('.explore-by').hide();
      } else if (what === "Questions") {
        this.$el.find('#questions').hide();
      } else if (what === "Chart") {
        this.$el.find('#vis').hide();
      } else if (what === "Controls") {
        this.$el.find('.explore-by').hide();
      }
    },

    hideQuestions: function() {
      this.hide('Questions');
    },
    hideChart: function() {
      this.hide('Chart');
    },
    hideControls: function() {
      this.hide('Controls');
    },

    show: function(what) {
      this.hideAbout();
      if (typeof what === "undefined") {
        //show everything that could be hidden
        this.$el.find("#questions").show();
        this.$el.find("#vis").show();
        this.$el.find(".explore-by").show();
      } else if (what === "Questions") {
        this.$el.find('#questions').show();
      } else if (what === "Chart") {
        this.$el.find('#vis').show();
      } else if (what === "Controls") {
        this.$el.find('.explore-by').show();
      }
    },

    about: function() {
      this.$el.find('#about-info').html(aboutView.render().el);
    },

    hideAbout: function() {
      aboutView.$el.remove();
    }
  });

  // navigate if we're switching breakdowns. Paths:
  // breakdown/versions, breakdown/age, breakdown/dependencies
  topbarView.on('navigate', function(path) {
    layout.trigger('navigate', path);
  });

  questionView.on('navigate', function(path) {
    layout.trigger('navigate', path);
  });

  questionView.on('question-switch', function(breakdown, question) {
    // if this is a different question, clear the canvas and navigate

    visView.highlightProperties([]);
    if (currentQuestion !== question) {
      layout.trigger('navigate', 'breakdown/' + breakdown + '/question/' + question); // navigate
    } else {
      // same question so just clear it
      layout.trigger('navigate', 'breakdown/' + breakdown);
    }
    currentQuestion = question;
  });

  questionView.on('highlight-subset', function(subset) {
    layout.updateQuestion(this.question, subset, false);
    layout.updateChart();
  });

  return MainLayout;
});

define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var TopbarView = require('src/modules/components/topbar');
  var VisView = require('src/modules/components/vis');
  var QuestionView = require('src/modules/components/questions-view');

  var currentQuestion;

  // Use main layout and set Views.
  var topbarView = new TopbarView();
  var visView = new VisView();
  var questionView = new QuestionView();

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#topbar': topbarView,
      '#vis' : visView,
      '#questions': questionView
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

      topbarView.setBreakdown(breakdown);
      questionView.setBreakdown(breakdown);
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

  var layout = new MainLayout();
  return layout;
});

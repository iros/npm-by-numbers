define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var TopbarView = require('src/modules/components/topbar');
  var VisView = require('src/modules/components/vis');
  var QuestionBreakdownView = require('src/modules/components/question-breakdown');
  var FooterView = require("src/modules/components/footer");

  // Use main layout and set Views.

  var topbarView = new TopbarView();
  var footerView = new FooterView();
  var visView = new VisView();
  var questionBreakdownView = new QuestionBreakdownView();

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#topbar': topbarView,
      '#vis' : visView,
      '#question-breakdown': questionBreakdownView,
      '#bottombar' : footerView,

    },

    setData: function(data) {
      topbarView.setData(data);
      visView.setData(data);
      questionBreakdownView.setData(data);
      footerView.setData(data);
    },

    updateQuestion: function(question, highlights, clear) {
      // clear highlight
      if (clear) {
        visView.highlightProperties([]);
      }
      // set question
      if (question) {
        questionBreakdownView.setQuestion(question);
      }
      // highlight breakdown
      if (highlights) {
        visView.highlightProperties(highlights);
      }
    },

    updateBreakdown: function(breakdown) {

      // update footer
      if (!footerView.areQuestionsRendered() ||
          footerView.getBreakdown() !== breakdown) {
        footerView.renderQuestions(breakdown);
      }

      // update the waffle chart
      visView.updateGrid(breakdown);

      // update the categories at the top
      topbarView.updateGrid(breakdown, visView.getDimensions());

      // update the breakdown in a question breakdown view
      questionBreakdownView.setBreakdown(breakdown);
    }
  });

  // navigate if we're switching breakdowns. Paths:
  // breakdown/versions, breakdown/age, breakdown/dependencies
  footerView.on('navigate', function(path) {
    layout.trigger('navigate', path);
  });

  footerView.on('question-switch', function(breakdown, question) {
    visView.highlightProperties([]);
    layout.trigger('navigate', 'breakdown/' + breakdown + '/question/' + question); // navigate
  });

  questionBreakdownView.on('highlight-subset', function(subset) {
    layout.updateQuestion(null, subset, false);
  });

  var layout = new MainLayout();
  return layout;
});

define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var FooterView = require("src/modules/core/footer");
  var VisView = require('src/modules/components/vis');

  // Use main layout and set Views.

  var footerView = new FooterView();
  var visView = new VisView();

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#bottombar' : footerView,
      '#vis' : visView
    },

    updateBreakdown: function(breakdown) {
      visView.updateGrid(breakdown);
    },

    renderQuestions: function(breakdown) {
      if (!footerView.areQuestionsRendered()) {
        footerView.renderQuestions(breakdown);
      }
    }
  });

  // navigate if we're switching breakdowns. Paths:
  // breakdown/versions, breakdown/age, breakdown/dependencies
  footerView.on('navigate', function(path) {
    layout.trigger('navigate', path);
  });

  var layout = new MainLayout();
  return layout;
});

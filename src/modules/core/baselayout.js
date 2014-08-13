define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var TopbarView = require('src/modules/core/topbar');
  var FooterView = require("src/modules/core/footer");
  var VisView = require('src/modules/components/vis');

  // Use main layout and set Views.

  var topbarView = new TopbarView();
  var footerView = new FooterView();
  var visView = new VisView();

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#topbar': topbarView,
      '#bottombar' : footerView,
      '#vis' : visView
    },

    setData: function(data) {
      topbarView.setData(data);
      visView.setData(data);
      footerView.setData(data);
    },

    updateBreakdown: function(breakdown) {

      // update footer
      if (!footerView.areQuestionsRendered()) {
        footerView.renderQuestions(breakdown);
      }

      // update the waffle chart
      visView.updateGrid(breakdown);

      // update the categories at the top
      topbarView.updateGrid(breakdown, visView.getDimensions());
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

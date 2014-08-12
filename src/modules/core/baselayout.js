define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var FooterView = require("src/modules/core/footer");
  var VisView = require('src/modules/components/vis');

  // Use main layout and set Views.

  var footerView = new FooterView();
  var visView = new VisView();

  footerView.on('grid-switch', function(grid) {
    visView.trigger('grid-switch', grid);
  });

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#bottombar' : footerView,
      '#vis' : visView
    }
  });

  return new MainLayout();
});

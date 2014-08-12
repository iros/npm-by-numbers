define(function(require) {

  var Layout = require("layoutmanager");

  Layout.configure({ manage: true });

  var FooterView = require("src/modules/core/footer");
  var VisView = require('src/modules/components/vis');

  // Use main layout and set Views.
  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/layouts/main"),
    views: {
      '#bottombar' : new FooterView(),
      '#vis' : new VisView()
    }
  });

  return new MainLayout();
});

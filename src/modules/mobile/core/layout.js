define(function(require) {

  var Layout = require("layoutmanager");
  Layout.configure({ manage: true });

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/mobile/layouts/main"),
    views: {
    },

    setData: function(data) {
      this.data = data;
    }
  });

  return MainLayout;
});

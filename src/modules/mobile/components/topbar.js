define(function(require) {
  var Layout = require("layoutmanager");

  return Layout.extend({
    template : require('tmpl!../templates/topbar-start'),
    manage: true,
    events: {
      'click' : 'onClick',
    },

    initialize: function() {
      this.rendered = false;

      if (window.location.pathname === "/about") {
        this.showingHelp = true;
      } else {
        this.showingHelp = false;
      }
    },

    setData: function(data) {
      this.data = data;
    },

    onClick: function(ev) {
      ev.preventDefault();
      if (!this.showingHelp) {
        this.showingHelp = true;
        this.currentLocation = window.location.pathname === "/about" ? "/" : window.location.pathname;
        this.trigger('navigate', 'about');
      } else {
        this.showingHelp = false;
        this.trigger('navigate', this.currentLocation);
        delete this.currentLocation;
      }
    }

  });
});

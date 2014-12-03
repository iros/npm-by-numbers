define(function(require) {

  var when = require('when');
  var Backbone = require('backbone');

  var MainLayout = require('./layout');
  var layout = new MainLayout();

  var DataFetcher = require('../../shared/services/datafetcher');

  var currentPage;
  var Router = Backbone.Router.extend({

    routes: {
      "": "index",
      "about": "about"
    },

    initialize: function() {
      var self = this;

      var def = when.defer();
      self.ready = def.promise;

      self.dataFetcher = new DataFetcher('/data/stats_reduced.json');
      self.dataFetcher.then(function(data) {

        // pass data to our layout which will distribute it across
        // required views
        layout.setData(data);
        layout.render();

        // notify to all routes that we are ready.
        def.resolve(data);
      });

      // navigate if we get a routing event.
      layout.on('navigate', function(path) {
        currentPage = path;
        self.navigate(path, { trigger: true });
      });
    },

    index: function() {
      // do nothing.
      this.ready.then(function() {
        layout.show();
      });
    },

    breakdown: function(breakdown) {

    },

    question: function(breakdown, question) {

    },

    about: function() {
      this.ready.then(function() {
        layout.hide();
        layout.about();
      });
    }

  });

  return Router;
});

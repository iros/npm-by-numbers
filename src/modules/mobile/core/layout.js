define(function(require) {

  var Layout = require("layoutmanager");
  Layout.configure({ manage: true });

  var TopbarView = require('src/modules/mobile/components/topbar');
  var SliderView = require('src/modules/mobile/components/slider');
  var AboutView = require('src/modules/shared/components/about');

  var topbarView = new TopbarView();
  var sliderView = new SliderView();
  var aboutView = new AboutView();

  var layout;

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!src/modules/mobile/layouts/main"),
    views: {
      '#topbar': topbarView,
      '#vis' : sliderView
    },

    initialize: function() {
      layout = this;
    },

    setData: function(data) {
      this.data = data;
      topbarView.setData(data);
    },

    about: function() {
      this.$el.find('#about-info').html(aboutView.render().el);
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

    hideQuestions: function() {
      this.hide('Questions');
    },
    hideChart: function() {
      this.hide('Chart');
    },
    hideControls: function() {
      this.hide('Controls');
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

  return MainLayout;
});

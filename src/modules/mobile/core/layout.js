define(function(require) {

  var Layout = require("layoutmanager");
  Layout.configure({ manage: true });

  var TopbarView = require('../components/topbar');
  var SliderView = require('../components/slider');
  var VisView = require('../components/vis');
  var AboutView = require('../../shared/components/about');

  var topbarView = new TopbarView();
  var sliderView = new SliderView();
  var visView = new VisView();
  var aboutView = new AboutView();

  var layout;

  var MainLayout = Layout.extend({
    el: "#main",
    template: require("tmpl!../layouts/main"),
    views: {
      '#topbar': topbarView,
      '#slide-container' : sliderView,
      '#vis': visView
    },

    initialize: function() {
      layout = this;
    },

    setData: function(data) {
      this.data = data;
      topbarView.setData(data);
      visView.setData(data);
    },

    about: function() {
      this.$el.find('#about-info').html(aboutView.render().el);
    },

    hide: function(what) {
      if (typeof what === "undefined") {
        this.$el.find('#slide-container').hide();
        this.$el.find('#vis').hide();
        this.$el.find('.explore-by').hide();
      } else if (what === "Slides") {
        this.$el.find('#slide-container').hide();
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
        this.$el.find("#slide-container").show();
        this.$el.find("#vis").show();
        this.$el.find(".explore-by").show();
      } else if (what === "Slides") {
        this.$el.find('#slide-container').show();
      } else if (what === "Chart") {
        this.$el.find('#vis').show();
      } else if (what === "Controls") {
        this.$el.find('.explore-by').show();
      }
    },

    hideSlides: function() {
      this.hide('Slides');
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

  // if the slide changes, update the visualization.
  sliderView.on('slide-change', function(breakdown, treemap_highlight) {
    if (breakdown === null) {
      visView.hide();
    } else {
      layout.$el.find('#vis').show();
      visView.show();
      visView.update(breakdown);
      if (treemap_highlight) {
        visView.highlight(treemap_highlight);
      }
    }
  });

  return MainLayout;
});

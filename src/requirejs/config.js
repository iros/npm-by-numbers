// Shared require config regardless of platform. See main.js for requiring
// platform specific configuration.

require.config({
  baseUrl: "/",

  paths: {
    jquery: "bower_components/jquery/dist/jquery",
    backbone: "bower_components/backbone/backbone",
    underscore: "bower_components/lodash/dist/lodash.underscore",
    lodash: "bower_components/lodash/dist/lodash",
    tmpl: "bower_components/lodash-template-loader/loader",
    d3: "bower_components/d3/d3",
    d3Chart: "bower_components/d3.chart/d3.chart",
    layoutmanager: "bower_components/layoutmanager/backbone.layoutmanager",
    when: "bower_components/when/when",
    slick: "bower_components/slick.js/slick/slick",
  },

  packages: [{ main: "when", location: "bower_components/when", name: "when" }],

  shim: {
    backbone: {
      exports: "Backbone",
      deps: ["underscore", "jquery"]
    },

    underscore: { exports: "_" },

    d3Chart: {
      exports: "d3.chart",
      deps: ["d3"]
    },

    d3: {
      exports: "d3"
    },

    slick: {
      deps: ["slick"]
    }
  },
  deps: ["src/main"]
});
require.config({
  baseUrl: "..",

  paths: {
    jquery: "bower_components/jquery/dist/jquery",
    backbone: "bower_components/backbone/backbone",
    underscore: "bower_components/lodash/dist/lodash.underscore",
    lodash: "bower_components/lodash/dist/lodash",
    tmpl: "bower_components/lodash-template-loader/loader",
    d3: "bower_components/d3/d3",
    d3Chart: "bower_components/d3.chart/d3.chart",
    layoutmanager: "bower_components/layoutmanager/backbone.layoutmanager",

    components: "src/modules/components",
    layouts: "src/modules/components/layouts",
    core: "src/modules/core",
    services: "src/modules/services"
  },

  shim: {
    backbone: {
      exports: "Backbone",
      deps: ["underscore", "jquery"]
    },

    underscore: { exports: "_" },

    d3Chart: {
      exports: "d3.chart",
      deps: ["d3"]
    }
  },
  deps: ["src/main"]
});
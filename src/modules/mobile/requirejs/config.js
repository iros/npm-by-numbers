define(function() {

  console.log("mobile");
  require.config({
    map: {
      "*": {
        platform: "modules/mobile"
      }
    },

    paths: {
      components: "platform/components",
      layouts: "platform/components/layouts",
      core: "platform/core",
      services: "platform/services",

      slick: "bower_components/slick.js/slick/slick"
    },

    shim: {
      slick: {
        deps: ["jquery"]
      }
    }

  });
});
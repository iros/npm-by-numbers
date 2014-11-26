define(function() {
  require.config({

    map: {
      "*": {
        platform: "modules/web"
      }
    },

    paths: {
      components: "platform/components",
      layouts: "platform/components/layouts",
      core: "platform/core",
      services: "platform/services"
    }

  });
});
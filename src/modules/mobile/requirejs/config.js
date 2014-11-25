define(function() {

  console.log("mobile");
  require.config({

    paths: {

      platform: "src/modules/mobile",

      components: "platform/components",
      layouts: "platform/components/layouts",
      core: "platform/core",
      services: "platform/services"
    }

  });
});
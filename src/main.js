define(function(require, exports, module) {
  'use strict';

  var Backbone = require('backbone');
  var $ = require('jquery');
  var WebRouter = require('./modules/web/core/router');
  var MobileRouter = require('./modules/mobile/core/router');

  // Figure out which require config we should be calling to add platform
  // specific requirements:
  var platform = Modernizr.mq('(min-width: 760px)') ? 'web' : 'mobile';

  // Load hard dependencies as well as core platform router.
  var Router = platform === 'web' ? WebRouter : MobileRouter;
  new Router();

  Backbone.history.start({
    pushState: true,
    root: "/"
  });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a[href^='#']:not([data-bypass])", function(evt) {
    // Prevent the default event (including page refresh).
    evt.preventDefault();

    // `Backbone.history.navigate` is sufficient for all Routers and will
    // trigger the correct events. The Router's internal `navigate` method
    // calls this anyways. The fragment is sliced from the root.
    var href = $(this).attr("href");
    Backbone.history.navigate(href, true);
  });
});

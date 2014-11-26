define(function(require) {
  var Layout = require("layoutmanager");

  var template = require('tmpl!src/modules/shared/templates/about');

  return Layout.extend({
    manage: true,
    template : template

  });
});
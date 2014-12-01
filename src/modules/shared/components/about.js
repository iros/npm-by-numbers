define(function(require) {
  var Layout = require("layoutmanager");

  var template = require('tmpl!../templates/about');

  return Layout.extend({
    manage: true,
    template : template

  });
});

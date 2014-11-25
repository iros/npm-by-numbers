define(function(require) {
  var $ = require('jquery');
  var when = require('when');

  var DataFetcher = function(url) {
    var self = this;
    self.def = when.defer();
    self.resolved = false;
    self.data = null;

    $.ajax(url).then(function(data) {

      self.resolved = true;
      self.data = data;

      self.def.resolve(data);
    }, function(err) {
      self.def.reject(err);
    });

    return self.def.promise;
  };

  DataFetcher.prototype.promise = function() {
    return this.def.promise;
  };

  DataFetcher.prototype.hasData = function() {
    return this.resolved;
  };

  DataFetcher.prototype.getData = function() {
    return this.data;
  };

  return DataFetcher;
});
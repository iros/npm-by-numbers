define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var questionTemplates = {
    versions: require('tmpl!src/modules/components/questions-versions'),
    age: require('tmpl!src/modules/components/questions-age'),
    dependents: require('tmpl!src/modules/components/questions-dependents')
  };


  return Backbone.View.extend({
    template : questionTemplates.versions,
    events: {
      'click li a' : 'questionClick'
    },

    initialize: function() {

    },

    // when someone tells us to update the questions, change to the
    // appropriate type
    questionChange: function(type) {
      this.$el.html(questionTemplates[type]());
    },

    questionClick: function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var target = $(ev.target);
      var q = target.attr('class');
      this.trigger('question-switch', q);
      console.log(q);
      return false;
    }
  });
});
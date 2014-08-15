define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  return Backbone.View.extend({
    template: require('tmpl!src/modules/templates/question-breakdown'),

    initialize: function() {
      this.data = null;
      this.isOpen = false;
    },

    afterRender: function() {
      this.bottomPos = {
        open: $('#bottombar').height() + 20, // default section padding, shared.styl.
        closed: $('#bottombar').height() - $('#question-breakdown').height()
      };
    },

    /**
     * Saves the data for the view
     * @param {Object} data breakdown data
     */
    setData: function(data) {
      this.data = data;
    },


    /**
     * Updates the bar to the correct question.
     * @param {[type]} question [description]
     */
    setQuestion: function(question) {

    },

    /**
     * Toggles visibility of bar
     * @return {Self} itself.
     */
    toggle: function() {
      if (this.isOpen) {
        this.hide();
      } else {
        this.show();
      }
      return this;
    },

    /**
     * Shows the bar.
     * @return {jQueryElm} jQuery's animation object.
     */
    show: function() {
      this.isOpen = true;
      return this.$el.parent().animate({
        bottom: this.bottomPos.open
      });
    },

    /**
     * Hides the bar.
     * @return {jQueryElm} jQuery's animation object.
     */
    hide: function() {
      this.isOpen = false;
      return this.$el.parent().animate({
        bottom: this.bottomPos.closed
      });
    }
  });

});
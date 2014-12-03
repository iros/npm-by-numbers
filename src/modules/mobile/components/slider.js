define(function(require) {

  var Layout = require('layoutmanager');
  require('jquery');
  require('slick');

  return Layout.extend({

    className : "slides",

    initialize: function(options) {
      this.slides = [
        [null, require('tmpl!../templates/00-intro')],
        ['versions', require('tmpl!../templates/05-versions')],
        ['age', require('tmpl!../templates/10-age')],
        ['dependents', require('tmpl!../templates/15-dependents')]
      ];
    },

    setData: function(data) {
      this.data = data;
    },

    afterRender: function() {
      var self = this;

      // go through slides, render them, and then
      // append them to the parent element
      for(var i = 0; i < this.slides.length; i++) {
        var slideTemplate = this.slides[i][1];

        var compiledSlide = slideTemplate(this.data);

        this.$el.append(compiledSlide);
      }

      // enable slickgrid
      this.$el.slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: false,
        onAfterChange: function(slider, i) {
          self.trigger('slide-change', self.slides[i][0]);
        }
      });

      return this;
    }

  });

});

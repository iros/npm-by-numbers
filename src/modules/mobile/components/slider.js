define(function(require) {

  var Layout = require('layoutmanager');
  require('jquery');
  require('slick');

  return Layout.extend({

    className : "slides",

    initialize: function(options) {
      this.slides = [
        require('tmpl!src/modules/mobile/templates/00-intro'),
        require('tmpl!src/modules/mobile/templates/05-versions'),
        require('tmpl!src/modules/mobile/templates/10-age'),
        require('tmpl!src/modules/mobile/templates/15-dependents')
      ];
    },

    setData: function(data) {
      this.data = data;
    },

    afterRender: function() {

      // go through slides, render them, and then
      // append them to the parent element
      for(var i = 0; i < this.slides.length; i++) {
        var slideTemplate = this.slides[i];

        var compiledSlide = slideTemplate(this.data);

        this.$el.append(compiledSlide);
      }

      // enable slickgrid
      this.$el.slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
      });

      return this;
    }

  });

});
define(function(require) {

  var Layout = require('layoutmanager');
  var $ = require('jquery');
  require('slick');
  require('../services/jquery-mobile-touch-custom');

  return Layout.extend({

    className : "slides",

    initialize: function(options) {
      this.slides = [
        [null, require('tmpl!../templates/00-intro')],
        ['versions', require('tmpl!../templates/05-versions'),
          'g.rects g.node:nth-child(2) rect'],
        ['versions', require('tmpl!../templates/06-versions-major1'),
          'g.rects g.node:nth-child(4) rect'],
        ['age', require('tmpl!../templates/10-age'),
          'g.rects g.node:nth-child(2) rect, g.rects g.node:nth-child(3) rect,g.rects g.node:nth-child(4) rect '],
        ['dependents', require('tmpl!../templates/14-dependents-how')],
        ['dependents', require('tmpl!../templates/15-dependents'),
          'g.rects g.node:nth-child(2) rect, g.rects g.node:nth-child(6) rect'],
        ['dependents', require('tmpl!../templates/16-dependents-2')]
      ];
    },

    setData: function(data) {
      this.data = data;
    },

    afterRender: function() {
      var self = this;

      // go through slides, render them, and then
      // append them to the parent element
      for(var i = 0; i < self.slides.length; i++) {
        var slideTemplate = self.slides[i][1];

        var compiledSlide = slideTemplate(self.data);

        self.$el.append(compiledSlide);
      }

      // enable slickgrid
      self.$el.slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: false,
        onAfterChange: function(slider, i) {
          self.trigger('slide-change', self.slides[i][0], self.slides[i][2]);
        }
      });

      // bind a listener to the body that will pass swipe events to slick
      // if swiped not on the slides.
      $('body').swipeleft(function(ev) {
        console.log("left");
        self.$el.slickNext();
      });

      $('body').swiperight(function(ev) {
        console.log("right");
        self.$el.slickPrev();
      });

      return self;
    }

  });

});

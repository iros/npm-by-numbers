define(function(require){
  var $ = require('jquery');
  var when = require('when');
  var Backbone = require('backbone');
  var _ = require('underscore');

  var questionTemplates = {
    ageyears: require('tmpl!src/modules/templates/questions/ageyears'),
    maintainers: require('tmpl!src/modules/templates/questions/maintainers'),
    releases: require('tmpl!src/modules/templates/questions/releases'),
    versions: require('tmpl!src/modules/templates/questions/versions'),
    updated: require('tmpl!src/modules/templates/questions/updated'),
    top_5_deep_dependents: require('tmpl!src/modules/templates/questions/top_5_deep_dependents')
  };

  var Accordion = function(el) {

    var self = this;

    this.el = el;
    this.currentlyOpenLi = null;
    this.currentlyOpenQuestion = null;
    this.data = {};

    this.el.on('click', 'li .full, li .partial', function(ev) {
      var target = $(ev.target).closest('li');
      var question = target.data('question');

      if (self.currentlyOpenQuestion === question) {
        self.close(self.currentlyOpenLi).then(function() {
          self.currentlyOpenLi = null;
          self.currentlyOpenQuestion = null;

          // all are closed, so reopen all fulls and close all partials
          self.el.find('.full').slideDown();
          self.el.find('.partial').slideUp();

          self.trigger('question-closed', self.currentlyOpenQuestion);

        });
      } else {

        //=== toggling a new one

        // close currently open
        self.close(self.currentlyOpenLi)

          // then open new one
          .then(function() {

            if (self.currentlyOpenQuestion) {
              self.trigger('question-closed', self.currentlyOpenQuestion);
            }
            self.currentlyOpenQuestion = question;

            self.open(target).then(function() {

              // when done, save opened.
              self.currentlyOpenLi = target;

              self.trigger('question-selected', question);

            });
          });
      }

    });
  };

  Accordion.prototype.setData = function(data) {
    this.data = data;
  };

  Accordion.prototype.close = function(li) {

    var def = when.defer();

    if (li) {
      li.removeClass('selected');
      var content = li.find('div.content');

      content.slideUp(function() {
        def.resolve();
      });
    } else {
      def.resolve();
    }

    return def.promise;
  };

  Accordion.prototype.openByName = function(name) {
    var li = this.el.find('[data-question=' + name + ']');
    this.currentlyOpenLi = li;
    this.currentlyOpenQuestion = name;
    return this.open(li);
  };

  Accordion.prototype.open = function(li) {
    var def = when.defer();
    var self = this;
    // mark as selected
    li.addClass('selected');

    var content = li.find('div.content');

    // set content
    if (!li.data('questionSet')) {
      var whichquestion = li.data('question');
      var template = questionTemplates[whichquestion];

      content.css('display', 'none')
        .html(template(this.data));

      li.data('questionSet', true);
    }

    // open this one's .full and close .partial
    li.find('.full').slideDown();
    li.find('.partial').slideUp();

    // find all other questions, and change them to .partial view
    var allOthers = self.el.find('li:not(.selected)');
    allOthers.find('.full').slideUp();
    allOthers.find('.partial').slideDown();

    content.slideDown(function() {
      def.resolve();
    });

    return def.promise;
  };

  Accordion.prototype.getContentEl = function() {
    if (this.currentlyOpenLi) {
      return this.currentlyOpenLi.find('.content');
    } else {
      return null;
    }
  };

  Accordion.prototype.destroy = function() {
    this.el.off('click');
  };

  Accordion.prototype = _.extend(Accordion.prototype, Backbone.Events);

  return Accordion;
});
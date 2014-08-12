define(function(require) {

  var _ = require('underscore');

  /**
   * Generates a number of dots, per breakdown.
   * @param  {int} total    total number of dots
   * @param {int}  perdot   number of packages per dot
   * @return {Array}        dot objects
   */
  function _generateDots(total, perdot) {
    var dots = [], count = 0, i;

    for(i = 0 ; i < total; i+= perdot) {
      dots.push({ id : count, breakdown: 'total', breakdown_idx: 0 });
      count += 1;
    }

    return dots;
  }

  /**
   * Reshapes dot data to match a specific breakdown.
   * @param {Object} data the stats object.
   */
  var DataModeler = function(data, breakdown) {
    this.breakdown = breakdown || "versions";   // default breakdown
    this.perdot = 100;                          // 100 packages per dot.

    this.data = data;
    this.breakdowns = _.keys(data.order);
    this.total = data.total;

    this.dots = _generateDots(this.total, this.perdot);
  };

  DataModeler.prototype.setBreakdown = function(breakdown) {

    var category, count = 0, dot, properties, dots = [];

    // get the breakdown categories:
    var categories = this.data.order[breakdown];
    for(var i = 0; i < categories.length; i++) {
      category = categories[i];

      var subset_data = this.data.questions[breakdown][category];
      var subset_size = this.data.dimensions[breakdown][category];

      for (var j = 0; j < Math.round(subset_size / this.perdot); j++) {
      // for (var j = subset_size; j >= 0; j=- this.perdot) {

        // get the dot we're modifying (we're reusing them, so that the ids
        // stay the same.)
        dot = this.dots[count++];

        if (dot) {
          // save the ID, drop the rest
          dot = { id : dot.id };

          // copy over properties if they remain
          properties = _.keys(subset_data);

          for (var k = 0; k < properties.length; k++) {
            // if ((j * this.perdot) < (Math.ceil(subset_data[properties[k]] / this.perdot) * this.perdot)){

            if ((j * this.perdot) < subset_data[properties[k]]) {
            // if (j < (Math.ceil(subset_data[properties[k]] / this.perdot) * this.perdot)){
              dot[properties[k]] = 1;
            } else {
              dot[properties[k]] = 0;
            }
          }

          // save the specific breakdown category here
          dot[breakdown] = category;
          dot.breakdown = category;
          dot.breakdown_idx = this.data.order[breakdown].indexOf(category);

          dots.push(dot);
        }
      }
    }

    // overwrite our dot collection
    this.dots = dots;
    this.breakdown = breakdown;
  };

  return DataModeler;

});

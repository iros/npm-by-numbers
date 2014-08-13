define(function(require) {
  var _ = require('underscore');
  var d3 = require('d3');

  var LayoutMath = {};

  /**
   * Computes the appropriate number of rows, columns and width and height of
   * each cell for a grid of a specific width x height that needs to fit
   * a number of elements.
   * @param  {int} width      Width of container
   * @param  {int} height     Height of container
   * @param  {int} numOfUnits Number of items to position
   * @return {Object}         Dimensions object with cols, rows, gridx and gridy.
   */
  LayoutMath.computeGrid = function(width, height, numOfUnits) {
    var rows = Math.ceil(Math.sqrt( numOfUnits * (height / width )));
    var cols = Math.ceil(numOfUnits / rows);

    var gridx = Math.floor(width / cols);
    var gridy = Math.floor(height/ rows);

    return {
      cols: cols,
      rows: rows,
      gridx: gridx,
      gridy: gridy
    };
  };

  /**
   * Computes the number of rows and cols of a space based on the unitSize provided
   * assuming each unit size is square, thus only one side is provided
   * @param  {int} width    Width of container
   * @param  {int} height   Height of container
   * @param  {int} unitSize Side of unit (square)
   * @return {Object}       Dimensions object with cols & rows, gridx and gridy.
   */
  LayoutMath.computeGridUnitSize = function(width, height, unitSize) {
    var rows = Math.ceil(height / unitSize);
    var cols = Math.ceil(width / unitSize);
    return {
      rows: rows,
      cols: cols,
      gridx: unitSize,
      gridy: unitSize
    };
  };

  /**
   * Computes grids for multiple groups that share the same workspace
   * and returns the most usable grid that will allow fitting of all the
   * dots.
   * @param  {int} width                Width of total container
   * @param  {int} height               Height of total container
   * @param  {Object} groups            Groups to use (name: count)
   * @param  {int} paddingBetweenGroups Space to leave between groups
   * @param  {int} pointsPerDot         How many points per dot
   * @param {Array} breakdownOrder      Array of group names in the desired order
   * @return {Object}                   Dimensions object of all grids + radius
   */
  LayoutMath.findMultiBreakdownDims = function(width, height, groups, paddingBetweenGroups, pointsPerDot, breakdownOrder) {
    var groupNames = _.keys(groups);
    var total = _.reduce(_.values(groups), function(memo, n) { return memo + n; }, 0);

    var groupCount = groupNames.length;

    var totalPadding = (groupCount - 1) * paddingBetweenGroups;
    var remainingWidth = width - totalPadding - 50; // padding for the end...

    var scale = d3.scale.linear()
      .domain([0, total])
      .range([0, remainingWidth]);

    var gridx = 0, gridy = 0, dims, i, group, groupWidth, grid;

    // for each breakdown:
    for(i = 0; i < groupCount; i++) {

      // get the group we're looking at
      group = groupNames[i];

      // get the width we'd be able to allocate to this group
      groupWidth = scale(groups[group]);

      // compute a grid for this group
      grid = LayoutMath.computeGrid(groupWidth, height, groups[group] / pointsPerDot);

      // if this grid is larger than we've saved so far, save it.
      if (grid.gridx > gridx) { gridx = grid.gridx; dims = grid; }
      if (grid.gridy > gridy) { gridy = grid.gridy; dims = grid; }

    }

    // compute radius based on our grid
    var r = Math.floor(Math.min(dims.gridx, dims.gridy) / 2);

    if (groupCount === 1) {
      dims.width = width;
      dims.height = height;
      dims.group = groupNames[0];
      dims.offset = 0;

      return _.extend({}, { radius : r, grids: [dims] });

    } else {

      // now that we have the radius, recompute the groups with this unit and the
      // widths we have based on value.
      var gridDims = [], offset = 0;
      for(i = 0; i < groupCount; i++) {

        // get the group we're looking at
        group = groupNames[i];

        // get the width we'd be able to allocate to this group
        groupWidth = scale(groups[group]);

        // save dimensions for this group
        var gdim = LayoutMath.computeGridUnitSize(groupWidth, height, r * 2);
        gdim.width = groupWidth;
        gdim.height = height;
        gdim.group = group;

        // we don't push to the grid array, but rather store in order based on passed
        // breakdown order.
        gridDims[breakdownOrder.indexOf(group)] = gdim;
      }

      // compute offsets based on new order
      for(i = 0; i < groupCount; i++) {
        // bump up offset each time by this group width + the padding.
        gridDims[i].offset = offset;

        offset += gridDims[i].width + paddingBetweenGroups;
      }

      return _.extend({}, { radius : r, grids: gridDims });
    }
  };

  return LayoutMath;

});
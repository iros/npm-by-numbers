define(function(require) {
  var d3 = require('d3');
  require('d3Chart');

  var colors = require('../../shared/services/colors');
  var dummyData = {
    nodes: [],
    links: []
  };

  function generateNodes() {
    var numberOfNodes = 75;

    for(var i = 0; i < numberOfNodes; i++) {
      dummyData.nodes.push({ id : i });
    }
  }

  function generateLinks() {
    var degreeOfConnection = 0.25;
    var numberOfNodes = dummyData.nodes.length;
    var numberOfConnections = 0.5 * numberOfNodes * (numberOfNodes - 1) * degreeOfConnection;

    // reset links
    dummyData.links = [];

    for(var i = 0; i < numberOfConnections; i++) {
      var source = Math.floor(Math.random() * numberOfNodes);
      var target = Math.floor(Math.random() * numberOfNodes);

      // if overlap, find different target
      while (source === target) {
        target = Math.floor(Math.random() * numberOfNodes);
      }

      dummyData.links.push({
        source: dummyData.nodes[source], target: dummyData.nodes[target]
      });
    }
  }

  generateNodes();
  generateLinks();

  d3.chart('SillyForce', {
    initialize: function(options) {

      var self = this;

      self.width = options.width;
      self.height = options.height;

      self.base.classed('sillyforce', true);

      self.bases = {
        nodes: self.base.append('g')
          .classed('nodes', true),
        links: self.base.append('g')
          .classed('links', true)
      };

      function onEnd() {
        if (self.running) {
          generateLinks();
          self.draw();
          self.start();
        }
      }

      function tick() {
        self.base.selectAll('.node').attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      }

      self.force = d3.layout.force()
        .charge(-400)
        .linkDistance(320)
        .size([self.width, self.height])
        .on("tick", tick)
        .on("end", onEnd);

      self.layer('nodes', self.bases.nodes, {
        dataBind: function(data) {
          return this.selectAll(".node")
            .data(self.force.nodes(), function(d) {
              return d.id;
            });
        },
        insert: function() {
          return this.append("circle");
        },
        events: {
          enter: function() {
            this.attr("class", function(d) {
              return "node " + d.id;
            })
            .attr("r", 8)
            .attr("fill", colors.regular);
          },
          "merge:transition": function() {
            this.attr("opacity", function(d) {
              return Math.random();
            });
          },
          exit: function() {
            this.remove();
          }
        }
      });


    },

    stop: function() {
      this.running = false;
      this.force.stop();
    },

    start: function() {
      this.running = true;
      this.force.start();
    },

    transform: function(data) {
      this.force.nodes(dummyData.nodes)
        .links(dummyData.links);
    }

  });

});
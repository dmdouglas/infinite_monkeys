// Force Directed Graph
// Based on Tom Roth's 'Zoomable Forced Directed Graph d3v4'
// https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a
//
// Some features from Simon Raper's 'An A to Z of Extra Features for the D3 Force Layout'
// http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/


// Create the space to display the graph.
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define colour scale.
var color = d3.scaleOrdinal(d3.schemeCategory20);

svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 600)
    .attr('width', 1250)
    .attr('fill', 'none')
    .attr('stroke', 'black');

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
           .distance(100)
           .strength(0.5)
           .id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().distanceMax(250))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide());

    function sigmoid(x, k) {
	        return 1 / (1 + Math.pow(Math.E, -k * (x - 0.5)));
    }

// build the arrow.
//svg.append("svg:defs").selectAll("marker")
//    .data(["end"])      // Different link/path types can be defined here
//  .enter().append("svg:marker")    // This section adds in the arrows
//    .attr("id", String)
//    .attr("viewBox", "0 -5 10 10")
//    .attr("refX", 15)
//    .attr("refY", -1.5)
//    .attr("markerWidth", 6)
//    .attr("markerHeight", 6)
//    .attr("orient", "auto")
//  .append("svg:path")
//    .attr("d", "M0,-2L4,0L0,2");



// Load the collected article data.
d3.json("news_articles_.json", function(error, graph) {
  if (error) throw error;

  // Create all-encompassing group for zooming.
  var g = svg.append("g")
      .attr("class", "everything");

  // Set up tooltips for the nodes.
  var tip = d3.tip()
      .attr('class', 'd3.tip')
      .offset([-10, 0])
      .html(function (d) { return d.source + ""; })
    g.call(tip);  
    
  // Create the lines between the nodes.
  var link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return 7 * sigmoid(d.value, 10); })
      .attr("marker-end", "url(#end)");
    
  // Create the nodes.
  var groups = g.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append('g').attr('class', 'label')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  // Create the coloured circles for each node.
  var node = groups.append("circle")
      .attr("r", 7)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  // Add zoom to the graph.
  var zoom_handler = d3.zoom()
      .on("zoom", zoom_actions);
    
  svg.selectAll('.label')
       .append('text')
       .attr("dx", 12)
       .attr("dy", ".35em")
       .text(function(d){ return d.title })

  zoom_handler(svg);
    
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function zoom_actions() {
      g.attr("transform", d3.event.transform)
  }
    
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    groups.attr("transform", positionNode)
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

// Load the news source data.
//getNewsSource = function(code) {
    
//    d3.json("journal_names.json", function (error, data) {

 //       if(error){
   //         console.log(error);
     //   }

       // d3.select('d3-tip')
         //   .html(JSON.stringify(data, null, 1));
    //});
//};


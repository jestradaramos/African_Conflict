var width = 1000,
height = 500;

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
.charge(-120)
.linkDistance(200)
.size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

//Set up tooltip
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function (d) {
  return  d.name + "";
})
svg.call(tip);

var tip2 = d3.tip()
.attr('class', 'd3-tip2')
.offset([-10, 0])
.html(function (d) {
  return "Number of Instances: "+ d.freq + "<br> Interaction: "+ d.type + "";
})
svg.call(tip2);

//Read the data from the mis element
var mis = document.getElementById('mis').innerHTML;
graph = JSON.parse(mis);
graphRec=JSON.parse(JSON.stringify(graph)); //Add this line

//Creates the graph data structure out of the json data
force.nodes(graph.nodes)
.links(graph.links)
.start();

//Create all the line svgs but without locations yet
var link = svg.selectAll(".link")
.data(graph.links)
.enter().append("line")
.on('mouseover', tip2.show)
.on('mouseout', tip2.hide)
.attr("class", "link")
// .style("stroke", function(d) { return color(d.norm); })
// .style("marker-end",  "url(#suit)") // Modified line
.style("stroke-width", function (d) {
  return Math.sqrt(d.norm*20);
});

//Do the same with the circles for the nodes - no
var node = svg.selectAll(".node")
.data(graph.nodes)
.enter().append("circle")
.attr("class", "node")
.attr("r", 15)
.style("fill", function (d) {
  return color(d.group);
})
.style("visibility", function (d) {
  return d.group === 0 ? "hidden" : "visible";
})
.call(force.drag)
.on('dblclick', connectedNodes)
.on('mouseover', tip.show)
.on('mouseout', tip.hide);


//Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
force.on("tick", function () {
  link.attr("x1", function (d) {
    return d.source.x;
  })
  .attr("y1", function (d) {
    return d.source.y;
  })
  .attr("x2", function (d) {
    return d.target.x;
  })
  .attr("y2", function (d) {
    return d.target.y;
  });

  node.attr("cx", function (d) {
    return d.x;
  })
  .attr("cy", function (d) {
    return d.y;
  });
  node.each(collide(0.5)); //Added
});

svg.append("defs").selectAll("marker")
.data(["suit", "licensing", "resolved"])
.enter().append("marker")
.attr("id", function(d) { return d; })
.attr("viewBox", "0 -5 10 10")
.attr("refX", 25)
.attr("refY", 0)
.attr("markerWidth", 6)
.attr("markerHeight", 6)
.attr("orient", "auto")
.append("path")
.attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
.style("stroke", "#4679BD")
.style("opacity", "0.6");

//adjust threshold
function threshold(thresh) {
  graph.links.splice(0, graph.links.length);
  for (var i = 0; i < graphRec.links.length; i++) {
    if (graphRec.links[i].value > thresh) {graph.links.push(graphRec.links[i]);}
  }
  restart();
}
//Restart the visualisation after any node and link changes
function restart() {
  link = link.data(graph.links);
  link.exit().remove();
  link.enter().insert("line", ".node").attr("class", "link");
  node = node.data(graph.nodes);
  node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 5).call(force.drag);
  force.start();
}


var padding = 10, // separation between circles
radius=15;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(graph.nodes);
  return function(d) {
    var rb = 2*radius + padding,
    nx1 = d.x - rb,
    nx2 = d.x + rb,
    ny1 = d.y - rb,
    ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
        y = d.y - quad.point.y,
        l = Math.sqrt(x * x + y * y);
        if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < graph.nodes.length; i++) {
  linkedByIndex[i + "," + i] = 1;
};
graph.links.forEach(function (d) {
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
//This function looks up whether a pair are neighbours
function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}
function connectedNodes() {
  if (toggle == 0) {
    d = d3.select(this).node().__data__;
    node.style("opacity", function (o) {
      return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
    });
    link.style("opacity", function (o) {
      return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
    });
    toggle = 1;
  } else {
    //Put them back to opacity=1
    node.style("opacity", 1);
    link.style("opacity", 1);
    toggle = 0;
  }
}

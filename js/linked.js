var height = 150, width = 350;
var data;
var formatDateIntoYear = d3.time.format("%Y");
var formatDate = d3.time.format("%Y");
var parseDate = formatDate.parse("%m/%d/%y");
var minDate = new Date(1997,0,1),
	maxDate = new Date(2017,11,31);
var margin = {top:30,bot:45, left:35, right:10};
var yScale = d3.scale.linear().domain([0,8000]).range([height, 0]);
var xScale = d3.time.scale().domain([minDate,maxDate]).range([0,width]);

var format = d3.time.format("%Y");
var line = d3.svg.line()
	.x(function(d){

		return xScale(formatDate.parse(d.EVENT_DATE));

	}) 

	.y(function(d) { return yScale(+d.counts);});
var area = d3.svg.area()
	.x(function(d) {
		return xScale(formatDate.parse(d.EVENT_DATE));
	})
	.y0(height)
	.y1(function(d) { return yScale(+d.counts); });

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left").ticks(4)
	.outerTickSize(0)
	.tickSubdivide(1)
	.tickFormat(d3.format(".0s"))
	.tickSize(-width);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom").ticks(0)
	.outerTickSize(0)
	.tickSubdivide(1)
	.tickFormat(d3.time.format("%y"))
	.tickSize(0);

d3.csv("csv/linked.csv", function(datum) {
	data = datum;
	var grouped = d3.nest()
			.key(function(d) { return d.EVENT_TYPE; })
			.entries(data);
	var div = d3.select("#linked").selectAll(".chart").data(grouped);
	div.enter()
		.append("div")
		.attr("class", "chart")
		.append("svg")
		.append("g");
	var svg = div.select("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.bot + margin.top);

	var g = svg.select("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top  +")");

	g.append("rect")
		.attr("class", "background")
		.style("pointer-events", "all")
		.attr("width", width + margin.right)
		.attr("height", height + margin.top );
	var lines= g.append("g");
	lines.append("path")
		.attr("class", "line")
		.attr("pointer-events", "none") 
		.attr("d", function(d){
			return line(d.values);
		});
	lines.append("path")
		.attr("class", "area")
		.attr("pointer-events", "none") 
		.attr("d", function(d){
			return area(d.values);
		});
	lines.append("text")
		.attr("class", "title")
		.attr("text-anchor","middle")
		.attr("y", height - margin.top + 45) //height)
		.attr("dy", margin.bot /2 )
		.attr("x", width /2)
		.text(function(d) { return d.key;});
	lines.append("text")
		.attr("class", "date")
		.attr("text-anchor", "start");
	g.append("g")
		.attr("class", "yaxis")
		.call(yAxis);
	g.append("g")
		.attr("class", "xaxis")
		.attr("transform", "translate(10," + height + ")")
		.call(xAxis);

	circle = lines.append("circle")
	    .attr("r", 2.2)
	    .attr("opacity", 0)
	    .style("pointer-events", "none")
	  
	caption = lines.append("text")
	    .attr("class", "caption")
	    .attr("text-anchor", "middle")
	    .style("pointer-events", "none")
	    .attr("dy", -8)
	  
	curYear = lines.append("text")
	    .attr("class", "year")
	    .attr("text-anchor", "middle")
	    .style("pointer-events", "none")
	    .attr("dy", 13)
	    .attr("y", height)
	bisect = d3.bisector(function(d) {
      return d['EVENT_DATE'];
    }).left;
    mouseover = function() {
      circle.attr("opacity", 1.0);
      d3.selectAll(".static_year").classed("hidden", true);
      return mousemove.call(this);
    };
    mousemove = function() {
      var date, index, year;
      year = xScale.invert(d3.mouse(this)[0]).getFullYear();
      date = format.parse('' + year);
      index = 0;
      circle.attr("cx", xScale(date)).attr("cy", function(c) {
        index = bisect(c.values, formatDate(date), 0, c.values.length - 1);
        return yScale((c.values[index].counts));
      });
      caption.attr("x", xScale(date))
			.attr("y", function(c) {
        		return yScale((c.values[index].counts)); })
			.text(function(c) {
        		return (c.values[index].counts);});
      return curYear.attr("x", xScale(date)).text(year);
    };
    mouseout = function() {
      d3.selectAll(".static_year").classed("hidden", false);
      circle.attr("opacity", 0);
      caption.text("");
      return curYear.text("");
    };

	g.append("rect")
  		.attr("class", "background")
  		.style("pointer-events", "all")
  		.attr("width", width + margin.right )
  		.attr("height", height)
  		.on("mouseover", mouseover)
  		.on("mousemove", mousemove)
  		.on("mouseout", mouseout);



});

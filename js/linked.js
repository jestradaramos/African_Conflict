var height = 300, width = 450;
var data;
var formatDateIntoYear = d3.time.format("%Y");
var formatDate = d3.time.format("%Y");
var parseDate = formatDate.parse("%m/%d/%y");
var minDate = new Date(1997,0,1),
	maxDate = new Date(2017,11,31);
var margin = {top:10,bot:35, left:35, right:10};
var yScale = d3.scale.linear().domain([0,8000]).range([height, 0]);
var xScale = d3.time.scale().domain([minDate,maxDate]).range([0,width]);

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
	.tickSize(-width);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom").ticks(10)
	.outerTickSize(0)
	.tickSubdivide(1)
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
		.attr("transform", "translate(" + margin.left + "," + margin.top +")");
	g.append("rect")
		.attr("class", "background")
		.style("pointer-events", "all")
		.attr("width", width + margin.right)
		.attr("height", height + margin.top);
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
		.attr("class", "date")
		.attr("text-anchor", "start");
	lines.append("text")
		.attr("class", "title")
		.attr("text-anchor","middle")
		.attr("y", 0) //height)
		.attr("dy", margin.bot /2 + 5)
		.attr("x", width /2)
		.text(function(d) { return d.key;});
	g.append("g")
		.attr("class", "yaxis")
		.call(yAxis);
	g.append("g")
		.attr("class", "xaxis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

});

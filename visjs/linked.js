var height = 120, width = 150;
var data;
var margin = {top:10,bot:35, left:35, right:10};
var yScale = d3.scaleLinear().domain([0,30]).range([height, 0]);
var xScale = d3.scaleLinear().domain([1,7]).range([0,width]);

var line = d3.line()
	.x(function(d){
		return xScale(d.EVENT_DATE);

	}) 

	.y(function(d) { return yScale(d.FATALITIES);});
var area = d3.area()
	.x(function(d) {
		return xScale(d.EVENT_DATE);
	})
	.y0(height)
	.y1(function(d) { return yScale(d.forms); });
var yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(4)
	.tickSize(-width);
d3.csv("csv/african_conflicts.csv", function(datum) {
	data = datum;
	var grouped = d3.nest()
			.key(function(d) { return d.EVENT_TYPE; })
			.entries(data);

	
	var div = d3.select("#linked").selectAll(".chart").data(grouped);
	
	console.log(grouped);

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
			console.log(d);
			console.log("hello");
			return line(d.values);
		});
	console.log("Hello");
	lines.append("path")
		.attr("class", "area")
		.attr("pointer-events", "none") 
		.attr("d", function(d){
			return area(d['history']);
		});
	lines.append("text")
		.attr("class", "date")
		.attr("text-anchor", "start");
	lines.append("text")
		.attr("class", "title")
		.attr("text-anchor","middle")
		.attr("y", height)
		.attr("dy", margin.bot /2 + 5)
		.attr("x", width /2)
		.text(function(d) { 
			console.log(d);
			console.log("Print");
			return d['key'];});
	g.append("g")
		.attr("class", "yaxis")
		.call(yAxis);

});

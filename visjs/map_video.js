/**
 * @author: Jeffrey Estrada
 * @description: The Javascript code to produce the map video
 */


// Creating the African Map
var width = 900,
	height = 600;
var svg = d3.select('#vis')
	.append('svg')
	.attr('width', width)
	.attr('height', height);
var g = svg.append('g');
var recProjection = d3.geoEquirectangular()
	.scale(300)
	.rotate([0, 0])
	.center([0, 42.313])
	.translate([width/2.5, 0]);
var geoPath = d3.geoPath()
	.projection(recProjection);
g.selectAll('path')
	.data(map_json.features)
	.enter()
	.append('path')
	.attr('fill','#ccc')
	.attr('stroke', '#000')
	.attr('d', geoPath);

// Date Stuff

var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%m/%d/%y");

var startDate = new Date("1997-01-01"),
	endDate = new Date("2017-12-31");

// Slider

var moving = false;
var currentValue = 0;
var targetValue = width - 150

var playButton = d3.select("#play-button");

var x = d3.scaleTime()
	.domain([startDate, endDate])
	.range([0, targetValue])
	.clamp(true);

var slider = svg.append("g")
	.attr("class", "slider")
	.attr("transform", "translate(" + 50 + "," + 460 +")");

slider.append("line")
	.attr("class", "track")
	.attr("x1", x.range()[0])
	.attr("x2", x.range()[1])
	.select(function() { return
		this.parentNode.appendChild(this.cloneNode(true)); })
	.attr("class", "track-inset")
	.select(function() { return
		this.parentNode.appendChild(this.cloneNode(true)); })
	.attr("class", "track-overlay")
	.call(d3.drag()
		.on("start.interrupt" , function() {slider.interrupt();})
		.on("start drag", function() {
			currentValue = d3.event.x;
			update(x.invert(currentValue));
		})
	);
slider.insert("g", ".track-overlay")
	.attr("class", "ticks")
	.attr("transform", "translate(0," + 18 + ")")
	.selectAll("text")
	.data(x.ticks(10))
	.enter()
	.append("text")
	.attr("x", x)
	.attr("y", 10)
	.attr("text-anchor", "middle")
	.text(function(d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
	.attr("class", "handle")
	.attr("r", 9);

var label = slider.append("text")  
	.attr("class", "label")
	.attr("text-anchor", "middle")
	.attr("color", '#696969')
	.text(formatDate(startDate))
	.attr("transform", "translate(0," + (-25) + ")");




// Plotting the points 
d3.csv("/csv/african_conflicts.csv", function(datum){
	datum = datum.filter(function(d){
		if (isNaN(d.LONGITUDE)){
			return false;
		}
		if (isNaN(d.LATITUDE)){
			return false;
		}
		if (isNaN(d.FATALITIES)){

			return false;
		}

		d.LONGITUDE = parseFloat(d.LONGITUDE);
		d.LATITUDE = parseFloat(d.LATITUDE);
		d.FATALITIES = +d.FATALITIES;
		return true;
	})

	var grouped = d3.nest()
		.key(function(d) { return d.COUNTRY; })
		.rollup(function(v) { return {
			total: d3.sum(v, function(d){ return d.FATALITIES; }),
			lon: d3.mean(v, function(d) { return d.LONGITUDE; }),
			lat: d3.mean(v, function(d) { return d.LATITUDE; })

		}})
		.entries(datum);

	var max = d3.max(grouped, function(d) { return d.value.total; }),
		min = d3.min(grouped, function(d) { return d.value.total; });

	playButton
		.on("click", function(){
			var button = d3.select(this);
			if (button.text() == "Pause"){
				moving = false;
				clearInterval(timer);
				button.text("Play");
			} else {
				moving = true;
				timer = setInterval(step, 100);
				button.text("Pause");
			}
			console.log("Slider Moving: " + moving);
		})

	svg.selectAll("circle")
		.data(grouped).enter()
		.append("circle")
		.attr("cx", function(d) { 
			console.log(d.value.total);
			return recProjection([d.value.lon,
				d.value.lat])[0]; })
		.attr("cy", function(d) { 
			return recProjection([d.value.lon,
				d.value.lat])[1]; })
		.attr("r", function(d) {
			var killed = (d.value.total - min)/(max - min)
				*50;
			console.log(killed);
			console.log(d.value.total);
			return "" + killed + "px";
		})
		.attr("fill", "red")
		.attr("opacity", "0.5");

	function step() {
		update(x.invert(currentValue));
		currentValue = currentValue + (targetValue/151);
		if (currentValue > targetValue) {
			moving = false;
			currentValue = 0;
			clearInterval(timer);
			// timer = 0;
			playButton.text("Play");
			console.log("Slider moving: " + moving);
		}
	}
	function update(h) {
		// update position and text of label according to slider scale
		handle.attr("cx", x(h));
		label
			.attr("x", x(h))
			.text(formatDate(h));

		// filter data set and redraw plot
		// var newData = dataset.filter(function(d) {
		// return d.date < h;
		// })
		// drawPlot(newData);
	}
});
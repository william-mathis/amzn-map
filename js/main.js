var margin = { top: 20, right: 20, bottom: 30, left: 40 };

var w = parseFloat($("#svg").attr("width")) - margin.left - margin.right,
	h = parseFloat($("#svg").attr("height")) - margin.top - margin.bottom;



//defines map projection
var projection = d3.geo.albersUsa()
	.translate([w / 2, h / 2])
	.scale([750]);

//define path generator
var path = d3.geo.path()
	.projection(projection);

// var colors = d3.scale.linear()
// 	.domain([2007, 2018])
// 	.range(["#1a9850", "#66bd63", "#a6d96a","#d9ef8b","#ffffbf","#fee08b","#fdae61","#f46d43","#d73027"]);


//define quantize scale to sort data values into buckets of colors

// var color = d3.scale.quantize()
// 	.range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
//Colors taken from colorbrewer.js, included in the D3 download

var svg = d3.select('body')
	.append('svg')
	.attr('width', w)
	.attr('height', h);

var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// var zoom = d3.behavior.zoom()
// 	.scaleExtent([1, 8])
// 	.on("zoom", zoomed);

// svg.append("rect")
// 	.attr("class", "overlay")
// 	.attr("width", w)
// 	.attr("height", h)
// 	.attr;
// .call(zoom);
//
// svg.call(zoom)
// 	.call(zoom.event);
//load data
d3.csv('amazon_fulfil_geocodio.csv', function (data) {
	var colors = d3.scale.ordinal()
		.domain(16)
		.range(["#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027"]);
	//getting the state shapes
	d3.json('us-states.json', function (json) {
		for (var i = 0; i < data.length; i++) {
			var dataState = data[i].state;
			var dataValue = parseFloat(data[i].value);

			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.name;

				if (dataState == jsonState) {
					json.features[j].properties.value = dataValue;

					break;
				}
			}
		}

		//bind data and create on path per geoJSON feature
		svg.selectAll('path')
			.data(json.features)
			.enter()
			.append('path')
			.attr('d', path)
			.style('fill', '#4582B4');

		d3.csv('amazon_fulfil_geocodio.csv', function (data) {



			svg.selectAll('circle')
				.data(data)
				.enter()
				.append('circle')
				.attr('cx', function (d) {
					return projection([d.Longitude, d.Latitude])[0];
				})
				.attr('cy', function (d) {
					return projection([d.Longitude, d.Latitude])[1];
				})
				.attr('r', '3' //function (d) {
					//return Math.sqrt(parseInt(d.SqFt) * 0.05);
				)
				.attr('fill', function (d, i) { return colors(d.Year); })
				.style('stroke', 'grey')
				.style('opacity', 0.75)
				.on("mouseover", function (d) {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(d.City + "<br/>" + d.Year)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function (d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
				});
		});

		var years = ["1997", "1999", "2000", "2005", "2006", "2007", "2008", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]

		var legend = svg.selectAll("g.legend")
			.data(years)
			.enter().append("g")
			.attr("class", "legend");

		var ls_w = 20,
			ls_h = 20;

		var legend_labels = d3.set(data.map(function (d) { return parseInt(d.Year) })).values().sort();






		// var years = d3.scale.ordinal(legend_labels);

		legend.append("rect")
			.attr("x", function (d, i) { return w - (i * ls_w) - 2 * ls_w; })
			.attr('y', (h - 20))
			// .attr("y", function (d, i) { return h - (i * ls_h) - 2 * ls_h; })
			.attr("width", ls_w)
			.attr("height", ls_h)
			.style("fill", function (d, i) { return colors(years[i]); })
			.style("opacity", 0.8);
		//

		legend.append('text')
			// .call(legend_labels)
			.attr('x', function (d, i) { return w - (i * ls_w) - 2 * ls_w * 2; })
			.attr('y', (h - 20))
			.text(function (d, i) {
				return legend_labels[i];
			});
		// legend.append("text")
		// 	.attr("x", function (d, i) { return w - (i * ls_w) - 2 * ls_w * 2; })
		// 	.attr('y', (h - 20))
		// 	// .attr("width", ls_w)
		// 	// .call(years)
		// 	// .attr('transform', 'rotate(-90)')
		// 	// .attr("x", 50)
		// 	//
		// 	// .attr("y", function (d, i) { return h - (i * ls_h) - ls_h - 4; })
		// 	.text(function (d, i) { return legend_labels[i]; });

	});
});

// function zoomed() {
// 	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// };
//
//
// d3.select(self.frameElement).style("height", height + "px");

var margin = { top: 20, right: 20, bottom: 30, left: 40 };

var w = parseFloat($("#svg").attr("width")) - margin.left - margin.right,
	h = parseFloat($("#svg").attr("height")) - margin.top - margin.bottom;

//defines map projection
var projection = d3.geo.albersUsa()
	.translate([w / 2, h / 2])
	.scale([500]);

//define path generator
var path = d3.geo.path()
	.projection(projection);

//define quantize scale to sort data values into buckets of colors

// var color = d3.scale.quantize()
// 	.range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
//Colors taken from colorbrewer.js, included in the D3 download

var svg = d3.select('body')
	.append('svg')
	.attr('width', w)
	.attr('height', h);

//load data
d3.csv('amazon_geocodio.csv', function (data) {

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

		d3.csv('amazon_geocodio.csv', function (data) {
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
				.style('fill', 'white')
				.style('stroke', 'grey')
				.style('opacity', 0.75);
		});
	});
})

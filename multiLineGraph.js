var multiLineGraph = function(config,obj){
	var self = this;
	var margin = config.margin || {};
	var tooltipDuration = config.tooltipDuration || 400,
		pathDuration = config.pathDuration || 1000;
	var heightMultiplier = 12;
	var leftMargin = margin.left || 40,
		rightMargin = margin.right || 20,
		topMargin = margin.top || 20,
		bottomMargin = margin.bottom || 30;
	var netHeight = config.height - (topMargin+bottomMargin),
		netWidth = config.width - (leftMargin+rightMargin);
	var legendWidth = config.legendWidth || 50;
	var graphWidth = netWidth - legendWidth;
	var tickFormat = config.tickFormat || '%b';
	var colorScale = d3.scale.category20();
	this.color = colorScale;
	var tickFormat = d3.time.format(tickFormat);
	var dateFormat = d3.time.format(config.popupFormat || tickFormat);
	var yScale = d3.scale.linear().range([netHeight,0]);
	var timeScale = d3.time.scale().range([0,graphWidth]);	//x axis is a time scale
	
	var yAxis = d3.svg.axis().scale(yScale)
					.orient('left').ticks(5);
	
	var xAxis = d3.svg.axis().scale(timeScale)
					.orient('bottom').ticks(5).tickFormat(tickFormat);
	
	var line = d3.svg.line()
				.x(function(d){ return timeScale(d[config.dateProp]); })
				.y(function(d){ return yScale(d[config.valueProp]); })

	function init(){
		var parent = d3.select(config.container)
						.classed('multi-line-graph',true);
		var svg = parent.append('svg')
//						.attr('width',config.width)
//						.attr('height',config.height);
						.attr("viewBox", "0 0 " + config.width + " " + config.height)
    					.attr("preserveAspectRatio", "xMidYMid meet")

		
		//group container for line graphs
		self.g = svg.append('g')
					.attr('class','line-group')
					.attr('transform', "translate("+leftMargin+","+topMargin+")");
		//group container for legend
		self.legend = svg.append('g')
						.attr('class','legend-group')
						.attr('transform','translate('+(graphWidth+leftMargin)+','+topMargin+')');
		//div for tooltip
		self.tooltip = parent.append('div')
							.attr('class','tooltip')
							.style('opacity','0')
	}
	
	//creates line graph
	function createGraph(data){
		//parsing the passed in string to specified date format
		data.forEach(function(d){
			d[config.dateProp] = parseDate(d[config.dateProp]);
		})
//		var dates = parseDate(data);
		yScale.domain([0,d3.max(data, function(d){ return d[config.valueProp]; })]);
		timeScale.domain(d3.extent(data,function(d){ return d[config.dateProp]; } ));
		
		var data = aggregateData(data);
		
		//Creating a group for each seperate line
		var lineGroups = self.g.selectAll('g')
						.data(data)
						.enter().append('g');
		//Adding a path to each group
		var path = lineGroups.append('path')
						.attr('class','line')
						.attr('d',function(d){ return line(d.values);})
						.attr('stroke', function(d){ return colorScale(d.key); });
		
		self.path = path;
		path[0].forEach(function(value){
			var totalLength = value.getTotalLength();
			path.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
				.duration(pathDuration)
				.ease("linear")
				.attr("stroke-dashoffset", 0);
		})
		
		//Adding x scale
		self.g.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate(0,'+netHeight+')')
			.call(xAxis);
		
		//Adding y scale (time scale)
		self.g.append('g')
			.attr('class','y axis')
			.call(yAxis)
		
		var points = lineGroups.append('g')
						.attr('class','line-points');
		
		//Adding data point
		points.selectAll('circle')
			.data(function(d){ return d.values; })
			.enter().append('circle')
			.attr('cx', function(d){ return timeScale(d[config.dateProp]); })
			.attr('cy', function(d){ return yScale(d[config.valueProp]); })
			.attr('r','2')
			.attr('fill','white')
			.attr('stroke', function(d){ return colorScale(d3.select(this.parentNode).datum().key); })
			.on('mouseover',showTooltip)
			.on('mouseout', hideTooltip)
		
		//Adding legend 
		self.legend.selectAll('rect')
			.data(data)
			.enter().append('rect')
			.attr('x', 5)
			.attr('y', function(d,i){ return i*heightMultiplier; })
			.attr('width',7)
			.attr('height',7)
			.style('fill', function(d){ return colorScale(d.key); })

		self.legend.selectAll('text')
			.data(data)
			.enter().append('text')
			.attr('x', 14)
			.attr('y', function(d,i){ return i*heightMultiplier + 7; })
			.text(function(d){ return d.key; })
	}
	
	function parseDate(time){
		var dateFormat = config.dateFormat||"%Y-%m-%d";
		return d3.time.format(dateFormat).parse(time);
	}
	
	/**
	 * Restructures an array of objects and creates two new key value pair with key 'key' and value 'config.labelProp' and, 
	 * 'values' with it's value being all the objects which have 'config.labelProp' as key's value
	 */
	function aggregateData(data){
		return d3.nest()
				.key(function(d){ return d[config.labelProp]; })
				.entries(data);
	}
	
	function showTooltip(d){
		self.tooltip.transition()
				.duration(tooltipDuration)
				.style('opacity','0.9');
		var text = d[config.valueProp]+" <br> "+dateFormat(d[config.dateProp] );
		self.tooltip.html(text)
					.style("left",d3.event.pageX+5+"px")
					.style("top",(d3.event.pageY-14)+"px")
					.style("fill","steelblue")
	}
	
	function hideTooltip(d){
		self.tooltip
			.transition()
			.duration(tooltipDuration)
			.style('opacity','0')
			.each("end", function(d){ d3.select(this).text(''); })
	}
	
	init();
	createGraph(obj);
}
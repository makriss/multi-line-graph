var multiLineGraph = function(config,obj){
	var self = this;
	var margin = config.margin || {};
	var leftMargin = margin.left || 40,
		rightMargin = margin.right || 20,
		topMargin = margin.top || 20,
		bottomMargin = margin.bottom || 30;
	var netHeight = config.height - (topMargin+bottomMargin),
		netWidth = config.width - (leftMargin+rightMargin);
	var tickFormat = config.tickFormat || '%b';
	
	var colorScale = d3.scale.category20();
	this.color = colorScale;
	
	var yScale = d3.scale.linear().range([netHeight,0]);
	var timeScale = d3.time.scale().range([0,netWidth])
	
	var yAxis = d3.svg.axis().scale(yScale)
					.orient('left').ticks(5);
	
	var xAxis = d3.svg.axis().scale(timeScale)
					.orient('bottom').ticks(5).tickFormat(d3.time.format(tickFormat));
	
	var line = d3.svg.line()
				.x(function(d){ return timeScale(d[config.dateProp]); })
				.y(function(d){ return yScale(d[config.valueProp]); })

	this.line = line;
	
	function init(){
		var parent = d3.select(config.container)
						.classed('multi-line-graph',true);
		var svg = parent.append('svg')
						.attr('width',config.width)
						.attr('height',config.height);
		self.g = svg.append('g')
					.attr('transform', "translate("+leftMargin+","+topMargin+")");
		
	}
	
	function createGraph(data){
		data.forEach(function(d){
			d[config.dateProp] = parseDate(d[config.dateProp]);
		})
//		var dates = parseDate(data);
		yScale.domain([0,d3.max(data, function(d){ return d[config.valueProp]; })]);
		timeScale.domain(d3.extent(data,function(d){ return d[config.dateProp]; } ));
		
		var data = segregateData(data);

		data.forEach(function(d){
			self.g.append('path')
					.attr('class','line')
					.attr("d",line(d.values))
					.attr('stroke', colorScale(d.keys))
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
		
	}
	
	function parseDate(time){
		var dateFormat = config.dateFormat||"%Y-%m-%d";
		return d3.time.format(dateFormat).parse(time);
	}
	
	function segregateData(data){
		return d3.nest()
				.key(function(d){ return d[config.labelProp]; })
				.entries(data);
	}
	
	init();
//	controller(obj);
	createGraph(obj);
}
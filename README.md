#Multi line graph

Creates an interactive, responsive multi line graph with dots on data points and tooltip

#Steps to use-
1. Import multiLineGraph.js and multiLineGraph.css

2. Create a configuration object with following properties
	```
	var config = {
			container: "#parent",				//Unique selector for the containing parent
			width: 700,							//Width of the viewbox
			height: 400,						//Height of the viewbox
			valueProp: 'value',					//Property name inside object that containers numerical value and should be interpolated along y axis
			dateProp: 'date',					//Property name inside object that has date or time string. It will be interpolated along x axis
			labelProp: 'category',				// Property name inside object that has a name for respective line. It's value will be shown in the legend
			tickFormat: "%b, '%y",				//Date or time format to be shown as tick values on x axis. Default value is '%b'. For more info, https://github.com/mbostock/d3/wiki/Time-Formatting
			popupFormat: "%d %b '%y"			//(Optional) Date or time format to be shown in tooltip. If not provided, tickFormat will be used
			legendWidth: 50,					//(Optional) Width of the legend. Default value is 50
			tooltipDuration: 400,				//(Optional) Transition duration for tooltip to appear/disappear. Default value is 400ms
			pathDuration: 1000					//(Optional) Transition duration for paths to translate across the graph. Default value is 1000ms
		}
	```
	
3. Structure for the data object is shown in index.html

4. Instantiate multiLineGraph function and pass in config and data objects as parameters

5. Voila!


#Features-
1. Transitions on value change

2. Dynamic chart update by calling **updateGraph** method
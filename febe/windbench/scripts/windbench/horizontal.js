jQuery(document).ready(function($) { //this thing is to deal with jquery blowing up (sometimes)


var data;

var input = new Array();
var terrain = new Array();

var x_min; 
var x_max;
var chart;

var input = JSON.parse(windbench_str_pass);
/* input:
			[0] settings:
				[0] profiles:
				[1] axis:
					[0/1] X/Y:
						[axis_index]:
							[0] axis name
							[1] axis units
				[2] other:
					[0] chart type
			[1] data:
				[data_package_index]:
					[0] user_name (can be terrain or measurements)
					[r] row index:
						[k] kolumn index

*/
//alert(input[0][1]);
if (input == null){
	alert('The plotting script has crashed. Please inform the administrator. \n Error: No data passed for plots');
}

if (input[1].length == 0){
	$('#profile').bind('change', function () {
		change_profile();
	});	
	alert("No data available for this profile");
	return;
}

var n_users = input[1].length;
var y_axes_no = input[0][1].length;
var data_kol = 1; //default
var label = input[0][1][data_kol-1][0] + " " + input[0][1][data_kol-1][1];
var chart_type = input[0][2][0];

$(function() {
	init();
});

function init(){
	chart = chartCreate("horizontal");
	chart.showResetZoom();
	
	$('#x_axis').bind('change', function () {
		reloadData();
	});
	$('#profile').bind('change', function () {
		change_profile();
	});	
	reloadData();
}


function setYaxisRange(refresh){
	//scale the terrain axis
	extremesX = chart.xAxis[0].getExtremes(); 
	extremesY = chart.yAxis[1].getExtremes(); 	
	//alert(extremesY.dataMin);
	chart.yAxis[1].setExtremes(extremesY.dataMin, (extremesX.max-extremesX.min)/2-extremesY.dataMin,refresh);
}
function change_profile(){
	var profile = document.getElementById("profile").value;
	var page_url = document.URL.split("?")[0];
	window.location.href = page_url+"?profile="+profile;
}


function reloadData(){
	var profile = document.getElementById("profile").value;
	var axis_index = document.getElementById("x_axis").value;
	chart.setTitle({text: "Profile "+profile});
	if(chart_type == "vertical"){
		label = input[0][1][0][axis_index][0] + " " + input[0][1][0][axis_index][1];
		chart.xAxis[0].setTitle({text: label});
	}
	if(chart_type == "horizontal"){
		label = input[0][1][1][axis_index][0] + " " + input[0][1][1][axis_index][1];
		chart.yAxis[0].setTitle({text: label});
	}
	data_kol = parseInt(axis_index) +1;
	//chartRemoveAllSeries();
	chartAddSeries(data_kol);
	chartSetZoom();

	chart.redraw();
	//alert("done reloading");
}
function chartRemoveAllSeries(){
	while(chart.series.length > 0){
		chart.series[0].remove(false);
	}
}
function chartSetZoom(){
	if(x_min != 9999){
		x_min -= (x_max-x_min)/5; //widen the range by a procentage of the full size
		x_max += (x_max-x_min)/5;
		if(chart_type=="horizontal")chart.xAxis[0].setExtremes(x_min,x_max,false);
		if(chart_type=="vertical")chart.yAxis[0].setExtremes(0,x_max,false);
	}
}

//---------------------------------------------highcharts templates
//-----------------------------------------------------------------



function chartCreate(){
	Highcharts3(Highcharts);
	if(chart_type == "horizontal"){
		$("#container").highcharts({
			exporting: {
				sourceWidth: 500,
				sourceHeight: 300
			},
			chart: {
				resetZoomButton: {
					position: {x: -40},
					relativeTo: "chart",
				},
				zoomType: "x"
			},
			title: {
				text: ""
			},
			xAxis: [{			
				title: {
					text: "Position from HT [m]",
					style: {}
				},
				events: {
					afterSetExtremes: function() {
						setYaxisRange(true);
					}
				}
				// max: 1600,
				// min: -1000
				//categories: ["0","560","1120","1680","2240","2800","3360","3920","4480","5040"]
			}],
			yAxis: [{ // Primary yAxis
				labels: {
					formatter: function() {
						return this.value + "";
					},
					style: {}
				},
				title: {
					text: label,
					style: {
	
					}
				}
				//max: 200,
				//min: 0
	
			},{ // Secondary yAxis
				labels: {
					formatter: function() {
						return this.value + "";
					},
					style: {}
				},
				title: {
					text: "Height [m]",
					style: {
	
					}
				},
				opposite: true
				//max: 300,
				//min: 0
	
			},
			
			],
	
			tooltip: {
				shared: true
			},
	        legend: {
                	layout: "vertical",
                	align: "right",
                	verticalAlign: "top",
                	y: 40,
                	borderWidth: 1,
			backgroundColor: '#FCFFC5',
			floating: false
	    	},
			plotOptions: {
				series: {
					marker: {
						enabled: false
					}
				}
			},
			series: []
		});
	}
	if(chart_type == "vertical"){
		$("#container").highcharts({
			exporting: {
				sourceWidth: 500,
				sourceHeight: 300
			},
			chart: {
				resetZoomButton: {
					position: {x: -40},
					relativeTo: "chart",
				},
				zoomType: "y"
			},
			title: {
				text: ""
			},
			xAxis: [{}],
			yAxis: [{			
				title: {
					text: "Height[m]",
					style: {}
				},
				min: 0
			}],
	
			tooltip: {
				shared: true
			},
	        legend: {
                	layout: "vertical",
                	align: "right",
                	verticalAlign: "top",
                	//x: -50,
                	y: 40,
                	borderWidth: 1,
			backgroundColor: '#FCFFC5',
			floating: false
	    	},
			plotOptions: {
				series: {
					marker: {
						enabled: false
					}
				}
			},
			series: []
		});
	}

	return $('#container').highcharts();

}
function chartAddSeries(kolumn){
	var first_run = (chart.series.length == 0);
	//alert(first_run);
	//alert(kolumn);
	data = new Array();
	x_min = 9999;
	x_max = -9999;
	for (var i=0;i<n_users ;i++){
		data.push(new Array());
		
		switch(input[1][i][0]){
		case "Topography":
			// load terrain
			for (var j=1;j<input[1][i].length;j++){
				data[i].push([input[1][i][j][0],input[1][i][j][1]]);
			}
			if(first_run){
				chart.addSeries({
					name: input[1][i][0],
					type: 'area',
					yAxis: 1,
					color: '#b0b0b0',
					fillOpacity: 0.7,
					lineWidth: 0,
					zIndex: -1,
					data: data[i]
				},false);
			}
			break;
		case "Measurements":
			for (var j=1;j<input[1][i].length;j++){
				x = input[1][i][j][0];
				val = input[1][i][j][kolumn];
				if (val!=-999 && chart_type=="horizontal") data[i].push([x,val]);
				if (val!=-999 && chart_type=="vertical") data[i].push([val,x]);	
				//find the min and max of the validation data to estimate the range for zoom
				if (x_min > x) x_min = x;
				if (x_max < x) x_max = x;		
			}
			if(first_run){
				chart.addSeries({
					name: input[1][i][0],
					type: 'scatter',
					marker: {enabled:true},
					data: data[i],
					tooltip: {
						pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
					}
				},false);
			}
			else{
				chart.series[i].setData(data[i],false);
			}
			break;
		default:
			for (var j=1;j<input[1][i].length;j++){
				x = input[1][i][j][0];
				val = input[1][i][j][kolumn];
				if (val!=-999 && chart_type=="horizontal") data[i].push([x,val]);
				if (val!=-999 && chart_type=="vertical") data[i].push([val,x]);		
			}
			if(first_run){
				if(chart_type=="horizontal"){
					chart.addSeries({
						name: input[1][i][0],
						type: 'spline',
						data: data[i],
						tooltip: {
							pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
						},
						yAxis: 0
					},false);
				}
				if(chart_type=="vertical"){
					chart.addSeries({
						name: input[1][i][0],
						type: 'scatter',
						data: data[i],
						lineWidth:2,
						tooltip: {
							pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
						}
					},false);
				}
			}
			else{
				chart.series[i].setData(data[i],false);
			}
			break;
		}
	}
}


// Set default options to the values for HC3
function Highcharts3(H) {
    H.setOptions({
        colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970',
            '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
    });
};



});


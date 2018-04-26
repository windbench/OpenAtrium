jQuery(document).ready(function($) { //this thing is to deal with jquery blowing up (sometimes)

var input = new Array();
var chart;
var normalised = false;
var data_kol = 0;

var input = JSON.parse(windbench_str_pass_res);
/* input:
	[0] user_names:
	[1] profiles:
		[]profile:
			[0] user_name 
			[1:] data_Types:
				[0] Name
				[1] Unit
	[2] data per_profile:
		[] per_user:
			[] per_data_type 
				[] DATA


*/
//alert(input);


$(function() {
	init();
});

function init(){
	//clean the und data
	for (var i=0;i<input[2].length ;i++)
		for (var j=0;j<input[2][i].length ;j++)
			for (var k=0;k<input[2][i][j].length ;k++)
				if(input[2][i][j][k] < 0)		
					input[2][i][j][k] = null;
	
	chart = chartCreate();

	$('#y_axis_res').bind('change', function () {
		reloadData();
	});
	$('#normalise_res').bind('change', function () {
		reloadData();
	});
	reloadData();
}

function reloadData(){
	var axis_index = document.getElementById("y_axis_res").value;
	normalised = document.getElementById("normalise_res").checked;
	
	data_kol = parseInt(axis_index);
	label = input[1][0][data_kol+1][0] + input[1][0][data_kol+1][1];
	
	if(normalised){
		chart.setTitle({text: "Results "+label+" normalised"});
		chart.yAxis[0].setTitle({text: label+"/n_data"});
	}
	else{
		chart.setTitle({text: "Results "+label});
		chart.yAxis[0].setTitle({text: label});
	}

	chartAddSeries(data_kol);
	chart.redraw();
}


function chartCreate(){
	Highcharts3(Highcharts);
	$('#container_res').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: 'Stacked column chart'
		},
		xAxis: {
			categories: []
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Total fruit consumption'
			},
			stackLabels: {
				enabled: true,
				format: '{total:.2f}',
				style: {
					fontWeight: 'bold',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
				}
			}
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
		tooltip: {
			formatter: function() {
				return '<b>'+ this.x +'</b><br/>'+
					this.series.name +': '+ round(this.y,3)+'<br/>'+
					'Total: '+ round(this.point.stackTotal,3);
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					format: '{point.y:.2f}',
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
					style: {
						//textShadow: '0 0 3px black, 0 0 3px black'
					}
				}
			},
            series: {
                events: {
                    hide: function(event) {
                        reloadData();
                    },
                    show: function(event) {
                        reloadData();
                    }
                }
            }
		},
		series:[]
	});
	return $('#container_res').highcharts();
}
    

function chartAddSeries(kolumn){
	var first_run = (chart.series.length == 0);
	data = new Array();
	var n_data =[];
	//set up users
	chart.xAxis[0].setCategories(input[0]);
	//set up n_data
	for (var j=0;j<input[2][0].length ;j++){
		n_data.push(0);
	}
	for (var i=0;i<input[2].length ;i++){
		//check if this series will be displayed, important for normalisation
		is_visible = true;
		if(!first_run) is_visible = chart.series[i].visible;
		for (var j=0;j<input[2][i].length ;j++){
			if(is_visible && (input[2][i][j][kolumn] != null)) 
				n_data[j]++;
		}
	}

	//alert(n_data[0]);
	//loop through data
	//loop profiles
	for (var i=0;i<input[2].length ;i++){
		data.push(new Array());
		//loop users
		for (var j=0;j<input[2][i].length ;j++){
			val = input[2][i][j][kolumn];
			data[i].push(val); 
		}
		//if normalise option is on then devide the results by the number of observations
		if(normalised){
			for(var j=0;j<input[2][i].length ;j++){
				data[i][j] = data[i][j]/n_data[j];
			} 
		}
		//round the results
		//for(var j=0;j<input[2][i].length ;j++)	data[i][j] = round(data[i][j],3);
		
		if(first_run){
			chart.addSeries({
				name: input[1][i][0],
				data: data[i],
			},false);
		}
		else{
			chart.series[i].setData(data[i],false);
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

function round(x, precision){
	a = Math.pow(10,precision);
	return Math.round(x*a)/a;
}

});


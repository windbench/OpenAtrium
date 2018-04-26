jQuery(document).ready(function($) { //this thing is to deal with jquery blowing up (sometimes)



var data = new Array();
var n_users = 3;

var input = new Array();
var S = new Array();
var TKE = new Array();
var S0 = new Array();
var TKE0 = new Array();
var TKES0 = new Array();
var terrain = new Array();
var temp;
var data_folder = "scripts/";

var x_min; 
var x_max;
var chart;



$(function() {
	$("#container").highcharts({
		chart: {
			zoomType: "y"
		},
		title: {
			text: "Profile HT"
		},

		xAxis: [{			
		}],
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
                	x: -50,
                	y: 50,
                	borderWidth: 1,
			backgroundColor: '#FCFFC5',
			floating: true
	    	},
        	plotOptions: {
        	    series: {
        	        marker: {
        	            enabled: false
			}
		    }
		},
		series: [{
			name: 'Measurments',
			type: 'scatter',
			data: data[0],
			marker: {enabled:true},
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		},  {
			name: 'User1',
			type: 'scatter',
			lineWidth:2,
			data: data[1],
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}, {
			name: 'User2',
			type: 'scatter',
			lineWidth:2,

			data: data[2],
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}, {
			name: 'User3',
			type: 'scatter',
			lineWidth:2,

			data: data[3],
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}
		]
	});
	chart = $('#container').highcharts();

	$('#x_axis').bind('change', function () {
		refresh(chart);
	});
	$('#profile').bind('change', function () {
		reloadData(chart);
	});	
	reloadData(chart);
});


function refresh(chart){
	var x_axis = document.getElementById("x_axis").value;
	chart.xAxis[0].setTitle({text: x_axis});
	if(x_axis == "TKE[m/s^2]"){
		
		for (var j=0;j<(n_users+1);j++){
			chart.series[j].setData(TKE[j]);
		}
	}
	if(x_axis == "S[m/s]"){
		for (var j=0;j<(n_users+1);j++){
			chart.series[j].setData(S[j]);
		}
	}
	if(x_axis == "S/S0"){
		for (var j=0;j<(n_users+1);j++){
			chart.series[j].setData(S0[j]);
		}
	}
	if(x_axis == "TKE/TKE0"){
		for (var j=0;j<(n_users+1);j++){
			chart.series[j].setData(TKE0[j]);
		}
	}
	if(x_axis == "TKE/S0^2"){
		for (var j=0;j<(n_users+1);j++){
			chart.series[j].setData(TKES0[j]);
		}
	}
	
}


function reloadData(chart){
	var file_name = data_folder+"data_askervein_neutral_run1_profHT.json";
	var profile = document.getElementById("profile").value;
	chart.setTitle({text: "Profile "+profile});
	if(profile == "A"){
		window.location.href = "plots-prototype?profile=A";
	}
	if(profile == "AA"){
		window.location.href = "plots-prototype?profile=AA";
	}
	if(profile == "B"){
		window.location.href = "plots-prototype?profile=B";
	}	

	if(profile == "HT"){
		file_name = data_folder+"data_askervein_neutral_run1_profHT.json";
	}
	if(profile == "RS"){
		file_name = data_folder+"data_askervein_neutral_run1_profRS.json";
	}
	if(profile == "CP"){
		file_name = data_folder+"data_askervein_neutral_run1_profCP.json";
	}
	// reset the data
	for (var j=0;j<(n_users+1);j++){
		data[j] = new Array();
		S[j] = new Array();
		TKE[j] = new Array();
		S0[j] = new Array();
		TKE0[j] = new Array();
		TKES0[j] = new Array();
	}


	reloadData_asynch(file_name);
}

function reloadData_asynch(file_name){
	$.getJSON(file_name,function(input) {
		// load values
		for (var j=1;j<(n_users +2) ;j++){
	
			for (var i=0;i<input[j].length;i++){
				data = input[j][i][1];
				if (data!=-999) S[j-1].push([data,input[j][i][0]]);
				data = input[j][i][2];
				if (data!=-999) TKE[j-1].push([data,input[j][i][0]]);	
				data = input[j][i][3];
				if (data!=-999) S0[j-1].push([data,input[j][i][0]]);
				data = input[j][i][4];
				if (data!=-999) TKE0[j-1].push([data,input[j][i][0]]);
				data = input[j][i][5];
				if (data!=-999) TKES0[j-1].push([data,input[j][i][0]]);
			}
		}

		
		//find the min and max of the validation data to estimate the range for zoom
		y_max = -9999;
		for (var i=0; i<input[1].length;i++){
			temp = input[1][i][0];
			if (y_max < temp) y_max = temp;
		}
		y_max += y_max/3;

		// default zoom
		chart.yAxis[0].setExtremes(0,y_max,false);
		
		// show the results
		for (var j=0;j<(n_users);j++){
			S_error = String(Math.round(input[0][j][0]*100))
			if (input[0][j][0] == -999)	S_error = "-";
			TKE_error = String(Math.round(input[0][j][1]*100))
			if (input[0][j][1] == -999)	TKE_error = "-";

			new_name = "User" + String(j) + " [" + S_error + "% ,"+TKE_error+"%]";
			chart.series[j+1].update({name: new_name}, false);
		}

		// plot new data	
        	refresh(chart);
	});	
}

});

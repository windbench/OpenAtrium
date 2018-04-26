function refresh(chart)
{
	// show all
	chart.series[0].show();
	chart.series[1].show();
	chart.series[2].show();
	chart.series[3].show();
	chart.series[4].show();
	chart.series[5].show();

	// hide what is necessarry
	if(!$("#unsteady").attr("checked")){
		chart.series[4].hide();
		chart.series[5].hide();
	}
	if(!$("#steady").attr("checked")){
		chart.series[2].hide();
		chart.series[3].hide();
	}
	if(!$("#Surface_layer").attr("checked")){
		chart.series[3].hide();
		chart.series[5].hide();
	}
	if(!$("#ABL_layer").attr("checked")){
		chart.series[2].hide();
		chart.series[4].hide();
	}
	if(!$("#lin").attr("checked")){
		chart.series[4].hide();
	}
	if(!$("#eddy").attr("checked")){
		chart.series[5].hide();
	}
	if(!$("#les").attr("checked")){
		chart.series[3].hide();
	}
	if(!$("#other").attr("checked")){
		chart.series[2].hide();
	}
}
$(function() {
	var merror = new Array();
	var m = [];
	var jsrodrigo = [
		[1,0,696,0],
		[2,560,550.34,0.20928],
		[3,1120,510.51,0.26651],
		[4,1680,486.88,0.30046],
		[5,2240,465.07,0.33179],
		[6,2800,442.38,0.3644],
		[7,3360,419.91,0.39668],
		[8,3920,398.64,0.42724],
		[9,4480,379.87,0.45422],
		[10,5040,363.83,0.47726]
	];
	var jsrodrigo_pd =[];
	var measurment = [
		[0,618,0,0.0055371],
		[560,436,0.2945,0.012826],
		[1120,431.1,0.30243,0.013214],
		[1680,415.7,0.32735,0.015172],
		[2240,395,0.36084,0.015375],
		[2800,390.3,0.36845,0.016244],
		[3360,379.5,0.38592,0.015644],
		[3920,360.8,0.41618,0.015995],
		[4480,345.1,0.44159,0.019972],
		[5040,348.1,0.43673,0.018705]];
	var user1 = [656,530,500,476,453,422,400,378,349,333];
	var user1pd = [];	
	var user2 = [716,560,500,476,455,442,429,398,369,353];
	var user2pd = [];
	var user3 = [719,569,509,480,450,432,419,388,359,343];
	var user3pd = [];

	for (var i=0;i<10;i++){
		merror.push([measurment[i][2]-measurment[i][3] ,measurment[i][2]+measurment[i][3]]);
		m.push(measurment[i][2]);
		user1pd.push((1 - user1[i]/user1[0]));
		user2pd.push((1 - user2[i]/user2[0]));
		user3pd.push((1 - user3[i]/user3[0]));
		jsrodrigo_pd.push(jsrodrigo[i][3]);
	}	
	merror[0][0] = 0;

	$("#container").highcharts({
		chart: {
			zoomType: "xy"
		},
		title: {
			text: "Error bar1"
		},
		xAxis: [{			
			title: {
				text: "Position",
				style: {}
			},
			categories: ["0","560","1120","1680","2240","2800","3360","3920","4480","5040"]
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				formatter: function() {
					return this.value + "";
				},
				style: {}
			},
			title: {
				text: "Power deficit",
				style: {

				}
			}
		}],

		tooltip: {
			shared: true
		},
	        legend: {
                	layout: "vertical",
                	align: "right",
                	verticalAlign: "top",
                	x: -10,
                	y: 100,
                	borderWidth: 0
	    	},
		series: [{
			name: 'Measurment',
			type: 'spline',
			data: m,
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b> '
			}
		}, {
			name: 'Measurment error',
			type: 'errorbar',
			data: merror,
			tooltip: {
				pointFormat: '(error range: {point.low:.3f}-{point.high:.3f})<br/>'
			}
		}, {
			name: 'User1',
			type: 'spline',
			data: user1pd,
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}, {
			name: 'User2',
			type: 'spline',
			data: user2pd,
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}, {
			name: 'User3',
			type: 'spline',
			data: user3pd,
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}, {
			name: 'jsrodrigo (Model_name)',
			type: 'spline',
			data: jsrodrigo_pd,
			tooltip: {
				pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.3f}</b><br> '
			}
		}]
	});

    	var chart = $('#container').highcharts();
        $button_apply = $('#button_apply');
	$button_all = $('#button_all');	

	$button_all.click(function() {
		$('input:checkbox').attr('checked','checked');
		refresh(chart);
	});


	$('#ABL_layer').bind('change', function () {
		refresh(chart);
	});
	$('#Surface_layer').bind('change', function () {
		refresh(chart);
	});
	$('#steady').bind('change', function () {
		refresh(chart);
	});
	$('#unsteady').bind('change', function () {
		refresh(chart);
	});
	$('#lin').bind('change', function () {
		refresh(chart);
	});
	$('#eddy').bind('change', function () {
		refresh(chart);
	});
	$('#les').bind('change', function () {
		refresh(chart);
	});
	$('#other').bind('change', function () {
		refresh(chart);
	});
});



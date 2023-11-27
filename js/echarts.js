const { readFile } = require("browserify-fs");



function echarts01(){
	var myChart = echarts.init(document.getElementById('pictrue1'));
	// 指定图表的配置项和数据
	var option = {
		tooltip: {
		  trigger: 'axis',
		  axisPointer: {
			// Use axis to trigger tooltip
			type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
		  }
		},
		legend: {},
		grid: {
		  left: '3%',
		  right: '4%',
		  bottom: '3%',
		  containLabel: true
		},
		xAxis: {
		  type: 'category',
		  data:[0,1,2,3,4,5,6,7,8,9,10]
		},
		yAxis: {
		  	type:'value'
		},
		series: [
		  {
			name: 'Direct',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true
			},
			emphasis: {
			  focus: 'series'
			},
			data: [320, 302, 301, 334, 390, 330, 320]
		  },
		  {
			name: 'Mail Ad',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true
			},
			emphasis: {
			  focus: 'series'
			},
			data: [120, 132, 101, 134, 90, 230, 210]
		  },
		  {
			name: 'Affiliate Ad',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true
			},
			emphasis: {
			  focus: 'series'
			},
			data: [220, 182, 191, 234, 290, 330, 310]
		  },
		  {
			name: 'Video Ad',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true
			},
			emphasis: {
			  focus: 'series'
			},
			data: [150, 212, 201, 154, 190, 330, 410]
		  },
		  {
			name: 'Search Engine',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true
			},
			emphasis: {
			  focus: 'series'
			},
			data: [820, 832, 901, 934, 1290, 1330, 1320]
		  }
		]
	  };
	 
	// 使用刚指定的配置项和数据显示图表。
	//myChart.setOption(option);
}
function echarts02(){
	var myChart = echarts.init(document.getElementById('pictrue2'));
	 
	// 指定图表的配置项和数据
	var option = {
	    title: {
	        text: 'ECharts 入门示例'
	    },
	    tooltip: {},
	    legend: {
	        data:['销量']
	    },
	    xAxis: {
	        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
	    },
	    yAxis: {},
	    series: [{
	        name: '销量',
	        type: 'bar',
	        data: [5, 20, 36, 10, 10, 20]
	    }]
	};
	 
	// 使用刚指定的配置项和数据显示图表。
	//myChart.setOption(option);
	
}

function getRankAndChoiceData(){
	//获得JSON数据
	$.getJSON("coffeeRank.json", function(data) {
		//console.log(data[0]);
		var rankAndChoice=[];
		for(var i=0;i<data.length;i++){
			var arr=[];
			arr.push(data[i]["Lastly, how would you rate your own coffee expertise?"]);
			arr.push(data[i]["Lastly, what was your favorite overall coffee?"]);
			rankAndChoice.push(arr);
		}
		for(var i = 0;i<rankAndChoice.length;i++)
		{
			console.log(rankAndChoice[i]);
		}
		return rankAndChoice;
		//返回排名和咖啡选择数组
		
	});
}

		
		
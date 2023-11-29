function readFile(files) {
	Z.readAsText(files,
		function(data) {

			var results = Papa.parse(data, {
				header: true, // 如果你的CSV文件包含表头，设置为true
				dynamicTyping: false, // 如果你希望自动将字符串转换为数字或日期，设置为true
			});

			var totalTestersNumber = 0; //测试者总数
			results.data.forEach((row) => {
				if (row) {
					totalTestersNumber++;
				};
			})
			//---------------------------男女比例------------------------
			var malePercent = getColKeyWorsNum(results, 'Gender', 'Male');
			var femalePercent = getColKeyWorsNum(results, 'Gender', 'Female');
			//---------------------------在家煮咖啡的方式------------------------
			var hBAH = getMyCol(results, "How do you brew coffee at home?"); //每个人的回答，回答中可能有多个关键词
			var finalHowBrewAtHome = getNorepeatKeyWordsDict(hBAH);
			/* 
			最终的brewWay数组，每个元素为字典
			如{
				keyword:"Espresso",
				num:500,
			}
			*/
			//---------------------------最爱的咖啡饮品------------------------
			var fD = getMyCol(results, "What is your favorite coffee drink?");
			var favoriteDrink = getNorepeatKeyWordsDict(fD);
			/*
			如{
				keyword:"Lattee",
				num:500,
			}
		   */
			//---------------------------自评专业等级与口味偏好------------------------
			var levelPreference = [];
			/*
			每种自评专业等级下，四种偏爱口味分别占多少人。
			形如：
			{
				level: 1,
				coffeeA: 20,
				coffeeB: 19,
				coffeeC: 60,
				coffeeD: 11,
			}
			*/
			for (var i = 0; i < 10; i++) {
				var cur = {
					level: i + 1,
					coffeeA: 0,
					coffeeB: 0,
					coffeeC: 0,
					coffeeD: 0,
				}
				levelPreference.push(cur);
			}
			for (var i = 0; i < results.data.length; i++) {
				var level = results.data[i]["Lastly, how would you rate your own coffee expertise?"];
				var choice = results.data[i]["Lastly, what was your favorite overall coffee?"];
				if (level && choice) {
					switch (choice) {
						case "Coffee A":
							levelPreference[Number(level) - 1].coffeeA++;
							break;
						case "Coffee B":
							levelPreference[Number(level) - 1].coffeeB++;
							break;
						case "Coffee C":
							levelPreference[Number(level) - 1].coffeeC++;
							break;
						case "Coffee D":
							levelPreference[Number(level) - 1].coffeeD++;
							break;
					}
				}

			}
			//---------------------------自认为偏好的烘焙度与口味偏好------------------------
			//var rP = getMyCol(results,"What roast level of coffee do you prefer");
			//var roastPreference = getNorepeatKeyWordsDict(rp);
			//processTwoColValueDict(results, "What roast level of coffee do you prefer?",
			//	"Lastly, what was your favorite overall coffee?", roastPreference);
			echarts01(levelPreference);
		});
}

function getMyCol(results, columnName) //需要传入papaparse的ret和某列的表头名字符串，以获取某一列的数据，返回为该列的一个数据数组。
{
	var columnValues = [];
	results.data.forEach((row) => {
		columnValues.push(row[columnName]);
	})
	return columnValues;
}

function detectKeyWordsNum(columnValues, keyWords) //获得某列中指定关键词出现的次数
{
	var keyWordsValues = [];
	var wordsNumber = 0;
	columnValues.forEach((value) => {
		if (value && value.includes(keyWords)) { //要检查是否有null或undefined的值，这些值没有includes方法
			keyWordsValues.push(value);
			wordsNumber++;
		}
	});
	return wordsNumber;
}

function getColKeyWorsNum(results, columName, keywords) //直接获取某列中指定关键词出现的次数
{
	var tempCol = [];
	tempCol = getMyCol(results, columName);
	var num = detectKeyWordsNum(tempCol, keywords);
	return num;
}

function getNorepeatKeyWordsDict(columnValues) { //获取某列数组中，按关键词分组，每组关键词都各有多少个
	var tmp = [];
	var ret = [];
	for (var i = 0; i < columnValues.length; i++) {
		if (columnValues[i]) {
			var key = columnValues[i].split(', '); //csv文件中，多个回答时是用, 分割的
			for (var j = 0; j < key.length; j++) { //key[j]中才是具体一个想要的关键词元素
				var index = tmp.indexOf(key[j]);
				if (index == -1) {
					var cur = {
						keyWord: key[j],
						num: 1,
					}
					ret.push(cur);
					tmp.push(key[j]);
				} else {
					ret[index].num++;
				}
			}
		}
	}
	return ret;
}

function processTwoColValueDict(results, col1, col2, dict) {
	for (var i = 0; i < results.data.length; i++) {
		var col1Value = results.data[i][col1];
		var col2Value = results.data[i][col2];
		if (col1Value && col2Value) {
			switch (col2Value) {
				case "Coffee A":
					dict[dict.indexOf(col1Value)].coffeeA++;
					break;
				case "Coffee B":
					dict[dict.indexOf(col1Value)].coffeeB++;
					break;
				case "Coffee C":
					dict[dict.indexOf(col1Value)].coffeeC++;
					break;
				case "Coffee D":
					dict[dict.indexOf(col1Value)].coffeeD++;
					break;
			}
		}
	}

}

function echarts01(data){
	var myChart = echarts.init(document.getElementById('pictrue1'));
	// 指定图表的配置项和数据
	var option = {
		title:{
			show:true,
			text:"Coffee Rank",
			textStyle:{
				fontStyle:'italic',
				fontSize:25,
				color:'#fff'
			},
		},
		tooltip: {
		  trigger: 'axis',
		  axisPointer: {
			// Use axis to trigger tooltip
			type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
			label:{
				formatter: function (params) {
					return "Coffee Expertise Level:" + params.value;
				  },
			}
		  }
		},
		legend: {
			right:'5%',
			textStyle:{
				color:'#fff'
			}
		},
		grid: {
		  left: '3%',
		  right: '4%',
		  bottom: '3%',
		  containLabel: true,
		  top:'5%'
		},
		xAxis: {
		  type: 'category',
		  data:[1,2,3,4,5,6,7,8,9,10],
		  axisLabel:{
			color:"rgba(255, 255, 255, 1)",
			fontFamily:'Courier New',
			fontSize:15
		  },
		  axisLine:{
			lineStyle:{
				color:'#fff'
			}
		  },
		  axisTick:{
			show:false, //隐藏坐标轴的刻度
			},
		},
		yAxis: {
			show:false,
		},
		series: [
		  {
			name: 'A',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true,
			  formatter:'{a}'
			},
			emphasis: {
			  focus: 'series'
			},
			data: []
		  },
		  {
			name: 'B',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true,
			  formatter:'{a}'
			},
			emphasis: {
			  focus: 'series'
			},
			data: []
		  },
		  {
			name: 'C',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true,
			  formatter:'{a}'
			},
			emphasis: {
			  focus: 'series'
			},
			data: []
		  },
		  {
			name: 'D',
			type: 'bar',
			stack: 'total',
			label: {
			  show: true,
			  formatter:'{a}'
			},
			emphasis: {
			  focus: 'series'
			},
			data: []
		  }
		]
	  };
	  for(var i=0;i<4;i++){
		for(var j=0;j<10;j++){
			var allNum = (data[j].coffeeA+data[j].coffeeB+data[j].coffeeC+data[j].coffeeD);
			if(i==0)
			{
				option.series[i].data.push((data[j].coffeeA/allNum *100).toFixed(2));
			}else if(i==1){
				option.series[i].data.push((data[j].coffeeB/allNum *100).toFixed(2));
			}else if(i==2){
				option.series[i].data.push((data[j].coffeeC/allNum *100).toFixed(2));
			}else{
				option.series[i].data.push((data[j].coffeeD/allNum *100).toFixed(2));
			}
		}
	  }
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
function getRankAndChoiceData(){
	//获得JSON数据
	$.getJSON("coffeeRank.json", function(data) {
		//console.log(data[0]);
		
		
	});
}

		
		
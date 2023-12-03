function readFile(files) {
	Z.readAsText(files,
		function(data) {

			var results = Papa.parse(data, {
				header: true, // 如果你的CSV文件包含表头，设置为true
				dynamicTyping: true, // 如果你希望自动将字符串转换为数字或日期，设置为true
			});

			var totalTestersNumber = 0; //测试者总数
			results.data.forEach((row) => {
				if (row) {
					totalTestersNumber++;
				};
			})
			//---------------------------男女比例(饼图)------------------------
			var malePercent = getColKeyWorsNum(results, 'Gender', 'Male');
			var femalePercent = getColKeyWorsNum(results, 'Gender', 'Female');
			//---------------------------在家煮咖啡的方式（条形图）------------------------
			var hBAH = getMyCol(results, "How do you brew coffee at home?"); //每个人的回答，回答中可能有多个关键词
			var finalHowBrewAtHome = getNorepeatKeyWordsDict(hBAH);
			/* 
			最终的brewWay数组，每个元素为字典
			如{
				keyword:"Espresso",
				num:500,
			}
			*/
			//---------------------------最爱的咖啡饮品(雷达图)------------------------
			var fD = getMyCol(results, "What is your favorite coffee drink?");
			var favoriteDrink = getNorepeatKeyWordsDict(fD);
			/*
			如{
				keyword:"Lattee",
				num:500,
			}
		   */
			//---------------------------饮用咖啡的原因（南丁格尔玫瑰图）------------------------
			var dR = getMyCol(results, "Why do you drink coffee?");
			var drinkReason = getNorepeatKeyWordsDict(dR);
			//---------------------------自评专业等级与口味偏好（堆叠条形图）------------------------
			var levelPreference = [];
			/*
			每种自评专业等级下，四种偏爱口味分别占多少人。
			形如：
			{
				keyWord: 1,
				coffeeA: 20,
				coffeeB: 19,
				coffeeC: 60,
				coffeeD: 11,
			}
			*/
			for (var i = 0; i < 10; i++) {
				var cur = {
					keyWord: i + 1,
				}
				levelPreference.push(cur);
			}
			processTwoColValueDict(results, "Lastly, how would you rate your own coffee expertise?",
				"Lastly, what was your favorite overall coffee?", levelPreference);
			//---------------------------自认为偏好的烘焙度与实际的口味偏好(旭日图)------------------------
			var rP = getMyCol(results, "What roast level of coffee do you prefer?");
			var roastPreference = getNorepeatKeyWordsDict(rP);
			/*
			形如：{
				keyWord:"Light",
				num:100,
				coffeeA:0,
				coffeeB:0,
				coffeeC:0,
				coffeeD:0,
			}
			*/
			roastPreference = processTwoColValueDict(results, "What roast level of coffee do you prefer?",
				"Lastly, what was your favorite overall coffee?", roastPreference);
			//---------------------------自认为偏好的形容词与实际的口味偏好（日历图）------------------------
			var descriptorPreference = getNorepeatKeyWordsDict(getMyCol(results,
				"Before today's tasting, which of the following best described what kind of coffee you like?"
			));
			descriptorPreference = processTwoColValueDict(results,
				"Before today's tasting, which of the following best described what kind of coffee you like?",
				"Lastly, what was your favorite overall coffee?",
				descriptorPreference
			);
			//---------------------------四类咖啡的词云（词云图）------------------------
			var coffeeA_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee A - Notes"));
			processNotes(coffeeA_Notes);
			/*
			{
				keyWord:"Fruity",
				num:200
			}
			*/
			var coffeeB_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee B - Notes"));
			processNotes(coffeeB_Notes);
			var coffeeC_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee C - Notes"));
			processNotes(coffeeC_Notes);
			var coffeeD_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee D - Notes"));
			processNotes(coffeeD_Notes);
			//---------------------------ECHARTS部分------------------------
			echarts01(levelPreference);
			echartsGenderRatio(malePercent, femalePercent);
			echartsBrewingMethod(finalHowBrewAtHome);
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

function processTwoColValueDict(results, col1, col2, dic) {
	var dict = dic;
	/*
	{
		keyWord:"Lattee",
		num:100,
	}
	*/
	for (var i = 0; i < results.data.length; i++) {
		var col1Value = results.data[i][col1];
		var col2Value = results.data[i][col2];
		var index = -1;
		for (var j = 0; j < dict.length; j++) { //遍历关键词字典
			if (col1Value && dict[j].keyWord == col1Value) {
				index = j; //取出co1Value对应字典中的索引是多少
				break;
			}
		}
		if (index != -1 && dict[index].coffeeA == undefined) { //在该字典元素中添加新的键值对，并判断该元素是否已经添加过一遍新键值对。
			dict[index].coffeeA = 0;
			dict[index].coffeeB = 0;
			dict[index].coffeeC = 0;
			dict[index].coffeeD = 0;
		}


		if (index != -1 && col1Value && col2Value) {
			switch (col2Value) {
				case "Coffee A":
					dict[index].coffeeA++;
					break;
				case "Coffee B":
					dict[index].coffeeB++;
					break;
				case "Coffee C":
					dict[index].coffeeC++;
					break;
				case "Coffee D":
					dict[index].coffeeD++;
					break;
			}
		}
	}
	return dict;
}

function processNotes(notes) //取出现了十次以上的描述
{
	for (var i = 0; i < notes.length; i++) {
		var cur = notes[i];
		if (cur.num < 10) {
			notes.splice(i, i + 1); //删除索引为i的元素
			i = i - 1;
		}
	}
}

function echartsGenderRatio(male, female) {
	var myChart = echarts.init(document.getElementById('pictrue2'));
	option = {
		title: {
			text: 'Gender Ratio',
			textStyle: {
				fontSize: 13,
				color: '#412d24',
			},
			bottom: '10%',
			left: 'center',

		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'horizontal',
			center: 'center',
		},
		series: [{
			name: 'Gender',
			type: 'pie',
			color: [
				'#43476d',
				'#6d4347',
			],
			radius: '40%',
			data: [{
					value: male,
					name: 'Male'
				},
				{
					value: female,
					name: 'Female'
				},
			],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	myChart.setOption(option);
}

function echartsBrewingMethod(data) {
	var myChart = echarts.init(document.getElementById('pictrue3'));
	var myXAxisData = [];
	var mySeriesData = [];
	for(var i = 0; i < data.length; i++)
	{
		var cur = data[i];
		myXAxisData.push(cur.keyWord);
		mySeriesData.push(cur.num);
	}
	option = {
		title: {
			text: "Preferred brewing method",
			textStyle: {
				fontSize: 18,
				color: '#412d24',
			},
			bottom: '0%',
			left: 'center',
		},
		tooltip: {
			show: true,
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			data: myXAxisData,
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			color: [
				'#43476d',
				'#6d4347',

			],
			data: mySeriesData,
			type: 'bar',
			colorBy: 'data',
		}]
	};
	myChart.setOption(option);
}

function echarts01(data) {
	var myChart = echarts.init(document.getElementById('pictrue1'));
	// 指定图表的配置项和数据
	var option = {
		title: {
			show: true,
			text: "Coffee Rank",
			textStyle: {
				fontStyle: 'italic',
				fontSize: 25,
				color: '#412d24',
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// Use axis to trigger tooltip
				type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
				label: {
					formatter: function(params) {
						return "Coffee Expertise Level:" + params.value;
					},
				}
			}
		},
		legend: {
			right: '5%',
			textStyle: {
				color: '#412d24',
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
			top: '5%'
		},
		xAxis: {
			type: 'category',
			data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			axisLabel: {
				color: '#412d24',
				fontFamily: 'Courier New',
				fontSize: 15
			},
			axisLine: {
				lineStyle: {
					color: '#412d24',
				}
			},
			axisTick: {
				show: false, //隐藏坐标轴的刻度
			},
		},
		yAxis: {
			show: false,
		},
		series: [{
				name: 'A',
				type: 'bar',
				stack: 'total',
				label: {
					show: true,
					formatter: '{a}'
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
					formatter: '{a}'
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
					formatter: '{a}'
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
					formatter: '{a}'
				},
				emphasis: {
					focus: 'series'
				},
				data: []
			}
		]
	};
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 10; j++) {
			var allNum = (data[j].coffeeA + data[j].coffeeB + data[j].coffeeC + data[j].coffeeD);
			if (i == 0) {
				option.series[i].data.push((data[j].coffeeA / allNum * 100).toFixed(2));
			} else if (i == 1) {
				option.series[i].data.push((data[j].coffeeB / allNum * 100).toFixed(2));
			} else if (i == 2) {
				option.series[i].data.push((data[j].coffeeC / allNum * 100).toFixed(2));
			} else {
				option.series[i].data.push((data[j].coffeeD / allNum * 100).toFixed(2));
			}
		}
	}
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}

function getRankAndChoiceData() {
	//获得JSON数据
	$.getJSON("coffeeRank.json", function(data) {
		//console.log(data[0]);


	});
}
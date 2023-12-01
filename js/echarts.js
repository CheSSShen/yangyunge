function readFile(files) {
	Z.readAsText(files,
		function (data) {

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
			//---------------------------自认为偏好的烘焙度与实际的口味偏好------------------------
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
			console.log(roastPreference);
			console.log(favoriteDrink);
			//---------------------------ECHARTS部分------------------------
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
				color: '#fff'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// Use axis to trigger tooltip
				type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
				label: {
					formatter: function (params) {
						return "Coffee Expertise Level:" + params.value;
					},
				}
			}
		},
		legend: {
			right: '5%',
			textStyle: {
				color: '#fff'
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
				color: "rgba(255, 255, 255, 1)",
				fontFamily: 'Courier New',
				fontSize: 15
			},
			axisLine: {
				lineStyle: {
					color: '#fff'
				}
			},
			axisTick: {
				show: false, //隐藏坐标轴的刻度
			},
		},
		yAxis: {
			show: false,
		},
		series: [
			{
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
echarts02();
function echarts02() {
	var myChart = echarts.init(document.getElementById('pictrue2'));
	var keywords = [{ "name": "男神", "value": 2.64 },
	{ "name": "好身材", "value": 4.03 },
	{ "name": "校草", "value": 24.95 },
	{ "name": "酷", "value": 4.04 },
	{ "name": "时尚", "value": 5.27 },
	{ "name": "阳光活力", "value": 5.80 },
	{ "name": "初恋", "value": 3.09 },
	{ "name": "英俊潇洒", "value": 24.71 },
	{ "name": "霸气", "value": 6.33 },
	{ "name": "腼腆", "value": 2.55 },
	{ "name": "蠢萌", "value": 3.88 },
	{ "name": "青春", "value": 8.04 },
	{ "name": "网红", "value": 5.87 },
	{ "name": "萌", "value": 6.97 },
	{ "name": "认真", "value": 2.53 },
	{ "name": "古典", "value": 2.49 },
	{ "name": "温柔", "value": 3.91 },
	{ "name": "有个性", "value": 3.25 },
	{ "name": "可爱", "value": 9.93 },
	{ "name": "幽默谐", "value": 3.65 },
	{ "name": "幽默诙谐", "value": 3.65 },
	{ "name": "幽诙谐", "value": 3.65 },
	{ "name": "幽默诙谐", "value": 3.65 },
	{ "name": "幽默谐", "value": 3.65 },
	{ "name": "幽默诙谐", "value": 3.65 },
	{ "name": "幽默诙谐", "value": 3.65 },
	{ "name": "幽默谐", "value": 3.65 },
	{ "name": "幽默诙谐", "value": 3.65 },
	{ "name": "幽诙谐", "value": 3.65 },
	{ "name": "幽默谐", "value": 3.65 }]

	var option = {
		series: [{
			type: 'wordCloud',
			//maskImage: maskImage,
			sizeRange: [15, 80],
			rotationRange: [0, 0],
			rotationStep: 45,
			gridSize: 8,
			shape: 'pentagon',
			width: '100%',
			height: '100%',
			textStyle: {
				normal: {
					color: function () {
						return 'rgb(' + [
							Math.round(Math.random() * 160),
							Math.round(Math.random() * 160),
							Math.round(Math.random() * 160)
						].join(',') + ')';
					},
					fontFamily: 'sans-serif',
					fontWeight: 'normal'
				},
				emphasis: {
					shadowBlur: 10,
					shadowColor: '#333'
				}
			},
			data: keywords
		}],
		image:`data:image/png;base64,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`
	};
	var maskImage = new Image();
	maskImage.src = option.series[0].data.image

	maskImage.onload = function () {
		myChart.setOption({
			backgroundColor: '#fff',
			tooltip: {
				show: false
			},
			series: [{
				type: 'wordCloud',
				gridSize: 1,
				sizeRange: [12, 55],
				rotationRange: [-45, 0, 45, 90],
				maskImage: maskImage,
				textStyle: {
					normal: {
						color: function () {
							return 'rgb(' +
								Math.round(Math.random() * 255) +
								', ' + Math.round(Math.random() * 255) +
								', ' + Math.round(Math.random() * 255) + ')'
						}
					}
				},
				left: 'center',
				top: 'center',
				// width: '96%',
				// height: '100%',
				right: null,
				bottom: null,
				// width: 300,
				// height: 200,
				// top: 20,
				data: data.value
			}]
		})
	}

	myChart.setOption(option);
	window.onresize = myChart.resize;
}



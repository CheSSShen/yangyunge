// function readTextFile(filePath, callback) {
// 	const xhrFile = new XMLHttpRequest();
// 	xhrFile.open("GET", filePath, true);
// 	xhrFile.onload = function () {
// 		const allText = xhrFile.response;
// 		callback(allText)
// 	}
// 	xhrFile.send();
// }
// readTextFile("coffee.csv", (data) => {
// 	var results = Papa.parse(data, {
// 		header: true, // 如果你的CSV文件包含表头，设置为true
// 		dynamicTyping: true, // 如果你希望自动将字符串转换为数字或日期，设置为true
// 	});

// 	var totalTestersNumber = 0; //测试者总数
// 	results.data.forEach((row) => {
// 		if (row) {
// 			totalTestersNumber++;
// 		};
// 	})
// 	//---------------------------男女比例(饼图)------------------------
// 	var malePercent = getColKeyWorsNum(results, 'Gender', 'Male');
// 	var femalePercent = getColKeyWorsNum(results, 'Gender', 'Female');
// 	//---------------------------在家煮咖啡的方式（条形图）------------------------
// 	var hBAH = getMyCol(results, "How do you brew coffee at home?"); //每个人的回答，回答中可能有多个关键词
// 	var finalHowBrewAtHome = getNorepeatKeyWordsDict(hBAH);
// 	/* 
// 	最终的brewWay数组，每个元素为字典
// 	如{
// 		keyword:"Espresso",
// 		num:500,
// 	}
// 	*/
// 	//---------------------------最爱的咖啡饮品(雷达图)------------------------
// 	var fD = getMyCol(results, "What is your favorite coffee drink?");
// 	var favoriteDrink = getNorepeatKeyWordsDict(fD);
// 	/*
// 	如{
// 		keyword:"Lattee",
// 		num:500,
// 	}
// */
// 	//---------------------------饮用咖啡的原因（南丁格尔玫瑰图）------------------------
// 	var dR = getMyCol(results, "Why do you drink coffee?");
// 	var drinkReason = getNorepeatKeyWordsDict(dR);
// 	//---------------------------自评专业等级与口味偏好（堆叠条形图）------------------------
// 	var levelPreference = [];
// 	/*
// 	每种自评专业等级下，四种偏爱口味分别占多少人。
// 	形如：
// 	{
// 		keyWord: 1,
// 		coffeeA: 20,
// 		coffeeB: 19,
// 		coffeeC: 60,
// 		coffeeD: 11,
// 	}
// 	*/
// 	for (var i = 0; i < 10; i++) {
// 		var cur = {
// 			keyWord: i + 1,
// 		}
// 		levelPreference.push(cur);
// 	}
// 	processTwoColValueDict(results, "Lastly, how would you rate your own coffee expertise?",
// 		"Lastly, what was your favorite overall coffee?", levelPreference);
// 	//---------------------------自认为偏好的烘焙度与实际的口味偏好(旭日图)------------------------
// 	var rP = getMyCol(results, "What roast level of coffee do you prefer?");
// 	var roastPreference = getNorepeatKeyWordsDict(rP);
// 	/*
// 	形如：{
// 		keyWord:"Light",
// 		num:100,
// 		coffeeA:0,
// 		coffeeB:0,
// 		coffeeC:0,
// 		coffeeD:0,
// 	}
// 	*/
// 	roastPreference = processTwoColValueDict(results, "What roast level of coffee do you prefer?",
// 		"Lastly, what was your favorite overall coffee?", roastPreference);
// 	//---------------------------自认为偏好的形容词与实际的口味偏好（日历图）------------------------
// 	var descriptorPreference = getNorepeatKeyWordsDict(getMyCol(results,
// 		"Before today's tasting, which of the following best described what kind of coffee you like?"
// 	));
// 	descriptorPreference = processTwoColValueDict(results,
// 		"Before today's tasting, which of the following best described what kind of coffee you like?",
// 		"Lastly, what was your favorite overall coffee?",
// 		descriptorPreference
// 	);
// 	//---------------------------四类咖啡的词云（词云图）------------------------
// 	var coffeeA_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee A - Notes"));
// 	processNotes(coffeeA_Notes);
// 	/*
// 	{
// 		keyWord:"Fruity",
// 		num:200
// 	}
// 	*/
// 	var coffeeB_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee B - Notes"));
// 	processNotes(coffeeB_Notes);
// 	var coffeeC_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee C - Notes"));
// 	processNotes(coffeeC_Notes);
// 	var coffeeD_Notes = getNorepeatKeyWordsDict(getMyCol(results, "Coffee D - Notes"));
// 	processNotes(coffeeD_Notes);
// 	//---------------------------ECHARTS部分------------------------
// 	echarts01(levelPreference);
// 	echartsGenderRatio(malePercent, femalePercent);
// 	echartsDrinkReason(drinkReason);
// 	echartsBrewingMethod(finalHowBrewAtHome);
// 	echartsFavoriteDrink(favoriteDrink);
// 	echarts03(roastPreference);
// 	echarts02(coffeeA_Notes, 'wordcloudCoffeeA','Light roast, washed process');
// 	echarts02(coffeeB_Notes, 'wordcloudCoffeeB','Medium roast');
// 	echarts02(coffeeC_Notes, 'wordcloudCoffeeC','Dark roast');
// 	echarts02(coffeeD_Notes, 'wordcloudCoffeeD','Light roast, natural process');
// 	echartsActualPreference(descriptorPreference);
// 	console.log(descriptorPreference);
// })


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
			var genderRatio = getNorepeatKeyWordsDict(getMyCol(results, 'Gender'));
			// var malePercent = getColKeyWorsNum(results, 'Gender', 'Male');
			// var femalePercent = getColKeyWorsNum(results, 'Gender', 'Female');
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
			//---------------------------获得咖啡的方式与口味偏好（堆叠条形图）------------------------
			brewWayPreference = processTwoColValueDict(results, "How do you brew coffee at home?",
				"Lastly, what was your favorite overall coffee?", finalHowBrewAtHome);

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
			echartsGenderRatio(genderRatio);
			echartsDrinkReason(drinkReason);
			echartsBrewingMethod(finalHowBrewAtHome);
			echartsFavoriteDrink(favoriteDrink);

			echarts03(roastPreference);
			echarts02(coffeeA_Notes, 'wordcloudCoffeeA', 'Light roast, washed process');
			echarts02(coffeeB_Notes, 'wordcloudCoffeeB', 'Medium roast');
			echarts02(coffeeC_Notes, 'wordcloudCoffeeC', 'Dark roast');
			echarts02(coffeeD_Notes, 'wordcloudCoffeeD', 'Light roast, natural process');
			echartsActualPreference(descriptorPreference);
			echartsBrewWayPreference(brewWayPreference);
			console.log(brewWayPreference);
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

function processNotes(notes) { //防止一单词不同拼写重复
	for (var i = 0; i < notes.length; i++) {
		var cur = notes[i].keyWord;
		for (var j = i + 1; j < notes.length; j++) {
			if (notes[j].keyWord.toLowerCase() == cur.toLowerCase()) {
				var n = notes[j].num;
				notes.splice(j, j + 1);
				notes[i].num += n;
				j--;
			}
		}
	}
}

function sortArr(myData) {
	for (var i = 0; i < myData.length - 1; i++) {
		for (var j = 0; j < myData.length - i - 1; j++) {
			if (myData[j + 1].num > myData[j].num) {
				var tmp = myData[j];
				myData[j] = myData[j + 1];
				myData[j + 1] = tmp;
			}
		}
	}
}

function echartsGenderRatio(data) {
	var myChart = echarts.init(document.getElementById('genderRatio'));
	var myData = [];
	for (var i = 0; i < data.length; i++) {
		var cur = {
			value: data[i].num,
			name: data[i].keyWord,
		}
		myData.push(cur);
	}
	option = {

		title: {
			text: 'Gender Ratio',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
			bottom: '5%',
			left: 'center',

		},
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{b} : {d}%',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		series: [{
			name: 'Gender',
			type: 'pie',
			color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c',
				'#bc64a4'
			],
			radius: '70%',
			data: myData,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				},
				label: {
					show: true,
					fontSize: 20,
					fontWeight: 'bold',
				}
			},
			labelLine: {
				show: true,
				smooth: true,
			},
			label: {
				fontSize: 16,
				color: '#6d6943',
			},
		}]
	};
	myChart.setOption(option);
}

function echartsDrinkReason(data) {
	var myChart = echarts.init(document.getElementById('drinkReason'));
	var myData = [];
	for (var i = 0; i < data.length; i++) {
		var cur = {
			value: data[i].num,
			name: data[i].keyWord,
		}
		myData.push(cur);
	}
	option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		title: {
			text: 'Why Drinking Coffee',
			left: 'center',
			bottom: '5%',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		tooltip: {
			trigger: 'item',
			formatter: '{b} : {d}%',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		series: [{
			type: 'pie',
			radius: ['30%', '70%'],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 10,
			},
			label: {
				show: false,
				fontSize: 25,
				position: 'center'
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 18,
					fontWeight: 'bold',

				}
			},
			labelLine: {
				show: false
			},
			data: myData,
		}]
	};
	myChart.setOption(option);
}

function echartsBrewingMethod(data) {
	var myChart = echarts.init(document.getElementById('brewMethod'));
	sortArr(data);
	var myXAxisData = [];
	var mySeriesData = [];
	for (var i = 0; i < data.length; i++) {
		var cur = data[i];
		myXAxisData.push(cur.keyWord);
		mySeriesData.push(cur.num);
	}


	option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		title: {
			text: "Preferred brewing method",
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
			bottom: '5%',
			left: 'center',
		},
		tooltip: {
			show: true,
			trigger: 'axis',
			formatter: '{b} : {c}',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},

		},
		xAxis: {
			show: true,
			type: 'category',
			axisLabel: {
				show: false,
			},
			axisTick: {
				alignWithLabel: true
			},
			data: myXAxisData,
		},
		yAxis: {
			type: 'value',
			show: false,
			alignTicks: true,
		},
		series: [{
			label: {
				show: true,
				position: 'top',
				fontSize: 20,
			},
			data: mySeriesData,
			type: 'bar',
			colorBy: 'data',
		}]
	};
	myChart.setOption(option);
}

function echartsFavoriteDrink(data) {
	var myChart = echarts.init(document.getElementById('favoriteDrink'));
	sortArr(data);
	var myData = [];
	for (var i = 0; i < 8; i++) {
		var cur = {
			value: data[i].num,
			name: data[i].keyWord,
		}
		myData.push(cur);
	}

	option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		title: {
			text: "Favorite Coffee Drink",
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
			bottom: '5%',
			left: 'center',
		},
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{b} : {d}%',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		series: [{
			label: {
				show: true,
				position: 'inside',
				fontSize: 13,
				rotate: -20,
			},
			emphasis: {
				label: {
					show: true
				},
				scale: true,
				scaleSize: 20,
				focus: 'series',
				blurScope: 'coordinateSystem',
			},
			type: 'pie',
			radius: [30, 200],
			roseType: 'area',
			itemStyle: {
				borderRadius: 5,
			},
			data: myData,
		}]
	};
	myChart.setOption(option);
}

function echarts01(data) {
	var myChart = echarts.init(document.getElementById('expertise'));
	// 指定图表的配置项和数据
	var option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		title: {
			show: true,
			text: "Expertise Level With Preference",
			top: '5%',
			left: '5%',
			textStyle: {
				fontSize: 20,
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
			},
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		legend: {
			right: '0%',
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
				fontSize: 12,
				margin: 5,
			},
			axisLine: {
				lineStyle: {
					color: '#412d24',
				}
			},

			axisTick: {
				show: false, //隐藏坐标轴的刻度
				alignWithLabel: true,
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
					formatter: '{a}',
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

function echarts02(data, divID, intro) {
	var myChart = echarts.init(document.getElementById(divID));
	var keywords = [];
	for (var i = 0; i < data.length; i++) {
		var cur = {
			"name": data[i].keyWord,
			"value": data[i].num,
		}
		keywords.push(cur);
	}
	var option = {
		series: [{
			data: keywords
		}],
		image: "data:image/png;base64,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"
	};
	var maskImage = new Image();
	//console.log(option.image);
	maskImage.src = option.image;

	maskImage.onload = function() {
		myChart.setOption({
			backgroundColor: '#d3b795',
			tooltip: {
				show: true,
				textStyle: {
					fontSize: 20,
					color: '#412d24',
				},
			},
			title: {
				text: divID.slice(9, 15) + ' ' + divID.slice(15, 16) + ' : ' + intro,
				left: '43%	',
				bottom: '0%',
				textAlign: 'center',
				textStyle: {
					fontSize: 18,
					color: '#412d24',
				},
			},
			series: [{
				type: 'wordCloud',
				gridSize: 1,
				sizeRange: [10, 80],
				rotationRange: [0, 90],
				maskImage: maskImage,
				drawOutOfBound: false,
				textStyle: {
					color: function() {
						return 'rgb(' +
							Math.round(Math.random() * 155) +
							', ' + Math.round(Math.random() * 155) +
							', ' + Math.round(Math.random() * 155) + ')'
					},
				},
				left: 'center',
				width: '100%',
				height: '100%',
				right: null,
				bottom: null,
				data: keywords
			}]
		})
	}
	myChart.setOption(option);
	window.onresize = myChart.resize;
}

function echarts03(data) {
	var myChart = echarts.init(document.getElementById('sunburst'));
	var option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		tooltip: {
			trigger: 'item',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		title: {
			text: "Perceived roast preference VS actual preference",
			bottom: '5%',
			left: 'center',
			textStyle: {
				fontSize: 25,
				align: 'center',
				color: '#412d24',
			},
		},
		series: {
			type: "sunburst",
			label: {
				fontSize: 14,
			},
			data: [{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: null
						},
						{
							name: "",
							value: null
						},
						{
							name: "",
							value: null
						}
					]

				},
				{
					name: "",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				}
			],
			radius: [0, '95%'],
			sort: undefined,
			emphasis: {
				focus: 'ancestor'
			},
			levels: [{},
				{
					r0: '15%',
					r: '45%',
					itemStyle: {
						borderWidth: 1,
					},
					label: {
						rotate: 'tangential'
					}
				},
				{
					r0: '45%',
					r: '70%',
					label: {
						align: 'center'
					}
				}
			]
		}
	}
	// 线性比例尺 Linear Scales
	// 线性比例尺 Linear Scales 值域中的值 yyy 与定义域中的值 xxx 通过表达式 y=mx+by=mx+by=mx+b 联系起来，
	// 这种映射方式可以在视觉元素的变量中保留数据的原始差异比例
	// 使用方法 d3.scaleLinear(domain, range) 构建一个线性比例尺，
	// 入参是可选的，如果忽略则定义域和值域范围默认是 [0, 1]，也可以在之后通过 continuous.domain(value) 和 continuous.range(value) 设置定义域和值域。

	//对数比例尺
	const x = d3.scaleLog()
		.domain([1, 910])
		.range([1, 300]);

	for (var i = 0; i < data.length; i++) {
		//console.log(data[i].keyWord);
		option.series.data[i].name = data[i].keyWord;
		option.series.data[i].children[0].name = "coffeeA";
		option.series.data[i].children[0].value = x(data[i].coffeeA);
		option.series.data[i].children[1].name = "coffeeB";
		option.series.data[i].children[1].value = x(data[i].coffeeB);
		option.series.data[i].children[2].name = "coffeeC";
		option.series.data[i].children[2].value = x(data[i].coffeeC);
		option.series.data[i].children[3].name = "coffeeD";
		option.series.data[i].children[3].value = x(data[i].coffeeD);
		// console.log(x(data[i].coffeeA) + "-" + x(data[i].coffeeB) + "-" + x(data[i].coffeeC) + "-" + x(data[i]
		// 	.coffeeD));
	}
	myChart.setOption(option);
}

function echartsActualPreference(data) {
	var myChart = echarts.init(document.getElementById("describe"));
	var option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		tooltip: {
			trigger: 'item',
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		title: {
			text: "Descriptors of perceived preferences VS actual preference",
			bottom: '5%',
			left: 'center',
			textStyle: {
				fontSize: 25,
				align: 'center',
				color: '#412d24',
			},
		},
		series: {
			type: "sunburst",
			label: {
				fontSize: 14,
			},
			data: [{
					name: "",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				},
				{
					name: "21212",
					children: [{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						},
						{
							name: "",
							value: 1
						}
					]

				}
			],
			radius: [0, '95%'],
			sort: undefined,
			emphasis: {
				focus: 'descendant',
				label: {
					fontSize: 20,
				},
				itemStyle: {
					borderRadius: ['20%', '50%']
				}
			},
			levels: [{},
				{
					r0: '15%',
					r: '45%',
					itemStyle: {
						borderWidth: 1,
					},
					label: {
						rotate: 'tangential'
					}
				},
				{
					r0: '45%',
					r: '70%',
					label: {
						align: 'center'
					}
				}
			]
		}
	}
	// 线性比例尺 Linear Scales
	// 线性比例尺 Linear Scales 值域中的值 yyy 与定义域中的值 xxx 通过表达式 y=mx+by=mx+by=mx+b 联系起来，
	// 这种映射方式可以在视觉元素的变量中保留数据的原始差异比例
	// 使用方法 d3.scaleLinear(domain, range) 构建一个线性比例尺，
	// 入参是可选的，如果忽略则定义域和值域范围默认是 [0, 1]，也可以在之后通过 continuous.domain(value) 和 continuous.range(value) 设置定义域和值域。

	//对数比例尺
	const x = d3.scaleLinear()
		.domain([1, 953])
		.range([1, 200]);

	for (var i = 2; i < data.length; i++) {
		j = i - 2;
		//console.log(data[i].keyWord);
		option.series.data[j].name = data[i].keyWord;
		option.series.data[j].children[0].name = "coffeeA";
		option.series.data[j].children[0].value = x(data[i].coffeeA);
		option.series.data[j].children[1].name = "coffeeB";
		option.series.data[j].children[1].value = x(data[i].coffeeB);
		option.series.data[j].children[2].name = "coffeeC";
		option.series.data[j].children[2].value = x(data[i].coffeeC);
		option.series.data[j].children[3].name = "coffeeD";
		option.series.data[j].children[3].value = x(data[i].coffeeD);
		//console.log(x(data[i].coffeeA) + "-" + x(data[i].coffeeB) + "-" + x(data[i].coffeeC) + "-" + x(data[i]
		//.coffeeD));
	}
	myChart.setOption(option);
}

function echartsBrewWayPreference(data) {
	var myChart = echarts.init(document.getElementById('brewWayPreference'));
	// 指定图表的配置项和数据
	var option = {
		color: ['#465da3', '#73a35d', '#bfa549', '#c55959', '#609fb8', '#2c7855', '#d1764b', '#9a606c', '#bc64a4'],
		title: {
			show: true,
			text: "Brew Way With Preference",
			bottom: '0%',
			left: '48%',
			textStyle: {
				fontSize: 20,
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
						return "Brew Way:" + params.value;
					},
				}
			},
			textStyle: {
				fontSize: 20,
				color: '#412d24',
			},
		},
		legend: {
			right: '0%',
			textStyle: {
				fontSize:15,
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
		yAxis: {
			type: 'category',
			data: [],
			axisLabel: {
				color: '#412d24',
				fontSize: 18,
				margin: 5,
			},
			axisLine: {
				lineStyle: {
					color: '#412d24',
				}
			},

			axisTick: {
				show: false, //隐藏坐标轴的刻度
				alignWithLabel: true,
			},
		},
		xAxis: {
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
					formatter: '{a}',
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
	for (var i = data.length-1; i >= 0; i--) {
		option.yAxis.data.push(data[i].keyWord);
	}
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
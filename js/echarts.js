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
			echartsFavoriteDrink(favoriteDrink);
			//echarts02(coffeeA_Notes);
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
		if (cur.num < 3) {
			notes.splice(i, i + 1); //删除索引为i的元素
			i = i - 1;
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

function echartsGenderRatio(male, female) {
	var myChart = echarts.init(document.getElementById('genderRatio'));
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
			show: true,
			trigger: 'item',
			formatter: '{b} : {d}%',
		},
		legend: {
			orient: 'horizontal',
			center: 'center',
		},
		series: [{
			name: 'Gender',
			type: 'pie',
			color: [
				'#5470c6',
				'#ee6666',
			],
			radius: '40%',
			data: [{
					value: male,
					name: 'Male'
				},
				{
					value: female,
					name: 'Female',
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
		title: {
			text: "Preferred brewing method",
			textStyle: {
				fontSize: 13,
				color: '#412d24',
			},
			bottom: '10%',
			left: 'center',
		},
		tooltip: {
			show: true,
			trigger: 'axis',
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
				position: 'insideTop',
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
		title: {
			text: "Favorite Coffee Drink",
			textStyle: {
				fontSize: 13,
				color: '#412d24',
			},
			bottom: '15%',
			left: 'center',
		},
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{b} : {d}%',
		},
		series: [{
			label: {
				show: true,
				position:'inside',
				fontSize:8,
				rotate:-20,
			},
			emphasis: {
				label: {
					show: true
				},
				scale:true,
				scaleSize :15,
				focus: 'series',
				blurScope: 'coordinateSystem',
			},
			type: 'pie',
			radius: [30, 130],
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
		title: {
			show: true,
			text: "Expertise Level\nWith Preference",
			left:'10%',
			textStyle: {
				fontSize: 13,
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
			right:'0%',
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
				margin:5,
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

function echarts02(data) {
	var myChart = echarts.init(document.getElementById('wordcloud'));
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
			// type: 'wordCloud',
			// //maskImage: maskImage,
			// sizeRange: [12, 60],
			// rotationRange: [0, 0],
			// rotationStep: 45,
			// gridSize: 3,
			// drawOutOfBound:false,
			// shape: 'pentagon',
			// width: '80%',
			// height: '75%',
			// textStyle: {
			// 	normal: {
			// 		color: function () {
			// 			return 'rgb(' + [
			// 				Math.round(Math.random() * 160),
			// 				Math.round(Math.random() * 160),
			// 				Math.round(Math.random() * 160)
			// 			].join(',') + ')';
			// 		},
			// 		fontFamily: 'sans-serif',
			// 		fontWeight: 'normal'
			// 	},
			// 	emphasis: {
			// 		shadowBlur: 10,
			// 		shadowColor: '#333'
			// 	}
			// },
			data: keywords
		}],
		image: "data:image/png;base64,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"
	};
	var maskImage = new Image();
	console.log(option.image);
	maskImage.src = option.image;

	maskImage.onload = function() {
		myChart.setOption({
			backgroundColor: '#d3b795',
			tooltip: {
				show: false
			},
			series: [{
				type: 'wordCloud',
				gridSize: 1,
				sizeRange: [4, 60],
				rotationRange: [0, 90],
				maskImage: maskImage,
				textStyle: {
					normal: {
						color: function() {
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
				data: keywords
			}]
		})
	}

	myChart.setOption(option);
	window.onresize = myChart.resize;
}
echarts03(roastPreference);
function echarts03(data){
	var myChart = echarts.init(document.getElementById('sunburst'));
	var option={
		title:{
			text:"sunburst",
			textStyle:{
				fontSize:14,
				align:'center'
			}
		},
		series:{
			type:"sunburst",
			data:[
				{
				  name: 'Flora',
				  itemStyle: {
					color: '#da0d68'
				  },
				  children: [
					{
					  name: 'Black Tea',
					  value: 1,
					  itemStyle: {
						color: '#975e6d'
					  }
					},
					{
					  name: 'Floral',
					  itemStyle: {
						color: '#e0719c'
					  },
					  children: [
						{
						  name: 'Chamomile',
						  value: 1,
						  itemStyle: {
							color: '#f99e1c'
						  }
						},
						{
						  name: 'Rose',
						  value: 1,
						  itemStyle: {
							color: '#ef5a78'
						  }
						},
						{
						  name: 'Jasmine',
						  value: 1,
						  itemStyle: {
							color: '#f7f1bd'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Fruity',
				  itemStyle: {
					color: '#da1d23'
				  },
				  children: [
					{
					  name: 'Berry',
					  itemStyle: {
						color: '#dd4c51'
					  },
					  children: [
						{
						  name: 'Blackberry',
						  value: 1,
						  itemStyle: {
							color: '#3e0317'
						  }
						},
						{
						  name: 'Raspberry',
						  value: 1,
						  itemStyle: {
							color: '#e62969'
						  }
						},
						{
						  name: 'Blueberry',
						  value: 1,
						  itemStyle: {
							color: '#6569b0'
						  }
						},
						{
						  name: 'Strawberry',
						  value: 1,
						  itemStyle: {
							color: '#ef2d36'
						  }
						}
					  ]
					},
					{
					  name: 'Dried Fruit',
					  itemStyle: {
						color: '#c94a44'
					  },
					  children: [
						{
						  name: 'Raisin',
						  value: 1,
						  itemStyle: {
							color: '#b53b54'
						  }
						},
						{
						  name: 'Prune',
						  value: 1,
						  itemStyle: {
							color: '#a5446f'
						  }
						}
					  ]
					},
					{
					  name: 'Other Fruit',
					  itemStyle: {
						color: '#dd4c51'
					  },
					  children: [
						{
						  name: 'Coconut',
						  value: 1,
						  itemStyle: {
							color: '#f2684b'
						  }
						},
						{
						  name: 'Cherry',
						  value: 1,
						  itemStyle: {
							color: '#e73451'
						  }
						},
						{
						  name: 'Pomegranate',
						  value: 1,
						  itemStyle: {
							color: '#e65656'
						  }
						},
						{
						  name: 'Pineapple',
						  value: 1,
						  itemStyle: {
							color: '#f89a1c'
						  }
						},
						{
						  name: 'Grape',
						  value: 1,
						  itemStyle: {
							color: '#aeb92c'
						  }
						},
						{
						  name: 'Apple',
						  value: 1,
						  itemStyle: {
							color: '#4eb849'
						  }
						},
						{
						  name: 'Peach',
						  value: 1,
						  itemStyle: {
							color: '#f68a5c'
						  }
						},
						{
						  name: 'Pear',
						  value: 1,
						  itemStyle: {
							color: '#baa635'
						  }
						}
					  ]
					},
					{
					  name: 'Citrus Fruit',
					  itemStyle: {
						color: '#f7a128'
					  },
					  children: [
						{
						  name: 'Grapefruit',
						  value: 1,
						  itemStyle: {
							color: '#f26355'
						  }
						},
						{
						  name: 'Orange',
						  value: 1,
						  itemStyle: {
							color: '#e2631e'
						  }
						},
						{
						  name: 'Lemon',
						  value: 1,
						  itemStyle: {
							color: '#fde404'
						  }
						},
						{
						  name: 'Lime',
						  value: 1,
						  itemStyle: {
							color: '#7eb138'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Sour/\nFermented',
				  itemStyle: {
					color: '#ebb40f'
				  },
				  children: [
					{
					  name: 'Sour',
					  itemStyle: {
						color: '#e1c315'
					  },
					  children: [
						{
						  name: 'Sour Aromatics',
						  value: 1,
						  itemStyle: {
							color: '#9ea718'
						  }
						},
						{
						  name: 'Acetic Acid',
						  value: 1,
						  itemStyle: {
							color: '#94a76f'
						  }
						},
						{
						  name: 'Butyric Acid',
						  value: 1,
						  itemStyle: {
							color: '#d0b24f'
						  }
						},
						{
						  name: 'Isovaleric Acid',
						  value: 1,
						  itemStyle: {
							color: '#8eb646'
						  }
						},
						{
						  name: 'Citric Acid',
						  value: 1,
						  itemStyle: {
							color: '#faef07'
						  }
						},
						{
						  name: 'Malic Acid',
						  value: 1,
						  itemStyle: {
							color: '#c1ba07'
						  }
						}
					  ]
					},
					{
					  name: 'Alcohol/\nFremented',
					  itemStyle: {
						color: '#b09733'
					  },
					  children: [
						{
						  name: 'Winey',
						  value: 1,
						  itemStyle: {
							color: '#8f1c53'
						  }
						},
						{
						  name: 'Whiskey',
						  value: 1,
						  itemStyle: {
							color: '#b34039'
						  }
						},
						{
						  name: 'Fremented',
						  value: 1,
						  itemStyle: {
							color: '#ba9232'
						  }
						},
						{
						  name: 'Overripe',
						  value: 1,
						  itemStyle: {
							color: '#8b6439'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Green/\nVegetative',
				  itemStyle: {
					color: '#187a2f'
				  },
				  children: [
					{
					  name: 'Olive Oil',
					  value: 1,
					  itemStyle: {
						color: '#a2b029'
					  }
					},
					{
					  name: 'Raw',
					  value: 1,
					  itemStyle: {
						color: '#718933'
					  }
					},
					{
					  name: 'Green/\nVegetative',
					  itemStyle: {
						color: '#3aa255'
					  },
					  children: [
						{
						  name: 'Under-ripe',
						  value: 1,
						  itemStyle: {
							color: '#a2bb2b'
						  }
						},
						{
						  name: 'Peapod',
						  value: 1,
						  itemStyle: {
							color: '#62aa3c'
						  }
						},
						{
						  name: 'Fresh',
						  value: 1,
						  itemStyle: {
							color: '#03a653'
						  }
						},
						{
						  name: 'Dark Green',
						  value: 1,
						  itemStyle: {
							color: '#038549'
						  }
						},
						{
						  name: 'Vegetative',
						  value: 1,
						  itemStyle: {
							color: '#28b44b'
						  }
						},
						{
						  name: 'Hay-like',
						  value: 1,
						  itemStyle: {
							color: '#a3a830'
						  }
						},
						{
						  name: 'Herb-like',
						  value: 1,
						  itemStyle: {
							color: '#7ac141'
						  }
						}
					  ]
					},
					{
					  name: 'Beany',
					  value: 1,
					  itemStyle: {
						color: '#5e9a80'
					  }
					}
				  ]
				},
				{
				  name: 'Other',
				  itemStyle: {
					color: '#0aa3b5'
				  },
				  children: [
					{
					  name: 'Papery/Musty',
					  itemStyle: {
						color: '#9db2b7'
					  },
					  children: [
						{
						  name: 'Stale',
						  value: 1,
						  itemStyle: {
							color: '#8b8c90'
						  }
						},
						{
						  name: 'Cardboard',
						  value: 1,
						  itemStyle: {
							color: '#beb276'
						  }
						},
						{
						  name: 'Papery',
						  value: 1,
						  itemStyle: {
							color: '#fefef4'
						  }
						},
						{
						  name: 'Woody',
						  value: 1,
						  itemStyle: {
							color: '#744e03'
						  }
						},
						{
						  name: 'Moldy/Damp',
						  value: 1,
						  itemStyle: {
							color: '#a3a36f'
						  }
						},
						{
						  name: 'Musty/Dusty',
						  value: 1,
						  itemStyle: {
							color: '#c9b583'
						  }
						},
						{
						  name: 'Musty/Earthy',
						  value: 1,
						  itemStyle: {
							color: '#978847'
						  }
						},
						{
						  name: 'Animalic',
						  value: 1,
						  itemStyle: {
							color: '#9d977f'
						  }
						},
						{
						  name: 'Meaty Brothy',
						  value: 1,
						  itemStyle: {
							color: '#cc7b6a'
						  }
						},
						{
						  name: 'Phenolic',
						  value: 1,
						  itemStyle: {
							color: '#db646a'
						  }
						}
					  ]
					},
					{
					  name: 'Chemical',
					  itemStyle: {
						color: '#76c0cb'
					  },
					  children: [
						{
						  name: 'Bitter',
						  value: 1,
						  itemStyle: {
							color: '#80a89d'
						  }
						},
						{
						  name: 'Salty',
						  value: 1,
						  itemStyle: {
							color: '#def2fd'
						  }
						},
						{
						  name: 'Medicinal',
						  value: 1,
						  itemStyle: {
							color: '#7a9bae'
						  }
						},
						{
						  name: 'Petroleum',
						  value: 1,
						  itemStyle: {
							color: '#039fb8'
						  }
						},
						{
						  name: 'Skunky',
						  value: 1,
						  itemStyle: {
							color: '#5e777b'
						  }
						},
						{
						  name: 'Rubber',
						  value: 1,
						  itemStyle: {
							color: '#120c0c'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Roasted',
				  itemStyle: {
					color: '#c94930'
				  },
				  children: [
					{
					  name: 'Pipe Tobacco',
					  value: 1,
					  itemStyle: {
						color: '#caa465'
					  }
					},
					{
					  name: 'Tobacco',
					  value: 1,
					  itemStyle: {
						color: '#dfbd7e'
					  }
					},
					{
					  name: 'Burnt',
					  itemStyle: {
						color: '#be8663'
					  },
					  children: [
						{
						  name: 'Acrid',
						  value: 1,
						  itemStyle: {
							color: '#b9a449'
						  }
						},
						{
						  name: 'Ashy',
						  value: 1,
						  itemStyle: {
							color: '#899893'
						  }
						},
						{
						  name: 'Smoky',
						  value: 1,
						  itemStyle: {
							color: '#a1743b'
						  }
						},
						{
						  name: 'Brown, Roast',
						  value: 1,
						  itemStyle: {
							color: '#894810'
						  }
						}
					  ]
					},
					{
					  name: 'Cereal',
					  itemStyle: {
						color: '#ddaf61'
					  },
					  children: [
						{
						  name: 'Grain',
						  value: 1,
						  itemStyle: {
							color: '#b7906f'
						  }
						},
						{
						  name: 'Malt',
						  value: 1,
						  itemStyle: {
							color: '#eb9d5f'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Spices',
				  itemStyle: {
					color: '#ad213e'
				  },
				  children: [
					{
					  name: 'Pungent',
					  value: 1,
					  itemStyle: {
						color: '#794752'
					  }
					},
					{
					  name: 'Pepper',
					  value: 1,
					  itemStyle: {
						color: '#cc3d41'
					  }
					},
					{
					  name: 'Brown Spice',
					  itemStyle: {
						color: '#b14d57'
					  },
					  children: [
						{
						  name: 'Anise',
						  value: 1,
						  itemStyle: {
							color: '#c78936'
						  }
						},
						{
						  name: 'Nutmeg',
						  value: 1,
						  itemStyle: {
							color: '#8c292c'
						  }
						},
						{
						  name: 'Cinnamon',
						  value: 1,
						  itemStyle: {
							color: '#e5762e'
						  }
						},
						{
						  name: 'Clove',
						  value: 1,
						  itemStyle: {
							color: '#a16c5a'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Nutty/\nCocoa',
				  itemStyle: {
					color: '#a87b64'
				  },
				  children: [
					{
					  name: 'Nutty',
					  itemStyle: {
						color: '#c78869'
					  },
					  children: [
						{
						  name: 'Peanuts',
						  value: 1,
						  itemStyle: {
							color: '#d4ad12'
						  }
						},
						{
						  name: 'Hazelnut',
						  value: 1,
						  itemStyle: {
							color: '#9d5433'
						  }
						},
						{
						  name: 'Almond',
						  value: 1,
						  itemStyle: {
							color: '#c89f83'
						  }
						}
					  ]
					},
					{
					  name: 'Cocoa',
					  itemStyle: {
						color: '#bb764c'
					  },
					  children: [
						{
						  name: 'Chocolate',
						  value: 1,
						  itemStyle: {
							color: '#692a19'
						  }
						},
						{
						  name: 'Dark Chocolate',
						  value: 1,
						  itemStyle: {
							color: '#470604'
						  }
						}
					  ]
					}
				  ]
				},
				{
				  name: 'Sweet',
				  itemStyle: {
					color: '#e65832'
				  },
				  children: [
					{
					  name: 'Brown Sugar',
					  itemStyle: {
						color: '#d45a59'
					  },
					  children: [
						{
						  name: 'Molasses',
						  value: 1,
						  itemStyle: {
							color: '#310d0f'
						  }
						},
						{
						  name: 'Maple Syrup',
						  value: 1,
						  itemStyle: {
							color: '#ae341f'
						  }
						},
						{
						  name: 'Caramelized',
						  value: 1,
						  itemStyle: {
							color: '#d78823'
						  }
						},
						{
						  name: 'Honey',
						  value: 1,
						  itemStyle: {
							color: '#da5c1f'
						  }
						}
					  ]
					},
					{
					  name: 'Vanilla',
					  value: 1,
					  itemStyle: {
						color: '#f89a80'
					  }
					},
					{
					  name: 'Vanillin',
					  value: 1,
					  itemStyle: {
						color: '#f37674'
					  }
					},
					{
					  name: 'Overall Sweet',
					  value: 1,
					  itemStyle: {
						color: '#e75b68'
					  }
					},
					{
					  name: 'Sweet Aromatics',
					  value: 1,
					  itemStyle: {
						color: '#d0545f'
					  }
					}
				  ]
				}
			  ],
			radius:[0,'95%'],
			sort:undefined,
			emphasis:{
				focus:'ancestor'
			},
			levels:[
				{},
				{
					r0:'15%',
					r:'45%',
					itemStyle:{
						borderWidth:1.5
					},
					label:{
						rotate: 'tangential'
					}
				},
				{
					r0:'45%',
					r:'70%',
					label:{
						align:'center'
					}
				}
			]
		}
	}
	for(var i=0;i<data.length();i++){
		option.series.data[i].name = data[i].keyWord;
	}
	myChart.setOption(option);
}



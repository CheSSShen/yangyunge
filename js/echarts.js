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
			//---------------------------最爱的咖啡饮品------------------------
			var fD = getMyCol(results, "What is your favorite coffee drink?");
			var favoriteDrink = getNorepeatKeyWordsDict(fD);
			/*
			如{
				keyword:"Lattee",
				num:500,
			}
		   */
			//---------------------------饮用咖啡的原因------------------------
			var dR = getMyCol(results, "Why do you drink coffee?");
			var drinkReason = getNorepeatKeyWordsDict(dR);
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
			//---------------------------自认为偏好的形容词与实际的口味偏好------------------------
			var descriptorPreference = getNorepeatKeyWordsDict(getMyCol(results,
				"Before today's tasting, which of the following best described what kind of coffee you like?"
			));
			descriptorPreference = processTwoColValueDict(results,
				"Before today's tasting, which of the following best described what kind of coffee you like?",
				"Lastly, what was your favorite overall coffee?",
				descriptorPreference
			);
			//---------------------------四类咖啡的词云------------------------
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
echarts02();
function echarts02() {
	var myChart = echarts.init(document.getElementById('pictrue2'));
	var keywords = [{
		"name": "花鸟市场",
		"value": 1446
	},
	{
		"name": "汽车",
		"value": 928
	},
	{
		"name": "视频",
		"value": 906
	},
	{
		"name": "电视",
		"value": 825
	},
	{
		"name": "Lover Boy 88",
		"value": 514
	},
	{
		"name": "动漫",
		"value": 486
	},
	{
		"name": "音乐",
		"value": 53
	},
	{
		"name": "直播",
		"value": 163
	},
	{
		"name": "广播电台",
		"value": 86
	},
	{
		"name": "戏曲曲艺",
		"value": 17
	},
	{
		"name": "演出票务",
		"value": 6
	},
	{
		"name": "给陌生的你听",
		"value": 1
	},
	{
		"name": "资讯",
		"value": 1437
	},
	{
		"name": "商业财经",
		"value": 422
	},
	{
		"name": "娱乐八卦",
		"value": 353
	},
	{
		"name": "军事",
		"value": 331
	},
	{
		"name": "科技资讯",
		"value": 313
	},
	{
		"name": "社会时政",
		"value": 307
	},
	{
		"name": "时尚",
		"value": 43
	},
	{
		"name": "网络奇闻",
		"value": 15
	},
	{
		"name": "旅游出行",
		"value": 438
	},
	{
		"name": "景点类型",
		"value": 957
	},
	{
		"name": "国内游",
		"value": 927
	},
	{
		"name": "远途出行方式",
		"value": 908
	},
	{
		"name": "酒店",
		"value": 693
	},
	{
		"name": "关注景点",
		"value": 611
	},
	{
		"name": "旅游网站偏好",
		"value": 512
	},
	{
		"name": "出国游",
		"value": 382
	},
	{
		"name": "交通票务",
		"value": 312
	},
	{
		"name": "旅游方式",
		"value": 187
	},
	{
		"name": "旅游主题",
		"value": 163
	},
	{
		"name": "港澳台",
		"value": 104
	},
	{
		"name": "本地周边游",
		"value": 3
	},
	{
		"name": "小卖家",
		"value": 1331
	},
	{
		"name": "全日制学校",
		"value": 941
	},
	{
		"name": "基础教育科目",
		"value": 585
	},
	{
		"name": "考试培训",
		"value": 473
	},
	{
		"name": "语言学习",
		"value": 358
	},
	{
		"name": "留学",
		"value": 246
	},
	{
		"name": "K12课程培训",
		"value": 207
	},
	{
		"name": "艺术培训",
		"value": 194
	},
	{
		"name": "技能培训",
		"value": 104
	},
	{
		"name": "IT培训",
		"value": 87
	},
	{
		"name": "高等教育专业",
		"value": 63
	},
	{
		"name": "家教",
		"value": 48
	},
	{
		"name": "体育培训",
		"value": 23
	},
	{
		"name": "职场培训",
		"value": 5
	},
	{
		"name": "金融财经",
		"value": 1328
	},
	{
		"name": "银行",
		"value": 765
	},
	{
		"name": "股票",
		"value": 452
	},
	{
		"name": "保险",
		"value": 415
	},
	{
		"name": "贷款",
		"value": 253
	},
	{
		"name": "基金",
		"value": 211
	},
	{
		"name": "信用卡",
		"value": 180
	},
	{
		"name": "外汇",
		"value": 138
	},
	{
		"name": "P2P",
		"value": 116
	},
	{
		"name": "贵金属",
		"value": 98
	},
	{
		"name": "债券",
		"value": 93
	},
	{
		"name": "网络理财",
		"value": 92
	},
	{
		"name": "信托",
		"value": 90
	},
	{
		"name": "征信",
		"value": 76
	},
	{
		"name": "期货",
		"value": 76
	},
	{
		"name": "公积金",
		"value": 40
	},
	{
		"name": "银行理财",
		"value": 36
	},
	{
		"name": "银行业务",
		"value": 30
	},
	{
		"name": "典当",
		"value": 7
	},
	{
		"name": "海外置业",
		"value": 1
	},
	{
		"name": "汽车",
		"value": 1309
	},
	{
		"name": "汽车档次",
		"value": 965
	},
	{
		"name": "汽车品牌",
		"value": 900
	},
	{
		"name": "汽车车型",
		"value": 727
	},
	{
		"name": "购车阶段",
		"value": 461
	},
	{
		"name": "二手车",
		"value": 309
	},
	{
		"name": "汽车美容",
		"value": 260
	},
	{
		"name": "新能源汽车",
		"value": 173
	},
	{
		"name": "汽车维修",
		"value": 155
	},
	{
		"name": "租车服务",
		"value": 136
	},
	{
		"name": "车展",
		"value": 121
	},
	{
		"name": "违章查询",
		"value": 76
	},
	{
		"name": "汽车改装",
		"value": 62
	},
	{
		"name": "汽车用品",
		"value": 37
	},
	{
		"name": "路况查询",
		"value": 32
	},
	{
		"name": "汽车保险",
		"value": 28
	},
	{
		"name": "陪驾代驾",
		"value": 4
	},
	{
		"name": "网络购物",
		"value": 1275
	},
	{
		"name": "做我的猫",
		"value": 1088
	},
	{
		"name": "只想要你知道",
		"value": 907
	},
	{
		"name": "团购",
		"value": 837
	},
	{
		"name": "比价",
		"value": 201
	},
	{
		"name": "海淘",
		"value": 195
	},
	{
		"name": "移动APP购物",
		"value": 179
	},
	{
		"name": "支付方式",
		"value": 119
	},
	{
		"name": "代购",
		"value": 43
	},
	{
		"name": "体育健身",
		"value": 1234
	},
	{
		"name": "体育赛事项目",
		"value": 802
	},
	{
		"name": "运动项目",
		"value": 405
	},
	{
		"name": "体育类赛事",
		"value": 337
	},
	{
		"name": "健身项目",
		"value": 199
	},
	{
		"name": "健身房健身",
		"value": 78
	},
	{
		"name": "运动健身",
		"value": 77
	},
	{
		"name": "家庭健身",
		"value": 36
	},
	{
		"name": "健身器械",
		"value": 29
	},
	{
		"name": "办公室健身",
		"value": 3
	},
	{
		"name": "商务服务",
		"value": 1201
	},
	{
		"name": "法律咨询",
		"value": 508
	},
	{
		"name": "化工材料",
		"value": 147
	},
	{
		"name": "广告服务",
		"value": 125
	},
	{
		"name": "会计审计",
		"value": 115
	},
	{
		"name": "人员招聘",
		"value": 101
	},
	{
		"name": "印刷打印",
		"value": 66
	},
	{
		"name": "知识产权",
		"value": 32
	},
	{
		"name": "翻译",
		"value": 22
	},
	{
		"name": "安全安保",
		"value": 9
	},
	{
		"name": "公关服务",
		"value": 8
	},
	{
		"name": "商旅服务",
		"value": 2
	},
	{
		"name": "展会服务",
		"value": 2
	},
	{
		"name": "特许经营",
		"value": 1
	},
	{
		"name": "休闲爱好",
		"value": 1169
	},
	{
		"name": "收藏",
		"value": 412
	},
	{
		"name": "摄影",
		"value": 393
	},
	{
		"name": "温泉",
		"value": 230
	},
	{
		"name": "博彩彩票",
		"value": 211
	},
	{
		"name": "美术",
		"value": 207
	},
	{
		"name": "书法",
		"value": 139
	},
	{
		"name": "DIY手工",
		"value": 75
	},
	{
		"name": "舞蹈",
		"value": 23
	},
	{
		"name": "钓鱼",
		"value": 21
	},
	{
		"name": "棋牌桌游",
		"value": 17
	},
	{
		"name": "KTV",
		"value": 6
	},
	{
		"name": "密室",
		"value": 5
	},
	{
		"name": "采摘",
		"value": 4
	},
	{
		"name": "电玩",
		"value": 1
	},
	{
		"name": "真人CS",
		"value": 1
	},
	{
		"name": "轰趴",
		"value": 1
	},
	{
		"name": "家电数码",
		"value": 1111
	},
	{
		"name": "手机",
		"value": 885
	},
	{
		"name": "电脑",
		"value": 543
	},
	{
		"name": "大家电",
		"value": 321
	},
	{
		"name": "家电关注品牌",
		"value": 253
	},
	{
		"name": "网络设备",
		"value": 162
	},
	{
		"name": "摄影器材",
		"value": 149
	},
	{
		"name": "影音设备",
		"value": 133
	},
	{
		"name": "办公数码设备",
		"value": 113
	},
	{
		"name": "生活电器",
		"value": 67
	},
	{
		"name": "厨房电器",
		"value": 54
	},
	{
		"name": "智能设备",
		"value": 45
	},
	{
		"name": "个人护理电器",
		"value": 22
	},
	{
		"name": "服饰鞋包",
		"value": 1047
	},
	{
		"name": "服装",
		"value": 566
	},
	{
		"name": "饰品",
		"value": 289
	},
	{
		"name": "鞋",
		"value": 184
	},
	{
		"name": "箱包",
		"value": 168
	},
	{
		"name": "奢侈品",
		"value": 137
	},
	{
		"name": "母婴亲子",
		"value": 1041
	},
	{
		"name": "孕婴保健",
		"value": 505
	},
	{
		"name": "母婴社区",
		"value": 299
	},
	{
		"name": "早教",
		"value": 103
	},
	{
		"name": "奶粉辅食",
		"value": 66
	},
	{
		"name": "童车童床",
		"value": 41
	},
	{
		"name": "关注品牌",
		"value": 271
	},
	{
		"name": "宝宝玩乐",
		"value": 30
	},
	{
		"name": "母婴护理服务",
		"value": 25
	},
	{
		"name": "纸尿裤湿巾",
		"value": 16
	},
	{
		"name": "妈妈用品",
		"value": 15
	},
	{
		"name": "宝宝起名",
		"value": 12
	},
	{
		"name": "童装童鞋",
		"value": 9
	},
	{
		"name": "胎教",
		"value": 8
	},
	{
		"name": "宝宝安全",
		"value": 1
	},
	{
		"name": "宝宝洗护用品",
		"value": 1
	},
	{
		"name": "软件应用",
		"value": 1018
	},
	{
		"name": "系统工具",
		"value": 896
	},
	{
		"name": "理财购物",
		"value": 440
	},
	{
		"name": "生活实用",
		"value": 365
	},
	{
		"name": "影音图像",
		"value": 256
	},
	{
		"name": "社交通讯",
		"value": 214
	},
	{
		"name": "手机美化",
		"value": 39
	},
	{
		"name": "办公学习",
		"value": 28
	},
	{
		"name": "应用市场",
		"value": 23
	},
	{
		"name": "母婴育儿",
		"value": 14
	},
	{
		"name": "游戏",
		"value": 946
	},
	{
		"name": "手机游戏",
		"value": 565
	},
	{
		"name": "PC游戏",
		"value": 353
	},
	{
		"name": "网页游戏",
		"value": 254
	},
	{
		"name": "游戏机",
		"value": 188
	},
	{
		"name": "模拟辅助",
		"value": 166
	},
	{
		"name": "个护美容",
		"value": 942
	},
	{
		"name": "护肤品",
		"value": 177
	},
	{
		"name": "彩妆",
		"value": 133
	},
	{
		"name": "美发",
		"value": 80
	},
	{
		"name": "香水",
		"value": 50
	},
	{
		"name": "个人护理",
		"value": 46
	},
	{
		"name": "美甲",
		"value": 26
	},
	{
		"name": "SPA美体",
		"value": 21
	},
	{
		"name": "花鸟萌宠",
		"value": 914
	},
	{
		"name": "绿植花卉",
		"value": 311
	},
	{
		"name": "狗",
		"value": 257
	},
	{
		"name": "其他宠物",
		"value": 131
	},
	{
		"name": "水族",
		"value": 125
	},
	{
		"name": "猫",
		"value": 122
	},
	{
		"name": "动物",
		"value": 81
	},
	{
		"name": "鸟",
		"value": 67
	},
	{
		"name": "宠物用品",
		"value": 41
	},
	{
		"name": "宠物服务",
		"value": 26
	},
	{
		"name": "书籍阅读",
		"value": 913
	},
	{
		"name": "网络小说",
		"value": 483
	},
	{
		"name": "关注书籍",
		"value": 128
	},
	{
		"name": "文学",
		"value": 105
	},
	{
		"name": "报刊杂志",
		"value": 77
	},
	{
		"name": "人文社科",
		"value": 22
	},
	{
		"name": "建材家居",
		"value": 907
	},
	{
		"name": "装修建材",
		"value": 644
	},
	{
		"name": "家具",
		"value": 273
	},
	{
		"name": "家居风格",
		"value": 187
	},
	{
		"name": "家居家装关注品牌",
		"value": 140
	},
	{
		"name": "家纺",
		"value": 107
	},
	{
		"name": "厨具",
		"value": 47
	},
	{
		"name": "灯具",
		"value": 43
	},
	{
		"name": "家居饰品",
		"value": 29
	},
	{
		"name": "家居日常用品",
		"value": 10
	},
	{
		"name": "生活服务",
		"value": 883
	},
	{
		"name": "物流配送",
		"value": 536
	},
	{
		"name": "家政服务",
		"value": 108
	},
	{
		"name": "摄影服务",
		"value": 49
	},
	{
		"name": "搬家服务",
		"value": 38
	},
	{
		"name": "物业维修",
		"value": 37
	},
	{
		"name": "婚庆服务",
		"value": 24
	},
	{
		"name": "二手回收",
		"value": 24
	},
	{
		"name": "鲜花配送",
		"value": 3
	},
	{
		"name": "维修服务",
		"value": 3
	},
	{
		"name": "殡葬服务",
		"value": 1
	},
	{
		"name": "求职创业",
		"value": 874
	},
	{
		"name": "创业",
		"value": 363
	},
	{
		"name": "目标职位",
		"value": 162
	},
	{
		"name": "目标行业",
		"value": 50
	},
	{
		"name": "兼职",
		"value": 21
	},
	{
		"name": "期望年薪",
		"value": 20
	},
	{
		"name": "实习",
		"value": 16
	},
	{
		"name": "雇主类型",
		"value": 10
	},
	{
		"name": "星座运势",
		"value": 789
	},
	{
		"name": "星座",
		"value": 316
	},
	{
		"name": "算命",
		"value": 303
	},
	{
		"name": "解梦",
		"value": 196
	},
	{
		"name": "风水",
		"value": 93
	},
	{
		"name": "面相分析",
		"value": 47
	},
	{
		"name": "手相",
		"value": 32
	},
	{
		"name": "公益",
		"value": 90
	}
	]
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
		image: "data:image/png;base64,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"
	};
	var maskImage = new Image();
	console.log(option.image);
	maskImage.src = option.image;

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
				data: keywords
			}]
		})
	}

	myChart.setOption(option);
	window.onresize = myChart.resize;
}



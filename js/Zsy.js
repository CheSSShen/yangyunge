/*
 Copyright (c) 2022 zhangsuiyu@cuz.edu.cn. All rights reserved. 
 代码仅供本课程授课，未经允许不可作其它用途
 只保证Chrome浏览器兼容性
 */
(function(){
	window['Z']={
		readAsText:function(path,f){
			/*
			读取本地文件，
			受限于安全性，浏览器必须通过<input type="file" onchange="readFile(this.files)"/>让用户手动选择文件,
			然后将this.files作为入参path传入，入参f为读取成功后的回调函数
			*/
			var reader=new FileReader();
			reader.readAsText(path[0]);
			reader.onload=function(data){
				console.log('Z: 文件-'+path[0].name+'-读取成功');
				f(data.target.result);
			};
		},
		smartWH:function(){
			var w=document.documentElement.clientWidth*0.9;
			var h=document.documentElement.clientHeight*0.9;
			console.log('Z: 适配窗口宽高('+w+','+h+')')
			return { width:w, height:h}
		},
		getJL12:function(){
			return ['林黛玉','薛宝钗','贾元春','贾探春','史湘云','妙玉','贾迎春','贾惜春','王熙凤','贾巧姐','李纨','秦可卿'];
		},
		getPikachu:function(){
			var pk="　　へ　　　　　／|\n"+
				"　　/＼7　　　 ∠＿/\n"+
				"　 /　│　　 ／　／\n"+
				"　│　Z ＿,＜　／　　 /`ヽ\n"+
				"　│　　　　　ヽ　　 /　　〉\n"+
				"　 Y　　　　　`　 /　　/\n"+
				"　ｲ●　､　●　　⊂⊃〈　　/\n"+
				"　()　 へ　　　　|　＼〈\n"+
				"　　>ｰ ､_　 ィ　 │ ／／\n"+
				"　 / へ　　 /　ﾉ＜| ＼＼ \n"+
				"　 ヽ_ﾉ　　(_／　 │／／\n"+
				"　　7　　　　　　　|／\n"+
				"　　＞―r￣￣`ｰ― ＿\n"
			console.log(pk)
			return pk;
		},
		version:'1.0.0'
	}
	
})();
var isIE = /msie/i.test(navigator.userAgent);
var isIE6 = /msie 6.0/i.test(navigator.userAgent);
var isIE9 = /msie 9.0/i.test(navigator.userAgent);
var isIE10 = /msie 10.0/i.test(navigator.userAgent);

function gID(id){return document.getElementById(id);}
function gE(e){
	if(isIE){return window.event.srcElement;}
	else{return e.target;}
}
function setXY(obj){
	obj.style.top=(document.documentElement.clientHeight - obj.offsetHeight)/2 +"px";
	obj.style.left=(document.documentElement.clientWidth - obj.offsetWidth)/2 +"px";
}
function gXY(obj){
	var r = { x:obj.offsetLeft, y:obj.offsetTop }; //json数组
	while(obj=obj.offsetParent){ //循环定位，兼容各浏览器
		r.x += obj.offsetLeft;
		r.y += obj.offsetTop;
	}return r;
}

//增加事件动作，不冲突原来的事件
//参数，对象，事件名称（带on），事件定义（如果要带参数，则要function(){eventFunc("")}这样传递参数）
function addObjEvent(obj,eventName,eventFunc){
	if (obj.attachEvent){ //IE
		obj.attachEvent(eventName,eventFunc);
	}else if (obj.addEventListener){ //FF Gecko / W3C
		var eventName2 = eventName.toString().replace(/on(.*)/i,'$1'); //正则过滤第1个on
		obj.addEventListener(eventName2,eventFunc, false); //fslse为倒序执行事件
	}else{ //Opera (or old browsers)
		obj[eventName] = eventFunc;
	}
}


//移除事件动作
//参数，对象，事件名称（带on），事件定义（如果要带参数，则要function(){eventFunc("")}这样传递参数）
//如果要删除，必须是和addObjEvent相同的eventFunc，否则无法删除，而且不能带参数，只能定义无参数的函数代执行。
function delObjEvent(obj,eventName,eventFunc){
	if (obj.detachEvent) { // IE
		obj.detachEvent(eventName,eventFunc);
	}else if (obj.removeEventListener){ //FF Gecko / W3C
		var eventName2 = eventName.toString().replace(/on(.*)/i,'$1'); //正则过滤第1个on
		obj.removeEventListener(eventName2,eventFunc, false); //fslse为倒序执行事件
	}else{ // Opera (or old browsers)
		obj[eventName] = null;
	}
}

//可以任意拖动的层（支持Firefox,IE)
//参数，移动的层对象和event对象，方法 onmousedown="MoveDiv(this,event)"
function MoveDiv(obj,e){
	e = e||window.event;

	var ie6=isIE;
	if (isIE9 || isIE10) {ie6=false;} //把IE9 IE10设置为非IE浏览器
	//只允许通过鼠标左键进行拖拽,IE68鼠标左键为1 FireFox ie9其他为0
	if (ie6 && e.button == 1 || !ie6 && e.button == 0) {}else{return false;}

	obj.style.position='absolute'; //设置浮动模式
	//obj.style.cursor='move'; //设置鼠标样式 ,取消设置鼠标，有些地方不想变鼠标样式
	obj.ondragstart =function(){return false;} //禁止对象的拖动事件，不然图片在火狐下会无法拖动

	var x = e.screenX - obj.offsetLeft;
	var y = e.screenY - obj.offsetTop;
	addObjEvent(document,'onmousemove',moving); //鼠标移动时，增加移动事件
	addObjEvent(document,'onmouseup',endMov); //鼠标放开时，增加停止事件
	e.cancelBubble = true; //禁止事件冒泡,使触发在子对象上的事件不传递给父对象
	
	//IE去除选中背景文字
	if (isIE) {
		obj.setCapture(); //设置捕获范围 releaseCapture() 释放
	} else {
		window.captureEvents(Event.mousemove); //window.releaseEvents(Event.eventType) 释放
	}

	//if (!isIE){e.stopPropagation();} //W3C 禁止冒泡
	//FireFox 去除容器内拖拽图片问题，火狐防止选中背景文字
	if (e.preventDefault) {
		e.preventDefault(); //取消事件的默认动作
		e.stopPropagation(); //事件不再被分派到其他节点
	}
	e.returnValue = false; //指事件的返回值是false 。return false;是指函数的返回值为false
	return false;

	//移动
	function moving(e){
		obj.style.left = (e.screenX - x) + 'px';
		obj.style.top = (e.screenY - y) + 'px';
		return false; //图片移动时会出现拖动图片的动作，增加这个return可以不执行这个动作
	}
		
	//停止
	function endMov(e){
		delObjEvent(document,'onmousemove',moving); //删除鼠标移动事件
		delObjEvent(document,'onmouseup',arguments.callee); //删除鼠标放开事件,arguments.callee为函数本身
		//window.document.body.focus(); // ff 3.0 //IE 模窗口会无法点击层要去掉
		if (isIE) {
			obj.releaseCapture(); //释放捕获
		} else {
			window.releaseEvents(Event.mousemove); //释放
		}
	}
}



//调整DIV大小 
//拖动对象，event，拖动后触发的其他函数空写null,可以function(){xx();}或xx,不能xx()
function ResizeDiv(obj,e,fun){
	e = e||window.event;

	var ie6=isIE;
	if (isIE9 || isIE10) {ie6=false;} //把IE9 IE10设置为非IE浏览器
	//只允许通过鼠标左键进行拖拽,IE68鼠标左键为1 FireFox ie9其他为0
	if (ie6 && e.button == 1 || !ie6 && e.button == 0) {}else{return false;}

	obj.ondragstart =function(){return false;} //禁止对象的拖动事件，不然图片在火狐下会无法拖动

	addObjEvent(document,'onmousemove',resizeing); //鼠标移动时，增加移动事件
	addObjEvent(document,'onmouseup',fun); //拖动结束后的其他函数执行
	addObjEvent(document,'onmouseup',endResize); //鼠标放开时，增加停止事件
	e.cancelBubble = true; //禁止事件冒泡,使触发在子对象上的事件不传递给父对象
	
	//IE去除选中背景文字
	if (isIE) {
		obj.setCapture(); //设置捕获范围 releaseCapture() 释放
	} else {
		window.captureEvents(Event.mousemove); //window.releaseEvents(Event.eventType) 释放
	}

	//FireFox 去除容器内拖拽图片问题，火狐防止选中背景文字
	if (e.preventDefault) {
		e.preventDefault(); //取消事件的默认动作
		e.stopPropagation(); //事件不再被分派到其他节点
	}
	e.returnValue = false; //指事件的返回值是false 。return false;是指函数的返回值为false
	return false;

	//调整
	function resizeing(e){
		//最小宽度100*30
		if (e.clientX - obj.offsetLeft>100){obj.style.width =  (e.clientX - obj.offsetLeft) + 'px';}
		if (e.clientY - obj.offsetTop>30){obj.style.height =  (e.clientY - obj.offsetTop) + 'px';}
		return false; //图片移动时会出现拖动图片的动作，增加这个return可以不执行这个动作
	}
		
	//停止
	function endResize(e){
		delObjEvent(document,'onmousemove',resizeing); //删除鼠标移动事件
		delObjEvent(document,'onmouseup',arguments.callee); //删除鼠标放开事件,arguments.callee为函数本身
		//window.document.body.focus(); // ff 3.0 //IE 模窗口会无法点击层要去掉
		if (isIE) {
			obj.releaseCapture(); //释放捕获
		} else {
			window.releaseEvents(Event.mousemove); //释放
		}
	}
}
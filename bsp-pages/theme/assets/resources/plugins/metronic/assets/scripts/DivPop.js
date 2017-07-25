//沙里软件 http://www.ShaliSoft.com

//输出样式
var stylehtml = '<style>';
stylehtml += '.popMain{position:absolute; background-color:#fff; overflow:hidden; -moz-box-shadow: 0 0 50px rgba(0,0,0,.4);/*firefox*/ -webkit-box-shadow: 0 0 50px rgba(0,0,0,.4);/*safari或chrome*/ box-shadow: 0 0 50px rgba(0,0,0,.4);/*opera或ie9*/}';
stylehtml += '.popHead{width:100%; line-height:30px; background-color: #428bca; cursor:move;}';
stylehtml += '.popTitle{font-size:14px; font-weight:bold; color:#fff; padding-left:10px;}';
stylehtml += '.popClose{position:absolute; right:3px; top:3px; width:24px; height:24px; line-height: 24px; text-align: center; border-radius: 3px; background: #3b7db5; cursor:pointer; color: #fff;}';
stylehtml += '.popClose i { margin-top: 4px;}';
stylehtml += '.popClose:hover { background-color: #F3565D;}';
stylehtml += '.popResize{position:absolute; right:0px; bottom:0px; background:url("'+$("#contextPath").val()+'/resources/plugins/metronic/assets/img/scale.png") no-repeat; width:12px; height:12px; overflow:hidden;  cursor:nw-resize;}';
stylehtml += '</style>';
document.write(stylehtml);

//弹出窗口内容
//参数:窗口name，event,{json对象，参数参考下面}
//如果要取得event事件，必须是事件中才能触发，所以要用onclick的方法调用openPop，如果用href=javascript:openPop无法取得
var openPop = function(name,e,options){
	e = e||window.event;
	this._name = name;
	if(!openPop.Zindex){ openPop.Zindex = 10; }else{ openPop.Zindex = openPop.Zindex + 1; } //初始zindex

	if(options){
		this._url = options.url ? options.url : ""; //打开地址
		this._htmltxt = options.htmltxt ? options.htmltxt : ""; //或指定的显示文本内容
		this._title = options.title ? options.title : ""; //标题
		this._width = options.width ? options.width : document.documentElement.clientWidth/2; //初始为屏幕1半宽度
		this._height = options.height ? options.height : document.documentElement.clientHeight/2; //初始为屏幕1半高度
		this._top = options.top ? options.top : (document.documentElement.clientHeight - this._height)/2; //初始为屏幕中间
		this._left = options.left ? options.left : (document.documentElement.clientWidth - this._width)/2 ; //初始为屏幕中间
		this._ptop = options.ptop ? options.ptop : 0; //相对点击位置的top位置
		this._pleft = options.pleft ? options.pleft : 0; //相对点击位置的left位置
		this._zindex = options.zindex ? options.zindex : openPop.Zindex; //z-index值
		this._reload = options.reload ? options.reload : "1"; //重复调用后 是否重新载入，默认1重新载入
		this._resize = options.resize ? options.resize : "1"; //允许调整大小，默认1允许
	}

	var html = '<div id="PopDiv'+ this._name +'" style="width:'+ this._width +'px; height:'+ this._height +'px; top:'+ this._top +'px; left:'+ this._left +'px; z-index:'+ this._zindex +'" class="popMain" onclick="setIndex(\''+ this._name +'\');">';
	html += '<div class="popHead" title="拖动" onmousedown="setIndex(\''+ this._name +'\');MoveDiv(gID(\'PopDiv'+ this._name +'\'),event);">';
	html += '<span class="popTitle">'+ this._title +'</span>';
	html += '<div class="popClose" title="关闭" onclick="closePop(\''+ this._name +'\');" onMouseOver="this.style.backgroundPosition=\'-37px -30px\';" onMouseOut="this.style.backgroundPosition=\'0px -30px\';"><i class="fa fa-remove"></i></div></div>';

	if (this._url != ""){
		html += '<iframe id="popFrm'+ this._name +'" height="'+ (this._height-25) +'px" width="'+ this._width +'px" scrolling="auto" src="'+ this._url +'" frameborder="0" marginwidth="0" marginheight="0"></iframe>';
	}else{
		html += this._htmltxt;
	}
	if (this._resize=="1"){ 
		html += '<div class="popResize" title="调整大小" onmousedown="ResizeDiv(gID(\'PopDiv'+ this._name +'\'),event,function(){setFrm(\''+ this._name +'\');});"></div>';
	}
	html += '</div>';
	
	//输出DIV层
	var InDiv = document.createElement("div");
	InDiv.innerHTML=html;
	if(!gID('PopDiv'+ this._name)){
		document.body.appendChild(InDiv);
	}else{
		if(this._reload=="1"){ //判断是否重新载入
			gID('PopDiv'+ this._name).parentNode.removeChild(gID('PopDiv'+ this._name)); //清除已打开窗口
			document.body.appendChild(InDiv);
		}
	}

	//调整指定的相对位置。非事件中取不到event，这里要加容错
	//由原来的gXY(gE(e))取对象，改为取鼠标位置
	try {
		if(this._ptop != 0){ gID('PopDiv'+ this._name).style.top = (e.clientY + this._ptop) +"px"; }
		if(this._pleft != 0){ gID('PopDiv'+ this._name).style.left = (e.clientX + this._pleft) +"px"; }
	}catch (ex) {}
}

//关闭
function closePop(name){
	gID('PopDiv'+ name).style.display='none';
	gID('PopDiv'+ name).parentNode.removeChild(gID('PopDiv'+ name)); //清除DIV内容
}

//调整层大小后 重新调整iframe大小
function setFrm(name){
	try {
		gID("popFrm"+ name).height=parseInt(gID("PopDiv"+ name).style.height) -25 +"px"; //减去25高度，要过滤px
		gID("popFrm"+ name).width=gID("PopDiv"+ name).style.width;
	}catch (ex) {}
}

//设置index坐标。关闭时也会执行此过程，找不到对象，要加容错
function setIndex(name){
	try {
		gID("PopDiv"+ name).style.zIndex = openPop.Zindex + 1;
		openPop.Zindex = openPop.Zindex + 1;
	}catch (ex) {}
}
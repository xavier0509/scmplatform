document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
$(function() {
	sendHTTPRequest("/fybv2_api/configQuery", '{"data":""}', searchConfigInfo);
})

function AferConfigHtmlInfo() {
	/*配置管理板块-增加与编辑*/
	var oButtonAdd = document.getElementById("manage-configAdd");
	oButtonAdd.onclick = function() {
		$('#myConfigAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("configChineseName").value = "";
		document.getElementById("configEnglishName").value = "";
		document.getElementById("configSrc").value = "";
		document.getElementById("configInstr").value = "";
		document.getElementById("configString").value = "";
		document.getElementById("ADCSEfficient").innerHTML="";
		for (var j = 0; j < 2; j++) {
			var parentDiv = document.getElementById("ADCSEfficient");
			var child1 = document.createElement("div");
			child1.setAttribute("class","menuUnit");
			var child2 = document.createElement("input");
			child2.setAttribute("type","text");
			child2.setAttribute("class","menuUnitInput");
			child2.setAttribute("placeholder","Value");			
			child1.appendChild(child2);
			parentDiv.appendChild(child1);
		};
		toSaveButton(this.index,null);
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#config-mkTable").find("a");
	var oTableInput = $("#config-mkTable").find("input");
	console.log(oTableA.length);
	var keyValue,keyValueObj = null;
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			keyValue = oTableA[this.index].nextSibling.value;
			var data = oTableInput[this.index].value;
			var jsonData = JSON.parse(data);
			//console.log("lxw "+keyValue);
			keyValueObj = JSON.parse(keyValue);
			//console.log("lxw "+keyValueObj);
			$('#myConfigAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");

			document.getElementById("configChineseName").value = jsonData.cnName;
			document.getElementById("configEnglishName").value = jsonData.engName;
			document.getElementById("configSrc").value = jsonData.configKey;
			if (jsonData.type == "string") {
				document.getElementById("configString").style.display = "block";
				document.getElementById("configTableBoxEnum").style.display = "none";
				document.getElementById("configString").value = jsonData.value;
				var menuUnitInputCheck =document.getElementsByClassName("menuUnitInput");
				for (var i = 0; i < menuUnitInputCheck.length; i++) {
					menuUnitInputCheck[i].value = "";
				};
			}
			else{
				document.getElementById("configString").style.display = "none";
				document.getElementById("configTableBoxEnum").style.display = "block";
				document.getElementById("configString").value = "";
				var oOpt = jsonData.options;
				document.getElementById("ADCSEfficient").innerHTML="";
				for (var j = 0; j < oOpt.length; j++) {
					var parentDiv = document.getElementById("ADCSEfficient");
					var child1 = document.createElement("div");
					child1.setAttribute("class","menuUnit");
					var child2 = document.createElement("input");
					child2.setAttribute("type","text");
					child2.setAttribute("class","menuUnitInput");
					child2.setAttribute("placeholder","Value");
					
					child1.appendChild(child2);
					parentDiv.appendChild(child1);
				};
				for (var k = 0; k < oOpt.length; k++) {
					var menuInput = document.getElementsByClassName("menuUnitInput");
					menuInput[k].value = oOpt[k];
				};

			}
			document.getElementById("configInstr").value = jsonData.desc;
			var categoryClass = jsonData.category;
			var opt = document.getElementById("configSelect").getElementsByTagName("option");
			for (var j = 0; j < opt.length; j++) {
				opt[j].removeAttribute("selected");
				if(opt[j].value == categoryClass){
					opt[j].setAttribute("selected","");
				}
			};

			var categoryClass = jsonData.category;

			toSaveButton(this.index,keyValueObj);
		}
	}

	/*模块管理板块-保存*/
	function toSaveButton(myindex,keylue) {
		console.log(myindex+"---"+keylue);
		
		var ConfigSubmit = document.getElementById("inputConfigSubmit");
		ConfigSubmit.onclick = function() {
			var newConfigCzName = document.getElementById("configChineseName").value;//中文名
			var newConfigEnName = document.getElementById("configEnglishName").value;//英文名
			var newConfigSrc = document.getElementById("configSrc").value;//config信息
			var newConfigString = document.getElementById("configString").value;//默认值【string型】
			var newConfigInstr = document.getElementById("configInstr").value;//描述
			var newConfigSelect = document.getElementById("configSelect").value;//下拉列表
			var inputNum = document.getElementsByClassName("menuUnitInput");
			var inputNumState = 0; //枚举型为空时的状态值
			for (var i = 0; i < inputNum.length; i++) {
				if (inputNum[i].value!=""){
					inputNumState = 1;
				}
			}
			if (newConfigCzName == "" || newConfigEnName == "" || newConfigSrc == "" || newConfigInstr =="" ||(newConfigString == "" && inputNumState == 0)) {
				document.getElementById(" configErrorInfo").innerHTML = "请确保所有项不为空！";
				setTimeout('document.getElementById(" configErrorInfo").innerHTML = "　"',3000);
			}
			else{
				console.log("枚举型是否为空："+inputNumState);
				console.log("字符串内容："+newConfigString);
				console.log("lxw " + "in inputConfigSubmit");
				var node = null;//向后台传递的数据
				console.log("lxw "+newConfigCzName+"--"+newConfigEnName+"--"+newConfigSrc+"--"+newConfigString+"--"+newConfigInstr+"--"+newConfigSelect);
				if (newConfigString !="" && inputNumState == 1) {
					console.log("字符串型不为空，枚举型不为空！！！冲突！！！！");
					document.getElementById(" configErrorInfo").innerHTML = "输入有误，请确保字符串与枚举型的唯一！";
					setTimeout('document.getElementById(" configErrorInfo").innerHTML = "　"',3000);
				}
				else if (newConfigString !="" && inputNumState == 0) {
					console.log("枚举型为空，字符串型！！！");
					node = '{"data":{"cnName": "'+newConfigCzName+'","engName": "'+newConfigEnName+'", "configKey":"'+newConfigSrc+'", "type": "string", "value": "'+newConfigString+'", "desc": "'+newConfigInstr+'", "category": "'+newConfigSelect+'", "options": []}}';
				}
				else if(newConfigString =="" && inputNumState == 1){
					console.log("枚举型不为为空，字符串型为空！！！");
					var configMenuDisplay = document.getElementsByClassName("tableBox")[0].style.display;
					var newConfigMenu = [];//value值是枚举,值放入数组
					var newConfigMenuObject = document.getElementsByClassName("menuUnit");
					var newConfigMenuDiv = document.getElementById("ADCSEfficient");
					var thisOneIndex,thisTwoIndex,valueOne,valueTwo = null;
					for (var i=0; i<newConfigMenuObject.length;i++) {
						thisOneIndex = 2*i;
						thisTwoIndex = 2*i + 1;
						// valueOne =  newConfigMenuDiv.getElementsByTagName("input")[thisOneIndex].value;
						valueTwo =  newConfigMenuDiv.getElementsByTagName("input")[i].value;
						console.log("lxw "+valueOne +":"+ valueTwo);
						newConfigMenu.push('"'+valueTwo+'"');
						console.log("lxw"+newConfigMenu);
					}
					console.log("lxw "+newConfigCzName+"--"+newConfigEnName+"--"+newConfigSrc+"--"+newConfigMenu+"--"+newConfigInstr+"--"+newConfigSelect);
					node = '{"data":{"cnName":"'+newConfigCzName+'","engName":"'+newConfigEnName+'","configKey":"'+newConfigSrc+'","type":"enum", "value":"'+valueTwo+'","options":['+newConfigMenu+'],"desc":"'+newConfigInstr+'","category":"'+newConfigSelect+'"}}';
					
				}

				if (myindex == null) {
					console.log("lxw in add 新增");
					console.log("lxw "+ node);
					sendHTTPRequest("/fybv2_api/configAdd", node, returnAddInfo);
				} else{
					if (node == null) {}
					else{
						console.log("lxw in edit 单项编辑"+keylue);
						var nodeObj = JSON.parse(node);
						console.log("lxw "+ node);
						console.log(nodeObj);
						console.log(nodeObj.data);
						var nodeObjString = JSON.stringify(nodeObj.data);
						console.log(nodeObjString);
						
						//var newNode = '{"data":{"condition":{"engName":"'+keylue.engName+'"},"update":'+nodeObjString+'}}';
						var newNode = '{"data":{"_id":"'+ keylue._id +'","update":'+nodeObjString+'}}';
						console.log("lxw "+ newNode);
						sendHTTPRequest("/fybv2_api/configUpdate", newNode, returnAddInfo);
					}
				}
			}
		}
	}

	/*字符串、枚举按钮的点击*/
	var oConfigDefaultedButtons = new Array();
	oConfigDefaultedButtons = document.getElementsByClassName("configDefaultedOption");
	for(var i = 0; i < oConfigDefaultedButtons.length; i++) {
		oConfigDefaultedButtons[i].index = i;
		oConfigDefaultedButtons[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			if(this.index == 0) {
				console.log("lxw " + "点击的是字符串");
				document.getElementById("configString").style.display = "block";
				document.getElementsByClassName("tableBox")[0].style.display = "none";
			} else if(this.index == 1) {
				console.log("lxw " + "点击的是枚举");
				document.getElementById("configString").style.display = "none";
				document.getElementsByClassName("tableBox")[0].style.display = "block";
			}
		}
	}

	/*枚举各个图标的点击事件*/
	var oEnumerateButtons = new Array();
	oEnumerateButtons = document.getElementsByClassName("menuEdit");
	console.log("lxw " + oEnumerateButtons.length);
	for(var i = 0; i < oEnumerateButtons.length; i++) {
		oEnumerateButtons[i].index = i;
		oEnumerateButtons[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			if(this.index == 0) {
				console.log("lxw " + "点击的是添加");
				var parentDiv = document.getElementById("ADCSEfficient");
				// appendObject.innerHTML += "<div class='menuUnit'><input type='text' class='menuUnitInput' value='' placeholder='选项名称'/><input type='text' class='menuUnitInput' value='' placeholder='Value'/></div>"
				var child1 = document.createElement("div");
				child1.setAttribute("class","menuUnit");
				var child2 = document.createElement("input");
				child2.setAttribute("type","text");
				child2.setAttribute("class","menuUnitInput");
				child2.setAttribute("placeholder","Value");			
				child1.appendChild(child2);
				parentDiv.appendChild(child1);
			} else if(this.index == 1) {
				console.log("lxw " + "点击的是删除");
				var forDeleteObject = document.getElementById("ADCSEfficient");
				var deleteObject = document.getElementsByClassName("menuUnit");
				var curLength = deleteObject.length;
				console.log("lxw " + curLength);
				if(curLength != 0) {
					forDeleteObject.removeChild(document.getElementsByClassName("menuUnit")[curLength - 1]);
				} else {
					console.log("lxw 已经删除完...");
				}
				//appendObject.removeChild();
			} else if(this.index == 2) {
				console.log("lxw " + "点击的是全部删除");
				var appendObject = document.getElementById("ADCSEfficient");
				appendObject.innerHTML = "";
			}
		}
	}
}

/*点击配置管理，获取数据*/
function searchConfigInfo() {
	console.log("lxw " + "searchConfigInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne,pullDataTwo =null;
			var _rowConfigMain = document.getElementById("configMkTableTdMain");
			var _rowConfigHardware = document.getElementById("configMkTableTdHardware");
			var _rowConfigServerip = document.getElementById("configMkTableTdServerip");
			var _rowConfigAd = document.getElementById("configMkTableTdAd");
			var _rowConfigChannel = document.getElementById("configMkTableTdChannel");
			var _rowConfigLocalmedia = document.getElementById("configMkTableTdLocalmedia");
			var _rowConfigBrowser = document.getElementById("configMkTableTdBrowser");
			var _rowConfigOther = document.getElementById("configMkTableTdOther");
			_rowConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowConfigHardware.innerHTML = "<div title='hardware'>硬件配置信息：</div>";
			_rowConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
			_rowConfigAd.innerHTML = "<div title='ad'>广告配置：</div>";
			_rowConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
			_rowConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
			_rowConfigBrowser.innerHTML = "<div title='browser'>浏览器配置：</div>";
			_rowConfigOther.innerHTML = "<div title='other'>其他功能：</div>";
			
			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw "+data.data[i].category);
				if (data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:"+kk);
					_rowConfigMain.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "hardware"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("hardware:"+kk);
					_rowConfigHardware.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "serverip"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("serverip:"+kk);
					_rowConfigServerip.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "ad"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:"+kk);
					_rowConfigAd.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "channel"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:"+kk);
					_rowConfigChannel.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "localmedia"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("localmedia:"+kk);
					_rowConfigLocalmedia.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "browser"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("browser:"+kk);
					_rowConfigBrowser.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
				else if(data.data[i].category == "other"){
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:"+kk);
					_rowConfigOther.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataTwo+"' style='display:none'></div>";
				}
			}
		};
		AferConfigHtmlInfo();
	}
}
function returnAddInfo(){
	console.log("lxw " + "returnChangeInfo");
	if(this.readyState == 4) {
		if(this.status == 200) 
		{
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myConfigAddChangeModal").modal('hide');
				freshConfigAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("configErrorInfo").style.display = "block";
				document.getElementById("configErrorInfo").innerHTML = "该配置已存在";
			};
		};
	}
}

/*刷新页面*/
function freshConfigAddHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu6");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "manage-configure.html";
}
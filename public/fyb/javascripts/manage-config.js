document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
$(function() {
	sendHTTPRequest("/fyb_api/configQuery", '{"data":""}', searchConfigInfo);
})

function AferConfigHtmlInfo() {
	/*配置管理板块-增加与编辑*/
	var oButtonAdd = document.getElementById("manage-configAdd");
	oButtonAdd.onclick = function() {
		$('#myConfigAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		toSaveButton(this.index,null);
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#config-mkTable").find("a")
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			var keyValue = this.name;
			console.log("lxw "+keyValue);
			$('#myConfigAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			toSaveButton(this.index,keyValue);
		}
	}

	/*模块管理板块-保存*/
	function toSaveButton(myindex,keyValue) {
		var ConfigSubmit = document.getElementById("inputConfigSubmit");
		ConfigSubmit.onclick = function() {
			console.log("lxw " + "in inputConfigSubmit");
			var node = null;//向后台传递的数据
			var newConfigCzName = document.getElementById("configChineseName").value;//中文名
			var newConfigEnName = document.getElementById("configEnglishName").value;//英文名
			var newConfigSrc = document.getElementById("configSrc").value;//config信息
			var newConfigInstr = document.getElementById("configInstr").value;//描述
			var newConfigSelect = document.getElementById("configSelect").value;//下拉列表
			
			var configStringDisplay = document.getElementById("configString").style.display;
			var newConfigString = null;
			if (configStringDisplay == "none") {
				newConfigString = null;
			} else{
				newConfigString = document.getElementById("configString").value;//value值是字符串
				console.log("lxw "+newConfigCzName+"--"+newConfigEnName+"--"+newConfigSrc+"--"+newConfigString+"--"+newConfigInstr+"--"+newConfigSelect);
				//node = '{"data":{"cnName":"'+newConfigCzName+'","engName":"'+newConfigEnName+'","configKey":"'+newConfigSrc+'","type":"input","value":"'+newConfigString+'",desc":"'+newConfigInstr+'","category":"'+newConfigSelect+'","opt":[]}}';
				node = '{"data":{"cnName": "'+newConfigCzName+'","engName": "'+newConfigEnName+'", "configKey":"'+newConfigSrc+'", "type": "string", "value": "'+newConfigString+'", "desc": "'+newConfigInstr+'", "category": "'+newConfigSelect+'", "opt": []}}';
			}
			
			var configMenuDisplay = document.getElementsByClassName("tableBox")[0].style.display;
			var newConfigMenu = [];//value值是枚举,值放入数组
			var newConfigMenuObject = document.getElementsByClassName("menuUnit");
			var newConfigMenuDiv = document.getElementById("ADCSEfficient");
			//var menuElementStr = new Array();//json数组
			var thisOneIndex,thisTwoIndex,valueOne,valueTwo = null;
			if (configMenuDisplay == "block") {
				for (var i=0; i<newConfigMenuObject.length;i++) {
					//var menuElement = {};//json对象
					thisOneIndex = 2*i;
					thisTwoIndex = 2*i + 1;
					valueOne =  newConfigMenuDiv.getElementsByTagName("input")[thisOneIndex].value;
					valueTwo =  newConfigMenuDiv.getElementsByTagName("input")[thisTwoIndex].value;
					console.log("lxw "+valueOne +":"+ valueTwo);
					//menuElement[valueOne] = valueTwo;
					//menuElementStr.push(JSON.stringify(menuElement));
					newConfigMenu.push(valueTwo);
				}
				//menuElementStr = JSON.stringify(menuElement);
				console.log("lxw "+newConfigCzName+"--"+newConfigEnName+"--"+newConfigSrc+"--"+newConfigMenu+"--"+newConfigInstr+"--"+newConfigSelect);
				node = '{"data":{"cnName":"'+newConfigCzName+'","engName":"'+newConfigEnName+'","configKey":"'+newConfigSrc+'","type":"select", "value":"'+valueTwo+'","opt":'+newConfigMenu+',"desc":"'+newConfigInstr+'","category":"'+newConfigSelect+'"}}';
			} else{
				newConfigMenu = null;
			}
			
			if (myindex == null) {
				console.log("lxw in add");
				console.log("lxw "+ node);
				//{"data":{"cnName": "2","engName": "2", "configKey":"2", "type": "string", "desc": "2", "category": "other", "value": "2", "opt": []}
				//var node = '{"data":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}';
				sendHTTPRequest("/fyb_api/configAdd", node, returnAddInfo);
			} else{
				console.log("lxw in edit");
				//var node = '{"data":{"condition":{"engName":"'+englishName+'"},"update":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}}';
				//sendHTTPRequest("/fyb_api/configUpdate", node, returnChangeInfo);
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
				var appendObject = document.getElementById("ADCSEfficient");
				appendObject.innerHTML += "<div class='menuUnit'><input type='text' class='menuUnitInput' value='' placeholder='选项名称'/><input type='text' class='menuUnitInput' value='' placeholder='Value'/></div>"
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
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			var kk = 0;
			//[{"cnName":"HDMI延时","engName":"HDMIDelay","type":"value","value":"4321","vategory":"main","options":[]},
			//{"cnName":"信源自切换","engName":"SourceSwitch","type":"enum","value":"false","vategory":"other","options":["true","false","undefined"]},
			var _rowConfigMain = document.getElementById("configMkTableTdOne");
			var _rowConfigOther = document.getElementById("configMkTableTdTwo");
			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw "+data.data[i].category);
				if (data.data[i].category == "main") {
					kk = i;
					console.log("main:"+kk);
					_rowConfigMain.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a></div>";
				} else if(data.data[i].category == "other"){
					kk = i;
					console.log("other:"+kk);
					_rowConfigOther.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a></div>";
				}
			}
		};
		AferConfigHtmlInfo();
	}
}
function returnAddInfo(){
	console.log("lxw " + "returnChangeInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				freshConfigAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
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
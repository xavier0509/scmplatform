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
	var oTableA = $("#config-mkTable").find("a");
	console.log(oTableA.length);
	var keyValue,keyValueObj = null;
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			keyValue = oTableA[this.index].nextSibling.value;
			console.log("lxw "+keyValue);
			keyValueObj = JSON.parse(keyValue);
			console.log("lxw "+keyValueObj);
			$('#myConfigAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			toSaveButton(this.index,keyValueObj);
		}
	}

	/*模块管理板块-保存*/
	function toSaveButton(myindex,keylue) {
		console.log(myindex+"---"+keylue);
		
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
//				if (newConfigCzName==null||newConfigEnName==null||newConfigSrc==null||newConfigString==null||newConfigInstr==null) {
//					//有一项为空时添加失败，后面做处理
//					node = null;
//				} else{
					node = '{"data":{"cnName": "'+newConfigCzName+'","engName": "'+newConfigEnName+'", "configKey":"'+newConfigSrc+'", "type": "string", "value": "'+newConfigString+'", "desc": "'+newConfigInstr+'", "category": "'+newConfigSelect+'", "opt": []}}';
//				}
				
			}
			
			var configMenuDisplay = document.getElementsByClassName("tableBox")[0].style.display;
			var newConfigMenu = [];//value值是枚举,值放入数组
			var newConfigMenuObject = document.getElementsByClassName("menuUnit");
			var newConfigMenuDiv = document.getElementById("ADCSEfficient");
			var thisOneIndex,thisTwoIndex,valueOne,valueTwo = null;
			if (configMenuDisplay == "block") {
				for (var i=0; i<newConfigMenuObject.length;i++) {
					thisOneIndex = 2*i;
					thisTwoIndex = 2*i + 1;
					valueOne =  newConfigMenuDiv.getElementsByTagName("input")[thisOneIndex].value;
					valueTwo =  newConfigMenuDiv.getElementsByTagName("input")[thisTwoIndex].value;
					console.log("lxw "+valueOne +":"+ valueTwo);
					newConfigMenu.push(valueTwo);
					console.log("lxw"+newConfigMenu);
				}
				console.log("lxw "+newConfigCzName+"--"+newConfigEnName+"--"+newConfigSrc+"--"+newConfigMenu+"--"+newConfigInstr+"--"+newConfigSelect);
//				if (newConfigCzName==null||newConfigEnName==null||newConfigSrc==null||newConfigString==null||newConfigInstr==null) {
//					//有一项为空时添加失败，后面做处理
//					node = null;
//				} else{
					node = '{"data":{"cnName":"'+newConfigCzName+'","engName":"'+newConfigEnName+'","configKey":"'+newConfigSrc+'","type":"enum", "value":"'+valueTwo+'","opt":['+newConfigMenu+'],"desc":"'+newConfigInstr+'","category":"'+newConfigSelect+'"}}';
				//}
				
			} else{
				newConfigMenu = null;
			}
			
			if (myindex == null) {
				console.log("lxw in add 新增");
				console.log("lxw "+ node);
				sendHTTPRequest("/fyb_api/configAdd", node, returnAddInfo);
			} else{
				console.log("lxw in edit 单项编辑"+keylue);
				var nodeObj = JSON.parse(node);
				console.log("lxw "+ node);
				console.log(nodeObj);
				console.log(nodeObj.data);
				var nodeObjString = JSON.stringify(nodeObj.data);
				console.log(nodeObjString);
				
				var newNode = '{"data":{"condition":{"engName":"'+keylue.engName+'"},"update":'+nodeObjString+'}}';
				console.log("lxw "+ newNode);
				sendHTTPRequest("/fyb_api/configUpdate", newNode, returnAddInfo);
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
			var kk = 0;
			var pullDataOne,pullDataTwo =null;
			var _rowConfigMain = document.getElementById("configMkTableTdOne");
			var _rowConfigOther = document.getElementById("configMkTableTdTwo");
			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw "+data.data[i].category);
				if (data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:"+kk);
					_rowConfigMain.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				} else if(data.data[i].category == "other"){
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
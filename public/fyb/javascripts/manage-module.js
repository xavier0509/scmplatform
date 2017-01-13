document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	//ModalHtmlInfo();
	//AfterModuleHtmlInfo();
	sendHTTPRequest("/fyb_api/moduleQuery", '{"data":""}', searchModalInfo);
})

function AfterModuleHtmlInfo() {
	/*模块管理板块-增加与编辑*/
	var oButtonAdd = document.getElementById("manage-moduleAdd");
	oButtonAdd.onclick = function() {
		$('#myModuleAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		toSaveButton(-1);
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#module-mkTable").find("a")
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok " + this.index); //点击的是第几个
			$('#myModuleAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			toSaveButton(this.index);
		}
	}
	/*模块管理板块-保存*/
	function toSaveButton(myindex){
		var ModualSubmit = document.getElementById("inputModuleSubmit");
		
		ModualSubmit.onclick = function() {
			console.log("lxw " + "in inputModuleSubmit");
			var newModuleCzName = document.getElementById("moduleCzName").value;
			var newModuleEnName = document.getElementById("moduleEnName").value;
			var newModuleSrc = document.getElementById("moduleSrc").value;
			var newModuleInstr = document.getElementById("moduleInstr").value;
			var newModuleSelect = document.getElementById("moduleSelect").value;
			console.log("lxw "+newModuleCzName+"--"+newModuleEnName+"--"+newModuleSrc+"--"+newModuleInstr+"--"+newModuleSelect);
			if (myindex == -1) {
				console.log("lxw "+myindex);
				var node = '{"data":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}';
				//var node = '{"data":{"cnName":"广告服务","engName": "SkyPushService","gitPath": "/System/APP/SkyADService","desc": "1234","category": "Service"}}';
				sendHTTPRequest("/fyb_api/moduleAdd", node, returnAddInfo);
			} else{
				console.log("lxw "+myindex);
				//sendHTTPRequest("/fyb_api/configUpdate", node, searchModalInfo);
			}
		}
	}
}

/*点击模块管理，获取数据*/
function searchModalInfo() {
	console.log("lxw " + "ModalHtmlInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			var kk = 0;
			//{"data":{"cnName":"酷开商城","engName": "SkyCCMall","gitPath": "/SkyworthApp/App/SkyCCMall","desc": "1","category": "App"}}
			//{"data":{"cnName":"应用圈","engName": "SkyAppStore","gitPath": "/SkyworthApp/AppStore/SkyAppStore","desc": "2","category": "AppStore"}}
			//{"data":{"cnName":"简易首页4.4","engName": "SimpleHome5.0","gitPath": "/SkyworthApp/HomePage/SimpleHome5.0","desc": "3","category": "HomePage"}}
			//{"data":{"cnName":"Android输入法","engName": "AndroidKeyboard","gitPath": "/SkyworthApp/IME/AndroidKeyboard","desc": "4","category": "IME"}}
			//{"data":{"cnName":"广告服务","engName": "SkyADService","gitPath": "/SkyworthApp/Service/SkyADService","desc": "5","category": "Service"}}
			//{"data":{"cnName":"自动安装器","engName": "SkyAutoInstaller","gitPath": "/SkyworthApp/SysApp/SkyAutoInstaller","desc": "6","category": "SysApp"}}
			//{"data":{"cnName":"数字外挂DTV","engName": "SkyDigitalDTV","gitPath": "/SkyworthApp/TV/SkyDigitalDTV","desc": "7","category": "TV"}}
			//{"data":{"cnName":"贝瓦儿童乐园","engName": "Beiwa","gitPath": "/Beiwa","desc": "8","category": "Other"}}
			//var _rowModule = document.getElementById("moduleTableTbody");
			var _rowModuleApp = document.getElementById("moduleTableApp");
			var _rowModuleService = document.getElementById("moduleTableService");
			var _rowModuleAppStore = document.getElementById("moduleTableAppStore");
			var _rowModuleHomePage = document.getElementById("moduleTableHomePage");
			var _rowModuleIME = document.getElementById("moduleTableIME");
			var _rowModuleSysApp = document.getElementById("moduleTableSysApp");
			var _rowModuleTV = document.getElementById("moduleTableTV");
			var _rowModuleOther = document.getElementById("moduleTableOther");
			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw "+data.data[i].category);
				if (data.data[i].category == "App") {
					kk = i;
					console.log("App:"+kk);
					_rowModuleApp.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				} else if(data.data[i].category == "Service"){
					kk = i;
					console.log("Service:"+kk);
					_rowModuleService.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "AppStore"){
					kk = i;
					console.log("AppStore:"+kk);
					_rowModuleAppStore.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "HomePage"){
					kk = i;
					console.log("HomePage:"+kk);
					_rowModuleHomePage.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "IME"){
					kk = i;
					console.log("IME:"+kk);
					_rowModuleIME.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "SysApp"){
					kk = i;
					console.log("SysApp:"+kk);
					_rowModuleSysApp.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "TV"){
					kk = i;
					console.log("TV:"+kk);
					_rowModuleTV.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}else if(data.data[i].category == "Other"){
					kk = i;
					console.log("Other:"+kk);
					_rowModuleOther.innerHTML += "<div class='col-xs-4'><a>" + data.data[kk].cnName + "</a></div>";
				}
			}
		};
		AfterModuleHtmlInfo();
	}
//	var key, counter = 0;
//	var _rowmodelInfo = "";
//	var _rowmodel = document.getElementById("module-mkTable");
//	for(key in currentData){
//		counter++;
//		//console.log("lxw "+ key +"---"+ currentData[key].length);
//		_rowmodelInfo += "<tr><td><div>"+key+":</div>";
//		for (var j=0;j<currentData[key].length;j++) {
//			_rowmodelInfo += "<div class='col-xs-4'><a>"+currentData[key][j].ChineseName+"</a></div>";
//			//console.log("lxw "+ _rowmodelInfo);
//		}
//		_rowmodelInfo += "</td></tr>";
//	}
//	_rowmodel.innerHTML+= _rowmodelInfo;
}
function returnAddInfo(){
	console.log("lxw " + "ModalHtmlInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data);
		};
	}
}

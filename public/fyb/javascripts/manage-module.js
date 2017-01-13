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
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#module-mkTable").find("a")
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			$('#myModuleAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
		}
		toSaveButton(this.index);
	}
	/*模块管理板块-保存*/
	function toSaveButton(index){
		var ModualSubmit = document.getElementById("inputModuleSubmit");
		ModualSubmit.onclick = function() {
			console.log("lxw " + "in inputModuleSubmit");
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
				if (data.data[i].category = "App") {
					data.data[i].index = i;
					console.log("App:"+this.index);
					_rowModuleApp.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				} else if(data.data[i].category = "Service"){
					data.data[i].index = i;
					console.log("Service:"+this.index);
					_rowModuleService.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "AppStore"){
					data.data[i].index = i;
					console.log("AppStore:"+this.index);
					_rowModuleAppStore.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "HomePage"){
					data.data[i].index = i;
					console.log("HomePage:"+this.index);
					_rowModuleHomePage.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "IME"){
					data.data[i].index = i;
					console.log("IME:"+this.index);
					_rowModuleIME.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "SysApp"){
					data.data[i].index = i;
					console.log("SysApp:"+this.index);
					_rowModuleSysApp.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "TV"){
					data.data[i].index = i;
					console.log("TV:"+this.index);
					_rowModuleTV.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}else if(data.data[i].category = "Other"){
					data.data[i].index = i;
					console.log("Other:"+this.index);
					_rowModuleOther.innerHTML += "<div class='col-xs-4'><a>" + data.data[this.index].cnName + "</a></div>";
				}
				//_rowChip.innerHTML += "<div class='col-xs-4'><a>" + data.data[i].name + "</a></div>";
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
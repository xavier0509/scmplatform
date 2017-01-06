$(function() {
	ModalHtmlInfo();
	AfterModuleHtmlInfo();
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
function ModalHtmlInfo() {
	console.log("lxw " + "ModalHtmlInfo");
	var currentData = {
		"App":[{"DetaiSource":"SkyworthApp/App/SkyCCMall","ChineseName":"酷开商城"}
			,{"DetaiSource":"SkyworthApp/App/SkyEDU","ChineseName":"教育中心"}
			,{"DetaiSource":"SkyworthApp/App/SkyManual","ChineseName":"电子说明书"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyMovie","ChineseName":"影视中心"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyMovie6","ChineseName":"影视中心6.0"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyMovie-voole","ChineseName":"影视中心(U)"}
			,{"DetaiSource":"SkyworthApp/App/SkyQrcode","ChineseName":"二维码"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyTVAgent","ChineseName":"远程服务"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyTVQQ","ChineseName":"亲友圈"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyUser","ChineseName":"酷开用户"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyWeather","ChineseName":"天气"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SmartHome","ChineseName":"智慧家庭"}
			,{"DetaiSource":"SkyworthApp/App/SkyMovie/SkyVoice","ChineseName":"搜狗语音"}]
		,"AppStore":[{"DetaiSource":"SkyworthApp/AppStore/SkyAppStore","ChineseName":"应用圈"}
			,{"DetaiSource":"SkyworthApp/AppStore/SkyAppStore_OEM","ChineseName":"应用圈OEM版本"}
			,{"DetaiSource":"SkyworthApp/AppStore/SkyAppStore_Oversea","ChineseName":"应用圈海外版本"}
			,{"DetaiSource":"SkyworthApp/AppStore/SkyAppStore_PE","ChineseName":"应用圈外包版本"}
			,{"DetaiSource":"SkyworthApp/AppStore/SkyHall","ChineseName":"运营大厅"}
			,{"DetaiSource":"SkyworthApp/AppStore/OperaStore","ChineseName":"Opera"}]
		,"HomePage":[{"AbsolutePath":"SkyworthApp/HomePage/SimpleHome5.0","ChineseName":"简易首页4.4"}
			,{"AbsolutePath":"SkyworthApp/HomePage/SimpleHomepage","ChineseName":"简易首页5.0"}
			,{"AbsolutePath":"SkyworthApp/HomePage/SimpleHomepage_OEM","ChineseName":"简易首页OEM"}
			,{"AbsolutePath":"SkyworthApp/HomePage/SkyHomeShell","ChineseName":"常规首页"}
			,{"AbsolutePath":"SkyworthApp/HomePage/SkyOverseaHomepage","ChineseName":"海外首页"}
			,{"AbsolutePath":"SkyworthApp/HomePage/SkyPanasonicHome","ChineseName":"松下首页"}]
		,"IME":[{"AbsolutePath":"SkyworthApp/IME/AndroidKeyboard","ChineseName":"Android输入法"}
			,{"AbsolutePath":"SkyworthApp/IME/SkyTianciIME","ChineseName":"酷开系统输入法"}
			,{"AbsolutePath":"SkyworthApp/IME/SogouIME","ChineseName":"搜狗输入法"}]
		,"Service":[{"AbsolutePath":"SkyworthApp/Service/SkyADService","ChineseName":"广告服务"}
			,{"AbsolutePath":"SkyworthApp/Service/SkyDEService","ChineseName":"设备服务"}
			,{"AbsolutePath":"SkyworthApp/Service/SkyDataService","ChineseName":"数据采集服务"}]
		,"SysApp":[{"AbsolutePath":"SkyworthApp/SysApp/SkyAutoInstaller","ChineseName":"自动安装器"}
			,{"AbsolutePath":"SkyworthApp/SysApp/SkyAutoTest","ChineseName":"自动化测试"}
			,{"AbsolutePath":"SkyworthApp/SysApp/SkyBrowser","ChineseName":"酷开浏览器"}]
		,"TV":[{"AbsolutePath":"SkyworthApp/TV/SkyDigitalDTV","ChineseName":"数字外挂DTV"}
			,{"AbsolutePath":"SkyworthApp/TV/SkyTV","ChineseName":"TV"}
			,{"AbsolutePath":"SkyworthApp/TV/SkyTVCaUI","ChineseName":"TV_CA界面"}
			,{"AbsolutePath":"SkyworthApp/TV/SkyTV_OverSea","ChineseName":"TV海外版"}]
		,"Other":[{"AbsolutePath":"Beiwa","ChineseName":"贝瓦儿童乐园"}
			,{"AbsolutePath":"GuoZheng_low","ChineseName":"勾正"}
			,{"AbsolutePath":"Huanqiu","ChineseName":"环球购物"}]};
	var key, counter = 0;
	var _rowmodelInfo = "";
	var _rowmodel = document.getElementById("module-mkTable");
	for(key in currentData){
		counter++;
		//console.log("lxw "+ key +"---"+ currentData[key].length);
		_rowmodelInfo += "<tr><td><div>"+key+":</div>";
		for (var j=0;j<currentData[key].length;j++) {
			_rowmodelInfo += "<div class='col-xs-4'><a>"+currentData[key][j].ChineseName+"</a></div>";
			//console.log("lxw "+ _rowmodelInfo);
		}
		_rowmodelInfo += "</td></tr>";
	}
	_rowmodel.innerHTML+= _rowmodelInfo;

}
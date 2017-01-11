$(function() {
	ConfigHtmlInfo();
	AferConfigHtmlInfo();
})

function AferConfigHtmlInfo() {
	/*配置管理板块-增加与编辑*/
	var oButtonAdd = document.getElementById("manage-configAdd");
	oButtonAdd.onclick = function() {
		$('#myConfigAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#config-mkTable").find("a")
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			$('#myConfigAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
		}
		toSaveButton(this.index);
	}

	/*模块管理板块-保存*/
	function toSaveButton(index) {
		var ConfigSubmit = document.getElementById("inputConfigSubmit");
		ConfigSubmit.onclick = function() {
			console.log("lxw " + "in inputConfigSubmit");
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
				//_rowChip.innerHTML += "<div class='col-xs-4'><a>" + data.data[i].name + "</a></div>";
				//<tr><td><input type="text" value="" placeholder="选项名称"></td><td><input type="text" value="" placeholder="Value"></td></tr>
				
				appendObject.innerHTML += "<div class='menuUnit'><input type='text' class='menuUnitInput' value='' placeholder='选项名称'/><input type='text' class='menuUnitInput' value='' placeholder='Value'/></div>"
			} else if(this.index == 1) {
				console.log("lxw " + "点击的是向上");
			} else if(this.index == 2) {
				console.log("lxw " + "点击的是向下");
			} else if(this.index == 3) {
				console.log("lxw " + "点击的是删除");
				console.log("lxw "+$(this).parent().attr("id"));
			} else if(this.index == 4) {
				console.log("lxw " + "点击的是全部删除");
				var appendObject = document.getElementById("ADCSEfficient");
				appendObject.innerHTML = "";
			}
		}
	}
}

/*点击配置管理，获取数据*/
function ConfigHtmlInfo() {
	console.log("lxw " + "ConfigHtmlInfo");
	var currentData = {
		"MainFunction": [{
			"EnglishName": "PANEL",
			"ChineseName": "屏幕"
		}, {
			"EnglishName": "NETWORK_SUPPORT_DEVICES",
			"ChineseName": "网络"
		}, {
			"EnglishName": "CONFIG_SOURCE_LIST",
			"ChineseName": "通道"
		}, {
			"EnglishName": "SUPPORT_BLE_REMOTE",
			"ChineseName": "蓝牙遥控"
		}, {
			"EnglishName": "SUPPORT_H265",
			"ChineseName": "H.265解码"
		}, {
			"EnglishName": "LOG_APPENDER",
			"ChineseName": "打印等级"
		}, {
			"EnglishName": "OTA_PATH",
			"ChineseName": "升级包路径"
		}, {
			"EnglishName": "NEW_BOOT_FLOW",
			"ChineseName": "新开机流程"
		}, {
			"EnglishName": "DEFAULT_HOMEPAGE",
			"ChineseName": "首页"
		}, {
			"EnglishName": "SUPPORT_SCREENSAVER",
			"ChineseName": "屏保"
		}, {
			"EnglishName": "SUPPORT_CHILDMODE",
			"ChineseName": "儿童模式"
		}, {
			"EnglishName": "DOLBY_DD_SUPPORT",
			"ChineseName": "杜比DD认证"
		}, {
			"EnglishName": "CURRENT_SERVER",
			"ChineseName": "基础服务后台"
		}],
		"OyherFunction": [{
			"EnglishName": "BITMAP_DECODE_MAX_SIZE",
			"ChineseName": "图片解码阀值"
		}, {
			"EnglishName": "SUPPORT_NEW_SUBTITLE",
			"ChineseName": "新字幕标准"
		}, {
			"EnglishName": "SUPPORT_SAMBA",
			"ChineseName": "Samba"
		}, {
			"EnglishName": "SUPPORT_PIC_PREVIEW",
			"ChineseName": "图片预览"
		}, {
			"EnglishName": "SUPPORT_VIDEO_PREVIEW",
			"ChineseName": "视频预览"
		}, {
			"EnglishName": "SUPPORT_SORT_FUNCTION",
			"ChineseName": "媒体分类"
		}]
};

var key, counter = 0;
var _rowconfigInfo = "";
var _rowconfig = document.getElementById("config-mkTable");
for(key in currentData) {
	counter++;
	//console.log("lxw " + key + "---" + currentData[key].length);
	_rowconfigInfo += "<tr><td><div>" + key + ":</div>";
	for(var j = 0; j < currentData[key].length; j++) {
		_rowconfigInfo += "<div class='col-xs-4'><a>" + currentData[key][j].ChineseName + "</a></div>";
		//console.log("lxw " + _rowconfigInfo);
	}
	_rowconfigInfo += "</td></tr>";
}
_rowconfig.innerHTML += _rowconfigInfo;
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
// document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function() {
		forsession();
		XandCancle();
	})
	//获取用户名
var adminFlag = null;
var loginusername = null;
//编辑、修改、删除时 机芯机型参数的传递
var TwiceTransferChip = null;
var TwiceTransferModel = null;
//定义一个数组，插入机芯机型对
var ChipModelArray = new Array();
//定义两个数组，插入所有的机芯和机型
var allChipArray = new Array();
var allModelArray = new Array();
//定义一个变量，保存批量删除的数据
var moreDeleteData = 0;
//定义一个全局变量，保存编辑提交之前的数据
var hashObj = {};

function XandCancle(){
	var oButtonAdd = document.getElementById("myEnsureX");
	oButtonAdd.onclick = function() {
		console.log("X按钮");
		document.getElementById("myAddCloseDiv").style.display = "none";
	}
	var oButtonAdd = document.getElementById("myEnsureCancle");
	oButtonAdd.onclick = function() {
		console.log("取消按钮");
		document.getElementById("myAddCloseDiv").style.display = "none";
	}
	//MoreEditX
	var oButtonAdd = document.getElementById("MoreEditX");
	oButtonAdd.onclick = function() {
		console.log("X按钮");
		document.getElementById("myMoreEditSubmitModal").style.display = "none";
	}
	var oButtonAdd = document.getElementById("MoreEditBack");
	oButtonAdd.onclick = function() {
		console.log("取消按钮");
		document.getElementById("myMoreEditSubmitModal").style.display = "none";
	}
}

function forsession() {
	sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
}

function sessionresult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				loginusername = data.data.data.author;
				if(data.data.data.adminFlag == "1") {
					adminFlag = 1; //非管理员标志位                
					// console.log(loginusername);
					//隐藏左边管理员的部分
					document.getElementById("wait-change").style.display = "block";
				} else if(data.data.data.adminFlag == "0") {
					adminFlag = 0;
				}
			};
		}
		startSelect(); //打开就获取数据
	}
}

function startSelect() {
	console.log("xjr start select");
	var oChip = document.getElementById('chip').value;
	var oMode = document.getElementById('model').value;
	var oMemory = document.getElementById('memory').value;
	var oAndroid = document.getElementById('androidVersion').value;
	var oChipid = document.getElementById('chipid').value;
	var node = null;
	var myNeedObj = {};
	console.log(oChip + "--" + oMode + "--" + oMemory + "--" + oAndroid + "--" + oChipid);
	if(oChip == "" && oMode == "" && oMemory == "" && oAndroid == "" && oChipid == "") {
		//进来就查询，全查
		node = '{"data":{"condition":{},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1}}}';
	} else {
		if(oChip != "") {
			myNeedObj['chip'] = oChip;
		}
		if(oMode != "") {
			myNeedObj['model'] = oMode;
		}
		if(oAndroid != "") {
			myNeedObj['androidVersion'] = oAndroid;
		}
		if(oChipid != "") {
			myNeedObj['chipModel'] = oChipid;
		}
		if(oMemory != "") {
			myNeedObj['memorySize'] = oMemory;
		}
		//console.log("lxw --->" + JSON.stringify(myNeedObj));
		var myNeedString = JSON.stringify(myNeedObj);
		node = '{"data":{"condition":' + myNeedString + ',"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1}}}';
	}
	console.log("lxw " + node);
	sendHTTPRequest("/fybv2_api/productRegexQuery", node, searchResource);
}

function searchResource() {
	if(this.readyState == 4) {
		// console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var title = document.getElementById("wait-tablebody"); //获取tbody的表格内容
			console.log("节点个数：" + title.childNodes.length);
			for(var i = title.childNodes.length - 1; i > -1; i--) {
				title.removeChild(title.childNodes[i]); //删除掉每个子节点的内容
			};
			var data = JSON.parse(this.responseText);
			var msg = data.msg;
			if(msg == "success") {
				var mySearchData = data.data;
				//console.log(mySearchData);
				for(var j = 0; j < mySearchData.length; j++) {
					if(mySearchData[j].gerritState == "0") {
						_row = document.getElementById("wait-tablebody").insertRow(0);
						var _cell0 = _row.insertCell(0);
						_cell0.innerHTML = "<input type='checkbox' chip='" + mySearchData[j].chip + "' model='" + mySearchData[j].model + "' class='checkboxstatus' value=''>";
						var _cell1 = _row.insertCell(1);
						_cell1.innerHTML = mySearchData[j].chip;
						var _cell2 = _row.insertCell(2);
						_cell2.innerHTML = mySearchData[j].model;
						var _cell3 = _row.insertCell(3);
						_cell3.innerHTML = mySearchData[j].androidVersion;
						var _cell4 = _row.insertCell(4);
						_cell4.innerHTML = mySearchData[j].chipModel;
						var _cell5 = _row.insertCell(5);
						_cell5.innerHTML = mySearchData[j].memorySize;
						var _cell6 = _row.insertCell(6);
						_cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default eachedit' chip='" + mySearchData[j].chip + "' model='" + mySearchData[j].model + "'>编辑</button><button type='button' class='btn btn-default eachdelete' chip='" + mySearchData[j].chip + "' model='" + mySearchData[j].model + "'>删除</button><button type='button' class='btn btn-default eachcopy' chip='" + mySearchData[j].chip + "' model='" + mySearchData[j].model + "'>复制</button></div>";
					}
				};
			}
		}
		AfterWaitHtmlinfo(); //具体细节操作
	}
}

function AfterWaitHtmlinfo() {
	console.log("admin=" + adminFlag);
	if(adminFlag == "1") {
		document.getElementById("wait-change").style.display = "block";
	};

	//查询searchInfo
	var mySearchInfo = document.getElementById("searchInfo");
	mySearchInfo.onclick = startSelect;

	/*点击新增按钮*/
	var oButtonAdd = document.getElementById("wait-add");
	oButtonAdd.onclick = function() {
		var currentParentName = oButtonAdd.id;
		var thisIndex = null;
		$("#myAddModalLabel").text("新增");
		$("#myAddModal").modal("toggle");
		$(".modal-backdrop").addClass("new-backdrop"); //去掉后面的阴影效果
		clearPageInfo();
		buttonStyle("myAddModalMkButton","myAddModalConfigButton");
		sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getAddInfoInfOne);
	}

	/*批量修改*/
	var oButtonEdit = document.getElementById("wait-change");
	oButtonEdit.onclick = function() {
		moreEditCommon();
	}

	/*多项删除*/
	var oButtonDelete = document.getElementById("wait-delete");
	oButtonDelete.onclick = function() {
		console.log("in delete");
		//每次点击时先将ChipModelArray置为空
		ChipModelArray = [];
		var currentParentName = oButtonDelete.id;
		var myCheckboxChecked = new Array();
		var myCheckedNumber = 0;
		var myDeleArray = new Array();
		myCheckboxChecked = document.getElementsByClassName("checkboxstatus");
		console.log("lxw:" + myCheckboxChecked.length);
		for(var i = 0; i < myCheckboxChecked.length; i++) {
			if($('.checkboxstatus')[i].checked == true) {
				myCheckedNumber++;
				var chipModelObj = {
					chip: "",
					model: ""
				};
				console.log("lxw " + $('.checkboxstatus')[i].getAttribute("chip") + "--" + $('.checkboxstatus')[i].getAttribute("model"));
				chipModelObj.chip = $('.checkboxstatus')[i].getAttribute("chip");
				chipModelObj.model = $('.checkboxstatus')[i].getAttribute("model");
				ChipModelArray.push(chipModelObj);
			}
		}
		console.log("lxw:" + myCheckedNumber);
		if(myCheckedNumber != 0) {
			$("#myMoreDeleteModalLabel").text("多项删除");
			$('#myMoreDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		} else {
			$("#myDeleteDialogModalLabel").text("请注意：");
			$('#myDeleteDialogModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		moreDeletePageButtons(); //后期可能会传参给页面里的点击事件
	}

	/*点击多项删除-弹框里的各个按钮*/
	function moreDeletePageButtons() {
		var oButtonEditEnsure = document.getElementById("myMoreDeleteModalEnsure");
		oButtonEditEnsure.onclick = function() {
			console.log("多项删除页-确认按钮");
			console.log("lxw " + ChipModelArray);
			var deleNode = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"set","update":{"userName":"' + loginusername + '","gerritState":"1","operateType":"2"}}}';
			console.log("lxw " + deleNode);
			sendHTTPRequest("/fybv2_api/productUpdate", deleNode, moreDeleteresult);
		}
	}

	/*单项编辑*/
	var oClassButtonEdit = new Array();
	oClassButtonEdit = document.getElementsByClassName("eachedit");
	for(var i = 0; i < oClassButtonEdit.length; i++) {
		oClassButtonEdit[i].index = i;
		oClassButtonEdit[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			var thisIndex = this.index;
			TwiceTransferChip = oClassButtonEdit[thisIndex].getAttribute("chip");
			TwiceTransferModel = oClassButtonEdit[thisIndex].getAttribute("model");
			console.log("lxw " + TwiceTransferChip + "--" + TwiceTransferModel);
			$("#myEditModalLabel").text("单项编辑");
			$('#myEditModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			buttonStyle("myEditModalMkButton","myEditModalConfigButton");
			sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getEditInfoInfOne);
		}
	}

	/*单项删除*/
	var oClassButtonDelete = new Array();
	oClassButtonDelete = document.getElementsByClassName("eachdelete");
	for(var i = 0; i < oClassButtonDelete.length; i++) {
		oClassButtonDelete[i].index = i;
		oClassButtonDelete[i].onclick = function() {
			console.log("in delete");
			console.log(this.index); //点击的是第几个
			var thisIndex = this.index;
			TwiceTransferChip = oClassButtonEdit[thisIndex].getAttribute("chip");
			TwiceTransferModel = oClassButtonEdit[thisIndex].getAttribute("model");
			//校验机芯机型
			sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', checkChipInfoInDel);
		}

	}
	/*单项复制*/
	var oClassButtonCopy = new Array();
	oClassButtonCopy = document.getElementsByClassName("eachcopy");
	for(var i = 0; i < oClassButtonCopy.length; i++) {
		oClassButtonCopy[i].index = i;
		oClassButtonCopy[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			var thisIndex = this.index;
			TwiceTransferChip = oClassButtonEdit[thisIndex].getAttribute("chip");
			TwiceTransferModel = oClassButtonEdit[thisIndex].getAttribute("model");
			$("#myCopyModalLabel").text("单项复制");
			$('#myCopyModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			buttonStyle("myCopyModalMkButton","myCopyModalConfigButton");
			sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getCopyInfoInfOne);
		}
	}
}
//新增-获取后台接口数据，动态加载新增页面
function getAddInfoInfOne() {
	console.log("lxw " + "getAddInfoInfOne");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var _rowAddPageApp = document.getElementById("myAddModalMkTableApp");
			var _rowAddPageService = document.getElementById("myAddModalMkTableService");
			var _rowAddPageAppStore = document.getElementById("myAddModalMkTableAppStore");
			var _rowAddPageHomePage = document.getElementById("myAddModalMkTableHomePage");
			var _rowAddPageIME = document.getElementById("myAddModalMkTableIME");
			var _rowAddPageSysApp = document.getElementById("myAddModalMkTableSysApp");
			var _rowAddPageTV = document.getElementById("myAddModalMkTableTV");
			var _rowAddPageOther = document.getElementById("myAddModalMkTableOther");
			_rowAddPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowAddPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowAddPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowAddPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowAddPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowAddPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowAddPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowAddPageOther.innerHTML = "<div title='Other'>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowAddPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowAddPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowAddPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowAddPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowAddPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowAddPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowAddPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowAddPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fybv2_api/configQuery", '{"data":""}', getAddInfoInfTwo);
	}
}

function getAddInfoInfTwo() {
	console.log("lxw " + "getAddInfoInfTwo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowAddPageConfigMain = document.getElementById("myAddModalConfigTableTdMain");
			var _rowAddPageConfigHardware = document.getElementById("myAddModalConfigTableTdHardware");
			var _rowAddPageConfigServerip = document.getElementById("myAddModalConfigTableTdServerip");
			var _rowAddPageConfigAd = document.getElementById("myAddModalConfigTableTdAd");
			var _rowAddPageConfigChannel = document.getElementById("myAddModalConfigTableTdChannel");
			var _rowAddPageConfigLocalmedia = document.getElementById("myAddModalConfigTableTdLocalmedia");
			var _rowAddPageConfigBrowser = document.getElementById("myAddModalConfigTableTdBrowser");
			var _rowAddPageConfigOther = document.getElementById("myAddModalConfigTableTdOther");

			_rowAddPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowAddPageConfigHardware.innerHTML = "<div title='main'>硬件配置信息：</div>";
			_rowAddPageConfigServerip.innerHTML = "<div title='main'>服务器IP配置：</div>";
			_rowAddPageConfigAd.innerHTML = "<div title='main'> 广告配置：</div>";
			_rowAddPageConfigChannel.innerHTML = "<div title='main'>TV通道：</div>";
			_rowAddPageConfigLocalmedia.innerHTML = "<div title='main'>本地媒体：</div>";
			_rowAddPageConfigBrowser.innerHTML = "<div title='main'>浏览器配置：</div>";
			_rowAddPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigMain.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "hardware") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("hardware:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigHardware.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigHardware.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigServerip.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigAd.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigChannel.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("localmedia:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "browser") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("browser:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigBrowser.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigBrowser.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigOther.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowAddPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		addPageButtons();
		sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', checkChipInfo);
	}
}

function checkChipInfo() {
	console.log("lxw " + "SearchChipInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			for(var i = 0; i < data.data.length; i++) {
				allChipArray.push(data.data[i].name);
			}
			console.log("lxw " + allChipArray);
		};
		sendHTTPRequest("/fybv2_api/modelQuery", '{"data":""}', checkModelInfo);
	}
}

function checkModelInfo() {
	console.log("lxw " + "in checkModelInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			for(var i = 0; i < data.data.length; i++) {
				allModelArray.push(data.data[i].name);
			}
			console.log("lxw " + allModelArray);
		};
	}
}

function checkChipInfoInDel() {
	console.log("lxw " + "SearchChipInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			for(var i = 0; i < data.data.length; i++) {
				allChipArray.push(data.data[i].name);
			}
			console.log("lxw " + allChipArray);
		};
		sendHTTPRequest("/fybv2_api/modelQuery", '{"data":""}', checkModelInfoInDel);
	}
}

function checkModelInfoInDel() {
	console.log("lxw " + "in checkModelInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			for(var i = 0; i < data.data.length; i++) {
				allModelArray.push(data.data[i].name);
			}
			console.log("lxw " + allModelArray);
		};
		console.log("lxw " + TwiceTransferChip + "--" + TwiceTransferModel);
		$("#myDeleteModalLabel").text("删除");
		$('#myDeleteModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("myDeleteModalErrorInfo").style.display = "none";
		document.getElementById("myDeleteModalErrorInfo").innerHTML = "";
		var ChipInArray = jQuery.inArray(TwiceTransferChip, allChipArray);
		var ModelInArray = jQuery.inArray(TwiceTransferModel, allModelArray);

		console.log("lxw " + allChipArray + "--" + allModelArray);
		console.log("lxw " + TwiceTransferChip + "--" + TwiceTransferModel);
		console.log("lxw " + ChipInArray + "--" + ModelInArray);
		if(ChipInArray == -1) {
			document.getElementById("myDeleteModalErrorInfo").style.display = "block";
			document.getElementById("myDeleteModalErrorInfo").innerHTML = "机芯：" + TwiceTransferChip + "不存在";
		} else if(ChipInArray != -1 && ModelInArray == -1) {
			document.getElementById("myDeleteModalErrorInfo").style.display = "block";
			document.getElementById("myDeleteModalErrorInfo").innerHTML = "机型：" + TwiceTransferModel + "不存在";
		}
		singleDeletePageButtons(TwiceTransferChip, TwiceTransferModel);
	}
}

function addPageSubmitData() {
	console.log("lxw " + loginusername + "--" + adminFlag);
	var dataObj = {
		"configFile": "",
		"mkFile": "",
		"memorySize": "",
		"chipModel": "",
		"androidVersion": "",
		"model": "",
		"chip": "",
		"targetProduct": "",
		"gerritState": "1", // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
		"operateType": "1", // 0表示无状态，1表示增加，2表示删除，3表示修改
		"userName": loginusername,
		"desc": "enenen"
	};
	// 获取DeviceInfo里的信息
	var oAchip = document.getElementById("newAddChip").value;
	var oAmodel = document.getElementById("newAddModel").value;
	var oAandroidVersion = document.getElementById("NewAddAndroidVersion").value;
	var oAchipModel = document.getElementById("newAddChipMode").value;
	var oAmemorySize = document.getElementById("newAddMemory").value;
	var oAtargetProduct = document.getElementById("newAddDevice").value;
	var oAgerritState = "1";
	var oAoperateType = "1";
	var userName = loginusername;
	var desc = "enheng";

	//获取config里的数据
	var addConfigFile = {};
	var oAconfigTrlength = $("#myAddModalConfigTableTbody").find("tr");
	console.log("lxw " + oAconfigTrlength.length);
	for(var i = 0; i < oAconfigTrlength.length; i++) {
		var oAConfigobj = {};
		var thisConfigindex = null;
		oAconfigTrDiv = $("#myAddModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oAconfigTrDiv.length; j++) {
			var oAopt = [];
			var oAstuInfo = {
				"cnName": "",
				"configKey": "",
				"engName": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oAstuInfo.category = oAconfigTrDiv[0].title;
			oAstuInfo.cnName = oAconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("cnName");
			oAstuInfo.engName = oAconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			oAstuInfo.configKey = oAconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("configKey");
			oAstuInfo.desc = oAconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("title");
			console.log("lxw" + oAstuInfo.engName);
			oAstuInfo.type = oAconfigTrDiv[thisConfigindex].childNodes[1].name;
			oAstuInfo.value = oAconfigTrDiv[thisConfigindex].childNodes[1].value;
			if(oAstuInfo.type == "string") {
				oAopt = [];
			} else if(oAstuInfo.type == "enum") {
				var jjlength = oAconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
				console.log("lxw " + jjlength.length);
				for(var jj = 0; jj < jjlength.length; jj++) {
					var optValue = jjlength[jj].value;
					oAopt.push(optValue);
				}
			}
			oAstuInfo.options = oAopt;
			addConfigFile[oAconfigTrDiv[thisConfigindex].childNodes[1].getAttribute("id")] = oAstuInfo;
		}
	}
	//console.log("lxw " + JSON.stringify(addConfigFile));

	//获取mkFile里的信息
	var addMkFile = {};
	var oAMkTrDiv = $("#myAddModalMkTableTbody").find("tr");
	console.log("lxw " + oAMkTrDiv.length);
	var oAMkindex = null;
	for(var i = 0; i < oAMkTrDiv.length; i++) {
		var oAMkobj = {};
		oAMkTrDivTwo = $("#myAddModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oAMkTrDivTwo.length);
		for(var j = 1; j < oAMkTrDivTwo.length; j++) {
			oAMkindex = j;
			if(oAMkTrDivTwo[oAMkindex].childNodes[0].checked == true) {
				var oAoptTwo = [];
				var oAstuInfoTwo = {
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				oAstuInfoTwo.category = oAMkTrDivTwo[oAMkindex].childNodes[1].getAttribute("category");
				oAstuInfoTwo.cnName = oAMkTrDivTwo[oAMkindex].childNodes[1].innerHTML;
				oAstuInfoTwo.engName = oAMkTrDivTwo[oAMkindex].childNodes[1].getAttribute("name");
				oAstuInfoTwo.gitPath = oAMkTrDivTwo[oAMkindex].childNodes[1].getAttribute("gitPath");
				oAstuInfoTwo.desc = oAMkTrDivTwo[oAMkindex].childNodes[1].getAttribute("title");
				addMkFile[oAMkTrDivTwo[oAMkindex].childNodes[0].getAttribute("id")] = oAstuInfoTwo;
			}
		}
	}
	dataObj.configFile = addConfigFile;
	dataObj.mkFile = addMkFile;
	dataObj.memorySize = oAmemorySize;
	dataObj.chipModel = oAchipModel;
	dataObj.androidVersion = oAandroidVersion;
	dataObj.model = oAmodel;
	dataObj.chip = oAchip;
	dataObj.targetProduct = oAtargetProduct;
	dataObj.gerritState = "1"; // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
	dataObj.operateType = "1"; // 0表示无状态，1表示增加，2表示删除，3表示修改
	dataObj.userName = loginusername;
	dataObj.desc = "enenen";

	var oAnode = '{"data":' + JSON.stringify(dataObj) + '}';
	console.log("lxw" + oAnode);
	sendHTTPRequest("/fybv2_api/productAdd", oAnode, productAddresult);
}

function productAddresult() {
	console.log("in productAddresult");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "添加成功");
				$("#myAddModal").modal('hide');
				$("#myCopyModal").modal('hide');
				document.getElementById("myAddCloseDiv").style.display = "block";
				document.getElementById("infoEdit").innerHTML = "数据提交成功，请在待审核页面查看。";
				setTimeout("document.getElementById('myAddCloseDiv').style.display = 'none'",3000);
				closeparentpage("1");
				freshHtml("tab_userMenu2");
				startSelect();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("myAddModalErrorInfo").style.display = "block";
				document.getElementById("myAddModalErrorInfo").innerHTML = "该产品已存在";
				document.getElementById("myCopyModalErrorInfo").style.display = "block";
				document.getElementById("myCopyModalErrorInfo").innerHTML = "该产品已存在";
				setTimeout("spanhidden()", 3000);
			};
		};
	}
}

function chipModeldataCheck(number) {
	//读参number：1-新增页 2-复制页 3-编辑页
	var InputInfoArray = new Array();
	var myChipObj = {
		"cnName": "001",
		"value": "001"
	};
	var myModelObj = {
		"cnName": "001",
		"value": "001"
	};
	var myDeviceObj = {
		"cnName": "001",
		"value": "001"
	};
	var myAndroidObj = {
		"cnName": "001",
		"value": "001"
	};
	var myChipModeObj = {
		"cnName": "001",
		"value": "001"
	};
	var myMemoryObj = {
		"cnName": "001",
		"value": "001"
	};
	var nullChip, nullModel, nullDevice, nullAndroid, nullChipMode = null;
	var mySpanId = null;
	if(number == 1) {
		nullChip = document.getElementById("newAddChip").value;
		nullModel = document.getElementById("newAddModel").value;
		nullDevice = document.getElementById("newAddDevice").value;
		nullAndroid = document.getElementById("NewAddAndroidVersion").value;
		nullChipMode = document.getElementById("newAddChipMode").value;
		nullMemory = document.getElementById("newAddMemory").value;
		mySpanId = "myAddModalErrorInfo";
	} else if(number == 2) {
		nullChip = document.getElementById("newCopyChip").value;
		nullModel = document.getElementById("newCopyModel").value;
		nullDevice = document.getElementById("newCopyDevice").value;
		nullAndroid = document.getElementById("NewCopyAndroidVersion").value;
		nullChipMode = document.getElementById("newCopyChipMode").value;
		nullMemory = document.getElementById("newCopyMemory").value;
		mySpanId = "myCopyModalErrorInfo";
	} else if(number == 3) {
		nullChip = document.getElementById("newEditChip").value;
		nullModel = document.getElementById("newEditModel").value;
		nullDevice = document.getElementById("newEditDevice").value;
		nullAndroid = document.getElementById("NewEditAndroidVersion").value;
		nullChipMode = document.getElementById("newEditChipMode").value;
		nullMemory = document.getElementById("newEditMemory").value;
		mySpanId = "myEditModalErrorInfo";
	}
	myChipObj.cnName = "机芯";
	myChipObj.value = nullChip;
	myModelObj.cnName = "机型";
	myModelObj.value = nullModel;
	myDeviceObj.cnName = "TARGET_PRODUCT";
	myDeviceObj.value = nullDevice;
	myAndroidObj.cnName = "安卓版本";
	myAndroidObj.value = nullAndroid;
	myChipModeObj.cnName = "芯片型号";
	myChipModeObj.value = nullChipMode;
	myMemoryObj.cnName = "内存";
	myMemoryObj.value = nullMemory;

	InputInfoArray = [myChipObj, myModelObj, myDeviceObj, myAndroidObj, myChipModeObj, myMemoryObj];
	console.log("lxw " + nullChip + "--" + allChipArray + "--" + allModelArray);
	var ChipInArray = jQuery.inArray(nullChip, allChipArray);
	var ModelInArray = jQuery.inArray(nullModel, allModelArray);
	console.log("lxw " + "|" + ChipInArray + "--" + "|" + ModelInArray);
	if(nullChip == "" || nullModel == "" || nullDevice == "" || nullAndroid == "" || nullChipMode == "" || nullMemory == "") {
		for(var jj = 0; jj < InputInfoArray.length; jj++) {
			console.log("lxw " + InputInfoArray[jj].value + "--" + InputInfoArray[jj].cnName)
			if(InputInfoArray[jj].value == "") {
				console.log("lxw " + mySpanId);
				document.getElementById(mySpanId).style.display = "block";
				document.getElementById(mySpanId).innerHTML = InputInfoArray[jj].cnName + "项不能为空";
				jj = InputInfoArray.length;
				setTimeout("spanhidden()", 3000);
			}
		}
	} else {
		if(ChipInArray == -1) {
			console.log("I am here chip" + mySpanId);
			document.getElementById(mySpanId).style.display = "block";
			document.getElementById(mySpanId).innerHTML = "机芯：" + nullChip + "不存在";
			setTimeout("spanhidden()", 3000);
		} else if(ChipInArray != -1 && ModelInArray == -1) {
			console.log("I am here model" + mySpanId);
			document.getElementById(mySpanId).style.display = "block";
			document.getElementById(mySpanId).innerHTML = "机型：" + nullModel + "不存在"
			setTimeout("spanhidden()", 3000);
		} else {
			console.log("lxw 提交数据，判断是否隐藏。");
			if(number == 1) {
				addPageSubmitData();
			} else if(number == 2) {
				copyPageSubmitData();
			} else if(number == 3) {
				editPageSubmitData();
			}
		}
	}
}

function spanhidden() {
	var spanStyleObj = document.getElementsByClassName("myModalErrorInfo");
	for(var i = 0; i < spanStyleObj.length; i++) {
		spanStyleObj[i].style.display = "none";
	}
}

//单项编辑-获取后台接口数据，动态加载单项编辑页面
function getEditInfoInfOne() {
	console.log("lxw " + "getEditInfoInfOne");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var kk = 0;
			var _rowEditPageApp = document.getElementById("myEditModalMkTableApp");
			var _rowEditPageService = document.getElementById("myEditModalMkTableService");
			var _rowEditPageAppStore = document.getElementById("myEditModalMkTableAppStore");
			var _rowEditPageHomePage = document.getElementById("myEditModalMkTableHomePage");
			var _rowEditPageIME = document.getElementById("myEditModalMkTableIME");
			var _rowEditPageSysApp = document.getElementById("myEditModalMkTableSysApp");
			var _rowEditPageTV = document.getElementById("myEditModalMkTableTV");
			var _rowEditPageOther = document.getElementById("myEditModalMkTableOther");
			_rowEditPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowEditPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowEditPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowEditPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowEditPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowEditPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowEditPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowEditPageOther.innerHTML = "<div title='Other'>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowEditPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowEditPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowEditPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowEditPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowEditPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowEditPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowEditPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowEditPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fybv2_api/configQuery", '{"data":""}', getEditInfoInfTwo);
	}
}

function getEditInfoInfTwo() {
	console.log("lxw " + "searchConfigInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowEditPageConfigMain = document.getElementById("myEditModalConfigTableTdMain");
			var _rowEditPageConfigHardware = document.getElementById("myEditModalConfigTableTdHardware");
			var _rowEditPageConfigServerip = document.getElementById("myEditModalConfigTableTdServerip");
			var _rowEditPageConfigAd = document.getElementById("myEditModalConfigTableTdAd");
			var _rowEditPageConfigChannel = document.getElementById("myEditModalConfigTableTdChannel");
			var _rowEditPageConfigLocalmedia = document.getElementById("myEditModalConfigTableTdLocalmedia");
			var _rowEditPageConfigBrowser = document.getElementById("myEditModalConfigTableTdBrowser");
			var _rowEditPageConfigOther = document.getElementById("myEditModalConfigTableTdOther");

			_rowEditPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowEditPageConfigHardware.innerHTML = "<div title='hardware'>硬件配置信息：</div>";
			_rowEditPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
			_rowEditPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
			_rowEditPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
			_rowEditPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
			_rowEditPageConfigBrowser.innerHTML = "<div title='browser'>浏览器配置：</div>";
			_rowEditPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowEditPageConfigMain.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "hardware") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					//console.log("hardware:" + kk);
					if(data.data[i].type == "string") {
						_rowEditPageConfigHardware.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigHardware.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					//console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowEditPageConfigServerip.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					//console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowEditPageConfigAd.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						//console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowEditPageConfigChannel.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowEditPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "browser") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowEditPageConfigBrowser.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowEditPageConfigOther.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						//console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowEditPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		var node = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"option":{}}}';
		sendHTTPRequest("/fybv2_api/productQuery", node, getEditInforesult);
	}
}

function getEditInforesult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			hashObj = data.data[0];
			//console.log(hashObj);
			//console.log(JSON.stringify(data));
			//var hash1 = md5(JSON.stringify(data));
			//console.log(hash1);
			if(data.msg == "success") {
				console.log("lxw " + "访问成功");
				//console.log("lxw " + JSON.stringify(data.data[0]));
				document.getElementById("newEditChip").value = data.data[0].chip;
				document.getElementById("newEditModel").value = data.data[0].model;
				document.getElementById("NewEditAndroidVersion").value = data.data[0].androidVersion;
				document.getElementById("newEditChipMode").value = data.data[0].chipModel;
				document.getElementById("newEditMemory").value = data.data[0].memorySize;
				document.getElementById("newEditDevice").value = data.data[0].targetProduct;

				//console.log("lxw " + JSON.stringify(data.data[0].mkFile));
				var key, counter = 0;
				for(key in data.data[0].mkFile) {
					counter++;
					console.log("lxw counter = " + counter + "--" + key);
					document.getElementById(key).setAttribute('checked', '');
					document.getElementById(key).checked = "true";
					console.log(document.getElementById(key).getAttribute("checked"));
				}
				console.log("lxw " + JSON.stringify(data.data[0].configFile));
				var configkey, configcounter = 0;
				for(configkey in data.data[0].configFile) {
					configcounter++;
					console.log("lxw counter = " + configcounter + "--" + configkey);
					console.log(data.data[0].configFile[configkey].type);
					if(data.data[0].configFile[configkey].type == "string") {
						document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
					} else {
						document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
						var childSelect = document.getElementById(configkey).childNodes;
						for(var j = 0; j < childSelect.length; j++) {
							childSelect[j].removeAttribute("selected");
							if(childSelect[j].value == data.data[0].configFile[configkey].value) {
								childSelect[j].setAttribute("selected", "");
							}
						};
					}
				}
			} else if(data.msg == "failure") {
				console.log("lxw " + "访问失败");
			}
		};
		editPageButtonsOnclick();
		if(allChipArray.length == 0 || allModelArray.length == 0) {
			sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', checkChipInfo);
		}
	}
}

function editPageSubmitData() {
	console.log("lxw " + loginusername + "--" + adminFlag);
	var dataObj = {
		"configFile": "",
		"mkFile": "",
		"memorySize": "",
		"chipModel": "",
		"androidVersion": "",
		"model": "",
		"chip": "",
		"targetProduct": "",
		"gerritState": "1", // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
		"operateType": "3", // 0表示无状态，1表示增加，2表示删除，3表示修改
		"userName": loginusername,
		"desc": "enenen"
	};
	// 获取DeviceInfo里的信息
	var oEchip = document.getElementById("newEditChip").value;
	var oEmodel = document.getElementById("newEditModel").value;
	var oEandroidVersion = document.getElementById("NewEditAndroidVersion").value;
	var oEchipModel = document.getElementById("newEditChipMode").value;
	var oEmemorySize = document.getElementById("newEditMemory").value;
	var oEtargetProduct = document.getElementById("newEditDevice").value;
	var oEgerritState = "1";
	var oEoperateType = "3";
	var userName = loginusername;
	var desc = "enheng";

	//获取config里的数据
	var editConfigFile = {};
	var oEconfigTrlength = $("#myEditModalConfigTableTbody").find("tr");
	console.log("lxw " + oEconfigTrlength.length);
	for(var i = 0; i < oEconfigTrlength.length; i++) {
		var oEConfigobj = {};
		var thisConfigindex = null;
		oEconfigTrDiv = $("#myEditModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oEconfigTrDiv.length);
		for(var j = 1; j < oEconfigTrDiv.length; j++) {
			var oEopt = [];
			var oEstuInfo = {
				"options": [],
				"desc": "XXXXX",
				"category": "",
				"value": "",
				"type": "",
				"configKey": "",
				"engName": "",
				"cnName": ""
			};
			thisConfigindex = j;
			oEstuInfo.category = oEconfigTrDiv[0].title;
			oEstuInfo.cnName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("cnName");
			oEstuInfo.engName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			oEstuInfo.configKey = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("configKey");
			oEstuInfo.type = oEconfigTrDiv[thisConfigindex].childNodes[1].name;
			oEstuInfo.value = oEconfigTrDiv[thisConfigindex].childNodes[1].value;
			oEstuInfo.desc = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("title");
			if(oEstuInfo.type == "string") {
				oEopt = [];
			} else if(oEstuInfo.type == "enum") {
				var jjlength = oEconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
				console.log("lxw " + jjlength.length);
				for(var jj = 0; jj < jjlength.length; jj++) {
					var optValue = jjlength[jj].value;
					oEopt.push(optValue);
				}
			}
			oEstuInfo.options = oEopt;
			editConfigFile[oEconfigTrDiv[thisConfigindex].childNodes[1].getAttribute("id")] = oEstuInfo;
		}
	}
	//获取mkFile里的信息
	var editMkFile = {};
	var oEMkTrDiv = $("#myEditModalMkTableTbody").find("tr");
	console.log("lxw " + oEMkTrDiv.length);
	var oEMkindex = null;
	for(var i = 0; i < oEMkTrDiv.length; i++) {
		var oEMkobj = {};
		oEMkTrDivTwo = $("#myEditModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oEMkTrDivTwo.length);
		for(var j = 1; j < oEMkTrDivTwo.length; j++) {
			oEMkindex = j;
			if(oEMkTrDivTwo[oEMkindex].childNodes[0].checked == true) {
				var oEoptTwo = [];
				var oEstuInfoTwo = {
					"desc": "XXXXX",//后期做“”的处理。
					"category": "",
					"gitPath": "",
					"engName": "",
					"cnName": ""
				};
				oEstuInfoTwo.category = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("category");
				oEstuInfoTwo.cnName = oEMkTrDivTwo[oEMkindex].childNodes[1].innerHTML;
				oEstuInfoTwo.engName = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("name");
				oEstuInfoTwo.gitPath = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("gitPath");
				oEstuInfoTwo.desc = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("title");
				editMkFile[oEMkTrDivTwo[oEMkindex].childNodes[0].getAttribute("id")] = oEstuInfoTwo;
			}
		}
	}
	dataObj.configFile = editConfigFile;
	dataObj.mkFile = editMkFile;
	dataObj.memorySize = oEmemorySize;
	dataObj.chipModel = oEchipModel;
	dataObj.androidVersion = oEandroidVersion;
	dataObj.model = oEmodel;
	dataObj.chip = oEchip;
	dataObj.targetProduct = oEtargetProduct;
	dataObj.gerritState = "1"; // 0表示审核通过，1表示待审核状态，2表示审核不通过状态
	dataObj.operateType = "3"; // 0表示无状态，1表示增加，2表示删除，3表示修改
	dataObj.userName = loginusername;
	dataObj.desc = "enenene";
	var oEnode = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"action":"set","update":{"userName":"' + loginusername + '","memorySize":"' + oEmemorySize + '","chipModel":"' + oEchipModel + '","androidVersion":"' + oEandroidVersion + '","targetProduct":"' + oEtargetProduct + '","gerritState":"1","operateType":"3","androidVersion":"' + oEandroidVersion + '","mkFile":' + JSON.stringify(editMkFile) + ',"configFile":' + JSON.stringify(editConfigFile) + '}}}';
	console.log("lxw " + oEnode);
	submitStatus(hashObj,dataObj,oEnode);
}

function submitStatus(hashObj,dataObj,oEnode){
	var changeStatus = 0;
	//console.log(hashObj);
	//console.log(dataObj);
	var oldMKkey, oldMKkeycounter= 0;
	for(oldMKkey in hashObj.mkFile) {
		oldMKkeycounter++;
	}
	var oldConfigkey, oldConfigkeycounter = 0;
	for(oldConfigkey in hashObj.configFile) {
		oldConfigkeycounter++;
	}
	var newMKkey, newMKkeycounter = 0;
	for(newMKkey in dataObj.mkFile) {
		newMKkeycounter++;
	}
	var newConfigkey, newConfigkeycounter = 0;
	for(newConfigkey in dataObj.configFile) {
		newConfigkeycounter++;
	}
	console.log("old: "+oldMKkeycounter+"---"+oldConfigkeycounter);
	console.log("new: "+newMKkeycounter+"---"+newConfigkeycounter);
	if(oldMKkeycounter==newMKkeycounter&&oldConfigkeycounter==newConfigkeycounter){
		var ookey = 0;
		for(ookey in hashObj.mkFile) {
			//console.log(hashObj.mkFile[ookey].value+"--"+dataObj.mkFile[ookey].value);
			//console.log(typeof(dataObj.mkFile[ookey]));
			if(typeof(dataObj.mkFile[ookey])==="undefined"){
				//console.log("mk做了修改");
				changeStatus = 1;
			}else{
				//console.log("mk未做修改");
			}
		}
		var nnkey = 0;
		for(nnkey in hashObj.configFile) {
			//console.log(hashObj.configFile[nnkey].value+"--"+dataObj.configFile[nnkey].value);
			if(hashObj.configFile[nnkey].value == dataObj.configFile[nnkey].value){
				//console.log("config未做修改");
			}else{
				//console.log("config做了修改");
				changeStatus = 1;
			}
		}
	}else{
		changeStatus = 1;
	}
	console.log(changeStatus);
	if (dataObj.androidVersion==hashObj.androidVersion&&dataObj.memorySize==hashObj.memorySize&&dataObj.chipModel==hashObj.chipModel&&dataObj.targetProduct ==hashObj.targetProduct&&changeStatus == 0) {
		console.log("未做修改...");
		document.getElementById("myEditModalErrorInfo").innerHTML = "您未做任何修改。";
		setTimeout("document.getElementById('myEditModalErrorInfo').innerHTML='　'",3000);
	} else{
		console.log("做了修改...");
		sendHTTPRequest("/fybv2_api/productUpdate", oEnode, productEditresult);
	}
}

function productEditresult() {
	console.log("lxw in productEditresult");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myEditModal").modal('hide');
				$("#myDeleteModal").modal('hide');
				startSelect();
				freshHtml("tab_userMenu2");
				document.getElementById("myAddCloseDiv").style.display = "block";
				document.getElementById("infoEdit").innerHTML = "数据提交成功，请在待审核页面查看。";
				setTimeout("document.getElementById('myAddCloseDiv').style.display = 'none'",3000);
				closeparentpage("1");
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("myEditModalErrorInfo").style.display = "block";
				document.getElementById("myEditModalErrorInfo").innerHTML = "该产品已存在"
				setTimeout("spanhidden()", 3000);
			};
		};
	}
}
//单项复制-获取后台接口数据，动态加载单项编辑页面
function getCopyInfoInfOne() {
	if(this.readyState == 4) {
		console.log("lxw " + "getCopyInfoInfOne");
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			var kk = 0;
			var _rowCopyPageApp = document.getElementById("myCopyModalMkTableApp");
			var _rowCopyPageService = document.getElementById("myCopyModalMkTableService");
			var _rowCopyPageAppStore = document.getElementById("myCopyModalMkTableAppStore");
			var _rowCopyPageHomePage = document.getElementById("myCopyModalMkTableHomePage");
			var _rowCopyPageIME = document.getElementById("myCopyModalMkTableIME");
			var _rowCopyPageSysApp = document.getElementById("myCopyModalMkTableSysApp");
			var _rowCopyPageTV = document.getElementById("myCopyModalMkTableTV");
			var _rowCopyPageOther = document.getElementById("myCopyModalMkTableOther");
			_rowCopyPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowCopyPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowCopyPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowCopyPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowCopyPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowCopyPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowCopyPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowCopyPageOther.innerHTML = "<div title='Other'>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowCopyPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowCopyPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowCopyPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowCopyPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowCopyPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowCopyPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowCopyPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowCopyPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk]._id + "'><span title='" + data.data[kk].desc + "' category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fybv2_api/configQuery", '{"data":""}', getCopyInfoInfTwo);
	}
}

function getCopyInfoInfTwo() {
	if(this.readyState == 4) {
		console.log("lxw " + "getCopyInfoInfTwo");
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowCopyPageConfigMain = document.getElementById("myCopyModalConfigTableTdMain");
			var _rowCopyPageConfigHardware = document.getElementById("myCopyModalConfigTableTdHardware");
			var _rowCopyPageConfigServerip = document.getElementById("myCopyModalConfigTableTdServerip");
			var _rowCopyPageConfigAd = document.getElementById("myCopyModalConfigTableTdAd");
			var _rowCopyPageConfigChannel = document.getElementById("myCopyModalConfigTableTdChannel");
			var _rowCopyPageConfigLocalmedia = document.getElementById("myCopyModalConfigTableTdLocalmedia");
			var _rowCopyPageConfigBrowser = document.getElementById("myCopyModalConfigTableTdBrowser");
			var _rowCopyPageConfigOther = document.getElementById("myCopyModalConfigTableTdOther");

			_rowCopyPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowCopyPageConfigHardware.innerHTML = "<div title='hardware'>硬件配置信息：</div>";
			_rowCopyPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
			_rowCopyPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
			_rowCopyPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
			_rowCopyPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
			_rowCopyPageConfigBrowser.innerHTML = "<div title='browser'>浏览器配置：</div>";
			_rowCopyPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category + data.data[i].type);
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigMain.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span  title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "hardware") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("hardware:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigHardware.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigHardware.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigServerip.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigAd.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigChannel.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("localmedia:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "browser") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("browser:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigBrowser.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigBrowser.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigOther.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='11111'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCopyPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		var node = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"option":{}}}';
		sendHTTPRequest("/fybv2_api/productQuery", node, getCopyInforesult);
	}
}

function getCopyInforesult() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "复制成功");
				document.getElementById("newCopyChip").value = data.data[0].chip;
				document.getElementById("newCopyModel").value = data.data[0].model;
				document.getElementById("NewCopyAndroidVersion").value = data.data[0].androidVersion;
				document.getElementById("newCopyChipMode").value = data.data[0].chipModel;
				document.getElementById("newCopyMemory").value = data.data[0].memorySize;
				document.getElementById("newCopyDevice").value = data.data[0].targetProduct;

				//console.log("lxw " + JSON.stringify(data.data[0].mkFile));
				var mkkey, mkcounter = 0;
				for(mkkey in data.data[0].mkFile) {
					mkcounter++;
					console.log("lxw counter = " + mkcounter + "--" + mkkey);
					document.getElementById(mkkey).removeAttribute("checked");
					//document.getElementById(mkkey).setAttribute('checked', '');
					document.getElementById(mkkey).checked = true;
					console.log(document.getElementById(mkkey).checked);
				};
				console.log("lxw " + JSON.stringify(data.data[0].configFile));
				var configkey, configcounter = 0;
				for(configkey in data.data[0].configFile) {
					configcounter++;
					if(data.data[0].configFile[configkey].type == "string") {
						document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
					} else {
						document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
						var childSelect = document.getElementById(configkey).childNodes;
						for(var j = 0; j < childSelect.length; j++) {
							childSelect[j].removeAttribute("selected");
							if(childSelect[j].value == data.data[0].configFile[configkey].value) {
								childSelect[j].setAttribute("selected", "");
							}
						};
					}
				};
			} else if(data.msg == "failure") {
				console.log("lxw " + "复制失败");
			}
		};
		startSelect();
		copyPageButtons();
		if(allChipArray.length == 0 || allModelArray.length == 0) {
			sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', checkChipInfo);
		}
	}
}

function copyPageSubmitData() {
	console.log("lxw " + loginusername + "--" + adminFlag);
	var dataObj = {
		"configFile": "",
		"mkFile": "",
		"memorySize": "",
		"chipModel": "",
		"androidVersion": "",
		"model": "",
		"chip": "",
		"targetProduct": "",
		"gerritState": "1", // 0表示审核通过，1表示待审核状态，2表示审核不通过状态
		"operateType": "1", // 0表示无状态，1表示增加，2表示删除，3表示修改
		"userName": loginusername,
		"desc": "enenen"
	};
	// 获取DeviceInfo里的信息
	var oCchip = document.getElementById("newCopyChip").value;
	var oCmodel = document.getElementById("newCopyModel").value;
	var oCandroidVersion = document.getElementById("NewCopyAndroidVersion").value;
	var oCchipModel = document.getElementById("newCopyChipMode").value;
	var oCmemorySize = document.getElementById("newCopyMemory").value;
	var oCtargetProduct = document.getElementById("newCopyDevice").value;
	var oCgerritState = "1";
	var oCoperateType = "1";
	var userName = loginusername;
	var desc = "enheng";
	//获取config里的数据
	var copyConfigFile = {};
	var oCconfigTrlength = $("#myCopyModalConfigTableTbody").find("tr");
	for(var i = 0; i < oCconfigTrlength.length; i++) {
		var oCConfigobj = {};
		var thisConfigindex = null;
		oCconfigTrDiv = $("#myCopyModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oCconfigTrDiv.length; j++) {
			var oCopt = [];
			var oCstuInfo = {
				"cnName": "",
				"engName": "",
				"configKey": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oCstuInfo.category = oCconfigTrDiv[0].title;
			oCstuInfo.cnName = oCconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("cnName");
			oCstuInfo.engName = oCconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			oCstuInfo.configKey = oCconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("configKey");
			oCstuInfo.desc = oCconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("title");
			oCstuInfo.type = oCconfigTrDiv[thisConfigindex].childNodes[1].name;
			oCstuInfo.value = oCconfigTrDiv[thisConfigindex].childNodes[1].value;
			if(oCstuInfo.type == "string") {
				oCopt = [];
			} else if(oCstuInfo.type == "enum") {
				var jjlength = oCconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
				for(var jj = 0; jj < jjlength.length; jj++) {
					var optValue = jjlength[jj].value;
					oCopt.push(optValue);
				}
			}
			oCstuInfo.options = oCopt;
			copyConfigFile[oCconfigTrDiv[thisConfigindex].childNodes[1].getAttribute("id")] = oCstuInfo;
		}
	}
	//获取mkFile里的信息
	var copyMkFile = {};
	var oCMkTrDiv = $("#myCopyModalMkTableTbody").find("tr");
	var oCMkindex = null;
	for(var i = 0; i < oCMkTrDiv.length; i++) {
		var oCMkobj = {};
		oCMkTrDivTwo = $("#myCopyModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oCMkTrDivTwo.length; j++) {
			oCMkindex = j;
			if(oCMkTrDivTwo[oCMkindex].childNodes[0].checked == true) {
				var oCoptTwo = [];
				var oCstuInfoTwo = {
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				oCstuInfoTwo.category = oCMkTrDivTwo[oCMkindex].childNodes[1].getAttribute("category");
				oCstuInfoTwo.cnName = oCMkTrDivTwo[oCMkindex].childNodes[1].innerHTML;
				oCstuInfoTwo.engName = oCMkTrDivTwo[oCMkindex].childNodes[1].getAttribute("name");
				oCstuInfoTwo.gitPath = oCMkTrDivTwo[oCMkindex].childNodes[1].getAttribute("gitPath");
				oCstuInfoTwo.desc = oCMkTrDivTwo[oCMkindex].childNodes[1].getAttribute("title");
				copyMkFile[oCMkTrDivTwo[oCMkindex].childNodes[0].getAttribute("id")] = oCstuInfoTwo;
			}
		}
	}
	//console.log("lxw " + JSON.stringify(copyMkFile));
	dataObj.configFile = copyConfigFile;
	dataObj.mkFile = copyMkFile;
	dataObj.memorySize = oCmemorySize;
	dataObj.chipModel = oCchipModel;
	dataObj.androidVersion = oCandroidVersion;
	dataObj.model = oCmodel;
	dataObj.chip = oCchip;
	dataObj.targetProduct = oCtargetProduct;
	dataObj.gerritState = "1"; // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
	dataObj.operateType = "1"; // 0表示无状态，1表示增加，2表示删除，3表示修改
	dataObj.userName = loginusername;
	dataObj.desc = "enenen";
	var oCnode = '{"data":' + JSON.stringify(dataObj) + '}';
	console.log("lxw " + oCnode);
	sendHTTPRequest("/fybv2_api/productAdd", oCnode, productAddresult);
}
//多项修改-获取后台接口数据，动态加载多项修改页面
function getMoreEditInfoOne() {
	console.log("lxw " + "getMoreEditInfoOne");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var _rowMEditPageApp = document.getElementById("myMoreEditModalMkTableApp");
			var _rowMEditPageService = document.getElementById("myMoreEditModalMkTableService");
			var _rowMEditPageAppStore = document.getElementById("myMoreEditModalMkTableAppStore");
			var _rowMEditPageHomePage = document.getElementById("myMoreEditModalMkTableHomePage");
			var _rowMEditPageIME = document.getElementById("myMoreEditModalMkTableIME");
			var _rowMEditPageSysApp = document.getElementById("myMoreEditModalMkTableSysApp");
			var _rowMEditPageTV = document.getElementById("myMoreEditModalMkTableTV");
			var _rowMEditPageOther = document.getElementById("myMoreEditModalMkTableOther");
			_rowMEditPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowMEditPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowMEditPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowMEditPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowMEditPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowMEditPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowMEditPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowMEditPageOther.innerHTML = "<div title='Other'>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowMEditPageApp.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowMEditPageService.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowMEditPageAppStore.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowMEditPageHomePage.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowMEditPageIME.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowMEditPageSysApp.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowMEditPageTV.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowMEditPageOther.innerHTML += "<div class='col-xs-4'><a id='" + data.data[kk]._id + "' class='aFlagToButton' engName='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "' gitPath='" + data.data[kk].gitPath + "' category='" + data.data[kk].category + "' title='" + data.data[kk].desc + "' curValue = '0'>" + data.data[kk].cnName + "</a><button type='button' class='btn btn-default mybuttonAddstyle'>批量新增</button><button type='button' class='btn btn-default mybuttonDelstyle'>批量删除</button></div>";
				}
			}
		};
		sendHTTPRequest("/fybv2_api/configQuery", '{"data":""}', getMoreEditInfoTwo);
	}
}

function getMoreEditInfoTwo() {
	console.log("lxw " + "getMoreEditInfoTwo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowMEPageConfigMain = document.getElementById("myMoreEditModalConfigTableTdMain");
			var _rowMEPageConfigHardware = document.getElementById("myMoreEditModalConfigTableTdHardware");
			var _rowMEPageConfigServerip = document.getElementById("myMoreEditModalConfigTableTdServerip");
			var _rowMEPageConfigAd = document.getElementById("myMoreEditModalConfigTableTdAd");
			var _rowMEPageConfigChannel = document.getElementById("myMoreEditModalConfigTableTdChannel");
			var _rowMEPageConfigLocalmedia = document.getElementById("myMoreEditModalConfigTableTdLocalmedia");
			var _rowMEPageConfigBrowser = document.getElementById("myMoreEditModalConfigTableTdBrowser");
			var _rowMEPageConfigOther = document.getElementById("myMoreEditModalConfigTableTdOther");

			_rowMEPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowMEPageConfigHardware.innerHTML = "<div title='main'>硬件配置信息：</div>";
			_rowMEPageConfigServerip.innerHTML = "<div title='main'>服务器IP配置：</div>";
			_rowMEPageConfigAd.innerHTML = "<div title='main'> 广告配置：</div>";
			_rowMEPageConfigChannel.innerHTML = "<div title='main'>TV通道：</div>";
			_rowMEPageConfigLocalmedia.innerHTML = "<div title='main'>本地媒体：</div>";
			_rowMEPageConfigBrowser.innerHTML = "<div title='main'>浏览器配置：</div>";
			_rowMEPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					if(data.data[i].type == "string") {
						_rowMEPageConfigMain.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "hardware") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("hardware:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigHardware.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigHardware.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigServerip.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigAd.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigChannel.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("localmedia:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigLocalmedia.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "browser") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("browser:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigBrowser.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigBrowser.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowMEPageConfigOther.innerHTML += "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' oldvalue='" + data.data[kk].value + "' value='" + data.data[kk].value + "' value='" + data.data[kk].value + "' curvalue='0'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6 mytextedit'><span title='" + data.data[kk].desc + "' name='" + data.data[kk].engName + "' cnName='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowMEPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		moreEditPageButtons();
	}
}

function getMoreEditInfo() {
	//获取mkFile、configFile里的信息
	var mEMkAddCzName = [];
	var mEMkDelCzName = [];
	var mEConfigEditCzName = []; //config文件用

	var oMEMkTrDiv = $("#myMoreEditModalMkTableTbody").find("tr");
	console.log("lxw " + oMEMkTrDiv.length);
	var oMEMkindex = null;
	for(var i = 0; i < oMEMkTrDiv.length; i++) {
		oMEMkTrDivTwo = $("#myMoreEditModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oMEMkTrDivTwo.length; j++) {
			oMEMkindex = j;
			var ooValue = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("curValue");
			if(ooValue == "1") { //新增
				console.log("lxw " + oMEMkindex + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
				mEMkAddCzName.push(oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
			}
			if(ooValue == "2") { //删除
				console.log("lxw " + oMEMkindex + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
				mEMkDelCzName.push(oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
			}
		}
	}

	var oMEConfigTrDiv = $("#myMoreEditModalConfigTableTbody").find("tr");
	console.log("lxw " + oMEConfigTrDiv.length);
	var oMEConfigindex = null;
	for(var i = 0; i < oMEConfigTrDiv.length; i++) {
		oMEConfigTrDivTwo = $("#myMoreEditModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oMEConfigTrDivTwo.length; j++) {
			oMEConfigindex = j;
			var ooValue = oMEConfigTrDivTwo[oMEConfigindex].childNodes[1].getAttribute("curvalue");
			if(ooValue == "1") { //修改
				console.log("lxw " + oMEConfigindex + "--" + oMEConfigTrDivTwo[oMEConfigindex].childNodes[1].value);
				mEConfigEditCzName.push(oMEConfigTrDivTwo[oMEConfigindex].childNodes[0].getAttribute("cnName"));
			}
		}
	}
	console.log("lxw " + mEMkAddCzName);
	console.log("lxw " + mEMkDelCzName);
	console.log("lxw " + mEConfigEditCzName);
	console.log(JSON.stringify(ChipModelArray));
	var infoArray = new Array();
	for (var i=0; i<ChipModelArray.length; i++) {
		infoArray.push('"'+ChipModelArray[i].chip+"、"+ChipModelArray[i].model+'" ');
	}
	console.log(infoArray);
	document.getElementById("AimAtChipAndModel").innerHTML = infoArray;
	document.getElementById("addmodules").innerHTML = mEMkAddCzName;
	document.getElementById("deletemodules").innerHTML = mEMkDelCzName;
	document.getElementById("setmodules").innerHTML = mEConfigEditCzName;
	var showStatus = document.getElementsByClassName("moreEditDetail");
	if(mEMkAddCzName.length == 0){
		showStatus[2].style.display = "none";
	}else{
		showStatus[2].style.display = "block";
	}
	if(mEMkDelCzName.length == 0){
		showStatus[3].style.display = "none";
	}else{
		showStatus[3].style.display = "block";
	}
	if(mEConfigEditCzName.length == 0){
		showStatus[4].style.display = "none";
	}else{
		showStatus[4].style.display = "block";
	}
	if(mEMkAddCzName.length == 0&&mEMkDelCzName.length == 0&&mEConfigEditCzName.length == 0){
		showStatus[0].style.display = "none";
		showStatus[1].style.display = "none";
		showStatus[5].style.display = "block";
	}else{
		showStatus[0].style.display = "block";
		showStatus[1].style.display = "block";
		showStatus[5].style.display = "none";
	}
}

function getMoreEditInfoEnd() {
	//获取mkFile、configFile里的信息
	var moreEditMkAddFile = {};
	var moreEditMkDelFile = {};
	var moreEditConfigEditFile = {}; //config文件用

	var oMEMkTrDiv = $("#myMoreEditModalMkTableTbody").find("tr");
	console.log("lxw " + oMEMkTrDiv.length);
	var oMEMkindex = null;
	for(var i = 0; i < oMEMkTrDiv.length; i++) {
		oMEMkTrDivTwo = $("#myMoreEditModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oMEMkTrDivTwo.length);
		for(var j = 1; j < oMEMkTrDivTwo.length; j++) {
			oMEMkindex = j;
			var ooValue = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("curValue");
			if(ooValue == "1") { //新增
				console.log("lxw " + oMEMkindex + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].id + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
				var oCstuInfoTwo = {
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				var curId = null;
				curId = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("id");
				oCstuInfoTwo.category = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("category");
				oCstuInfoTwo.cnName = oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML;
				oCstuInfoTwo.engName = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("engName");
				oCstuInfoTwo.gitPath = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("gitPath");
				oCstuInfoTwo.desc = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("title");
				//moreEditMkAddFile.push(JSON.stringify(oCstuInfoTwo));
				moreEditMkAddFile['mkFile.' + curId] = oCstuInfoTwo;
			}
			if(ooValue == "2") { //删除
				console.log("lxw " + oMEMkindex + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].id + "--" + oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML);
				var oCstuInfoTwo = {
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				var curTwoId = null;
				curTwoId = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("id");
				oCstuInfoTwo.category = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("category");
				oCstuInfoTwo.cnName = oMEMkTrDivTwo[oMEMkindex].childNodes[0].innerHTML;
				oCstuInfoTwo.engName = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("engName");
				oCstuInfoTwo.gitPath = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("gitPath");
				oCstuInfoTwo.desc = oMEMkTrDivTwo[oMEMkindex].childNodes[0].getAttribute("title");
				moreEditMkDelFile['mkFile.' + curTwoId] = "1";
			}
		}
	}

	var oMEConfigTrDiv = $("#myMoreEditModalConfigTableTbody").find("tr");
	var oMEConfigindex = null;
	for(var i = 0; i < oMEMkTrDiv.length; i++) {
		oMEConfigTrDivTwo = $("#myMoreEditModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 1; j < oMEConfigTrDivTwo.length; j++) {
			oMEConfigindex = j;
			var ooValue = oMEConfigTrDivTwo[oMEConfigindex].childNodes[1].getAttribute("curvalue");
			if(ooValue == "1") { //修改了
				console.log("hello");
				var curCTwoId = null;
				curCTwoId = oMEConfigTrDivTwo[oMEConfigindex].childNodes[1].getAttribute("id");
				moreEditMkAddFile['configFile.' + curCTwoId + '.value'] = oMEConfigTrDivTwo[oMEConfigindex].childNodes[1].value;
			}
		}
	}
	console.log("lxw " + ChipModelArray); 
	console.log(judge(moreEditMkAddFile));
	console.log(judge(moreEditMkDelFile));
	if(judge(moreEditMkAddFile)==true&&judge(moreEditMkDelFile)==true){
		//添加或者修改、删除"userName":"' + loginusername + '","gerritState":"1","operateType":"2"
		moreEditMkAddFile['userName'] = loginusername;
		moreEditMkAddFile['gerritState'] = "1";
		moreEditMkAddFile['operateType'] = "3";
		var addNode = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"set","update":' + JSON.stringify(moreEditMkAddFile) + '}}';
		var delNode = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"unset","update":' + JSON.stringify(moreEditMkDelFile) + '}}';
		console.log("lxw " + addNode);
		console.log("lxw " + delNode);
		moreDeleteData = delNode;
		sendHTTPRequest("/fybv2_api/productUpdate", addNode, moreAddResult);
	}
	if(judge(moreEditMkAddFile)==true&&judge(moreEditMkDelFile)==false){
		//添加或者修改、未删除
		moreEditMkAddFile['userName'] = loginusername;
		moreEditMkAddFile['gerritState'] = "1";
		moreEditMkAddFile['operateType'] = "3";
		var addNode = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"set","update":' + JSON.stringify(moreEditMkAddFile) + '}}';
		console.log("lxw " + addNode);
		moreDeleteData = 0;//表示未删除
		sendHTTPRequest("/fybv2_api/productUpdate", addNode, moreAddResult);
	}
	if(judge(moreEditMkAddFile)==false&&judge(moreEditMkDelFile)==true){
		//未添加或者修改、只删除
		//moreEditMkDelFile['userName'] = loginusername;
		//moreEditMkDelFile['gerritState'] = "1";
		//moreEditMkDelFile['operateType'] = "3";
		var delNode = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"unset","update":' + JSON.stringify(moreEditMkDelFile) + '}}';
		console.log("lxw " + delNode);
		sendHTTPRequest("/fybv2_api/productUpdate", delNode, moreDelResult);
	}
	if(judge(moreEditMkAddFile)==false&&judge(moreEditMkDelFile)==false){
		//未做操作
		console.log("未做任何操作");
	}
	
}

function judge(obj){
 　　for(var i in obj){//如果不为空，则会执行到这一步，返回true
　　　　return true;
　　}
　　 return false; 
}
function moreAddResult(){
	if(this.readyState == 4) {
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "批量添加单项成功");
				//$("#myMoreEditSubmitModal").modal('hide');
				//freshHtml("tab_userMenu2");
				//startSelect();
			} else if(data.msg == "failure") {
				console.log("lxw " + "批量添加单项失败");
				//document.getElementById("myMDModalErrorInfo").style.display = "block";
				//document.getElementById("myMDModalErrorInfo").innerHTML = "修改失败";
				//setTimeout("spanhidden()", 3000);
			};
		};
		console.log(moreDeleteData);
		if(moreDeleteData!=0){//做了删除操作
			sendHTTPRequest("/fybv2_api/productUpdate", moreDeleteData, moreDelResult);
		}else{
			freshHtml("tab_userMenu2");
			startSelect();
		}
	}
}
function moreDelResult(){
	if(this.readyState == 4) {
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "批量删除单项成功");
				//$("#myMoreEditSubmitModal").modal('hide');
				//freshHtml("tab_userMenu2");
				//startSelect();
			} else if(data.msg == "failure") {
				console.log("lxw " + "批量删除单项失败");
				//document.getElementById("myMDModalErrorInfo").style.display = "block";
				//document.getElementById("myMDModalErrorInfo").innerHTML = "修改失败";
				//setTimeout("spanhidden()", 3000);
			};
		};
		console.log(JSON.stringify(ChipModelArray));
		var delStatus = '{"data":{"condition":{"$or":' + JSON.stringify(ChipModelArray) + '},"action":"set","update":{"userName":"' + loginusername + '","gerritState":"1","operateType":"3"}}}';
		console.log(delStatus);
		sendHTTPRequest("/fybv2_api/productUpdate", delStatus, delupdatafunc);
	}
}
function delupdatafunc(){
	if(this.readyState == 4) {
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "批量删除单项的状态修改-成功");
			} else if(data.msg == "failure") {
				console.log("lxw " + "批量删除单项的状态修改-失败");
			};
		};
		freshHtml("tab_userMenu2");
		startSelect();
	}
}

//多项删除整条数据的返回结果
function moreDeleteresult() {
	if(this.readyState == 4) {
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myMoreDeleteModal").modal('hide');
				freshHtml("tab_userMenu2");
				startSelect();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("myMDModalErrorInfo").style.display = "block";
				document.getElementById("myMDModalErrorInfo").innerHTML = "修改失败";
				setTimeout("spanhidden()", 3000);
			};
		};
	}
}
/*点击新增-弹框里的各个按钮*/
function addPageButtons() {
	var oButtonAddEnsure = document.getElementById("myAddModalSubmit");
	oButtonAddEnsure.onclick = function() {
		console.log("新增页-提交按钮一");
		chipModeldataCheck(1);
	}
	var oButtonAddEnsure = document.getElementById("myAddModalSubmitTwo");
	oButtonAddEnsure.onclick = function() {
		console.log("新增页-提交按钮二");
		//传参：1-新增页 2-复制页 3-编辑页
		chipModeldataCheck(1);
	}
	var oButtonAdd = document.getElementById("myAddModalClose");
	oButtonAdd.onclick = function() {
		console.log("新增页-关闭按钮");
		document.getElementById("myAddCloseDiv").style.display = "block";
		document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
		//传参-关闭父页  
		closeparentpage("#myAddModal");
	}
	//新增页mk-config button的点击
	functionMkConfigTable("myAddModalMkButton", "myAddModalMkTable", "myAddModalConfigButton", "myAddModalConfigTable");
}
/*点击单项复制-弹框里的各个按钮*/
function copyPageButtons() {
	var oButtonEditEnsure = document.getElementById("myCopyModalSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("单项复制页-提交按钮一");
		//传参：1-新增页 2-复制页 3-编辑页
		chipModeldataCheck(2);
	}
	var oButtonEditEnsure = document.getElementById("myCopyModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("单项复制页-提交按钮二");
		//传参：1-新增页 2-复制页 3-编辑页
		chipModeldataCheck(2);
	}
	var oButtonAdd = document.getElementById("myCopyModalClose");
	oButtonAdd.onclick = function() {
			console.log("单项复制页-关闭按钮");
			document.getElementById("myAddCloseDiv").style.display ="block";
			document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
			//传参-关闭父页  
			closeparentpage("#myCopyModal");
		}
		//复制页mk-config button的点击
	functionMkConfigTable("myCopyModalMkButton", "myCopyModalMkTable", "myCopyModalConfigButton", "myCopyModalConfigTable");
}
/*点击单项编辑-弹框里的各个按钮*/
function editPageButtonsOnclick() {
	var oButtonEditEnsure = document.getElementById("myEditModalSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("单项编辑页-提交按钮一");
		//传参：1-新增页 2-复制页 3-编辑页
		chipModeldataCheck(3);
	}
	var oButtonEditEnsure = document.getElementById("myEditModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("单项编辑页-提交按钮二");
		var div = document.getElementById("myEditModal");
		var body = document.getElementById("homePage");
		console.log(div.scrollTop+"---"+parent.document.documentElement.scrollTop);
		document.getElementById("myEditModal").scrollTop = 0;
		//document.documentElement.scrollTop = 0;
		//传参：1-新增页 2-复制页 3-编辑页
		chipModeldataCheck(3);
	}
	var oButtonAdd = document.getElementById("myEditModalClose");
	oButtonAdd.onclick = function() {
			console.log("单项编辑页-关闭按钮");
			document.getElementById("myAddCloseDiv").style.display ="block";
			document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
			//传参-关闭父页  
			closeparentpage("#myEditModal");
		}
		//编辑页mk-config button的点击
	functionMkConfigTable("myEditModalMkButton", "myEditModalMkTable", "myEditModalConfigButton", "myEditModalConfigTable");
}
/*点击单项删除-弹框里的各个按钮*/
function singleDeletePageButtons(olchip, olmode) {
	var oButtonEditEnsure = document.getElementById("myDeleteModalEnsure");
	oButtonEditEnsure.onclick = function() {
		console.log("单项删除页-确认按钮");
		console.log("lxw " + olchip + "--" + olmode);
		var ooEnode = '{"data":{"condition":{"chip":"' + olchip + '","model":"' + olmode + '"},"action":"set","update":{"userName":"' + loginusername + '","gerritState":"1","operateType":"2"}}}';
		console.log("lxw " + ooEnode);
		sendHTTPRequest("/fybv2_api/productUpdate", ooEnode, productEditresult);
	}
}
/*点击批量修改-弹框里的各个按钮*/
function moreEditPageButtons() {
	var oButtonEditEnsure = document.getElementById("myMoreEditModalSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("批量修改页-提交按钮一");
		document.getElementById("myMoreEditSubmitModal").style.display = "block";
		//$('#myMoreEditSubmitModal').modal();
		//$(".modal-backdrop").addClass("new-backdrop");
		getMoreEditInfo();
	}
	var oButtonEditEnsure = document.getElementById("myMoreEditModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("批量修改页-提交按钮二");
		document.getElementById("myMoreEditSubmitModal").style.display = "block";
		//$('#myMoreEditSubmitModal').modal();
		//$(".modal-backdrop").addClass("new-backdrop");
		getMoreEditInfo();
	}
	var oButtonEditEnsure = document.getElementById("myMoreEditModalClose");
	oButtonEditEnsure.onclick = function() {
		console.log("批量修改页-关闭按钮");
		document.getElementById("myAddCloseDiv").style.display ="block";
		document.getElementById("infoEdit").innerHTML = "确认要关闭吗？";
		closeparentpage("#myMoreEditModal");
	}
	var oButtonEditEnsure = document.getElementById("MoreEditSaveSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("批量修改页-提交确认按钮");
		getMoreEditInfoEnd();
		document.getElementById("myMoreEditSubmitModal").style.display = "none";
		$("#myMoreEditModal").modal('hide');
		//$("#myMoreEditSubmitModal").modal('hide');
	}
	var oButtonEditEnsure = document.getElementById("MoreEditBack");
	oButtonEditEnsure.onclick = function() {
		console.log("批量修改页-提交取消按钮");
		document.getElementById("myMoreEditSubmitModal").style.display = "none";
	}
	/*批量修改页mk-config button的点击*/
	functionMkConfigTable("myMoreEditModalMkButton", "myMoreEditModalMkTable", "myMoreEditModalConfigButton", "myMoreEditModalConfigTable");

	/*批量修改页-MK页*/
	var oClassAClicks = new Array();
	var omybuttonAddstyle = new Array();
	var omybuttonDelstyle = new Array();
	var oAFlagStatus = new Array();
	oClassAClicks = document.getElementsByClassName("aFlagToButton");
	omybuttonAddstyle = document.getElementsByClassName("mybuttonAddstyle");
	omybuttonDelstyle = document.getElementsByClassName("mybuttonDelstyle");
	for(var i = 0; i < oClassAClicks.length; i++) {
		oClassAClicks[i].index = i;
		oAFlagStatus[i] = true;
		oClassAClicks[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			var currentId = oClassAClicks[this.index].id;
			for(var j = 0; j < oClassAClicks.length; j++) {
				omybuttonAddstyle[j].style.display = "none";
				omybuttonDelstyle[j].style.display = "none";
			}
			if(oAFlagStatus[this.index] == true) {
				omybuttonAddstyle[this.index].style.display = "block";
				omybuttonDelstyle[this.index].style.display = "block";
			} else {
				omybuttonAddstyle[this.index].style.display = "none";
				omybuttonDelstyle[this.index].style.display = "none";
			}
			oAFlagStatus[this.index] = !oAFlagStatus[this.index];
			AddOrDelButtonFunction(this.index, currentId);
		}
	}
	/*批量删除或批量新增的点击*/
	function AddOrDelButtonFunction(number, id) {
		console.log("lxw" + "in AddOrDelButtonFunction" + number + "--" + id);
		omybuttonAddstyle[number].onclick = function() {
			console.log("lxw" + "批量新增的点击" + number);
			if(omybuttonAddstyle[number].innerHTML == "批量新增") {
				omybuttonAddstyle[number].style.color = "red";
				omybuttonAddstyle[number].innerHTML = "取消新增";
				omybuttonDelstyle[number].style.color = "";
				omybuttonDelstyle[number].innerHTML = "批量删除";
				document.getElementById(id).style.color = "red";
				document.getElementById(id).setAttribute("curValue", "1");
			} else {
				omybuttonAddstyle[number].style.color = "";
				omybuttonAddstyle[number].innerHTML = "批量新增";
				document.getElementById(id).style.color = "";
				document.getElementById(id).setAttribute("curValue", "0");
			}
		}
		omybuttonDelstyle[number].onclick = function() {
			console.log("lxw" + "批量删除的点击" + number);
			if(omybuttonDelstyle[number].innerHTML == "批量删除") {
				omybuttonDelstyle[number].style.color = "red";
				omybuttonDelstyle[number].innerHTML = "取消删除";
				omybuttonAddstyle[number].style.color = "";
				omybuttonAddstyle[number].innerHTML = "批量新增";
				document.getElementById(id).style.color = "red";
				document.getElementById(id).setAttribute("curValue", "2");
			} else {
				omybuttonDelstyle[number].style.color = "";
				omybuttonDelstyle[number].innerHTML = "批量删除";
				document.getElementById(id).style.color = "";
				document.getElementById(id).setAttribute("curValue", "0");
			}
		}
	}

	/*批量修改页-Config页*/
	var omyTextEditObj = new Array();
	omyTextEditObj = document.getElementsByClassName("mytextedit");
	console.log(omyTextEditObj.length);
	for(var ii = 0; ii < omyTextEditObj.length; ii++) {
		omyTextEditObj[ii].childNodes[1].onchange = function() {
			//console.log(document.getElementById(this.id).getAttribute("oldvalue"));
			console.log(this.type + "---" + this.getAttribute("oldvalue") + "|" + this.value + "---" + this.previousSibling.title);
			if(this.getAttribute("oldvalue") != this.value) { //做了修改
				this.previousSibling.style.color = "red";
				this.setAttribute("curvalue", "1");
			} else { //没做修改
				this.previousSibling.style.color = "";
				this.setAttribute("curvalue", "0");
			}
		}
	}
}

function functionMkConfigTable(name1, table1, name2, table2) {
	var oMkButtonObject = document.getElementById(name1);
	oMkButtonObject.onclick = function() {
		buttonStyle(name1,name2);
		document.getElementById(table1).style.display = "block";
		document.getElementById(table2).style.display = "none";
	}
	var oConfigButtonObject = document.getElementById(name2);
	oConfigButtonObject.onclick = function() {
		buttonStyle(name2,name1);
		document.getElementById(table2).style.display = "block";
		document.getElementById(table1).style.display = "none";
	}
}

function closeparentpage(pageName) {
	//pageName = #myAddModal\#myCopyModal\#myEditModal\#myMoreEditModal
	var oButtonObject = document.getElementById("myEditEnsureModalEnsure");
	oButtonObject.onclick = function() {
		document.getElementById("myAddCloseDiv").style.display = "none";
		if (pageName != 1) {
			console.log("pageName != 1");
			$(pageName).modal('hide');
		}else{
			console.log("pageName == 1");
		}
	}
}

/*刷新审核页面*/
function freshHtml(pageName) {
	var htmlObject = parent.document.getElementById(pageName);
	console.log("lxw " + htmlObject);
	if(htmlObject == null) {
		console.log("该页面没有被点击出来，不需要刷新");
	} else {
		console.log("lxw " + htmlObject.firstChild.src);
		htmlObject.firstChild.src = "review.html";
	}
}
document.getElementById("reset").onclick = waitReset;

function waitReset() {
	document.getElementById("chip").value = "";
	document.getElementById("model").value = "";
	document.getElementById("androidVersion").value = "";
	document.getElementById("chipid").value = "";
	document.getElementById("memory").value = "";
	startSelect();
}

function buttonStyle(name1, name2){
	document.getElementById(name1).style.color = "#333";
	document.getElementById(name1).style.backgroundColor = "#e6e6e6";
	document.getElementById(name1).style.borderColor = "#adadad";
	document.getElementById(name2).style.color = "#333";
	document.getElementById(name2).style.backgroundColor = "#fff";
	document.getElementById(name2).style.borderColor = "#ccc";
}

function disMiss(id){
	$(id).modal("toggle");
	$(".modal-backdrop").addClass("new-backdrop"); //去掉后面的阴影效果
}
function moreEditCommon(){
	//每次点击时先将ChipModelArray置为空
		ChipModelArray = [];
		var myCheckboxChecked = new Array();
		var myCheckedNumber = 0;
		myCheckboxChecked = document.getElementsByClassName("checkboxstatus");
		console.log("lxw:" + myCheckboxChecked.length);
		for(var i = 0; i < myCheckboxChecked.length; i++) {
			if($('.checkboxstatus')[i].checked == true) {
				myCheckedNumber++;
				var chipModelObj = {
					chip: "",
					model: ""
				};
				console.log("lxw " + $('.checkboxstatus')[i].getAttribute("chip") + "--" + $('.checkboxstatus')[i].getAttribute("model"));
				chipModelObj.chip = $('.checkboxstatus')[i].getAttribute("chip");
				chipModelObj.model = $('.checkboxstatus')[i].getAttribute("model");
				ChipModelArray.push(chipModelObj);
			}
		}
		console.log("lxw " + ChipModelArray + "--" + myCheckedNumber);
		if(myCheckedNumber != 0) {
			var thisIndex = null;
			$("#myMoreEditModalLabel").text("批量修改");
			$('#myMoreEditModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			buttonStyle("myMoreEditModalMkButton","myMoreEditModalConfigButton");
			sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', getMoreEditInfoOne);
		} else {
			$("#myDeleteDialogModalLabel").text("请注意：");
			$('#myDeleteDialogModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
}

function clearPageInfo(){
	document.getElementById("newAddChip").value = "";
	document.getElementById("newAddModel").value = "";
	document.getElementById("newAddDevice").value = "";
	document.getElementById("NewAddAndroidVersion").value = "";
	document.getElementById("newAddChipMode").value = "";
	document.getElementById("newAddMemory").value = "";
	document.getElementById("myAddModalMkTableApp").innerHTML = "";
	document.getElementById("myAddModalMkTableService").innerHTML = "";
	document.getElementById("myAddModalMkTableAppStore").innerHTML = "";
	document.getElementById("myAddModalMkTableHomePage").innerHTML = "";
	document.getElementById("myAddModalMkTableIME").innerHTML = "";
	document.getElementById("myAddModalMkTableSysApp").innerHTML = "";
	document.getElementById("myAddModalMkTableTV").innerHTML = "";
	document.getElementById("myAddModalMkTableOther").innerHTML = "";
}

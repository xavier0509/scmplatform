document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function() {
	forsession();
})
var adminFlag = null;
var loginusername = null;

var TwiceTransferChip = null;
var TwiceTransferModel = null;

function forsession() {
	sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
}

function sessionresult() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
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
		node = '{"data":{"condition":{},"options":{}}}';
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
		console.log("lxw --->" + JSON.stringify(myNeedObj));
		var myNeedString = JSON.stringify(myNeedObj);
		node = '{"data":{"condition":' + myNeedString + '},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1}}';
	}
	console.log("lxw " + node);
	sendHTTPRequest("/fyb_api/productRegexQuery", node, searchResource);
}

function searchResource() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var title = document.getElementById("wait-tablebody"); //获取tbody的表格内容
			for(var i = title.childNodes.length - 1; i > 0; i--) {
				title.removeChild(title.childNodes[i]); //删除掉每个子节点的内容
			};
			var data = JSON.parse(this.responseText);
			var msg = data.msg;
			if(msg == "success") {
				var mySearchData = data.data;
				console.log(mySearchData);
				for(var j = 0; j < mySearchData.length; j++) {
					if(mySearchData[j].gerritState == "0"){
						_row = document.getElementById("wait-tablebody").insertRow(0);
						var _cell0 = _row.insertCell(0);
						_cell0.innerHTML = "<input type='checkbox' class='checkboxstatus' value=''>";
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
			} else {
				//查询失败
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
		sendHTTPRequest("/fyb_api/moduleQuery", '{"data":""}', getAddInfoInfOne);
	}

	/*批量修改*/
	var oButtonEdit = document.getElementById("wait-change");
	oButtonEdit.onclick = function() {
			/*需要添加前提条件，点击多项删除时需选中至少一项 wait-tablebody*/
			var myCheckboxChecked = new Array();
			var myCheckedNumber = 0;
			myCheckboxChecked = document.getElementsByClassName("checkboxstatus");
			console.log("lxw:" + myCheckboxChecked.length);
			for(var i = 0; i < myCheckboxChecked.length; i++) {
				if($('.checkboxstatus')[i].checked == true) {
					myCheckedNumber++;
				}
			}
			console.log("lxw:" + myCheckedNumber);
			if(myCheckedNumber != 0) {
				var thisIndex = null;
				$("#myMoreEditModalLabel").text("批量修改");
				$('#myMoreEditModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				//myCloseEnsure("#myMoreEditModal","#wait-change",thisIndex);
			} else {
				$("#myDeleteDialogModalLabel").text("请注意：");
				$('#myDeleteDialogModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
			}
			moreEditPageButtons(); //后期可能会传参给页面里的点击事件
		}
	/*点击批量修改-弹框里的各个按钮*/
	function moreEditPageButtons() {
		var oButtonEditEnsure = document.getElementById("myMoreEditModalSubmit");
		oButtonEditEnsure.onclick = function() {
			console.log("批量修改页-提交按钮一");
			$('#myMoreEditSubmitModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		var oButtonEditEnsure = document.getElementById("myMoreEditModalSubmitTwo");
		oButtonEditEnsure.onclick = function() {
			console.log("批量修改页-提交按钮二");
			$('#myMoreEditSubmitModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		var oButtonEditEnsure = document.getElementById("myMoreEditModalClose");
		oButtonEditEnsure.onclick = function() {
			console.log("批量修改页-关闭按钮");
			$('#myEditEnsureModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			closeparentpage("#myMoreEditModal");
		}
		var oButtonEditEnsure = document.getElementById("MoreEditSaveSubmit");
		oButtonEditEnsure.onclick = function() {
				console.log("批量修改页-提交确认按钮");
				$("#myMoreEditModal").modal('hide');
				$("#myMoreEditSubmitModal").modal('hide');
			}
			//批量修改页mk-config button的点击
		functionMkConfigTable("myMoreEditModalMkButton", "myMoreEditModalMkTable", "myMoreEditModalConfigButton", "myMoreEditModalConfigTable");

		/*批量修改页-单项*/
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
				console.log("lxw--oAFlagStatus[" + this.index + "] = " + oAFlagStatus[this.index]);
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

				AddOrDelButtonFunction(this.index);
			}

		}
		/*批量删除或新增的点击*/
		function AddOrDelButtonFunction(number) {
			console.log("lxw" + "in AddOrDelButtonFunction" + number);
			omybuttonAddstyle[number].onclick = function() {
				console.log("lxw" + "批量新增的点击" + number);
				omybuttonAddstyle[number].style.color = "red";
				omybuttonDelstyle[number].style.color = "";
			}
			omybuttonDelstyle[number].onclick = function() {
					console.log("lxw" + "批量删除的点击" + number);
					omybuttonDelstyle[number].style.color = "red";
					omybuttonAddstyle[number].style.color = "";
				}
				/*执行保存按钮的动作*/
		}
	}

	/*多项删除*/
	var oButtonDelete = document.getElementById("wait-delete");
	oButtonDelete.onclick = function() {
			console.log("in delete");
			var currentParentName = oButtonDelete.id;
			/*需要添加前提条件，点击多项删除时需选中至少一项 wait-tablebody*/
			var myCheckboxChecked = new Array();
			var myCheckedNumber = 0;
			var myDeleArray = new Array();
			myCheckboxChecked = document.getElementsByClassName("checkboxstatus");
			console.log("lxw:" + myCheckboxChecked.length);
			for(var i = 0; i < myCheckboxChecked.length; i++) {
				if($('.checkboxstatus')[i].checked == true) {
					myCheckedNumber++;
					myDeleArray.push(i);
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
			$("#myMoreDeleteModal").modal('hide');
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
			sendHTTPRequest("/fyb_api/moduleQuery", '{"data":""}', getEditInfoInfOne);
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
			console.log("lxw " + TwiceTransferChip + "--" + TwiceTransferModel);
			$("#myDeleteModalLabel").text("删除");
			$('#myDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			
			singleDeletePageButtons(TwiceTransferChip,TwiceTransferModel); //后期可能会传参给页面里的点击事件
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
			sendHTTPRequest("/fyb_api/moduleQuery", '{"data":""}', getCopyInfoInfOne);
		}
	}
}
//新增-获取后台接口数据，动态加载新增页面
function getAddInfoInfOne() {
	console.log("lxw " + "getAddInfoInfOne");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data);
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
					console.log("App:" + kk);
					_rowAddPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					console.log("Service:" + kk);
					_rowAddPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					console.log("AppStore:" + kk);
					_rowAddPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					console.log("HomePage:" + kk);
					_rowAddPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					console.log("IME:" + kk);
					_rowAddPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					console.log("SysApp:" + kk);
					_rowAddPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					console.log("TV:" + kk);
					_rowAddPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					console.log("Other:" + kk);
					_rowAddPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk].engName + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fyb_api/configQuery", '{"data":""}', getAddInfoInfTwo);
	}
}

function getAddInfoInfTwo() {
	console.log("lxw " + "getAddInfoInfTwo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowAddPageConfigMain = document.getElementById("myAddModalConfigTableTdOne");
			var _rowAddPageConfigOther = document.getElementById("myAddModalConfigTableTdTwo");
			_rowAddPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowAddPageConfigOther.innerHTML = "<div title='other'>其他功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category + data.data[i].type);
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigMain.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='****'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowAddPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='11111'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowAddPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		addPageButtons(); //后期可能会传参给页面里的点击事件
	}
}

function addPageSubmitData() {
	console.log("lxw "+loginusername+"--"+adminFlag);
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
	var addConfigFile = [];
	var oAconfigTrlength = $("#myAddModalConfigTableTbody").find("tr");
	console.log("lxw " + oAconfigTrlength.length);
	for(var i = 0; i < oAconfigTrlength.length; i++) {
		var oAConfigobj = {};
		var thisConfigindex = null;
		oAconfigTrDiv = $("#myAddModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		//console.log("lxw" +oAconfigTrDiv.length);
		for(var j = 1; j < oAconfigTrDiv.length; j++) {
			var oAopt = [];
			var oAstuInfo = {
				"cnName": "",
				"engName": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oAstuInfo.category = oAconfigTrDiv[0].title;
			oAstuInfo.cnName = oAconfigTrDiv[thisConfigindex].childNodes[0].title;
			oAstuInfo.engName = oAconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
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
			addConfigFile.push(oAstuInfo);
		}
	}
	console.log("lxw " + JSON.stringify(addConfigFile));

	//获取mkFile里的信息
	var addMkFile = [];
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
				addMkFile.push(oAstuInfoTwo);
				console.log("lxw " + JSON.stringify(oAstuInfoTwo));
			}
		}
	}
	console.log("lxw " + JSON.stringify(addMkFile));
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

	console.log("lxw" + JSON.stringify(dataObj));
	var oAnode = '{"data":' + JSON.stringify(dataObj) + '}';
	sendHTTPRequest("/fyb_api/productAdd", oAnode, productAddresult);
}

function productAddresult() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "添加成功");
				freshHtml("tab_userMenu2");
				//var oooNode = '{"data":{"gerritState":"1"}}';
				//sendHTTPRequest("/fyb_api/productRegexQuery", oooNode, searchResource);
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
			};
		};
	}
}

//单项编辑-获取后台接口数据，动态加载单项编辑页面
function getEditInfoInfOne() {
	console.log("lxw " + "getEditInfoInfOne");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data);
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
					console.log("App:" + kk);
					_rowEditPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					console.log("Service:" + kk);
					_rowEditPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					console.log("AppStore:" + kk);
					_rowEditPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					console.log("HomePage:" + kk);
					_rowEditPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					console.log("IME:" + kk);
					_rowEditPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					console.log("SysApp:" + kk);
					_rowEditPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					console.log("TV:" + kk);
					_rowEditPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					console.log("Other:" + kk);
					_rowEditPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fyb_api/configQuery", '{"data":""}', getEditInfoInfTwo);
	}
}

function getEditInfoInfTwo() {
	console.log("lxw " + "searchConfigInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowEditPageConfigMain = document.getElementById("myEditModalConfigTableTdOne");
			var _rowEditPageConfigOther = document.getElementById("myEditModalConfigTableTdTwo");
			_rowEditPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowEditPageConfigOther.innerHTML = "<div title='other'>其他功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category + data.data[i].type);
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowEditPageConfigMain.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='****'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowEditPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowEditPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='****'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowEditPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		var node = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"option":{}}}';
		sendHTTPRequest("/fyb_api/productQuery", node, getEditInforesult);
	}
}

function getEditInforesult() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "访问成功");
				console.log("lxw " + JSON.stringify(data.data[0]));
				document.getElementById("newEditChip").value = data.data[0].chip;
				document.getElementById("newEditModel").value = data.data[0].model;
				document.getElementById("NewEditAndroidVersion").value = data.data[0].androidVersion;
				document.getElementById("newEditChipMode").value = data.data[0].chipModel;
				document.getElementById("newEditMemory").value = data.data[0].memorySize;
				document.getElementById("newEditDevice").value = data.data[0].targetProduct;

				console.log("lxw " + data.data[0].mkFile.length); //mk
				for(var i = 0; i < data.data[0].mkFile.length; i++) {
					console.log("lxw " + data.data[0].mkFile[i].engName);
					//document.getElementById(data.data[0].mkFile[i].engName).checked = true;
					document.getElementById(data.data[0].mkFile[i].engName).setAttribute('checked', '');
				}
				console.log("lxw " + data.data[0].configFile.length); //config
				for(var i = 0; i < data.data[0].configFile.length; i++) {
					console.log("lxw " + data.data[0].configFile[i].engName);
					//document.getElementById(data.data[0].mkFile[i].engName).checked = true;
					document.getElementById(data.data[0].configFile[i].engName).setAttribute('value', data.data[0].configFile[i].value);
				}
			} else if(data.msg == "failure") {
				console.log("lxw " + "访问失败");
			}
		};
		editPageButtonsOnclick();
	}
}

function editPageSubmitData() {
	console.log("lxw "+loginusername+"--"+adminFlag);
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
	var editConfigFile = [];
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
				"cnName": "",
				"engName": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oEstuInfo.category = oEconfigTrDiv[0].title;
			oEstuInfo.cnName = oEconfigTrDiv[thisConfigindex].childNodes[0].title;
			oEstuInfo.engName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			console.log("lxw" + oEstuInfo.engName);
			oEstuInfo.type = oEconfigTrDiv[thisConfigindex].childNodes[1].name;
			oEstuInfo.value = oEconfigTrDiv[thisConfigindex].childNodes[1].value;
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
			editConfigFile.push(oEstuInfo);
		}
	}
	//获取mkFile里的信息
	var editMkFile = [];
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
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				oEstuInfoTwo.category = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("category");
				oEstuInfoTwo.cnName = oEMkTrDivTwo[oEMkindex].childNodes[1].innerHTML;
				oEstuInfoTwo.engName = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("name");
				oEstuInfoTwo.gitPath = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("gitPath");
				editMkFile.push(oEstuInfoTwo);
				console.log("lxw " + JSON.stringify(oEstuInfoTwo));
			}
		}
	}
	console.log("lxw " + JSON.stringify(editConfigFile));
	console.log("lxw " + JSON.stringify(editMkFile));
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
	dataObj.desc = "enenen";
	//console.log("lxw" + JSON.stringify(dataObj));
	var oEnode = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"action":"set","update":{"memorySize":"'+oEmemorySize+'","chipModel":"'+oEchipModel+'","androidVersion":"'+oEandroidVersion+'","targetProduct":"'+oEtargetProduct+'","gerritState":"1","operateType":"3","androidVersion":"'+oEandroidVersion+'","mkFile":'+JSON.stringify(editMkFile)+',"configFile":'+JSON.stringify(editConfigFile)+'}}}';
	console.log("lxw " + oEnode);
	sendHTTPRequest("/fyb_api/productUpdate",oEnode,productEditresult);
}
function productEditresult(){
	console.log("lxw in productEditresult");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				freshHomeHtml();
				//var oooNode = '{"data":{"gerritState":"1"}}';
				//sendHTTPRequest("/fyb_api/productRegexQuery", oooNode, searchResource);
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
			};
		};
	}
}
//单项复制-获取后台接口数据，动态加载单项编辑页面
function getCopyInfoInfOne() {
	console.log("lxw " + "getCopyInfoInfOne");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data);
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
					console.log("App:" + kk);
					_rowCopyPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					console.log("Service:" + kk);
					_rowCopyPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					console.log("AppStore:" + kk);
					_rowCopyPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					console.log("HomePage:" + kk);
					_rowCopyPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					console.log("IME:" + kk);
					_rowCopyPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					console.log("SysApp:" + kk);
					_rowCopyPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					console.log("TV:" + kk);
					_rowCopyPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					console.log("Other:" + kk);
					_rowCopyPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' value='' id='" + data.data[kk].engName + "'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fyb_api/configQuery", '{"data":""}', getCopyInfoInfTwo);
	}
}

function getCopyInfoInfTwo() {
	console.log("lxw " + "getCopyInfoInfTwo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowCopyPageConfigMain = document.getElementById("myCopyModalConfigTableTdOne");
			var _rowCopyPageConfigOther = document.getElementById("myCopyModalConfigTableTdTwo");
			_rowCopyPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowCopyPageConfigOther.innerHTML = "<div title='other'>其他功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category + data.data[i].type);
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigMain.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='****'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowCopyPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowCopyPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='11111'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						console.log("lxw " + _myAddselect);
						_rowCopyPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
		};
		var node = '{"data":{"condition":{"chip":"' + TwiceTransferChip + '","model":"' + TwiceTransferModel + '"},"option":{}}}';
		sendHTTPRequest("/fyb_api/productQuery", node, getCopyInforesult);
	}
}

function getCopyInforesult() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		//console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "访问成功");
				console.log("lxw " + JSON.stringify(data.data[0]));
				document.getElementById("newCopyChip").value = data.data[0].chip;
				document.getElementById("newCopyModel").value = data.data[0].model;
				document.getElementById("NewCopyAndroidVersion").value = data.data[0].androidVersion;
				document.getElementById("newCopyChipMode").value = data.data[0].chipModel;
				document.getElementById("newCopyMemory").value = data.data[0].memorySize;
				document.getElementById("newCopyDevice").value = data.data[0].targetProduct;

				console.log("lxw " + data.data[0].mkFile.length); //mk
				for(var i = 0; i < data.data[0].mkFile.length; i++) {
					console.log("lxw " + data.data[0].mkFile[i].engName);
					//document.getElementById(data.data[0].mkFile[i].engName).checked = true;
					document.getElementById(data.data[0].mkFile[i].engName).setAttribute('checked', '');
					console.log("lxw "+document.getElementById(data.data[0].mkFile[i].engName).checked);
				}
				console.log("lxw " + data.data[0].configFile.length); //config
				for(var i = 0; i < data.data[0].configFile.length; i++) {
					console.log("lxw " + data.data[0].configFile[i].engName);
					document.getElementById(data.data[0].configFile[i].engName).setAttribute('value', data.data[0].configFile[i].value);
				}
			} else if(data.msg == "failure") {
				console.log("lxw " + "访问失败");
			}
		};
		copyPageButtons();
	}
}

function copyPageSubmitData(){
	console.log("lxw "+loginusername+"--"+adminFlag);
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
	var copyConfigFile = [];
	var oCconfigTrlength = $("#myCopyModalConfigTableTbody").find("tr");
	console.log("lxw " + oCconfigTrlength.length);
	for(var i = 0; i < oCconfigTrlength.length; i++) {
		var oCConfigobj = {};
		var thisConfigindex = null;
		oCconfigTrDiv = $("#myCopyModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oCconfigTrDiv.length);
		for(var j = 1; j < oCconfigTrDiv.length; j++) {
			var oCopt = [];
			var oCstuInfo = {
				"cnName": "",
				"engName": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oCstuInfo.category = oCconfigTrDiv[0].title;
			oCstuInfo.cnName = oCconfigTrDiv[thisConfigindex].childNodes[0].title;
			oCstuInfo.engName = oCconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			console.log("lxw" + oCstuInfo.engName);
			oCstuInfo.type = oCconfigTrDiv[thisConfigindex].childNodes[1].name;
			oCstuInfo.value = oCconfigTrDiv[thisConfigindex].childNodes[1].value;
			if(oCstuInfo.type == "string") {
				oCopt = [];
			} else if(oCstuInfo.type == "enum") {
				var jjlength = oCconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
				console.log("lxw " + jjlength.length);
				for(var jj = 0; jj < jjlength.length; jj++) {
					var optValue = jjlength[jj].value;
					oCopt.push(optValue);
				}
			}
			oCstuInfo.options = oCopt;
			copyConfigFile.push(oCstuInfo);
		}
	}
	console.log("lxw " + JSON.stringify(copyConfigFile));

	//获取mkFile里的信息
	var copyMkFile = [];
	var oCMkTrDiv = $("#myCopyModalMkTableTbody").find("tr");
	console.log("lxw " + oCMkTrDiv.length);
	var oCMkindex = null;
	for(var i = 0; i < oCMkTrDiv.length; i++) {
		var oCMkobj = {};
		oCMkTrDivTwo = $("#myCopyModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oCMkTrDivTwo.length);
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
				copyMkFile.push(oCstuInfoTwo);
				console.log("lxw " + JSON.stringify(oCstuInfoTwo));
			}
		}
	}
	console.log("lxw " + JSON.stringify(copyMkFile));
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

	console.log("lxw" + JSON.stringify(dataObj));
	var oCnode = '{"data":' + JSON.stringify(dataObj) + '}';
	console.log("lxw " + oCnode);
	sendHTTPRequest("/fyb_api/productAdd", oCnode, productAddresult);
}


/*点击新增-弹框里的各个按钮*/
function addPageButtons() {
	var oButtonEditEnsure = document.getElementById("myAddModalSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("新增页-提交按钮一");
		addPageSubmitData();
		$("#myAddModal").modal('hide');
	}
	var oButtonEditEnsure = document.getElementById("myAddModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("新增页-提交按钮二");
		addPageSubmitData();
		$("#myAddModal").modal('hide');
	}
	var oButtonAdd = document.getElementById("myAddModalClose");
	oButtonAdd.onclick = function() {
			console.log("新增页-关闭按钮");
			$('#myEditEnsureModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
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
		copyPageSubmitData();
		$("#myCopyModal").modal('hide');
	}
	var oButtonEditEnsure = document.getElementById("myCopyModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("单项复制页-提交按钮二");
		copyPageSubmitData();
		$("#myCopyModal").modal('hide');
	}
	var oButtonAdd = document.getElementById("myCopyModalClose");
	oButtonAdd.onclick = function() {
			console.log("单项复制页-关闭按钮");
			$('#myEditEnsureModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
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
		editPageSubmitData();
		$("#myEditModal").modal('hide');
	}
	var oButtonEditEnsure = document.getElementById("myEditModalSubmitTwo");
	oButtonEditEnsure.onclick = function() {
		console.log("单项编辑页-提交按钮二");
		editPageSubmitData();
		$("#myEditModal").modal('hide');
	}
	var oButtonAdd = document.getElementById("myEditModalClose");
	oButtonAdd.onclick = function() {
			console.log("单项编辑页-关闭按钮");
			$('#myEditEnsureModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			//传参-关闭父页  
			closeparentpage("#myEditModal");
		}
		//编辑页mk-config button的点击
	functionMkConfigTable("myEditModalMkButton", "myEditModalMkTable", "myEditModalConfigButton", "myEditModalConfigTable");
}
/*点击单项删除-弹框里的各个按钮*/
function singleDeletePageButtons(olchip,olmode) {
	var oButtonEditEnsure = document.getElementById("myDeleteModalEnsure");
	oButtonEditEnsure.onclick = function() {
		console.log("单项删除页-确认按钮");
		console.log("lxw "+ olchip+"--"+olmode);
		var ooEnode = '{"data":{"condition":{"chip":"' + olchip + '","model":"' + olmode + '"},"action":"set","update":{"gerritState":"1","operateType":"2"}}}';
		console.log("lxw " + ooEnode);
		sendHTTPRequest("/fyb_api/productUpdate",ooEnode,productEditresult);
		$("#myDeleteModal").modal('hide');
	}
}

function functionMkConfigTable(name1, table1, name2, table2) {
	var oMkButtonObject = document.getElementById(name1);
	oMkButtonObject.onclick = function() {
		document.getElementById(table1).style.display = "block";
		document.getElementById(table2).style.display = "none";
	}
	var oConfigButtonObject = document.getElementById(name2);
	oConfigButtonObject.onclick = function() {
		document.getElementById(table2).style.display = "block";
		document.getElementById(table1).style.display = "none";
	}
}

function closeparentpage(pageName) {
	var oButtonObject = document.getElementById("myEditEnsureModalEnsure");
	oButtonObject.onclick = function() {
		$(pageName).modal('hide');
		$("#myEditEnsureModal").modal('hide');
	}
}

/*刷新审核页面*/
function freshHtml(pageName) {
	var htmlObject = parent.document.getElementById(pageName);
	console.log("lxw "+ htmlObject);
	if (htmlObject == null) {
		console.log("该页面没有被点击出来，不需要刷新");
	} else{
		console.log("lxw " + htmlObject.firstChild.src);
		htmlObject.firstChild.src = "review.html";
	}
}
/*刷新当前页面*/
function freshHomeHtml() {
	var htmlObject = parent.document.getElementById("");
	var htmlObjectTwo = document.getElementById("");
	console.log("lxw "+ htmlObject+"--"+htmlObjectTwo);
//	if (htmlObject == null) {
//		console.log("该页面没有被点击出来，不需要刷新");
//	} else{
//		console.log("lxw " + htmlObject.firstChild.src);
//		htmlObject.firstChild.src = "review.html";
//	}
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function() {
	forsession();
})

function forsession() {
	sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
}

function sessionresult() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
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
		node = '{"data":{"condition":{},"option":{}}}';
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
		node = '{"data":' + myNeedString + '}';
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
					_cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default eachedit'>编辑</button><button type='button' class='btn btn-default eachdelete'>删除</button><button type='button' class='btn btn-default eachcopy'>复制</button></div>";
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
		//getAddInfoInterface(); //点击新增时，获取后台的数据，生成新增页
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
			$("#myEditModalLabel").text("单项编辑");
			$('#myEditModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
			getEditInfoInterface(thisIndex); //获取点击单项编辑时，获取后台的数据，生成单项编辑页
			editPageButtonsOnclick(thisIndex);
		}
	}
	/*点击单项编辑-弹框里的各个按钮*/
	function editPageButtonsOnclick(index) {
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

	/*单项删除*/
	var oClassButtonDelete = new Array();
	oClassButtonDelete = document.getElementsByClassName("eachdelete");
	for(var i = 0; i < oClassButtonDelete.length; i++) {
		oClassButtonDelete[i].index = i;
		oClassButtonDelete[i].onclick = function() {
			console.log("in delete");
			$("#myDeleteModalLabel").text("删除");
			$('#myDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		singleDeletePageButtons(this.index); //后期可能会传参给页面里的点击事件
	}
	/*点击单项删除-弹框里的各个按钮*/
	function singleDeletePageButtons(index) {
		var oButtonEditEnsure = document.getElementById("myDeleteModalEnsure");
		oButtonEditEnsure.onclick = function() {
			console.log("单项删除页-确认按钮");
			$("#myDeleteModal").modal('hide');
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
			$("#myCopyModalLabel").text("单项复制");
			$('#myCopyModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			getCopyInfoInterface(thisIndex); //获取点击单项复制时，获取后台的数据，生成单项复制页
			copyPageButtons(thisIndex); //后期可能会传参给页面里的点击事件
		}
	}
	/*点击单项复制-弹框里的各个按钮*/
	function copyPageButtons(index) {
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
}
//新增-获取后台接口数据，动态加载新增页面
function getAddInfoInfOne() {
	console.log("lxw " + "getAddInfoInfOne");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
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
			_rowAddPageApp.innerHTML = "<div>App:</div>";
			_rowAddPageService.innerHTML = "<div>Service:</div>";
			_rowAddPageAppStore.innerHTML = "<div>AppStore:</div>";
			_rowAddPageHomePage.innerHTML = "<div>HomePage:</div>";
			_rowAddPageIME.innerHTML = "<div>IME:</div>";
			_rowAddPageSysApp.innerHTML = "<div>SysApp:</div>";
			_rowAddPageTV.innerHTML = "<div>TV:</div>";
			_rowAddPageOther.innerHTML = "<div>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					console.log("App:" + kk);
					_rowAddPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					console.log("Service:" + kk);
					_rowAddPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					console.log("AppStore:" + kk);
					_rowAddPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					console.log("HomePage:" + kk);
					_rowAddPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					console.log("IME:" + kk);
					_rowAddPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					console.log("SysApp:" + kk);
					_rowAddPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					console.log("TV:" + kk);
					_rowAddPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					console.log("Other:" + kk);
					_rowAddPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' value=''><span name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
		};
		sendHTTPRequest("/fyb_api/configQuery", '{"data":""}', getAddInfoInfTwo);
	}
}

function getAddInfoInfTwo() {
	console.log("lxw " + "searchConfigInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowAddPageConfigMain = document.getElementById("myAddModalConfigTableTdOne");
			var _rowAddPageConfigOther = document.getElementById("myAddModalConfigTableTdTwo");
			_rowAddPageConfigMain.innerHTML = "<div>核心功能：</div>";
			_rowAddPageConfigOther.innerHTML = "<div>其他功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category + data.data[i].type);
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowAddPageConfigMain.innerHTML += "<div class='col-xs-6'><span title='" + data.data[kk].engName + "'>" + data.data[kk].cnName + " :</span><input type='text' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "' placeholder='****'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk].engName + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myfirstselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myfirstselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myfirstselect = "<div class='col-xs-6'><span title='name'>" + data.data[kk].cnName + " :</span>" + _myfirstselect + "</select></div>";
						console.log("lxw " + _myfirstselect);
						_rowAddPageConfigOther.innerHTML += _myfirstselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					_rowAddPageConfigOther.innerHTML += "<div class='col-xs-4'><a name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataTwo + "' style='display:none'></div>";
				}
			}
		};
		addPageButtons(); //后期可能会传参给页面里的点击事件
	}
}

function addDeviceInfoInput(data) {
	document.getElementById("newAddChip").value = data[0].platformModel;
	document.getElementById("newAddModel").value = data[0].productModel;
	document.getElementById("newAddDevice").value = data[0].chipModel;
	document.getElementById("NewAddAndroidVersion").value = data[0].androidVersion;
	document.getElementById("newAddMemory").value = data[0].memorySize;
	document.getElementById("newAddChipMode").value = data[0].pendingReview;
}

function addMkInfoInput(data) {
	var _myAddTableMKInsertInfo = "";
	var myAddTableMKInsert = document.getElementById("myAddModalMkTableTbody");
	myAddTableMKInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		_myAddTableMKInsertInfo = "<tr><td><div>" + key + "</div>";
		for(var j = 0; j < data[key].length; j++) {
			_myAddTableMKInsertInfo += "<div class='col-xs-3' title='" + data[key][j].pkgname + "'><input type='checkbox' value=''><span>" + data[key][j].name + "</span></div>";
			console.log("lxw " + _myAddTableMKInsertInfo);
		}
		_myAddTableMKInsertInfo += "</td></tr>";
		console.log("lxw " + counter);
		myAddTableMKInsert.innerHTML += _myAddTableMKInsertInfo;
	}
}

function addConfigInfoInput(data) {
	var _myAddTableConfigInsertInfo = "";
	var myAddTableMConfigInsert = document.getElementById("myAddModalConfigTableTbody");
	myAddTableMConfigInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		if(key == "main") {
			_myAddTableConfigInsertInfo = "<tr><td><div title='" + key + "'>核心功能</div>";
		} else if(key == "other") {
			_myAddTableConfigInsertInfo = "<tr><td><div title='" + key + "'>其他功能</div>";
		}

		for(var j = 0; j < data[key].length; j++) {
			console.log("lxw " + data[key][j].name);
			console.log("lxw " + data[key][j].type);
			if(data[key][j].type == "input") {
				_myAddTableConfigInsertInfo += "<div class='col-xs-6'><span title='" + data[key][j].pkgname + "'>" + data[key][j].name + " :</span><input type='text' name='" + data[key][j].type + "' value='" + data[key][j].value + "' placeholder='****'></div>";
			} else if(data[key][j].type == "select") {
				var _myfirstselect = "<select id='" + data[key][j].pkgname + "' name='" + data[key][j].type + "'>";
				console.log("lxw " + data[key][j].options.length);
				for(var k = 0; k < data[key][j].options.length; k++) {
					if(data[key][j].options[k] == data[key][j].value) {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'selected>" + data[key][j].options[k] + "</option>";
					} else {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'>" + data[key][j].options[k] + "</option>";
					}
				}
				_myfirstselect = "<div class='col-xs-6'><span title='name'>" + data[key][j].name + " :</span>" + _myfirstselect + "</select></div>";
				console.log("lxw " + _myfirstselect);
				_myAddTableConfigInsertInfo += _myfirstselect;
			}
		}
		_myAddTableConfigInsertInfo += "</td></tr>";
		myAddTableMConfigInsert.innerHTML += _myAddTableConfigInsertInfo;
	}
}

function addPageSubmitData() {
	var data, devInfoData = null;
	devInfoData = {
		"platformModel": document.getElementById("newAddChip").value,
		"productModel": document.getElementById("newAddModel").value,
		"androidVersion": document.getElementById("newAddDevice").value,
		"chipModel": document.getElementById("NewAddAndroidVersion").value,
		"memorySize": document.getElementById("newAddMemory").value,
		"pendingReview": document.getElementById("newAddChipMode").value
	};
	var mkFileData = {};
	var mkTrlength = document.getElementById("myAddModalMkTableTbody").childNodes;
	console.log("lxw " + mkTrlength.length);
	var thisMkindex = null;
	var mkTrTdDiv = new Array();
	for(var i = 0; i < mkTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		mkTrTdDiv = $("#myAddModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < mkTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"state": "",
				"pkgname": ""
			};
			thisMkindex = j;
			if(j == 0) {
				console.log(mkTrTdDiv[thisMkindex].innerHTML);
				innerHtml = mkTrTdDiv[thisMkindex].innerHTML;
			} else {
				stuInfo.name = mkTrTdDiv[thisMkindex].childNodes[1].innerHTML;
				stuInfo.pkgname = mkTrTdDiv[thisMkindex].title;
				if(mkTrTdDiv[thisMkindex].childNodes[0].checked) {
					stuInfo.state = "1";
				} else {
					stuInfo.state = "0";
				}
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		mkFileData[innerHtml] = arrayInfo;
		console.log(mkFileData);
	}

	var configFileData = {};
	var configTrlength = document.getElementById("myAddModalConfigTableTbody").childNodes;
	console.log("lxw " + configTrlength.length);
	var thisConfigindex = null;
	var configTrTdDiv = new Array();
	for(var i = 0; i < configTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		configTrTdDiv = $("#myAddModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < configTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"type": "",
				"value": ""
			};
			thisConfigindex = j;
			if(j == 0) {
				console.log(configTrTdDiv[thisConfigindex].name);
				innerHtml = configTrTdDiv[thisConfigindex].title;
			} else {
				stuInfo.name = configTrTdDiv[thisConfigindex].childNodes[0].innerHTML;
				stuInfo.type = configTrTdDiv[thisConfigindex].childNodes[1].name;
				stuInfo.value = configTrTdDiv[thisConfigindex].childNodes[1].value;
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		configFileData[innerHtml] = arrayInfo;
		console.log(configFileData);
	}

	data = {
		"DevInfo": [devInfoData], //参数：{"platformModel": "","productModel": ""}
		"mkFile": mkFileData, //参数：{"App": [{"name": "酷开商城","pkgname": "SkyCCMall"},{"name": "搜狗语音","pkgname": "SkyVoice"}]}
		"configFile": configFileData //参数：{"main": [{"name": "屏幕","value":"","options":[]},{"name": "升级包","value":"","options":[]}]};
	};
	console.log(data);
}
//单项编辑-获取后台接口数据，动态加载单项编辑页面
function getEditInfoInterface(index) {
	var myData = {
		"msg": "success",
		"code": "1",
		"data": {
			"DevInfo": [{
				"platformModel": "chip001",
				"productModel": "model001",
				"androidVersion": "5.0.5",
				"chipModel": "14A55",
				"memorySize": "5G",
				"pendingReview": "芯片型号"
			}],
			"mkFile": {
				"App": [{
					"name": "酷开商城",
					"state": "1",
					"pkgname": "SkyCCMall"
				}, {
					"name": "教育中心",
					"state": "0",
					"pkgname": "SkyEDU"
				}, {
					"name": "电子说明书",
					"state": "0",
					"pkgname": "SkyManual"
				}, {
					"name": "影视中心",
					"state": "1",
					"pkgname": "SkyMovie"
				}, {
					"name": "二维码",
					"state": "1",
					"pkgname": "SkyQrcode"
				}, {
					"name": "远程服务",
					"state": "1",
					"pkgname": "SkyTVAgent"
				}, {
					"name": "亲友圈",
					"state": "1",
					"pkgname": "SkyTVQQ"
				}, {
					"name": "酷开用户",
					"state": "1",
					"pkgname": "SkyUser"
				}, {
					"name": "天气",
					"state": "1",
					"pkgname": "SkyWeather"
				}, {
					"name": "智慧家庭",
					"state": "1",
					"pkgname": "SkyCCMall"
				}, {
					"name": "搜狗语音",
					"state": "1",
					"pkgname": "SkyVoice"
				}],
				"AppStore": [{
					"name": "应用圈",
					"state": "1",
					"pkgname": "SkyAppStore"
				}, {
					"name": "应用圈OEM版本",
					"state": "0",
					"pkgname": "SkyAppStore_OEM"
				}, {
					"name": "应用圈海外版本",
					"state": "0",
					"pkgname": "SkyAppStore_Oversea"
				}, {
					"name": "应用圈外包版本",
					"state": "1",
					"pkgname": "SkyAppStore_PE"
				}, {
					"name": "运营大厅",
					"state": "1",
					"pkgname": "SkyHall"
				}, {
					"name": "Opera浏览器",
					"state": "1",
					"pkgname": "OperaStore"
				}],
				"HomePage": [{
					"name": "简易首页4.4",
					"state": "1",
					"pkgname": "SimpleHome5+.0"
				}, {
					"name": "简易首页5.0",
					"state": "0",
					"pkgname": "SimpleHomepage"
				}, {
					"name": "简易首页OEM",
					"state": "0",
					"pkgname": "SimpleHomepage_OEM"
				}, {
					"name": "常规首页",
					"state": "1",
					"pkgname": "SkyHomeShell"
				}, {
					"name": "海外首页",
					"state": "1",
					"pkgname": "SkyOverseaHomepage"
				}, {
					"name": "松下首页",
					"state": "1",
					"pkgname": "SkyPanasonicHome"
				}],
				"IME": [{
					"name": "Android输入法",
					"state": "1",
					"pkgname": "AndroidKeyboard"
				}, {
					"name": "酷开系统输入法",
					"state": "0",
					"pkgname": "SkyTianciIME"
				}, {
					"name": "搜狗输入法",
					"state": "0",
					"pkgname": "SogouIME"
				}],
				"Service": [{
					"name": "广告服务",
					"state": "1",
					"pkgname": "SkyADService"
				}, {
					"name": "设备服务",
					"state": "0",
					"pkgname": "SkyDEService"
				}, {
					"name": "数据采集服务",
					"state": "0",
					"pkgname": "SkyDataService"
				}, {
					"name": "通讯服务",
					"state": "0",
					"pkgname": "SkyIPCService"
				}, {
					"name": "推送服务",
					"state": "0",
					"pkgname": "SkyPushService"
				}, {
					"name": "智慧启动",
					"state": "0",
					"pkgname": "SkySSService"
				}, {
					"name": "系统服务",
					"state": "0",
					"pkgname": "SkySystemService"
				}]
			},
			"configFile": {
				"main": [{
					"name": "屏幕",
					"type": "input",
					"pkgname": "PANEL",
					"value": "FHD|3D",
					"options": []
				}, {
					"name": "网络",
					"type": "input",
					"pkgname": "NETWORK",
					"value": "WIFI",
					"options": []
				}, {
					"name": "通道",
					"type": "input",
					"pkgname": "Source",
					"value": "ATV",
					"options": []
				}, {
					"name": "蓝牙遥控",
					"type": "select",
					"pkgname": "BleRemote",
					"value": "false",
					"options": ["false", "true"]
				}, {
					"name": "H.265解码",
					"type": "select",
					"pkgname": "H+.265",
					"value": "three",
					"options": ["one", "two", "three"]
				}, {
					"name": "打印等级",
					"type": "select",
					"pkgname": "Log_appender",
					"value": "2",
					"options": ["1", "2", "3", "4"]
				}, {
					"name": "升级包路径",
					"type": "input",
					"pkgname": "Ota_path",
					"value": "COM.COOCAA",
					"options": []
				}],
				"other": [{
					"name": "HDMI延时",
					"type": "input",
					"pkgname": "HDMIDelay",
					"value": "xxxx",
					"options": []
				}, {
					"name": "信源自切换",
					"type": "select",
					"pkgname": "SourceSwitch",
					"value": "false",
					"options": ["true", "false"]
				}, {
					"name": "数字通道字幕",
					"type": "select",
					"pkgname": "DTVSubTitle",
					"value": "hanyu",
					"options": ["english", "chinese", "hanyu"]
				}, {
					"name": "DTV场景实现",
					"type": "input",
					"pkgname": "DTVView",
					"value": "fuck",
					"options": []
				}]
			}
		}
	};

	var key, counter = 0;
	for(key in myData.data) {
		if(key == "DevInfo") {
			editDeviceInfoInput(myData.data.DevInfo);
		} else if(key == "mkFile") {
			editMkInfoInput(myData.data.mkFile);
		} else if(key == "configFile") {
			editConfigInfoInput(myData.data.configFile);
		}
	}
}

function editDeviceInfoInput(data) {
	document.getElementById("newEditChip").value = data[0].platformModel;
	document.getElementById("newEditModel").value = data[0].productModel;
	document.getElementById("newEditDevice").value = data[0].chipModel;
	document.getElementById("NewEditAndroidVersion").value = data[0].androidVersion;
	document.getElementById("newEditMemory").value = data[0].memorySize;
	document.getElementById("newEditChipMode").value = data[0].pendingReview;

}

function editMkInfoInput(data) {
	var _myEditTableMKInsertInfo = "";
	var myEditTableMKInsert = document.getElementById("myEditModalMkTableTbody");
	myEditTableMKInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		_myEditTableMKInsertInfo = "<tr><td><div>" + key + ":</div>";
		for(var j = 0; j < data[key].length; j++) {
			_myEditTableMKInsertInfo += "<div class='col-xs-3'><input type='checkbox' value=''><span>" + data[key][j].name + "</span></div>";
			console.log("lxw " + _myEditTableMKInsertInfo);
		}
		_myEditTableMKInsertInfo += "</td></tr>";
		console.log("lxw " + counter);
		myEditTableMKInsert.innerHTML += _myEditTableMKInsertInfo;
	}
}

function editConfigInfoInput(data) {
	var _myEditTableConfigInsertInfo = "";
	var myEditTableMConfigInsert = document.getElementById("myEditModalConfigTableTbody");
	myEditTableMConfigInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		if(key == "main") {
			_myEditTableConfigInsertInfo = "<tr><td><div>核心功能:</div>";
		} else if(key == "other") {
			_myEditTableConfigInsertInfo = "<tr><td><div>其他功能:</div>";
		}

		for(var j = 0; j < data[key].length; j++) {
			console.log("lxw " + data[key][j].name);
			console.log("lxw " + data[key][j].type);
			if(data[key][j].type == "input") {
				_myEditTableConfigInsertInfo += "<div class='col-xs-6'><span title='name'>" + data[key][j].name + " :</span><input type='text' name='name' value='" + data[key][j].value + "' placeholder='****'></div>";
			} else if(data[key][j].type == "select") {
				var _myfirstselect = "<select id='" + data[key][j].pkgname + "'>";
				console.log("lxw " + data[key][j].options.length);
				for(var k = 0; k < data[key][j].options.length; k++) {
					if(data[key][j].options[k] == data[key][j].value) {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'selected>" + data[key][j].options[k] + "</option>";
					} else {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'>" + data[key][j].options[k] + "</option>";
					}

					//console.log("lxw "+ data[key][j].pkgname+"---"+data[key][j].value);
				}
				_myfirstselect = "<div class='col-xs-6'><span title='name'>" + data[key][j].name + " :</span>" + _myfirstselect + "</select></div>";
				console.log("lxw " + _myfirstselect);
				_myEditTableConfigInsertInfo += _myfirstselect;
			}
		}
		_myEditTableConfigInsertInfo += "</td></tr>";
		myEditTableMConfigInsert.innerHTML += _myEditTableConfigInsertInfo;
	}
}

function editPageSubmitData() {
	var data, devInfoData = null;
	devInfoData = {
		"platformModel": document.getElementById("newEditChip").value,
		"productModel": document.getElementById("newEditModel").value,
		"androidVersion": document.getElementById("newEditDevice").value,
		"chipModel": document.getElementById("NewEditAndroidVersion").value,
		"memorySize": document.getElementById("newEditMemory").value,
		"pendingReview": document.getElementById("newEditChipMode").value
	};
	var mkFileData = {};
	var mkTrlength = document.getElementById("myEditModalMkTableTbody").childNodes;
	console.log("lxw " + mkTrlength.length);
	var thisMkindex = null;
	var mkTrTdDiv = new Array();
	for(var i = 0; i < mkTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		mkTrTdDiv = $("#myEditModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < mkTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"state": "",
				"pkgname": ""
			};
			thisMkindex = j;
			if(j == 0) {
				console.log(mkTrTdDiv[thisMkindex].innerHTML);
				innerHtml = mkTrTdDiv[thisMkindex].innerHTML;
			} else {
				stuInfo.name = mkTrTdDiv[thisMkindex].childNodes[1].innerHTML;
				stuInfo.pkgname = mkTrTdDiv[thisMkindex].title;
				if(mkTrTdDiv[thisMkindex].childNodes[0].checked) {
					stuInfo.state = "1";
				} else {
					stuInfo.state = "0";
				}
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		mkFileData[innerHtml] = arrayInfo;
		console.log(mkFileData);
	}

	var configFileData = {};
	var configTrlength = document.getElementById("myEditModalConfigTableTbody").childNodes;
	console.log("lxw " + configTrlength.length);
	var thisConfigindex = null;
	var configTrTdDiv = new Array();
	for(var i = 0; i < configTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		configTrTdDiv = $("#myEditModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < configTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"type": "",
				"value": ""
			};
			thisConfigindex = j;
			if(j == 0) {
				console.log(configTrTdDiv[thisConfigindex].name);
				innerHtml = configTrTdDiv[thisConfigindex].title;
			} else {
				stuInfo.name = configTrTdDiv[thisConfigindex].childNodes[0].innerHTML;
				stuInfo.type = configTrTdDiv[thisConfigindex].childNodes[1].name;
				stuInfo.value = configTrTdDiv[thisConfigindex].childNodes[1].value;
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		configFileData[innerHtml] = arrayInfo;
		console.log(configFileData);
	}

	data = {
		"DevInfo": [devInfoData], //参数：{"platformModel": "","productModel": ""}
		"mkFile": mkFileData, //参数：{"App": [{"name": "酷开商城","pkgname": "SkyCCMall"},{"name": "搜狗语音","pkgname": "SkyVoice"}]}
		"configFile": configFileData //参数：{"main": [{"name": "屏幕","value":"","options":[]},{"name": "升级包","value":"","options":[]}]};
	};
	console.log(data);
}
//单项复制-获取后台接口数据，动态加载单项编辑页面
function getCopyInfoInterface(index) {
	var myData = {
		"msg": "success",
		"code": "1",
		"data": {
			"DevInfo": [{
				"platformModel": "chip001",
				"productModel": "model001",
				"androidVersion": "5.0.5",
				"chipModel": "14A55",
				"memorySize": "5G",
				"pendingReview": "芯片型号"
			}],
			"mkFile": {
				"App": [{
					"name": "酷开商城",
					"state": "1",
					"pkgname": "SkyCCMall"
				}, {
					"name": "教育中心",
					"state": "0",
					"pkgname": "SkyEDU"
				}, {
					"name": "电子说明书",
					"state": "0",
					"pkgname": "SkyManual"
				}, {
					"name": "影视中心",
					"state": "1",
					"pkgname": "SkyMovie"
				}, {
					"name": "二维码",
					"state": "1",
					"pkgname": "SkyQrcode"
				}, {
					"name": "远程服务",
					"state": "1",
					"pkgname": "SkyTVAgent"
				}, {
					"name": "亲友圈",
					"state": "1",
					"pkgname": "SkyTVQQ"
				}, {
					"name": "酷开用户",
					"state": "1",
					"pkgname": "SkyUser"
				}, {
					"name": "天气",
					"state": "1",
					"pkgname": "SkyWeather"
				}, {
					"name": "智慧家庭",
					"state": "1",
					"pkgname": "SkyCCMall"
				}, {
					"name": "搜狗语音",
					"state": "1",
					"pkgname": "SkyVoice"
				}],
				"AppStore": [{
					"name": "应用圈",
					"state": "1",
					"pkgname": "SkyAppStore"
				}, {
					"name": "应用圈OEM版本",
					"state": "0",
					"pkgname": "SkyAppStore_OEM"
				}, {
					"name": "应用圈海外版本",
					"state": "0",
					"pkgname": "SkyAppStore_Oversea"
				}, {
					"name": "应用圈外包版本",
					"state": "1",
					"pkgname": "SkyAppStore_PE"
				}, {
					"name": "运营大厅",
					"state": "1",
					"pkgname": "SkyHall"
				}, {
					"name": "Opera浏览器",
					"state": "1",
					"pkgname": "OperaStore"
				}],
				"HomePage": [{
					"name": "简易首页4.4",
					"state": "1",
					"pkgname": "SimpleHome5+.0"
				}, {
					"name": "简易首页5.0",
					"state": "0",
					"pkgname": "SimpleHomepage"
				}, {
					"name": "简易首页OEM",
					"state": "0",
					"pkgname": "SimpleHomepage_OEM"
				}, {
					"name": "常规首页",
					"state": "1",
					"pkgname": "SkyHomeShell"
				}, {
					"name": "海外首页",
					"state": "1",
					"pkgname": "SkyOverseaHomepage"
				}, {
					"name": "松下首页",
					"state": "1",
					"pkgname": "SkyPanasonicHome"
				}],
				"IME": [{
					"name": "Android输入法",
					"state": "1",
					"pkgname": "AndroidKeyboard"
				}, {
					"name": "酷开系统输入法",
					"state": "0",
					"pkgname": "SkyTianciIME"
				}, {
					"name": "搜狗输入法",
					"state": "0",
					"pkgname": "SogouIME"
				}],
				"Service": [{
					"name": "广告服务",
					"state": "1",
					"pkgname": "SkyADService"
				}, {
					"name": "设备服务",
					"state": "0",
					"pkgname": "SkyDEService"
				}, {
					"name": "数据采集服务",
					"state": "0",
					"pkgname": "SkyDataService"
				}, {
					"name": "通讯服务",
					"state": "0",
					"pkgname": "SkyIPCService"
				}, {
					"name": "推送服务",
					"state": "0",
					"pkgname": "SkyPushService"
				}, {
					"name": "智慧启动",
					"state": "0",
					"pkgname": "SkySSService"
				}, {
					"name": "系统服务",
					"state": "0",
					"pkgname": "SkySystemService"
				}]
			},
			"configFile": {
				"main": [{
					"name": "屏幕",
					"type": "input",
					"pkgname": "PANEL",
					"value": "FHD|3D",
					"options": []
				}, {
					"name": "网络",
					"type": "input",
					"pkgname": "NETWORK",
					"value": "WIFI",
					"options": []
				}, {
					"name": "通道",
					"type": "input",
					"pkgname": "Source",
					"value": "ATV",
					"options": []
				}, {
					"name": "蓝牙遥控",
					"type": "select",
					"pkgname": "BleRemote",
					"value": "false",
					"options": ["false", "true"]
				}, {
					"name": "H.265解码",
					"type": "select",
					"pkgname": "H+.265",
					"value": "three",
					"options": ["one", "two", "three"]
				}, {
					"name": "打印等级",
					"type": "select",
					"pkgname": "Log_appender",
					"value": "2",
					"options": ["1", "2", "3", "4"]
				}, {
					"name": "升级包路径",
					"type": "input",
					"pkgname": "Ota_path",
					"value": "COM.COOCAA",
					"options": []
				}],
				"other": [{
					"name": "HDMI延时",
					"type": "input",
					"pkgname": "HDMIDelay",
					"value": "xxxx",
					"options": []
				}, {
					"name": "信源自切换",
					"type": "select",
					"pkgname": "SourceSwitch",
					"value": "false",
					"options": ["true", "false"]
				}, {
					"name": "数字通道字幕",
					"type": "select",
					"pkgname": "DTVSubTitle",
					"value": "hanyu",
					"options": ["english", "chinese", "hanyu"]
				}, {
					"name": "DTV场景实现",
					"type": "input",
					"pkgname": "DTVView",
					"value": "fuck",
					"options": []
				}]
			}
		}
	};

	var key, counter = 0;
	for(key in myData.data) {
		if(key == "DevInfo") {
			copyDeviceInfoInput(myData.data.DevInfo);
		} else if(key == "mkFile") {
			copyMkInfoInput(myData.data.mkFile);
		} else if(key == "configFile") {
			copyConfigInfoInput(myData.data.configFile);
		}
	}
}

function copyDeviceInfoInput(data) {
	document.getElementById("newCopyChip").value = data[0].platformModel;
	document.getElementById("newCopyModel").value = data[0].productModel;
	document.getElementById("newCopyDevice").value = data[0].chipModel;
	document.getElementById("NewCopyAndroidVersion").value = data[0].androidVersion;
	document.getElementById("newCopyMemory").value = data[0].memorySize;
	document.getElementById("newCopyChipMode").value = data[0].pendingReview;
}

function copyMkInfoInput(data) {
	var _myCopyTableMKInsertInfo = "";
	var myCopyTableMKInsert = document.getElementById("myCopyModalMkTableTbody");
	myCopyTableMKInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		_myCopyTableMKInsertInfo = "<tr><td><div>" + key + ":</div>";
		for(var j = 0; j < data[key].length; j++) {
			_myCopyTableMKInsertInfo += "<div class='col-xs-3'><input type='checkbox' value=''><span>" + data[key][j].name + "</span></div>";
			console.log("lxw " + _myCopyTableMKInsertInfo);
		}
		_myCopyTableMKInsertInfo += "</td></tr>";
		console.log("lxw " + counter);
		myCopyTableMKInsert.innerHTML += _myCopyTableMKInsertInfo;
	}
}

function copyConfigInfoInput(data) {
	var _myCopyTableConfigInsertInfo = "";
	var myCopyTableMConfigInsert = document.getElementById("myCopyModalConfigTableTbody");
	myCopyTableMConfigInsert.innerHTML = "";
	var key, counter = 0;
	for(key in data) {
		counter++;
		console.log("lxw counter = " + counter + "--" + key);
		if(key == "main") {
			_myCopyTableConfigInsertInfo = "<tr><td><div>核心功能:</div>";
		} else if(key == "other") {
			_myCopyTableConfigInsertInfo = "<tr><td><div>其他功能:</div>";
		}

		for(var j = 0; j < data[key].length; j++) {
			console.log("lxw " + data[key][j].name);
			console.log("lxw " + data[key][j].type);
			if(data[key][j].type == "input") {
				_myCopyTableConfigInsertInfo += "<div class='col-xs-6'><span title='name'>" + data[key][j].name + " :</span><input type='text' name='name' value='" + data[key][j].value + "' placeholder='****'></div>";
			} else if(data[key][j].type == "select") {
				var _myfirstselect = "<select id='" + data[key][j].pkgname + "'>";
				console.log("lxw " + data[key][j].options.length);
				for(var k = 0; k < data[key][j].options.length; k++) {
					if(data[key][j].options[k] == data[key][j].value) {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'selected>" + data[key][j].options[k] + "</option>";
					} else {
						_myfirstselect += "<option value='" + data[key][j].options[k] + "'>" + data[key][j].options[k] + "</option>";
					}
				}
				_myfirstselect = "<div class='col-xs-6'><span title='name'>" + data[key][j].name + " :</span>" + _myfirstselect + "</select></div>";
				console.log("lxw " + _myfirstselect);
				_myCopyTableConfigInsertInfo += _myfirstselect;
			}
		}
		_myCopyTableConfigInsertInfo += "</td></tr>";
		myCopyTableMConfigInsert.innerHTML += _myCopyTableConfigInsertInfo;
	}
}

function copyPageSubmitData() {
	var data, devInfoData = null;
	devInfoData = {
		"platformModel": document.getElementById("newCopyChip").value,
		"productModel": document.getElementById("newCopyModel").value,
		"androidVersion": document.getElementById("newCopyDevice").value,
		"chipModel": document.getElementById("NewCopyAndroidVersion").value,
		"memorySize": document.getElementById("newCopyMemory").value,
		"pendingReview": document.getElementById("newCopyChipMode").value
	};
	var mkFileData = {};
	var mkTrlength = document.getElementById("myCopyModalMkTableTbody").childNodes;
	console.log("lxw " + mkTrlength.length);
	var thisMkindex = null;
	var mkTrTdDiv = new Array();
	for(var i = 0; i < mkTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		mkTrTdDiv = $("#myCopyModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < mkTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"state": "",
				"pkgname": ""
			};
			thisMkindex = j;
			if(j == 0) {
				console.log(mkTrTdDiv[thisMkindex].innerHTML);
				innerHtml = mkTrTdDiv[thisMkindex].innerHTML;
			} else {
				stuInfo.name = mkTrTdDiv[thisMkindex].childNodes[1].innerHTML;
				stuInfo.pkgname = mkTrTdDiv[thisMkindex].title;
				if(mkTrTdDiv[thisMkindex].childNodes[0].checked) {
					stuInfo.state = "1";
				} else {
					stuInfo.state = "0";
				}
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		mkFileData[innerHtml] = arrayInfo;
		console.log(mkFileData);
	}

	var configFileData = {};
	var configTrlength = document.getElementById("myCopyModalConfigTableTbody").childNodes;
	console.log("lxw " + configTrlength.length);
	var thisConfigindex = null;
	var configTrTdDiv = new Array();
	for(var i = 0; i < configTrlength.length; i++) {
		var arrayInfo = [];
		var innerHtml = "";
		configTrTdDiv = $("#myCopyModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		for(var j = 0; j < configTrTdDiv.length; j++) {
			var stuInfo = {
				"name": "",
				"type": "",
				"value": ""
			};
			thisConfigindex = j;
			if(j == 0) {
				console.log(configTrTdDiv[thisConfigindex].name);
				innerHtml = configTrTdDiv[thisConfigindex].title;
			} else {
				stuInfo.name = configTrTdDiv[thisConfigindex].childNodes[0].innerHTML;
				stuInfo.type = configTrTdDiv[thisConfigindex].childNodes[1].name;
				stuInfo.value = configTrTdDiv[thisConfigindex].childNodes[1].value;
				arrayInfo.push(stuInfo);
			}
		}
		//console.log(arrayInfo);
		configFileData[innerHtml] = arrayInfo;
		console.log(configFileData);
	}

	data = {
		"DevInfo": [devInfoData], //参数：{"platformModel": "","productModel": ""}
		"mkFile": mkFileData, //参数：{"App": [{"name": "酷开商城","pkgname": "SkyCCMall"},{"name": "搜狗语音","pkgname": "SkyVoice"}]}
		"configFile": configFileData //参数：{"main": [{"name": "屏幕","value":"","options":[]},{"name": "升级包","value":"","options":[]}]};
	};
	console.log(data);
}

//新增页保存，向后台传递数据
//function modalAddSave(){
//	var currentObject = document.getElementsByClassName("addOrEditsubmit");
//	for (var i=0;i<currentObject.length; i++) {
//		currentObject[i].onclick = function(){
//			console.log("lxw "+"新增页点击保存，向后台传递数据");
//			//获取每个表格的tr有多少行 myAddModalTableTrNumber-modalMkTableTrNumber-modalConfigTableTrNumber= 最外层有多少行
//			var myAddModalTableTrNumber = $("#myAddModalTable").find("tr").length;
//			var modalMkTableTrNumber = $("#modal-mkTable").find("tr").length;
//			var modalConfigTableTrNumber = $("#modal-configTable").find("tr").length;
//			//console.log("lxw 1"+myAddModalTableTrNumber+"lxw 2"+modalMkTableTrNumber+"lxw 3"+modalConfigTableTrNumber);
//			var firstVar = myAddModalTableTrNumber-modalMkTableTrNumber-modalConfigTableTrNumber;
//			var jsonarray=[];
//			var arr = {"name" : "","type" : "","value" : ""}
//			for (var i=0; i<firstVar; i++) {
//				if (i==0) {
//					var trTdDiv = $("#myAddModalTable").find("tr:first").find("div");
//					//console.log("lxw "+trTdDiv.length);
//					for (var j=0; j<trTdDiv.length; j++) {
//						//var oName = trTdDiv[j].children[0].innerHTML;//中文
//						var oName = trTdDiv[j].children[0].title;//英文
//						var oType = trTdDiv[j].children[0].nodeName;//标签名
//						//console.log("lxw "+ oType);
//						var oValue = trTdDiv[j].children[1].value;
//						//console.log("lxw "+trTdDiv[j].children[0].title+"--"+trTdDiv[j].children[1].name);
//						arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
//						jsonarray.push(arr);
//					}
//				}else if(i==1){
//					var trTdDiv = $("#myAddModalTable").find("tr:eq(1)").find("div");
//					//console.log("lxw "+trTdDiv.length);
//					for (var j=0; j<trTdDiv.length; j++) {
//						var oName = trTdDiv[j].children[0].title;//英文
//						var oType = trTdDiv[j].children[0].nodeName;//标签名
//						var oValue = trTdDiv[j].children[1].value;
//						//console.log("lxw "+trTdDiv[j].children[0].title+"--"+trTdDiv[j].children[1].name);
//						arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
//						jsonarray.push(arr);
//					}
//				}else if(i==2){
//					var tableTr = $("#modal-mkTable").find("tr");
//					//console.log("lxw "+tableTr.length);
//					for (var j=0; j<tableTr.length; j++) {
//						var tableTrDiv = $("#modal-mkTable").find("tr:eq("+j+")").find("div");
//						//console.log("lxw "+ tableTrDiv.length);
//						for (var k=0;k<tableTrDiv.length;k++) {
//							if (k==0) {
//								console.log("lxw "+ tableTrDiv[0].title);
//							} else{
//								var oName = tableTrDiv[k].children[1].title;//英文
//								var oType = tableTrDiv[k].children[0].type;//标签名
//								var oValue = tableTrDiv[k].children[0].checked;
//								//console.log("lxw "+ tableTrDiv[k].children[0].nodeName+"--"+tableTrDiv[k].children[1].nodeName);
//								//console.log("lxw "+ tableTrDiv[k].children[0].checked+"--"+tableTrDiv[k].children[1].innerHTML);
//								arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
//								jsonarray.push(arr);
//							}
//							
//						}
//					}
//					
//					var tableTrTwo = $("#modal-configTable").find("tr");
//					console.log("lxw "+tableTrTwo.length);
//					for (var jj=0; jj<tableTrTwo.length; jj++) {
//						var tableTrDivTwo = $("#modal-configTable").find("tr:eq("+jj+")").find("div");
//						console.log("lxw "+ tableTrDivTwo.length);
//						for (var kk=0;kk<tableTrDivTwo.length;kk++) {
//							if (kk==0) {
//								console.log("lxw "+ tableTrDivTwo[0].title);
//							} else{
//								var oName = tableTrDivTwo[kk].children[0].title;//英文
//								var oNodeName = tableTrDivTwo[kk].children[1].nodeName;//标签名
//								if (oNodeName == "INPUT") {
//									var oType = tableTrDivTwo[kk].children[1].type;//标签名
//									var oValue = tableTrDivTwo[kk].children[1].value;
//								} else if(oNodeName == "SELECT"){
//									var oType = tableTrDivTwo[kk].children[1].nodeName;
//									var index = tableTrDivTwo[kk].children[1].selectedIndex;
//									var oValue = tableTrDivTwo[kk].children[1].options[index].value;
//								}
//								console.log("lxw "+ oName+"--"+oNodeName+"--"+oType+"--"+oValue);
//								//console.log("lxw "+ tableTrDivTwo[kk].children[0].checked+"--"+tableTrDivTwo[kk].children[1].innerHTML);
//								arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
//								jsonarray.push(arr);
//							}							
//						}
//					}
//				}
//			}
//			console.log("lxw "+ jsonarray);
//		}
//	}
//}
//
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
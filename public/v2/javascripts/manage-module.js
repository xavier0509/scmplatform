document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', searchModalInfo);
})

function AfterModuleHtmlInfo() {
	/*模块管理板块-增加（-1）与编辑（其他）*/
	var oButtonAdd = document.getElementById("manage-moduleAdd");
	oButtonAdd.onclick = function() {
		$('#myModuleAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("moduleCzName").value = "";
		document.getElementById("moduleEnName").value = "";
		document.getElementById("moduleSrc").value = "";
		document.getElementById("moduleSrc").removeAttribute('disabled');
        document.getElementById("moduleSrc").style.backgroundColor = "white";
		document.getElementById("moduleInstr").value = "";
		document.getElementById("moduleSelect").value = "App";
		toSaveButton(-1, null);
	}

	/*模块管理板块-修改*/
	var oTableA = $("#module-mkTable").find("a");
	var oTableInput = $("#module-mkTable").find("input");
	console.log("xjr" + oTableInput.length);
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok " + this.index + "--" + this.name); //点击的是第几个
			var englishName = this.name;
			var data = oTableInput[this.index].value;
			var jsonData = JSON.parse(data);
			var thisId = jsonData._id;
			console.log("lxw " + thisId);
			$('#myModuleAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("moduleCzName").value = jsonData.cnName;
			document.getElementById("moduleEnName").value = jsonData.engName;
			document.getElementById("moduleSrc").value = jsonData.gitPath;
			document.getElementById("moduleSrc").setAttribute('disabled','');
           	document.getElementById("moduleSrc").style.backgroundColor = "#ebebe4";
			document.getElementById("moduleInstr").value = jsonData.desc;

			var childSelect = document.getElementById("moduleSelect");
			console.log(childSelect.options.length);
			for(var j = 0; j < childSelect.options.length; j++) {
				if(childSelect.options[j].value == jsonData.category) {
					childSelect.options[j].selected = true;
				} else {
					childSelect.options[j].selected = false;
				}
			};

			toSaveButton(this.index, thisId);
		}
	}
	/*模块管理板块-保存*/
	function toSaveButton(myindex, idName) {
		var ModualSubmit = document.getElementById("inputModuleSubmit");

		ModualSubmit.onclick = function() {
			console.log("lxw " + "in inputModuleSubmit");
			var newModuleCzName = document.getElementById("moduleCzName").value;
			var newModuleEnName = document.getElementById("moduleEnName").value;
			var newModuleSrc = document.getElementById("moduleSrc").value;
			var newModuleInstr = document.getElementById("moduleInstr").value;
			var newModuleSelect = document.getElementById("moduleSelect").value;

			newModuleCzName = newModuleCzName.replace(/(^\s*)|(\s*$)/g, "");
			newModuleEnName = newModuleEnName.replace(/(^\s*)|(\s*$)/g, "");
			newModuleSrc = newModuleSrc.replace(/(^\s*)|(\s*$)/g, "");
			newModuleInstr = newModuleInstr.replace(/(^\s*)|(\s*$)/g, "");
			console.log("lxw " + newModuleCzName + "--" + newModuleEnName + "--" + newModuleSrc + "--" + newModuleInstr + "--" + newModuleSelect);

			var myCnNameObj = {
				"cnName": "001",
				"value": "001"
			};
			var myEnNameObj = {
				"cnName": "001",
				"value": "001"
			};
			var mySrcObj = {
				"cnName": "001",
				"value": "001"
			};
			var myInstrObj = {
				"cnName": "001",
				"value": "001"
			};

			myCnNameObj.cnName = "模块中文名";
			myCnNameObj.value = newModuleCzName;
			myEnNameObj.cnName = "模块英文名";
			myEnNameObj.value = newModuleEnName;
			mySrcObj.cnName = "模块路径";
			mySrcObj.value = newModuleSrc;
			myInstrObj.cnName = "描述";
			myInstrObj.value = newModuleInstr;

			var currentArray = [myCnNameObj, myEnNameObj, mySrcObj, myInstrObj];
			if(newModuleCzName == "" || newModuleEnName == "" || newModuleSrc == "" || newModuleInstr == "") {
				for(var jj = 0; jj < currentArray.length; jj++) {
					var ooName = currentArray[jj].cnName;
					console.log("lxw " + currentArray[jj].value + "--" + ooName);
					if(currentArray[jj].value == "") {
						jj = currentArray.length;
						document.getElementById("moduleErrorInfo").style.display = "block";
						document.getElementById("moduleErrorInfo").innerHTML = ooName + "项不能为空！";
						setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
					}
				}
			} else {
				if(myindex == -1) {
					console.log("lxw " + myindex);
					var node = '{"data":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}';
					sendHTTPRequest("/fybv2_api/moduleAdd", node, returnAddInfo);
				} else {
					console.log("lxw " + myindex);
					var node = '{"data":{"_id":"' + idName + '","update":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}}';
					console.log("lxw " + node);
					sendHTTPRequest("/fybv2_api/moduleUpdate", node, returnChangeInfo);
				}
			}
		}
	}
}

/*点击模块管理，获取数据*/
function searchModalInfo() {
	console.log("lxw " + "ModalHtmlInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			var kk = 0;
			var _rowModuleApp = document.getElementById("moduleTableApp");
			var _rowModuleService = document.getElementById("moduleTableService");
			var _rowModuleAppStore = document.getElementById("moduleTableAppStore");
			var _rowModuleHomePage = document.getElementById("moduleTableHomePage");
			var _rowModuleIME = document.getElementById("moduleTableIME");
			var _rowModuleSysApp = document.getElementById("moduleTableSysApp");
			var _rowModuleTV = document.getElementById("moduleTableTV");
			var _rowModuleOther = document.getElementById("moduleTableOther");
			_rowModuleApp.innerHTML = "<div title='App'>App:</div>";
			_rowModuleService.innerHTML = "<div title='Service'>Service:</div>";
			_rowModuleAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowModuleHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowModuleIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowModuleSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowModuleTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowModuleOther.innerHTML = "<div title='Other'>Other:</div>";

			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					_rowModuleApp.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					_rowModuleService.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					_rowModuleAppStore.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					_rowModuleHomePage.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					_rowModuleIME.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("SysApp:" + kk);
					_rowModuleSysApp.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("TV:" + kk);
					_rowModuleTV.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("Other:" + kk);
					_rowModuleOther.innerHTML += "<div class='col-xs-4'><a title='"+data.data[kk].cnName+"' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</a><input type='text' value='" + pullDataOne + "' style='display:none'></div>";
				}
			}
		};
		AfterModuleHtmlInfo();
	}
}

function returnAddInfo() {
	console.log("lxw " + "returnAddInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				console.log("lxw " + "添加成功");
				$("#myModuleAddChangeModal").modal('hide');
				freshModuleAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "添加失败");
				document.getElementById("moduleErrorInfo").innerHTML = "添加失败！该内容或已存在。";
				setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
			};
		};
	}
}

function returnChangeInfo() {
	console.log("lxw " + "returnChangeInfo");
	if(this.readyState == 4) {
		if(this.status == 200) {
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myModuleAddChangeModal").modal('hide');
				freshModuleAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("moduleErrorInfo").innerHTML = "修改失败！";
				setTimeout("document.getElementById('moduleErrorInfo').innerHTML='　'", 3000);
			};
		};
	}
}

/*刷新页面*/
function freshModuleAddHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu5");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "manage-module.html";

	var indexObject = parent.document.getElementById("home");
    var iframe = indexObject.getElementsByTagName("iframe");
    iframe[0].src = "wait.html";
    if(parent.document.getElementById("tab_userMenu2")){
	    var htmlObject1 = parent.document.getElementById("tab_userMenu2");
	    htmlObject1.firstChild.src = "review.html";
	}  
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":""}', searchModalInfo);
})

function AfterModuleHtmlInfo() {
	/*模块管理板块-增加与编辑*/
	var oButtonAdd = document.getElementById("manage-moduleAdd");
	oButtonAdd.onclick = function() {
		$('#myModuleAddChangeModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		toSaveButton(-1,null);
	}

	/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
	var oTableA = $("#module-mkTable").find("a");
	var oTableInput = $("#module-mkTable").find("input");
	console.log("xjr"+oTableInput.length);
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok " + this.index+"--"+this.name); //点击的是第几个
			var englishName = this.name;
			var data = oTableInput[this.index].value;
			var jsonData = JSON.parse(data);
			var thisId = jsonData._id;
			console.log("lxw "+thisId);
			$('#myModuleAddChangeModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("moduleCzName").value = jsonData.cnName;
			document.getElementById("moduleEnName").value = jsonData.engName;
			document.getElementById("moduleSrc").value = jsonData.gitPath;
			document.getElementById("moduleInstr").value = jsonData.desc;
			
			toSaveButton(this.index,thisId);
		}
	}
	/*模块管理板块-保存*/
	function toSaveButton(myindex,idName){
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
				sendHTTPRequest("/fybv2_api/moduleAdd", node, returnAddInfo);
			} else{
				console.log("lxw "+myindex);
				//{"data":{"_id":"5896f88dbd1da5559da02dbe","update":{"desc":"11"}}}
				var node = '{"data":{"_id":"'+ idName +'","update":{"cnName":"' + newModuleCzName + '","engName":"' + newModuleEnName + '","gitPath":"' + newModuleSrc + '","desc":"' + newModuleInstr + '","category":"' + newModuleSelect + '"}}}';
				console.log("lxw "+ node);
				sendHTTPRequest("/fybv2_api/moduleUpdate", node, returnChangeInfo);
			}
		}
	}
}

/*点击模块管理，获取数据*/
function searchModalInfo() {
	console.log("lxw " + "ModalHtmlInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
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
				console.log("lxw "+data.data[i].category);
				if (data.data[i].category == "App") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("App:"+kk);
					_rowModuleApp.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				} else if(data.data[i].category == "Service"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("Service:"+kk);
					_rowModuleService.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "AppStore"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("AppStore:"+kk);
					_rowModuleAppStore.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "HomePage"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("HomePage:"+kk);
					_rowModuleHomePage.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "IME"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("IME:"+kk);
					_rowModuleIME.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "SysApp"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("SysApp:"+kk);
					_rowModuleSysApp.innerHTML += "<div class='col-xs-4' name='"+data.data[kk].engName+"'><a>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "TV"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("TV:"+kk);
					_rowModuleTV.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}else if(data.data[i].category == "Other"){
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("Other:"+kk);
					_rowModuleOther.innerHTML += "<div class='col-xs-4'><a name='"+data.data[kk].engName+"'>" + data.data[kk].cnName + "</a><input type='text' value='"+pullDataOne+"' style='display:none'></div>";
				}
			}
		};
		AfterModuleHtmlInfo();
	}
}
function returnAddInfo(){
	console.log("lxw " + "returnAddInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				console.log("lxw " + "添加成功");
				$("#myModuleAddChangeModal").modal('hide');
				freshModuleAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "添加失败");
				document.getElementById("moduleErrorInfo").style.display = "block";
				document.getElementById("moduleErrorInfo").innerHTML = "添加失败！";
			};
		};
	}
}
function returnChangeInfo(){
	console.log("lxw " + "returnChangeInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log(data);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myModuleAddChangeModal").modal('hide');
				freshModuleAddHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("moduleErrorInfo").style.display = "block";
				document.getElementById("moduleErrorInfo").innerHTML = "修改失败！";
			};
		};
	}
}

/*刷新页面*/
function freshModuleAddHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu5");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "manage-module.html";
}
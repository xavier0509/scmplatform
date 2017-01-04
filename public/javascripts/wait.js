document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function() {
	waitHtmlInfo(); //获取后台数据
	AfterWaitHtmlinfo(); //具体细节操作
})

function AfterWaitHtmlinfo() {

	//查询searchInfo
	var mySearchInfo = document.getElementById("searchInfo");
	mySearchInfo.onclick = function(){
		var oChip = document.getElementById('chip').value;
    	var oMode = document.getElementById('model').value;
    	var node = '{"data":{"platformModel":"' + oChip + '","productModel":"' + oMode +'"}}';
    
		sendHTTPRequest("/api/configmananger/search", node, searchResource);
		
	}
	
	function searchResource(){
		console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            
            // loginId = data.data;
            // printlog(loginId);
            
        }
    }
	}















	/*增加*/
	var oButtonAdd = document.getElementById("wait-add");
	oButtonAdd.onclick = function() {
		var currentParentName = oButtonAdd.id;
		var thisIndex = null;
		$("#myAddModal").modal("toggle");
		$(".modal-backdrop").addClass("new-backdrop"); //去掉后面的阴影效果
		myCloseEnsure("#myAddModal","wait-add",thisIndex);
		modalSave(currentParentName);
	}
	/*多项删除*/
	var oButtonDelete = document.getElementById("wait-delete");
	oButtonDelete.onclick = function() {
		console.log("in delete");
		var currentParentName = oButtonDelete.id;
		//需要添加前提条件，点击多项删除时需选中至少一项 wait-tablebody
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
			$("#myMoreDeleteModalLabel").text("删除");
			$('#myMoreDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		} else {
			$("#myDeleteDialogModalLabel").text("请注意：");
			$('#myDeleteDialogModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		
//		myCloseEnsure("#wait-delete");
	}
	/*批量修改*/
	var oButtonEdit = document.getElementById("wait-change");
	oButtonEdit.onclick = function() {
		//需要添加前提条件，点击多项删除时需选中至少一项 wait-tablebody
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
			myCloseEnsure("#myMoreEditModal","#wait-change",thisIndex);
		} else {
			$("#myDeleteDialogModalLabel").text("请注意：");
			$('#myDeleteDialogModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
	}
	/*批量修改-保存-确认框*/
	var oButtonEditEnsure = document.getElementById("MoreEditSubmit");
	oButtonEditEnsure.onclick = function() {
		console.log("in delete");
		$('#myMoreEditSubmitModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}
	var oButtonDeleteEnsure = document.getElementById("myMoreDeleteSubmit");
	oButtonDeleteEnsure.onclick = function() {
		console.log("in delete");
		$('#myMoreEditSubmitModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}

	/*单项编辑*/
	var oClassButtonEdit = new Array();
	oClassButtonEdit = document.getElementsByClassName("eachedit");
	for(var i = 0; i < oClassButtonEdit.length; i++) {
		oClassButtonEdit[i].index = i;
		oClassButtonEdit[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			var thisIndex = this.index;
			$("#myAddModalLabel").text("新增机芯机型");
			$('#myAddModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("newChip").value = "编辑功能";
			myCloseEnsure("#myAddModal","eachedit",thisIndex);
		}
	}

	/*单项删除*/
	var oClassButtonDelete = new Array();
	oClassButtonDelete = document.getElementsByClassName("eachdelete");
	for(var i = 0; i < oClassButtonDelete.length; i++) {
		oClassButtonDelete[i].index = i;
		oClassButtonDelete[i].onclick = function() {
			console.log("in delete");
			$("#myMoreDeleteModalLabel").text("删除");
			$('#myMoreDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
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
			$("#myAddModalLabel").text("新增机芯机型");
			$('#myAddModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("newChip").value = "复制功能";

			myCloseEnsure("#myAddModal","eachcopy",thisIndex);
		}
	}

	/*批量修改-单项*/
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
		}
		omybuttonDelstyle[number].onclick = function() {
				console.log("lxw" + "批量删除的点击" + number);
				omybuttonDelstyle[number].style.color = "red";
			}
			/*执行保存按钮的动作*/
		MoreEditSubmit();
	}
	/*弹出确认框*/
	function MoreEditSubmit() {
		console.log("lxw" + "in MoreEditSubmit");
	}

	/*关闭按钮的确认框*/
	function myCloseEnsure(currentModalname,parentName,index) {
		var oCloseEnsure = new Array();
		oCloseEnsure = document.getElementsByClassName("myclose");
		for(var i = 0; i < oCloseEnsure.length; i++) {
			oCloseEnsure[i].index = i;
			oCloseEnsure[i].onclick = function() {
				console.log(this.index); //点击的是第几个
				if(this.index == 0) {
					$('#myEditEnsureModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname,parentName,index);
				} else if(this.index == 1) {
					$('#myEditEnsureModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname,parentName,index);
				} else if(this.index == 2) {
					$('#myMoreDeleteModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname,parentName,index);
				}
			}
		}
	}

	function myCloseEnsuretrue(obj, number, modalName, parentName,index) {
		var oClosetrue = new Array();
		var oClosetrue = document.getElementsByClassName("ensureTrue");
		for(var i = 0; i < oClosetrue.length; i++) {
			oClosetrue[i].onclick = function() {
				console.log("lxw:" + obj[number].className + ",modalName=" + modalName+ ",parentName=" + parentName+ ",index=" + index);
				$(modalName).modal('hide')
			}
		}
	}
}

/*点击配置文件管理，获取数据*/
function waitHtmlInfo() {
	console.log("lxw " + "hello");
	var currentData = "[{'chip':'2s61','android':'5.0.1','chipid':'1521','author':'name1'},{'chip':'2s62','android':'5.0.2','chipid':'1522','author':'name2'},{'chip':'2s63','android':'5.0.3','chipid':'1523','author':'name3'},{'chip':'2s64','android':'5.0.4','chipid':'1524','author':'name4'},{'chip':'2s65','android':'5.0.5','chipid':'1525','author':'name5'}]";
	var objData = eval("(" + currentData + ")");
	console.log("lxw " + objData.length);
	for(var i = 0; i < objData.length; i++) {
		_row = document.getElementById("wait-tablebody").insertRow(0);
		var _cell0 = _row.insertCell(0);
		_cell0.innerHTML = "<input type='checkbox' class='checkboxstatus' value=''>";
		var _cell1 = _row.insertCell(1);
		_cell1.innerHTML = objData[i].chip;
		var _cell2 = _row.insertCell(2);
		_cell2.innerHTML = objData[i].android;
		var _cell3 = _row.insertCell(3);
		_cell3.innerHTML = objData[i].chipid;
		var _cell4 = _row.insertCell(4);
		_cell4.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default eachedit'>编辑</button><button type='button' class='btn btn-default eachdelete'>删除</button><button type='button' class='btn btn-default eachcopy'>复制</button></div>";
	};
}

function oButtonMKonclick(name) {
	console.log("ok=" + name);
	if(name == "mkButton") {
		changeStyle("modal-mkTable", "block");
		changeStyle("modal-configTable", "none");
	} else if(name == "mkAdminButton") {
		changeStyle("modal-mkAdminTable", "block");
		changeStyle("modal-configAdminTable", "none");
	}

}

function oButtonConfigonclick(name) {
	if(name == "configButton") {
		changeStyle("modal-mkTable", "none");
		changeStyle("modal-configTable", "block");
	} else if(name == "configAdminButton") {
		changeStyle("modal-mkAdminTable", "none");
		changeStyle("modal-configAdminTable", "block");
	}
}

function changeStyle(id, style) {
	var currentObject = document.getElementById(id);
	currentObject.style.display = style;
}

//新增、编辑、辅助页点击保存，向后台传递数据
function modalSave(currentParentName){
	//传参，判断是新增还是编辑还是复制，执行不同的功能函数
	if (currentParentName == "wait-add") {
		modalAddSave();
	} else {
		//区分编辑和复制
	}
	
}
//新增页保存，向后台传递数据
function modalAddSave(){
	var currentObject = document.getElementsByClassName("addOrEditsubmit");
	for (var i=0;i<currentObject.length; i++) {
		currentObject[i].onclick = function(){
			console.log("lxw "+"新增页点击保存，向后台传递数据");
			//获取每个表格的tr有多少行 myAddModalTableTrNumber-modalMkTableTrNumber-modalConfigTableTrNumber= 最外层有多少行
			var myAddModalTableTrNumber = $("#myAddModalTable").find("tr").length;
			var modalMkTableTrNumber = $("#modal-mkTable").find("tr").length;
			var modalConfigTableTrNumber = $("#modal-configTable").find("tr").length;
			//console.log("lxw 1"+myAddModalTableTrNumber+"lxw 2"+modalMkTableTrNumber+"lxw 3"+modalConfigTableTrNumber);
			var firstVar = myAddModalTableTrNumber-modalMkTableTrNumber-modalConfigTableTrNumber;
			var jsonarray=[];
			var arr = {"name" : "","type" : "","value" : ""}
			for (var i=0; i<firstVar; i++) {
				if (i==0) {
					var trTdDiv = $("#myAddModalTable").find("tr:first").find("div");
					//console.log("lxw "+trTdDiv.length);
					for (var j=0; j<trTdDiv.length; j++) {
						//var oName = trTdDiv[j].children[0].innerHTML;//中文
						var oName = trTdDiv[j].children[0].title;//英文
						var oType = trTdDiv[j].children[0].nodeName;//标签名
						//console.log("lxw "+ oType);
						var oValue = trTdDiv[j].children[1].value;
						//console.log("lxw "+trTdDiv[j].children[0].title+"--"+trTdDiv[j].children[1].name);
						arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
						jsonarray.push(arr);
					}
				}else if(i==1){
					var trTdDiv = $("#myAddModalTable").find("tr:eq(1)").find("div");
					//console.log("lxw "+trTdDiv.length);
					for (var j=0; j<trTdDiv.length; j++) {
						var oName = trTdDiv[j].children[0].title;//英文
						var oType = trTdDiv[j].children[0].nodeName;//标签名
						var oValue = trTdDiv[j].children[1].value;
						//console.log("lxw "+trTdDiv[j].children[0].title+"--"+trTdDiv[j].children[1].name);
						arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
						jsonarray.push(arr);
					}
				}else if(i==2){
					var tableTr = $("#modal-mkTable").find("tr");
					//console.log("lxw "+tableTr.length);
					for (var j=0; j<tableTr.length; j++) {
						var tableTrDiv = $("#modal-mkTable").find("tr:eq("+j+")").find("div");
						//console.log("lxw "+ tableTrDiv.length);
						for (var k=0;k<tableTrDiv.length;k++) {
							if (k==0) {
								console.log("lxw "+ tableTrDiv[0].title);
							} else{
								var oName = tableTrDiv[k].children[1].title;//英文
								var oType = tableTrDiv[k].children[0].type;//标签名
								var oValue = tableTrDiv[k].children[0].checked;
								//console.log("lxw "+ tableTrDiv[k].children[0].nodeName+"--"+tableTrDiv[k].children[1].nodeName);
								//console.log("lxw "+ tableTrDiv[k].children[0].checked+"--"+tableTrDiv[k].children[1].innerHTML);
								arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
								jsonarray.push(arr);
							}
							
						}
					}
					
					var tableTrTwo = $("#modal-configTable").find("tr");
					console.log("lxw "+tableTrTwo.length);
					for (var jj=0; jj<tableTrTwo.length; jj++) {
						var tableTrDivTwo = $("#modal-configTable").find("tr:eq("+jj+")").find("div");
						console.log("lxw "+ tableTrDivTwo.length);
						for (var kk=0;kk<tableTrDivTwo.length;kk++) {
							if (kk==0) {
								console.log("lxw "+ tableTrDivTwo[0].title);
							} else{
								var oName = tableTrDivTwo[kk].children[0].title;//英文
								var oNodeName = tableTrDivTwo[kk].children[1].nodeName;//标签名
								if (oNodeName == "INPUT") {
									var oType = tableTrDivTwo[kk].children[1].type;//标签名
									var oValue = tableTrDivTwo[kk].children[1].value;
								} else if(oNodeName == "SELECT"){
									var oType = tableTrDivTwo[kk].children[1].nodeName;
									var index = tableTrDivTwo[kk].children[1].selectedIndex;
									var oValue = tableTrDivTwo[kk].children[1].options[index].value;
								}
								console.log("lxw "+ oName+"--"+oNodeName+"--"+oType+"--"+oValue);
								//console.log("lxw "+ tableTrDivTwo[kk].children[0].checked+"--"+tableTrDivTwo[kk].children[1].innerHTML);
								arr = '{"name" : '+oName+',"type" : '+oType+',"value" : '+oValue+'}';
								jsonarray.push(arr);
							}							
						}
					}
				}
			}
			console.log("lxw "+ jsonarray);
		}
	}
}

//删除、批量删除弹出框确认按钮的点击

function modalDelete(name){
	
}


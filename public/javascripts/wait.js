document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function() {
	// waitHtmlInfo(); //获取后台数据
	forsession();
})

function forsession(){
    sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
}

function sessionresult(){
	console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                loginusername = data.data.data.author;
                if (data.data.data.adminFlag == "1") {
                    adminFlag = 1;   //非管理员标志位                
                    // console.log(loginusername);
					//隐藏左边管理员的部分
                    document.getElementById("wait-change").style.display="block";
                }
                else if (data.data.data.adminFlag == "0") {
                    adminFlag = 0;
                }
            };            
        }
        startSelect();//打开就获取数据
    }
}

function startSelect() {

	console.log("xjr start select");
	var oChip = document.getElementById('chip').value;
	var oMode = document.getElementById('model').value;
	var oMemory = document.getElementById('memory').value;
	var oAndroid = document.getElementById('androidVersion').value;
	var oChipid = document.getElementById('chipid').value;
	var node = '{"data":{"platformModel":"' + oChip + '","productModel":"' + oMode + '","androidVersion":"' + oAndroid + '","chipModel":"' + oChipid + '","memorySize":"' + oMemory + '"}}';
	console.log("lxw "+node);
	sendHTTPRequest("/api/configmananger/search", node, searchResource);
}

function searchResource() {
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) {
			var title=document.getElementById("wait-tablebody"); //获取tbody的表格内容
			for (var i = title.childNodes.length-1; i > 0; i--) {
				title.removeChild(title.childNodes[i]); //删除掉每个子节点的内容
			};			
			var data = JSON.parse(this.responseText);
			var msg = data.msg;
			if (msg == "success") {
				var datalength = data.data;
				console.log(datalength);
				for (var i = 0; i < datalength.length; i++) {
					var objData = datalength[i].DevInfo;
					console.log(objData);
					for(var j = 0; j < objData.length; j++) {
						_row = document.getElementById("wait-tablebody").insertRow(0);
						var _cell0 = _row.insertCell(0);
						_cell0.innerHTML = "<input type='checkbox' class='checkboxstatus' value=''>";
						var _cell1 = _row.insertCell(1);
						_cell1.innerHTML = objData[j].platformModel;
						var _cell2 = _row.insertCell(2);
						_cell2.innerHTML = objData[j].productModel;
						var _cell3 = _row.insertCell(3);
						_cell3.innerHTML = objData[j].androidVersion;
						var _cell4 = _row.insertCell(4);
						_cell4.innerHTML = objData[j].chipModel;
						var _cell5 = _row.insertCell(5);
						_cell5.innerHTML = objData[j].memorySize;
						var _cell6 = _row.insertCell(6);
						_cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default eachedit'>编辑</button><button type='button' class='btn btn-default eachdelete'>删除</button><button type='button' class='btn btn-default eachcopy'>复制</button></div>";
					};
				};
			}
			else{
				//查询为空

			}
		}
	}
	AfterWaitHtmlinfo(); //具体细节操作
}

function AfterWaitHtmlinfo() {

	console.log("admin="+adminFlag);
	if (adminFlag == "1") {
		document.getElementById("wait-change").style.display="block";
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
		addPageButtons(); //后期可能会传参给页面里的点击事件
	}

	function addPageButtons() {
		var oButtonEditEnsure = document.getElementById("myAddModalSubmit");
		oButtonEditEnsure.onclick = function() {
			console.log("新增页-提交按钮一");
			$("#myAddModal").modal('hide');
		}
		var oButtonEditEnsure = document.getElementById("myAddModalSubmitTwo");
		oButtonEditEnsure.onclick = function() {
			console.log("新增页-提交按钮二");
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
			//myCloseEnsure("#myAddModal","eachedit",thisIndex);
			editPageButtonsOnclick(thisIndex);
		}
	}

	function editPageButtonsOnclick(index) {
		var oButtonEditEnsure = document.getElementById("myEditModalSubmit");
		oButtonEditEnsure.onclick = function() {
			console.log("单项编辑页-提交按钮一");
			$("#myEditModal").modal('hide');
		}
		var oButtonEditEnsure = document.getElementById("myEditModalSubmitTwo");
		oButtonEditEnsure.onclick = function() {
			console.log("单项编辑页-提交按钮二");
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
			$("#myCopyModalLabel").text("新增机芯机型");
			$('#myCopyModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			//document.getElementById("newChip").textContent = "复制功能";
			//myCloseEnsure("#myAddModal","eachcopy",thisIndex);
			copyPageButtons(); //后期可能会传参给页面里的点击事件
		}
	}

	function copyPageButtons() {
		var oButtonEditEnsure = document.getElementById("myCopyModalSubmit");
		oButtonEditEnsure.onclick = function() {
			console.log("单项复制页-提交按钮一");
			$("#myCopyModal").modal('hide');
		}
		var oButtonEditEnsure = document.getElementById("myCopyModalSubmitTwo");
		oButtonEditEnsure.onclick = function() {
			console.log("单项复制页-提交按钮二");
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

	function closeparentpage(pageName) {
		var oButtonObject = document.getElementById("myEditEnsureModalEnsure");
		oButtonObject.onclick = function() {
			$(pageName).modal('hide');
			$("#myEditEnsureModal").modal('hide');
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

//function oButtonMKonclick(name) {
//	console.log("ok=" + name);
//	if(name == "mkButton") {
//		changeStyle("modal-mkTable", "block");
//		changeStyle("modal-configTable", "none");
//	} else if(name == "mkAdminButton") {
//		changeStyle("modal-mkAdminTable", "block");
//		changeStyle("modal-configAdminTable", "none");
//	}
//}
//function oButtonConfigonclick(name) {
//	if(name == "configButton") {
//		changeStyle("modal-mkTable", "none");
//		changeStyle("modal-configTable", "block");
//	} else if(name == "configAdminButton") {
//		changeStyle("modal-mkAdminTable", "none");
//		changeStyle("modal-configAdminTable", "block");
//	}
//}
//function changeStyle(id, style) {
//	var currentObject = document.getElementById(id);
//	currentObject.style.display = style;
//}

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
////删除、批量删除弹出框确认按钮的点击
//
//function modalDelete(name){
//	
//}
//
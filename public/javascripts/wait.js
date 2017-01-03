$(function() {
	waitHtmlInfo(); //获取后台数据
	AfterWaitHtmlinfo(); //具体细节操作
})

function AfterWaitHtmlinfo() {

	/*增加*/
	var oButtonAdd = document.getElementById("wait-add");
	oButtonAdd.onclick = function() {
			$("#myAddModal").modal("toggle");
			$(".modal-backdrop").addClass("new-backdrop"); //去掉后面的阴影效果
			myCloseEnsure("#myAddModal");
		}
		/*多项删除*/
	var oButton = document.getElementById("wait-delete");
	oButton.onclick = function() {
			console.log("in delete");
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
				$("#myMoreDeleteModalLabel").text("删除");
				$('#myMoreDeleteModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
			} else {
				$("#myDeleteDialogModalLabel").text("请注意：");
				$('#myDeleteDialogModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
			}

		}
		/*批量修改*/
	var oButton = document.getElementById("wait-change");
	oButton.onclick = function() {
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
				$("#myMoreEditModalLabel").text("批量修改");
				$('#myMoreEditModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				myCloseEnsure("#myMoreEditModal");
			} else {
				$("#myDeleteDialogModalLabel").text("请注意：");
				$('#myDeleteDialogModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");

			}
		}
		/*批量修改-保存-确认框*/
	var oButton = document.getElementById("MoreEditSubmit");
	oButton.onclick = function() {
		console.log("in delete");
		$('#myMoreEditSubmitModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}
	var oButton = document.getElementById("myMoreDeleteSubmit");
	oButton.onclick = function() {
		console.log("in delete");
		$('#myMoreEditSubmitModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}

	/*单项编辑*/
	var oClassButtons = new Array();
	oClassButtons = document.getElementsByClassName("eachedit");
	for(var i = 0; i < oClassButtons.length; i++) {
		oClassButtons[i].index = i;
		oClassButtons[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			$("#myAddModalLabel").text("新增机芯机型");
			$('#myAddModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("newChip").value = "编辑功能";
			myCloseEnsure("#myAddModal");
		}
	}

	/*单项删除*/
	var oClassButtons = new Array();
	oClassButtons = document.getElementsByClassName("eachdelete");
	for(var i = 0; i < oClassButtons.length; i++) {
		oClassButtons[i].index = i;
		oClassButtons[i].onclick = function() {
			console.log("in delete");
			$("#myMoreDeleteModalLabel").text("删除");
			$('#myMoreDeleteModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
	}

	/*单项复制*/
	var oClassButtons = new Array();
	oClassButtons = document.getElementsByClassName("eachcopy");
	for(var i = 0; i < oClassButtons.length; i++) {
		oClassButtons[i].index = i;
		oClassButtons[i].onclick = function() {
			console.log(this.index); //点击的是第几个
			$("#myAddModalLabel").text("新增机芯机型");
			$('#myAddModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
			$(".modal-backdrop").addClass("new-backdrop");
			document.getElementById("newChip").value = "复制功能";

			myCloseEnsure("#myAddModal");
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
	function myCloseEnsure(currentModalname) {
		var oCloseEnsure = new Array();
		oCloseEnsure = document.getElementsByClassName("myclose");
		for(var i = 0; i < oCloseEnsure.length; i++) {
			oCloseEnsure[i].index = i;
			oCloseEnsure[i].onclick = function() {
				console.log(this.index); //点击的是第几个
				if(this.index == 0) {
					$('#myEditEnsureModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname);
				} else if(this.index == 1) {
					$('#myEditEnsureModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname);
				} else if(this.index == 2) {
					$('#myMoreDeleteModal').modal();
					$(".modal-backdrop").addClass("new-backdrop");
					myCloseEnsuretrue(oCloseEnsure, this.index, currentModalname);
				}
			}
		}
	}

	function myCloseEnsuretrue(obj, number, modalName) {
		var oClosetrue = new Array();
		var oClosetrue = document.getElementsByClassName("ensureTrue");
		for(var i = 0; i < oClosetrue.length; i++) {
			oClosetrue[i].onclick = function() {
				console.log("lxw:" + obj[number].className + "modalName=" + modalName);
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
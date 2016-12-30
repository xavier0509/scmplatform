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
	var myCheckedNumber =0;
	myCheckboxChecked = document.getElementsByClassName("checkboxstatus");
	console.log("lxw:"+myCheckboxChecked.length);
	for (var i=0; i<myCheckboxChecked.length; i++) {
		if ($('.checkboxstatus')[i].checked == true) {
			myCheckedNumber++;
		}
	}
	console.log("lxw:"+myCheckedNumber);
	if (myCheckedNumber != 0) {
		$("#myMoreDeleteModalLabel").text("删除");
		$('#myMoreDeleteModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	} else{
		$("#myDeleteDialogModalLabel").text("请注意：");
		$('#myDeleteDialogModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}
	
}
/*批量修改*/
var oButton = document.getElementById("wait-change");
oButton.onclick = function() {
	$("#myMoreEditModalLabel").text("批量修改");
	$('#myMoreEditModal').modal();
	$(".modal-backdrop").addClass("new-backdrop");
	myCloseEnsure("#myMoreEditModal");
}
/*批量修改-保存-确认框*/
var oButton = document.getElementById("MoreEditSubmit");
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

function changeStyle(id, style) {
	var currentObject = document.getElementById(id);
	currentObject.style.display = style;
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
			if (this.index == 0) {
				$('#myEditEnsureModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				myCloseEnsuretrue(oCloseEnsure,this.index,currentModalname);
			} else if(this.index == 1){
				$('#myEditEnsureModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				myCloseEnsuretrue(oCloseEnsure,this.index,currentModalname);
			}
			else if(this.index == 2){
				$('#myMoreDeleteModal').modal();
				$(".modal-backdrop").addClass("new-backdrop");
				myCloseEnsuretrue(oCloseEnsure,this.index,currentModalname);
			}
		}
	}
}

function myCloseEnsuretrue(obj,number,modalName){
	var oClosetrue = new Array();
	var oClosetrue = document.getElementsByClassName("ensureTrue");
	for (var i=0; i<oClosetrue.length; i++) {
		oClosetrue[i].onclick = function(){
			console.log("lxw:"+obj[number].className+"modalName="+modalName);
			$(modalName).modal('hide')
		}
	}
}

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
	function toSaveButton(index){
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
			} else if(this.index == 1) {
				console.log("lxw " + "点击的是向上");
			} else if(this.index == 2) {
				console.log("lxw " + "点击的是向下");
			} else if(this.index == 3) {
				console.log("lxw " + "点击的是删除");
			} else if(this.index == 4) {
				console.log("lxw " + "点击的是全部删除");
			}
		}
	}
}

/*点击配置管理，获取数据*/
function ConfigHtmlInfo() {
	console.log("lxw " + "ConfigHtmlInfo");
}
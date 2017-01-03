$(function() {
	ChipModeHtmlInfo();
	AfterChipModeHtmlInfo();
})

function AfterChipModeHtmlInfo() {

	/*机芯机型板块-机芯-增加*/
	var oButtonAdd = document.getElementById("manage-chipAdd");
	oButtonAdd.onclick = function() {
		$('#myModeChipAddModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
	}

	/*机芯机型板块-机型-增加*/
	var oButtonAdd = document.getElementById("manage-modeAdd");
	oButtonAdd.onclick = function() {
			$('#myModeChipAddModal').modal();
			$(".modal-backdrop").addClass("new-backdrop");
		}
		/*机芯机型板块-机芯-修改*/
	var oTableA = $("#chip-mkTable").find("a");
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			$('#myModeChipAddModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
		}
	}
	/*机芯机型板块-机型-修改*/
	var oTableA = $("#modal-mkTable").find("a");
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			$('#myModeChipAddModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
		}
	}

	/*机芯机型板块-机芯-增加-关闭*/
	var hipOrModeClose = document.getElementById("inputChipOrModeClose");
	hipOrModeClose.onclick = function() {
			console.log("lxw " + "in inputChipOrModeClose");
		}
	/*机芯机型板块-机芯-增加-保存*/
	var ChipOrModeSubmit = document.getElementById("inputChipOrModeSubmit");
	ChipOrModeSubmit.onclick = function() {
		console.log("lxw " + "in inputChipOrModeSubmit");
	}

}

/*点击机芯机型管理，获取数据*/
function ChipModeHtmlInfo() {
	console.log("lxw " + "ChipModeHtmlInfo");
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	sendHTTPRequest("/api/searchplatformmodel", '{"data":""}', ChipHtmlInfo);
	//ChipModeHtmlInfo();
	//AfterChipModeHtmlInfo();
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
			//给保存按钮传参
		toSaveButton(this.index);
	}
	/*机芯机型板块-机型-修改*/
	var oTableA = $("#modal-mkTable").find("a");
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++){
		oTableA[i].index = i;
		oTableA[i].onclick = function(){
			console.log("ok" + this.index); //点击的是第几个
			$('#myModeChipAddModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
		}
	}
	/*机芯机型板块-机芯-增加-关闭*/
	var hipOrModeClose = document.getElementById("inputChipOrModeClose");
	hipOrModeClose.onclick = function(){
		console.log("lxw " + "in inputChipOrModeClose");
	}
	/*机芯机型板块-机芯-增加-保存*/
	function toSaveButton(index){
		var ChipOrModeSubmit = document.getElementById("inputChipOrModeSubmit");
		ChipOrModeSubmit.onclick = function(){
			console.log("lxw " + "in inputChipOrModeSubmit");
		}
	}
}

/*机芯-获取数据*/
function ChipHtmlInfo() {
	console.log("lxw " + "ChipHtmlInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			var _rowChip = document.getElementById("chipManageAdd-td");
			for(var i = 0; i < data.data.length; i++) {
				_rowChip.innerHTML += "<div class='col-xs-4'><a>" + data.data[i].name + "</a></div>";
			}
		};
		sendHTTPRequest("/api/searchproductmodel", '{"data":""}', ModeHtmlInfo);
	}
	
	//AfterChipModeHtmlInfo();
}
/*机型-获取数据*/
function ModeHtmlInfo() {
	console.log("lxw " + "ModeHtmlInfo");
	console.log("this.readyState = " + this.readyState);
	if(this.readyState == 4) {
		console.log("this.status = " + this.status);
		console.log("this.responseText = " + this.responseText);
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data.data.length);
			var _rowMode = document.getElementById("modalManageAdd-td");
			for(var i = 0; i < data.data.length; i++) {
				_rowMode.innerHTML += "<div class='col-xs-4'><a>" + data.data[i].name + "</a></div>";
			}
		};
	}
	AfterChipModeHtmlInfo();
}

document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

$(function() {
	sendHTTPRequest("/fybv2_api/chipQuery", '{"data":""}', SearchChipInfo);
})

function AfterChipModeHtmlInfo() {
	/*机芯机型板块-机芯-增加*/
	var oButtonAdd = document.getElementById("manage-chipAdd");
	oButtonAdd.onclick = function() {
		console.log("点击增加机芯按钮");
		$('#myModeChipAddModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("lableText").innerText = "输入机芯名称：";
		toSaveButton("chip", "-1", "");
	}
	/*机芯机型板块-机型-增加*/
	var oButtonAdd = document.getElementById("manage-modeAdd");
	oButtonAdd.onclick = function() {
		$('#myModeChipAddModal').modal();
		$(".modal-backdrop").addClass("new-backdrop");
		document.getElementById("lableText").innerText = "输入机型名称：";
		toSaveButton("model", "-1", "", "");
	}
	/*机芯机型板块-机芯-修改*/
	var oTableA = $("#chipManager-mkTable").find("a");
	console.log(oTableA.length);
	for(var i = 0; i < oTableA.length; i++) {
		oTableA[i].index = i;
		oTableA[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			var thisIndexName = oTableA[this.index].innerText;//通过englishName找到对应数据
			var thisIndexId = oTableA[this.index].name;//通过id找到对应数据
			$('#myModeChipAddModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			//给保存按钮传参
			toSaveButton("chip", this.index, thisIndexName, thisIndexId);
		}
	}
	/*机芯机型板块-机型-修改*/
	var oTableB = $("#modeManager-mkTable").find("a");
	//console.log(oTableB.length);
	for(var i = 0; i < oTableB.length; i++) {
		oTableB[i].index = i;
		oTableB[i].onclick = function() {
			console.log("ok" + this.index); //点击的是第几个
			var thisIndexName = oTableB[this.index].innerText;//通过englishName找到对应数据
			var thisIndexId = oTableB[this.index].name;//通过id找到对应数据
			$('#myModeChipAddModal').modal(); //显示新建与编辑机芯机型时的弹框
			$(".modal-backdrop").addClass("new-backdrop");
			toSaveButton("model", this.index, thisIndexName, thisIndexId);
		}
	}
	/*机芯机型板块-机芯-增加-关闭*/
	var hipOrModeClose = document.getElementById("inputChipOrModeClose");
	hipOrModeClose.onclick = function() {
		console.log("lxw " + "in inputChipOrModeClose");
	}
	/*机芯机型板块-机芯-增加-保存*/
	function toSaveButton(name, index, oldname, idname) {
		var ChipOrModeSubmit = document.getElementById("inputChipOrModeSubmit");
		ChipOrModeSubmit.onclick = function() {
			console.log("点击了保存按钮" + name + "--" + index +"--"+ idname + "--" + oldname);
			var currentChipOrModelName = document.getElementById("chipOrMode").value;
			if (currentChipOrModelName == "") {
				document.getElementById("chipMangInfo").innerHTML="该数据不可为空！";
				setTimeout("document.getElementById('chipMangInfo').innerHTML='　'",3000);
			}
			else{
				if(name == "chip") {
					if(index == "-1") {
						console.log("lxw " + "新增机芯的保存按钮" + currentChipOrModelName);
						var creatChip = '{"data":{"name":"' + currentChipOrModelName + '"}}';
						sendHTTPRequest("/fybv2_api/chipAdd", creatChip, CreatChipInfo);
					} else {
						console.log("lxw " + "修改机芯的保存按钮" + currentChipOrModelName);
						//var changeChip = '{"data":{"old":"' + oldname + '","newer":"' + currentChipOrModelName + '"}}';
						var changeChip = '{"data":{"_id":"'+ idname +'","update":{"old":"' + oldname + '","newer":"' + currentChipOrModelName + '"}}}';
						console.log("lxw " + changeChip);
						sendHTTPRequest("/fybv2_api/chipUpdate", changeChip, ChangeChipInfo);
					}
				} else if(name == "model") {
					if(index == "-1") {
						console.log("lxw " + "新增机型的保存按钮" + currentChipOrModelName);
						var creatModel = '{"data":{"name":"' + currentChipOrModelName + '"}}';
						console.log("lxw " + creatModel);
						sendHTTPRequest("/fybv2_api/modelAdd", creatModel, CreatModelInfo);
					} else {
						console.log("lxw " + "修改机型的保存按钮" + currentChipOrModelName);
						//var changeModel = '{"data":{"old":"' + oldname + '","newer":"' + currentChipOrModelName + '"}}';
						var changeModel = '{"data":{"_id":"'+ idname +'","update":{"old":"' + oldname + '","newer":"' + currentChipOrModelName + '"}}}';
						console.log("lxw " + changeModel);
						sendHTTPRequest("/fybv2_api/modelUpdate", changeModel, ChangeModelInfo);
					}
				}
			}
			
		}
	}
}

/*机芯-查询数据*/
function SearchChipInfo() {
	console.log("lxw " + "SearchChipInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data);
			console.log("lxw " + data.data.length);
			var _rowChip = document.getElementById("chipManageAdd-td");
			for(var i = 0; i < data.data.length; i++) {
				_rowChip.innerHTML += "<div class='col-xs-4'><a name='"+data.data[i]._id+"' title='"+data.data[i].name+"'>" + data.data[i].name + "</a></div>";
			}
		};
		sendHTTPRequest("/fybv2_api/modelQuery", '{"data":""}', SearchModeInfo);
	}
}
/*机芯-新增数据*/
function CreatChipInfo() {
	console.log("lxw " + "CreatChipInfo");
	if(this.readyState == 4) {
		if(this.status == 200) //TODO
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "creat chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "新增成功");
				freshHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "新增失败");
			};
		}
	}
}
/*机芯-修改数据*/
function ChangeChipInfo() {
	console.log("lxw " + "ChangeChipInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + "change chipinfo success");
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				freshHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
			};
		};
	}
}
/*机型-查询数据*/
function SearchModeInfo() {
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data);
			console.log("lxw " + data.data.length);
			var _rowMode = document.getElementById("modalManageAdd-td");
			for(var i = 0; i < data.data.length; i++) {
				_rowMode.innerHTML += "<div class='col-xs-4'><a name='"+data.data[i]._id+"' title='"+data.data[i].name+"'>" + data.data[i].name + "</a></div>";
			}
		};
		AfterChipModeHtmlInfo();
	}

}
/*机型-新增数据*/
function CreatModelInfo() {
	console.log("lxw " + "CreatModelInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myConfigAddChangeModal").modal('hide');
				freshHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("chipMangInfo").style.display = "block";
				document.getElementById("chipMangInfo").innerHTML = "添加失败";
			};
		};
	}
}
/*机型-修改数据*/
function ChangeModelInfo() {
	console.log("lxw " + "ChangeModelInfo");
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			if(data.msg == "success") {
				console.log("lxw " + "修改成功");
				$("#myConfigAddChangeModal").modal('hide');
				freshHtml();
			} else if(data.msg == "failure") {
				console.log("lxw " + "修改失败");
				document.getElementById("chipMangInfo").style.display = "block";
				document.getElementById("chipMangInfo").innerHTML = "修改失败";
			};
		};
	}
}
/*刷新页面*/
function freshHtml() {
	var htmlObject = parent.document.getElementById("tab_userMenu4");
	console.log("lxw " + htmlObject.firstChild.src);
	htmlObject.firstChild.src = "manage-chipmode.html";
}
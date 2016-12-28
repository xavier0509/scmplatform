/*模块管理板块-增加与编辑*/
var oButtonAdd = document.getElementById("manage-moduleAdd");
oButtonAdd.onclick = function() {
	$('#myModuleAddChangeModal').modal();
	$(".modal-backdrop").addClass("new-backdrop");
}

/*机芯机型板块-机型-修改------------这里需要分级------ table-tr-a   */
var oTableA = $("#module-mkTable").find("a")
console.log(oTableA.length);
for (var i=0; i<oTableA.length; i++) {
	oTableA[i].index = i;
	oTableA[i].onclick = function(){
		console.log("ok"+this.index); //点击的是第几个
		$('#myModuleAddChangeModal').modal();//显示新建与编辑机芯机型时的弹框
		$(".modal-backdrop").addClass("new-backdrop");
	}
}
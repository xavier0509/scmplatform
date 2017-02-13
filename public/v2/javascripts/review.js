document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
// document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

var level = null;
var loginusername = null;
var hashObj = {};
//加载自执行，传递参数请求列表
$(function () {
    level = parent.adminFlag;
    loginusername = parent.loginusername;
    // console.log("得到的用户名："+loginusername+"得到的权限标志："+level);
    if (level == 1) {
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"$or":[{"gerritState":"1"},{"gerritState":"2","userName":"'+loginusername+'"}]},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1}}}', reviewlist);
    }
    else{
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"userName":"'+loginusername+'","$or":[{"gerritState":"1"},{"gerritState":"2"}]},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1}}}', reviewlist);
    }     
    XandCancle();
})
var chip = null;
var model = null;
var operate = null;
var fileUsername = null;
var adminControl = null;


function XandCancle(){
	var oButtonAdd = document.getElementById("oButtonX");
	oButtonAdd.onclick = function() {
		console.log("X按钮");
		document.getElementById("mydialog").style.display = "none";
	}
	var oButtonAdd = document.getElementById("oButtonCancle");
	oButtonAdd.onclick = function() {
		console.log("取消按钮");
		document.getElementById("mydialog").style.display = "none";
	}
}

//在待审核页面出现列表
function reviewlist(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var title=document.getElementById("reviewmytable"); //获取tbody的表格内容
            for (var i = title.childNodes.length-1; i > 0; i--) {
                title.removeChild(title.childNodes[i]); //删除掉每个子节点的内容
            };          
            var data = JSON.parse(this.responseText);
            var level = parent.adminFlag;
            // console.log("level:"+level)
            var _row;
            var msg = data.msg;
            if (msg == "success") {
                var datalength = data.data;
                for (var i = 0; i < datalength.length; i++) {
                    _row = document.getElementById("reviewmytable").insertRow(0);
                    var _cell1 = _row.insertCell(0);
                    _cell1.innerHTML = datalength[i].chip;
                    var _cell2 = _row.insertCell(1);
                    _cell2.innerHTML = datalength[i].model;
                    var _cell3 = _row.insertCell(2);
                    _cell3.innerHTML = datalength[i].androidVersion;
                    var _cell4 = _row.insertCell(3);
                    _cell4.innerHTML = datalength[i].chipModel;
                    var _cell5 = _row.insertCell(4);
                    _cell5.innerHTML = datalength[i].memorySize;
                    var _cell6 = _row.insertCell(5); 
                    var operateType = datalength[i].operateType;   
                    var gerritState = datalength[i].gerritState;  
                    var userName = datalength[i].userName;              
                    if (level == 1) {
                        if (userName == loginusername) {
                            _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,1)'>审核</button></div><div class='btn-group'><button type='button' class='btn btn-default' onclick='edit(this,2)'>编辑</button></div>";
                        }
                        else{
                            _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,1)'>审核</button></div>";
                        }
                    }
                    else{
                        if (operateType == 2) {
                             _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='recover(this)'>恢复</button></div>";

                        }
                        else{
                            _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,2)'>编辑</button></div>";

                        }
                    }
                    
                    var _cell7 = _row.insertCell(6); 
                    _cell7.style.color="red";
                    if (operateType == 1) {  
                        if(gerritState == 1){_cell7.innerHTML = "新增(待审核)";}
                        else{_cell7.innerHTML = "新增(审核未通过)";}                
                       
                    }
                    else if (operateType == 2) {
                        if(gerritState == 1){_cell7.innerHTML = "删除(待审核)";}
                        else{_cell7.innerHTML = "删除(审核未通过)";}
                    }
                    else if (operateType == 3) {
                        if(gerritState == 1){_cell7.innerHTML = "修改(待审核)";}
                        else{_cell7.innerHTML = "修改(审核未通过)";}
                    }
                    var _cell8 = _row.insertCell(7);
                    _cell8.innerHTML = userName;
                    // _cell8.style.display="none";
                    var _cell9 = _row.insertCell(8);
                    _cell9.innerHTML = operateType;
                    _cell9.style.display="none";
                    
                };
            }
            else{
                //查询为空

            }
            
        }
    }
}

//恢复提示框
var rechip = null;
var remodel = null;
function recover(obj){
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    rechip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    remodel = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    document.getElementById("myDeleteModalLabel").innerHTML = "恢复操作";
    document.getElementById("dialogword").innerHTML = "确认撤销删除吗？";   
    document.getElementById("myDeleteModalEnsure").onclick = recoverSure;

}
//点击恢复按钮执行函数-----将待审核状态置0
function recoverSure(obj){    
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"chip":"'+rechip+'","model":"'+remodel+'"},"action":"set","update":{"operateType":"0","gerritState":"0"}}}',recoverResult);

}

//恢复的回调函数
function recoverResult(){
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                freshReviewHtml();
            };

        }
    }

}


$('#configbutton').click(function(){
    $("#reviewconfigfile").css("display","block");
    $("#reviewmkfile").css("display","none");
    buttonStyle("configbutton","mkbutton");
})

$('#mkbutton').click(function(){
    $("#reviewconfigfile").css("display","none");
    $("#reviewmkfile").css("display","block");
	buttonStyle("mkbutton","configbutton");    
})

function buttonStyle(name1, name2){
	document.getElementById(name1).style.color = "#333";
	document.getElementById(name1).style.backgroundColor = "#e6e6e6";
	document.getElementById(name1).style.borderColor = "#adadad";
	document.getElementById(name2).style.color = "#333";
	document.getElementById(name2).style.backgroundColor = "#fff";
	document.getElementById(name2).style.borderColor = "#ccc";
}


//点击编辑、审核出现页面的执行函数
function review(obj,adminControl){
    adminControl = adminControl;
    console.log("操作按钮："+adminControl);
    chip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    operate = obj.parentNode.parentNode.parentNode.children[8].innerHTML;
    fileUsername = obj.parentNode.parentNode.parentNode.children[7].innerHTML;
    buttonStyle("mkbutton","configbutton");
    document.getElementById("myAddModalLabel").innerHTML = "审核";
    if(document.getElementById("closeReview1")){
        document.getElementById("closeReview1").setAttribute("id","closeReview");
        
    }
    //查询模块信息接口
    sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":{}}', moduleResult);    
    
}

function edit(obj,adminControl){
    adminControl = adminControl;
    console.log("操作按钮："+adminControl);
    chip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    operate = obj.parentNode.parentNode.parentNode.children[8].innerHTML;
    fileUsername = obj.parentNode.parentNode.parentNode.children[7].innerHTML;
    buttonStyle("mkbutton","configbutton");
    document.getElementById("myAddModalLabel").innerHTML = "编辑";
    if(document.getElementById("closeReview")){
        document.getElementById("closeReview").setAttribute("id","closeReview1");
        document.getElementById("closeReview1").onclick=closeFunT;
    }
    //查询模块信息接口
    sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":{}}', moduleResult2);    
    
}

//罗列出所有的mk信息
function moduleResult(){
    
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            console.log("操作1："+adminControl);
            $('#myCheckModal').modal();
            $(".modal-backdrop").addClass("new-backdrop");
            var data = JSON.parse(this.responseText);
            console.log(data);
            var kk = 0;
			var _rowCheckPageApp = document.getElementById("myCheckModalMkTableApp");
			var _rowCheckPageService = document.getElementById("myCheckModalMkTableService");
			var _rowCheckPageAppStore = document.getElementById("myCheckModalMkTableAppStore");
			var _rowCheckPageHomePage = document.getElementById("myCheckModalMkTableHomePage");
			var _rowCheckPageIME = document.getElementById("myCheckModalMkTableIME");
			var _rowCheckPageSysApp = document.getElementById("myCheckModalMkTableSysApp");
			var _rowCheckPageTV = document.getElementById("myCheckModalMkTableTV");
			var _rowCheckPageOther = document.getElementById("myCheckModalMkTableOther");
			_rowCheckPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowCheckPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowCheckPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowCheckPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowCheckPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowCheckPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowCheckPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowCheckPageOther.innerHTML = "<div title='Other'>Other:</div>";
			
			for(var i = 0; i < data.data.length; i++) {
				console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowCheckPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowCheckPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowCheckPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowCheckPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowCheckPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowCheckPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowCheckPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowCheckPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
      	}
	//查询config信息接口
  	sendHTTPRequest("/fybv2_api/configQuery", '{"data":{}}', configResult); 
  	}
}

function moduleResult2(){
    
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            console.log("操作1："+adminControl);
            $('#myCheckModal').modal();
            $(".modal-backdrop").addClass("new-backdrop");
            //document.getElementById("mkbutton").setAttribute("background-color: rgb(230, 230, 230);");
            var data = JSON.parse(this.responseText);
            console.log(data);
            var kk = 0;
            var _rowCheckPageApp = document.getElementById("myCheckModalMkTableApp");
            var _rowCheckPageService = document.getElementById("myCheckModalMkTableService");
            var _rowCheckPageAppStore = document.getElementById("myCheckModalMkTableAppStore");
            var _rowCheckPageHomePage = document.getElementById("myCheckModalMkTableHomePage");
            var _rowCheckPageIME = document.getElementById("myCheckModalMkTableIME");
            var _rowCheckPageSysApp = document.getElementById("myCheckModalMkTableSysApp");
            var _rowCheckPageTV = document.getElementById("myCheckModalMkTableTV");
            var _rowCheckPageOther = document.getElementById("myCheckModalMkTableOther");
            _rowCheckPageApp.innerHTML = "<div title='App'>App:</div>";
            _rowCheckPageService.innerHTML = "<div title='Service'>Service:</div>";
            _rowCheckPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
            _rowCheckPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
            _rowCheckPageIME.innerHTML = "<div title='IME'>IME:</div>";
            _rowCheckPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
            _rowCheckPageTV.innerHTML = "<div title='TV'>TV:</div>";
            _rowCheckPageOther.innerHTML = "<div title='Other'>Other:</div>";
            
            for(var i = 0; i < data.data.length; i++) {
                console.log("lxw " + data.data[i].category);
                if(data.data[i].category == "App") {
                    kk = i;
                    _rowCheckPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "Service") {
                    kk = i;
                    _rowCheckPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "AppStore") {
                    kk = i;
                    _rowCheckPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "HomePage") {
                    kk = i;
                    _rowCheckPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "IME") {
                    kk = i;
                    _rowCheckPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "SysApp") {
                    kk = i;
                    _rowCheckPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "TV") {
                    kk = i;
                    _rowCheckPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "Other") {
                    kk = i;
                    _rowCheckPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                }
            }
        }
    //查询config信息接口
    sendHTTPRequest("/fybv2_api/configQuery", '{"data":{}}', configResult2); 
    }
}

function configResult(){
    console.log("操作2："+adminControl);
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
      	{
      		var data = JSON.parse(this.responseText);
			var kk = 0;
			var pullDataOne, pullDataTwo = null;
			var _rowCheckPageConfigMain = document.getElementById("myCheckModalConfigTableTdMain");
			var _rowCheckPageConfigHardware = document.getElementById("myCheckModalConfigTableTdHardware");
			var _rowCheckPageConfigServerip = document.getElementById("myCheckModalConfigTableTdServerip");
			var _rowCheckPageConfigAd = document.getElementById("myCheckModalConfigTableTdAd");
			var _rowCheckPageConfigChannel = document.getElementById("myCheckModalConfigTableTdChannel");
			var _rowCheckPageConfigLocalmedia = document.getElementById("myCheckModalConfigTableTdLocalmedia");
			var _rowCheckPageConfigBrowser = document.getElementById("myCheckModalConfigTableTdBrowser");
			var _rowCheckPageConfigOther = document.getElementById("myCheckModalConfigTableTdOther");

			_rowCheckPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
			_rowCheckPageConfigHardware.innerHTML = "<div title='hardware'>硬件配置信息：</div>";
			_rowCheckPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
			_rowCheckPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
			_rowCheckPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
			_rowCheckPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
			_rowCheckPageConfigBrowser.innerHTML = "<div title='browser'>浏览器配置：</div>";
			_rowCheckPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].category == "main") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					console.log("main:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigMain.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigMain.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "hardware") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("hardware:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigHardware.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigHardware.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigServerip.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigAd.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigChannel.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("localmedia:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "browser") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("browser:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigBrowser.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigBrowser.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
      	}
    // 查询对应机芯机型的配置信息
    sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult);   
    }
}

function configResult2(){
    console.log("操作2："+adminControl);
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            var kk = 0;
            var pullDataOne, pullDataTwo = null;
            var _rowCheckPageConfigMain = document.getElementById("myCheckModalConfigTableTdMain");
            var _rowCheckPageConfigHardware = document.getElementById("myCheckModalConfigTableTdHardware");
            var _rowCheckPageConfigServerip = document.getElementById("myCheckModalConfigTableTdServerip");
            var _rowCheckPageConfigAd = document.getElementById("myCheckModalConfigTableTdAd");
            var _rowCheckPageConfigChannel = document.getElementById("myCheckModalConfigTableTdChannel");
            var _rowCheckPageConfigLocalmedia = document.getElementById("myCheckModalConfigTableTdLocalmedia");
            var _rowCheckPageConfigBrowser = document.getElementById("myCheckModalConfigTableTdBrowser");
            var _rowCheckPageConfigOther = document.getElementById("myCheckModalConfigTableTdOther");

            _rowCheckPageConfigMain.innerHTML = "<div title='main'>核心功能：</div>";
            _rowCheckPageConfigHardware.innerHTML = "<div title='hardware'>硬件配置信息：</div>";
            _rowCheckPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
            _rowCheckPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
            _rowCheckPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
            _rowCheckPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
            _rowCheckPageConfigBrowser.innerHTML = "<div title='browser'>浏览器配置：</div>";
            _rowCheckPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

            for(var i = 0; i < data.data.length; i++) {
                if(data.data[i].category == "main") {
                    kk = i;
                    pullDataOne = JSON.stringify(data.data[kk]);
                    console.log("main:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigMain.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigMain.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "hardware") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("hardware:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigHardware.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigHardware.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "serverip") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("serverip:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigServerip.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigServerip.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "ad") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("ad:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigAd.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigAd.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "channel") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("channel:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigChannel.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigChannel.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "localmedia") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("localmedia:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigLocalmedia.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "browser") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("browser:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigBrowser.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigBrowser.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "other") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("other:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "' title='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigOther.innerHTML += _myAddselect;
                    }
                }
            }
        }
    // 查询对应机芯机型的配置信息
    sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult2);   
    }
}

function reviewresult(){
    console.log("操作3："+adminControl);
    var level = parent.adminFlag;
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            hashObj = data.data[0];
            //更新设备信息
            document.getElementById("newCheckChip").value=data.data[0].chip;
            document.getElementById("newCheckModel").value=data.data[0].model;
            document.getElementById("newCheckDevice").value=data.data[0].targetProduct;
            document.getElementById("newCheckAndroidVersion").value=data.data[0].androidVersion;
            document.getElementById("newCheckChipMode").value=data.data[0].chipModel;
            document.getElementById("newCheckMemory").value=data.data[0].memorySize;
            console.log("更新设备信息完毕！！");
            //更新mk文件信息，匹配后勾选
            var mkkey, mkcounter = 0;
			for(mkkey in data.data[0].mkFile) {
				mkcounter++;
				console.log("lxw counter = " + mkcounter + "--" + mkkey);
				document.getElementById(mkkey).removeAttribute("checked");
				//document.getElementById(mkkey).setAttribute('checked', '');
				document.getElementById(mkkey).checked = true;
				console.log(document.getElementById(mkkey).checked);
			};
			//生成config文件
			//console.log("lxw " + JSON.stringify(data.data[0].configFile));
			var configkey, configcounter = 0;
			for(configkey in data.data[0].configFile) {
				configcounter++;
				if(data.data[0].configFile[configkey].type == "string") {
					document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
				} else {
					document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
					var childSelect = document.getElementById(configkey).childNodes;
					for(var j = 0; j < childSelect.length; j++) {
						childSelect[j].removeAttribute("selected");
						if(childSelect[j].value == data.data[0].configFile[configkey].value) {
							childSelect[j].setAttribute("selected", "");
						}
					};
				}
			};
			//如果是管理员，不允许修改-----------更改提示框
            console.log("不同用户的管理等级：" + level);
            console.log("操作："+ adminControl);
            if(level == 1 ){
                // if (adminControl == 1) {
                    document.getElementById("noPassReview").style.display="block";
                                   
                    var inputcounts = document.getElementsByTagName("input");
                    var selectcounts = document.getElementsByTagName("select");
                    // console.log("inputcounts="+inputcounts.length);
                    document.getElementById("noPassReview").onclick = noPassIssue;
                    for (var i = 0; i < inputcounts.length; i++) {
                        inputcounts[i].setAttribute('disabled','');
                        inputcounts[i].style.backgroundColor = "#ebebe4";
                    }
                    for (var i = 0; i < selectcounts.length; i++) {
                        selectcounts[i].setAttribute('disabled','');
                        selectcounts[i].style.backgroundColor = "#ebebe4";
                    }
                    // console.log("操作状态:"+operate);
                    if (operate == 2) {
                        document.getElementById("reviewSubmit").innerHTML = "确认删除";
                        document.getElementById("reButton").innerHTML = "确认删除";
                        document.getElementById("reviewSubmit").style.color = "red";
                        document.getElementById("reButton").style.color = "red";
                        document.getElementById("btn_submit").onclick = deleteIssue;
                        document.getElementById("button_submit").onclick = deleteIssue;
                    }
                    else{
                        document.getElementById("reviewSubmit").innerHTML = "审核通过";
                        document.getElementById("reButton").innerHTML = "审核通过";
                        document.getElementById("btn_submit").onclick = passIssue;
                        document.getElementById("button_submit").onclick = passIssue;
                    }   
                // }            
            }
            else {
                document.getElementById("noPassReview").style.display="none";
                document.getElementById("reviewSubmit").innerHTML = "提交";
                document.getElementById("reButton").innerHTML = "提交";
                // document.getElementById("btn_submit").onclick = reviewEdit;
                document.getElementById("btn_submit").onclick = editIssue;
                document.getElementById("button_submit").onclick = editIssue;
                
                document.getElementById("newCheckChip").setAttribute('disabled','');
                document.getElementById("newCheckChip").style.backgroundColor = "#ebebe4";
                document.getElementById("newCheckModel").setAttribute('disabled','');
                document.getElementById("newCheckModel").style.backgroundColor = "#ebebe4";
            }
        }
    }
}

function reviewresult2(){
    console.log("操作3："+adminControl);
    var level = parent.adminFlag;
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            hashObj = data.data[0];
            //更新设备信息
            document.getElementById("newCheckChip").value=data.data[0].chip;
            document.getElementById("newCheckModel").value=data.data[0].model;
            document.getElementById("newCheckDevice").value=data.data[0].targetProduct;
            document.getElementById("newCheckAndroidVersion").value=data.data[0].androidVersion;
            document.getElementById("newCheckChipMode").value=data.data[0].chipModel;
            document.getElementById("newCheckMemory").value=data.data[0].memorySize;
            console.log("更新设备信息完毕！！");
            //更新mk文件信息，匹配后勾选
            var mkkey, mkcounter = 0;
            for(mkkey in data.data[0].mkFile) {
                mkcounter++;
                console.log("lxw counter = " + mkcounter + "--" + mkkey);
                document.getElementById(mkkey).removeAttribute("checked");
                //document.getElementById(mkkey).setAttribute('checked', '');
                document.getElementById(mkkey).checked = true;
                console.log(document.getElementById(mkkey).checked);
            };
            //生成config文件
            //console.log("lxw " + JSON.stringify(data.data[0].configFile));
            var configkey, configcounter = 0;
            for(configkey in data.data[0].configFile) {
                configcounter++;
                if(data.data[0].configFile[configkey].type == "string") {
                    document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
                } else {
                    document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
                    var childSelect = document.getElementById(configkey).childNodes;
                    for(var j = 0; j < childSelect.length; j++) {
                        childSelect[j].removeAttribute("selected");
                        if(childSelect[j].value == data.data[0].configFile[configkey].value) {
                            childSelect[j].setAttribute("selected", "");
                        }
                    };
                }
            };
            //如果是管理员，不允许修改-----------更改提示框
            console.log("不同用户的管理等级：" + level);
            console.log("操作："+ adminControl);
            
            document.getElementById("noPassReview").style.display="none";
            document.getElementById("reviewSubmit").innerHTML = "提交";
            document.getElementById("reButton").innerHTML = "提交";
            // document.getElementById("btn_submit").onclick = reviewEdit;
            document.getElementById("btn_submit").onclick = editIssue;
            document.getElementById("button_submit").onclick = editIssue;
            
            document.getElementById("newCheckChip").setAttribute('disabled','');
            document.getElementById("newCheckChip").style.backgroundColor = "#ebebe4";
            document.getElementById("newCheckModel").setAttribute('disabled','');
            document.getElementById("newCheckModel").style.backgroundColor = "#ebebe4";
            
        }
    }
}

//删除弹窗
function deleteIssue(){
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "删除操作";
    document.getElementById("dialogword").innerHTML = "确认要删除该配置信息吗？";
    document.getElementById("myDeleteModalEnsure").onclick = deleteSure;
}

//审核弹窗
function passIssue(){
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "确认通过审核吗？";
    document.getElementById("myDeleteModalEnsure").onclick = passSure;
}

//审核不通过弹窗
function noPassIssue(){
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "是否确认不通过该文件？";
    document.getElementById("myDeleteModalEnsure").onclick = noPassSure;
}

//编辑提交弹窗
function editIssue(){
    //$('#mydialog').modal();
   // $(".modal-backdrop").addClass("new-backdrop");
   	document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "编辑操作";
    document.getElementById("dialogword").innerHTML = "确认提交该修改吗？";
    document.getElementById("myDeleteModalEnsure").onclick = reviewEdit;    
}

//审核通过（针对编辑）
function passSure(){
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"operateType":"0","gerritState":"0"}}}',passResult);
}

//审核不通过
function noPassSure(){
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"gerritState":"2"}}}',passnotResult);
}

//删除操作
function deleteSure(){
    sendHTTPRequest("/fybv2_api/productDelete",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"}}}',deleteResult);
}

//点击删除的回调
function deleteResult(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                // console.log("删除成功！！！！");
                freshReviewHtml();
            };
        }
    }
}

//点击审核通过的回调
function passResult(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                console.log("审核成功！！！！");
                
            };

        }
        console.log("生成文件的机芯机型是："+chip+";"+model);
    sendHTTPRequest("/fybv2_api/generateFile",'{"data":{"chip":"'+chip+'","model":"'+model+'"}}',creatFile);
    freshReviewHtml();
    }
}

//点击审核不通过的回调
function passnotResult(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                freshReviewHtml();
            };

        }
    }
}

function creatFile(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                console.log("生成文件成功！！！！");
                
            }
            else{
                console.log(data.reason);
                freshReviewHtml();
            }

        }
    }
}


//点击编辑提交的函数
function reviewEdit(){
	console.log("lxw " + loginusername + "--" + level);
	var dataObj = {
		"configFile": "",
		"mkFile": "",
		"memorySize": "",
		"chipModel": "",
		"androidVersion": "",
		"model": "",
		"chip": "",
		"targetProduct": "",
		"gerritState": "1", // 0表示正常状态，1表示待审核状态，2表示审核不通过状态
		"operateType": "3", // 0表示无状态，1表示增加，2表示删除，3表示修改
		"userName": loginusername,
		"desc": "enenen"
	};
	// 获取DeviceInfo里的信息
	var oEchip = document.getElementById("newCheckChip").value;
	var oEmodel = document.getElementById("newCheckModel").value;
	var oEandroidVersion = document.getElementById("newCheckAndroidVersion").value;
	var oEchipModel = document.getElementById("newCheckChipMode").value;
	var oEmemorySize = document.getElementById("newCheckMemory").value;
	var oEtargetProduct = document.getElementById("newCheckDevice").value;
	var oEgerritState = "1";
	var oEoperateType = "3";
	var userName = loginusername;
	var desc = "enheng";

	//获取config里的数据
	var editConfigFile = {};
	var oEconfigTrlength = $("#myCheckModalConfigTableTbody").find("tr");
	console.log("lxw " + oEconfigTrlength.length);
	for(var i = 0; i < oEconfigTrlength.length; i++) {
		var oEConfigobj = {};
		var thisConfigindex = null;
		oEconfigTrDiv = $("#myCheckModalConfigTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oEconfigTrDiv.length);
		for(var j = 1; j < oEconfigTrDiv.length; j++) {
			var oEopt = [];
			var oEstuInfo = {
				"cnName": "",
				"engName": "",
				"configKey": "",
				"type": "",
				"value": "",
				"category": "",
				"desc": "XXXXX",
				"options": []
			};
			thisConfigindex = j;
			oEstuInfo.category = oEconfigTrDiv[0].title;
			oEstuInfo.cnName = oEconfigTrDiv[thisConfigindex].childNodes[0].title;
			oEstuInfo.engName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("name");
			oEstuInfo.configKey = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("configKey");
			oEstuInfo.type = oEconfigTrDiv[thisConfigindex].childNodes[1].name;
			oEstuInfo.value = oEconfigTrDiv[thisConfigindex].childNodes[1].value;
			if(oEstuInfo.type == "string") {
				oEopt = [];
			} else if(oEstuInfo.type == "enum") {
				var jjlength = oEconfigTrDiv[thisConfigindex].childNodes[1].childNodes;
				console.log("lxw " + jjlength.length);
				for(var jj = 0; jj < jjlength.length; jj++) {
					var optValue = jjlength[jj].value;
					oEopt.push(optValue);
				}
			}
			oEstuInfo.options = oEopt;
			editConfigFile[oEconfigTrDiv[thisConfigindex].childNodes[1].getAttribute("id")] = oEstuInfo;
		}
	}
	//获取mkFile里的信息
	var editMkFile = {};
	var oEMkTrDiv = $("#myCheckModalMkTableTbody").find("tr");
	console.log("lxw " + oEMkTrDiv.length);
	var oEMkindex = null;
	for(var i = 0; i < oEMkTrDiv.length; i++) {
		var oEMkobj = {};
		oEMkTrDivTwo = $("#myCheckModalMkTableTbody").find("tr:eq(" + i + ")").find("div");
		console.log("lxw" + oEMkTrDivTwo.length);
		for(var j = 1; j < oEMkTrDivTwo.length; j++) {
			oEMkindex = j;
			if(oEMkTrDivTwo[oEMkindex].childNodes[0].checked == true) {
				var oEoptTwo = [];
				var oEstuInfoTwo = {
					"cnName": "",
					"engName": "",
					"gitPath": "",
					"category": "",
					"desc": "XXXXX", //后期做“”的处理。
				};
				oEstuInfoTwo.category = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("category");
				oEstuInfoTwo.cnName = oEMkTrDivTwo[oEMkindex].childNodes[1].innerHTML;
				oEstuInfoTwo.engName = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("name");
				oEstuInfoTwo.gitPath = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("gitPath");
				editMkFile[oEMkTrDivTwo[oEMkindex].childNodes[0].getAttribute("id")] = oEstuInfoTwo;
			}
		}
	}
	dataObj.configFile = editConfigFile;
	dataObj.mkFile = editMkFile;
	dataObj.memorySize = oEmemorySize;
	dataObj.chipModel = oEchipModel;
	dataObj.androidVersion = oEandroidVersion;
	dataObj.model = oEmodel;
	dataObj.chip = oEchip;
	dataObj.targetProduct = oEtargetProduct;
	dataObj.gerritState = "1"; // 0表示审核通过，1表示待审核状态，2表示审核不通过状态
	dataObj.operateType = "3"; // 0表示无状态，1表示增加，2表示删除，3表示修改
	dataObj.userName = loginusername;
	dataObj.desc = "enenene";
	var oEnode = '{"data":{"condition":{"chip":"' + oEchip + '","model":"' + oEmodel + '"},"action":"set","update":{"userName":"' + loginusername + '","memorySize":"' + oEmemorySize + '","chipModel":"' + oEchipModel + '","androidVersion":"' + oEandroidVersion + '","targetProduct":"' + oEtargetProduct + '","gerritState":"1","operateType":"3","androidVersion":"' + oEandroidVersion + '","mkFile":' + JSON.stringify(editMkFile) + ',"configFile":' + JSON.stringify(editConfigFile) + '}}}';
	console.log("lxw " + oEnode);
	submitStatus(hashObj,dataObj,oEnode);
}


function reviewEditResult(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                // console.log("编辑提交成功！！！！");
                //$("#mydialog").modal('hide');
                document.getElementById("mydialog").style.display = "none";
                freshReviewHtml();
            }
            else{
                freshReviewHtml();
            }

        }
    }
}

//刷新当前iframe
function freshReviewHtml() {
    var htmlObject = parent.document.getElementById("tab_userMenu2");
    // console.log("页面1:"+htmlObject.firstChild);
    var indexObject = parent.document.getElementById("home");
    var iframe = indexObject.getElementsByTagName("iframe");
    // console.log("页面："+iframe[0]);
    // console.log("页面："+iframe);
    // console.log("页面2:"+indexObject.firstChild);
    // console.log("lxw " + htmlObject.firstChild.src);
    htmlObject.firstChild.src = "review.html";
    // console.log("要刷新主页了！！！！");
    iframe[0].src = "wait.html";
}   


document.getElementById("closeReview").onclick=closeFun;
function closeFun(){
    console.log("用户等级："+level);
    if (level == 1) {
        freshReviewHtml();
    }
    else{
        //$('#mydialog').modal();
        document.getElementById("mydialog").style.display = "block";
        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
        document.getElementById("myDeleteModalEnsure").onclick = freshReviewHtml;  
    }
    
}

function closeFunT(){
    console.log("用户等级："+level);
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
    document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
    document.getElementById("myDeleteModalEnsure").onclick = freshReviewHtml;  
}

function submitStatus(hashObj,dataObj,oEnode){
	var changeStatus = 0;
	console.log(hashObj);
	console.log(dataObj);
	var oldMKkey, oldMKkeycounter= 0;
	for(oldMKkey in hashObj.mkFile) {
		oldMKkeycounter++;
	}
	var oldConfigkey, oldConfigkeycounter = 0;
	for(oldConfigkey in hashObj.configFile) {
		oldConfigkeycounter++;
	}
	var newMKkey, newMKkeycounter = 0;
	for(newMKkey in dataObj.mkFile) {
		newMKkeycounter++;
	}
	var newConfigkey, newConfigkeycounter = 0;
	for(newConfigkey in dataObj.configFile) {
		newConfigkeycounter++;
	}
	console.log("old: "+oldMKkeycounter+"---"+oldConfigkeycounter);
	console.log("new: "+newMKkeycounter+"---"+newConfigkeycounter);
	if(oldMKkeycounter==newMKkeycounter&&oldConfigkeycounter==newConfigkeycounter){
		var ookey = 0;
		for(ookey in hashObj.mkFile) {
			//console.log(hashObj.mkFile[ookey].value+"--"+dataObj.mkFile[ookey].value);
			//console.log(typeof(dataObj.mkFile[ookey]));
			if(typeof(dataObj.mkFile[ookey])==="undefined"){
				//console.log("mk做了修改");
				changeStatus = 1;
			}else{
				//console.log("mk未做修改");
			}
		}
		var nnkey = 0;
		for(nnkey in hashObj.configFile) {
			//console.log(hashObj.configFile[nnkey].value+"--"+dataObj.configFile[nnkey].value);
			if(hashObj.configFile[nnkey].value == dataObj.configFile[nnkey].value){
				//console.log("config未做修改");
			}else{
				//console.log("config做了修改");
				changeStatus = 1;
			}
		}
	}else{
		changeStatus = 1;
	}
	console.log(changeStatus);
	if (dataObj.androidVersion==hashObj.androidVersion&&dataObj.memorySize==hashObj.memorySize&&dataObj.chipModel==hashObj.chipModel&&dataObj.targetProduct ==hashObj.targetProduct&&changeStatus == 0) {
		console.log("未做修改...");
		document.getElementById("myAddModalErrorInfo").innerHTML = "您未做任何修改。";
		setTimeout("document.getElementById('myAddModalErrorInfo').innerHTML='　'",3000);
	} else{
		console.log("做了修改...");
		sendHTTPRequest("/fybv2_api/productUpdate", oEnode, reviewEditResult);
	}
}


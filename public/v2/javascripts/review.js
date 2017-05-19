document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
// document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

var level = null;
var loginusername = null;
var hashObj = {};
var changeAdd = [];
var changeReduce = [];
var changeConf = [];
var changeDev = [];
var olrplayerid = null;
var fromEmail = null;
var toEmail = null;
var allTargetMk = null;
var targetForMK = null;
//加载自执行，传递参数请求列表
$(function () {
    level = parent.adminFlag;
    loginusername = parent.loginusername;
    fromEmail = parent.loginEmail;
    console.log("邮箱是："+loginusername);
    // console.log("得到的用户名："+loginusername+"得到的权限标志："+level);
    if (level == 1) {
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"$or":[{"gerritState":"1"}]},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1,"operateTime":1,"targetProduct":1},"sort":{"model":-1  }}}', reviewlist);
    }
    else{
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"userName":"'+loginusername+'","$or":[{"gerritState":"1"}]},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1,"operateTime":1,"targetProduct":1},"sort":{"model":-1  }}}', reviewlist);
    }     
    XandCancle();
})
var chip = null;
var model = null;
var targetProduct = null;
var operate = null;
var fileUsername = null;
var adminControl = null;
var emaiTo = null;


function XandCancle(){
	var oButtonAdd = document.getElementById("oButtonX");
	oButtonAdd.onclick = function() {
		console.log("X按钮");
		document.getElementById("mydialog").style.display = "none";
	}
	var oButtonCK_E = document.getElementById("myCK_X");
	oButtonCK_E.onclick = function() {
		console.log("确定按钮");
		document.getElementById("myVideoChangeDivTwo").style.display = "none";
	}
	var oButtonCK_E = document.getElementById("myCK_Ensure");
	oButtonCK_E.onclick = function() {
		console.log("确定按钮");
		document.getElementById("myVideoChangeDivTwo").style.display = "none";
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
                var thisK = datalength.length;
                for (var i = 0; i < datalength.length; i++) {
                    _row = document.getElementById("reviewmytable").insertRow(0);
                    var _cell1 = _row.insertCell(0);
                    _cell1.innerHTML = thisK--;
                     var _cell2 = _row.insertCell(1);
                    _cell2.innerHTML = datalength[i].model;
                    var _cell3 = _row.insertCell(2);
                    _cell3.innerHTML = datalength[i].chip;
                    var _cell4 = _row.insertCell(3);
                    _cell4.innerHTML = datalength[i].targetProduct;
                    _cell4.style.display="none"
                    var _cell5 = _row.insertCell(4);
                    _cell5.innerHTML = datalength[i].androidVersion;
                    var _cell6 = _row.insertCell(5);
                    _cell6.innerHTML = datalength[i].chipModel;
                    var _cell7 = _row.insertCell(6);
                    _cell7.innerHTML = datalength[i].memorySize;
                    var _cell8 = _row.insertCell(7); 
                    var operateType = datalength[i].operateType;   
                    var gerritState = datalength[i].gerritState; 
                    var operateTime = datalength[i].operateTime; 
                    var userName = datalength[i].userName;              
                    if (level == 1) {
                        if (userName == loginusername) {
                            if (operateType == 2) {
                                _cell8.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,2,2)'>审核</button></div><div class='btn-group'><button type='button' class='btn btn-default' onclick='recover(this)'>恢复</button></div>";
                            }
                            else{
                                _cell8.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,1,0)'>审核</button></div><div class='btn-group'><button type='button' class='btn btn-default' onclick='edit(this,2,0)'>编辑</button></div>";
                            }
                        }
                        else{
                            _cell8.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,1,"+operateType+")'>审核</button></div>";
                        }
                    }
                    else{
                        if (operateType == 2) {
                             _cell8.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='recover(this)'>恢复</button></div>";

                        }
                        else{
                            _cell8.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this,2,0)'>编辑</button></div>";

                        }
                    }
                    var _cell9 = _row.insertCell(8); 
                    _cell9.style.color="red";
                    if (operateType == 1) {  
                        if(gerritState == 1){_cell9.innerHTML = "新增";}
                        else{_cell9.innerHTML = "新增";}                
                       
                    }
                    else if (operateType == 2) {
                        if(gerritState == 1){_cell9.innerHTML = "删除";}
                        else{_cell9.innerHTML = "删除";}
                    }
                    else if (operateType == 3) {
                        if(gerritState == 1){_cell9.innerHTML = "修改";}
                        else{_cell9.innerHTML = "修改";}
                    }
                    var _cell10 = _row.insertCell(9);
                    _cell10.innerHTML = userName;
                    // _cell8.style.display="none";
                    var _cell11 = _row.insertCell(10);
                    _cell11.innerHTML = operateType;
                    _cell11.style.display="none";
                    _cell12 = _row.insertCell(11);
                    // _cell10.innerHTML = "fanyanbo@skyworth.com";
                    _cell12.style.display="none";
                };
            }
            
        }
        sendHTTPRequest("/fybv2_api/chipModelQuery", '{"data":""}', SearchChipTypeInfo);
    }
}

function SearchChipTypeInfo(){
	if(this.readyState == 4) {
		if(this.status == 200)
		{
			var data = JSON.parse(this.responseText);
			console.log("lxw " + data);
			console.log("lxw " + data.data.length);
			var _rowChipModeCheck = document.getElementById("newCheckChipMode");
			_rowChipModeCheck.innerHTML = "<option value=''></option>";
			for(var i = 0; i < data.data.length; i++) {
				_rowChipModeCheck.innerHTML += "<option value="+data.data[i].name+">"+data.data[i].name+"</option>";
			}
		};
	}
}

//恢复提示框
var rechip = null;
var remodel = null;
var retargetProduct =null;
function recover(obj){
    //$('#mydialog').modal();
    document.getElementById("mydialog").style.display = "block";
    rechip = obj.parentNode.parentNode.parentNode.children[2].innerHTML;
    remodel = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    retargetProduct = obj.parentNode.parentNode.parentNode.children[3].innerHTML;
    document.getElementById("myDeleteModalLabel").innerHTML = "恢复操作";
    document.getElementById("dialogword").innerHTML = "确认撤销删除吗？";   
    document.getElementById("myDeleteModalEnsure").onclick = recoverSure;

}
//点击恢复按钮执行函数-----将待审核状态置0
function recoverSure(obj){   
    var operateTime = new Date().getTime(); 
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"targetProduct":"'+retargetProduct+'","chip":"'+rechip+'","model":"'+remodel+'"},"action":"set","update":{"operateType":"0","gerritState":"0","operateTime":"'+ operateTime +'"}}}',recoverResult);

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
                if (level == "1") {
                    freshReviewHtml();
                }
                else{
                    var maildata = "用户："+loginusername+"<br/>恢复删除机芯："+rechip+",机型："+remodel+"的配置文档";
                    maildata += "<br/>该文档将重新出现在首页上，请确认<br/> -----<br/>To view visit <a href='http://localhost:3000/v2/scmplatform/index.html'>scmplatform</a>";
                    sendHTTPRequest("/fybv2_api/sendmail", '{"data":{"desc":"'+maildata+'","from":"'+fromEmail+'","to":"","subject":"软件配置平台通知-自动发送，请勿回复"}}', recovermailfun);
                }
            };

        }
    }

}

function recovermailfun(){
    if (this.readyState == 4) {
        if (this.status == 200) 
        {
            freshReviewHtml();
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
function review(obj,adminControl,deleteFlag){
	document.getElementById("loading").style.display = "block";
    adminControl = adminControl;
    var deleteFlag = deleteFlag;
    if (adminControl ) {
        if (deleteFlag != "2") {
            document.getElementById("changeDescDiv").style.display="block";
        }else{
            document.getElementById("changeDescDiv").style.display="none";
        }       
    }else{
        // document.getElementById("changeDescDiv").style.display="none";
    }
    $("#newFileDesc").hide();
    $("#changeDeviceDesc").hide();
    $("#addModelDesc").hide();
    $("#removeModelDesc").hide();
    $("#changeConfigDesc").hide();
    console.log("操作按钮："+adminControl);
    chip = obj.parentNode.parentNode.parentNode.children[2].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    targetProduct = obj.parentNode.parentNode.parentNode.children[3].innerHTML;
    operate = obj.parentNode.parentNode.parentNode.children[10].innerHTML;
    fileUsername = obj.parentNode.parentNode.parentNode.children[9].innerHTML;
    emaiTo = obj.parentNode.parentNode.parentNode.children[11].innerHTML;
    console.log("email:"+emaiTo);
    buttonStyle("mkbutton","configbutton");
    document.getElementById("myAddModalLabel").innerHTML = "审核";
    if(document.getElementById("closeReview1")){
        document.getElementById("closeReview1").setAttribute("id","closeReview");
    }
    sendHTTPRequest("/fybv2_api/userQuery", '{"data":{"condition":{"userName":"' + fileUsername + '"}}}', userInfoResult);          
}

function userInfoResult(){
    if (this.readyState == 4) {
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                // console.log(data);
                toEmail = data.data[0].email;
                console.log("邮箱地址："+toEmail);
            }
        }
        //查询模块信息接口
        sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":{}}', moduleResult);  
    }
}

function edit(obj,adminControl,deleteFlag){
	document.getElementById("loading").style.display = "block";
    adminControl = adminControl;
    document.getElementById("changeDescDiv").style.display="none";
    console.log("操作按钮："+adminControl);
    chip = obj.parentNode.parentNode.parentNode.children[2].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    targetProduct = obj.parentNode.parentNode.parentNode.children[3].innerHTML;
    operate = obj.parentNode.parentNode.parentNode.children[10].innerHTML;
    fileUsername = obj.parentNode.parentNode.parentNode.children[9].innerHTML;
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
            var data = JSON.parse(this.responseText);
            console.log(data);
            var kk = 0;
            var checkId = 0;
			var firstChecked = "";
			var _rowCheckPageApp = document.getElementById("myCheckModalMkTableApp");
			var _rowCheckPageService = document.getElementById("myCheckModalMkTableService");
			var _rowCheckPageAppStore = document.getElementById("myCheckModalMkTableAppStore");
			var _rowCheckPageHomePage = document.getElementById("myCheckModalMkTableHomePage");
			var _rowCheckPageIME = document.getElementById("myCheckModalMkTableIME");
			var _rowCheckPageSysApp = document.getElementById("myCheckModalMkTableSysApp");
			var _rowCheckPageTV = document.getElementById("myCheckModalMkTableTV");
			var _rowCheckPageOther = document.getElementById("myCheckModalMkTableOther");
			var _rowCheckPagePlayerLibrary = document.getElementById("myCheckModalMkTablePlayerLibrary");
			
			_rowCheckPageApp.innerHTML = "<div title='App'>App:</div>";
			_rowCheckPageService.innerHTML = "<div title='Service'>Service:</div>";
			_rowCheckPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
			_rowCheckPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
			_rowCheckPageIME.innerHTML = "<div title='IME'>IME:</div>";
			_rowCheckPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
			_rowCheckPageTV.innerHTML = "<div title='TV'>TV:</div>";
			_rowCheckPageOther.innerHTML = "<div title='Other'>Other:</div>";
			_rowCheckPagePlayerLibrary.innerHTML = "<div title='PlayerLibrary'>PlayerLibrary:</div>";
			
			for(var i = 0; i < data.data.length; i++) {
				// console.log("lxw " + data.data[i].category);
				if(data.data[i].category == "App") {
					kk = i;
					_rowCheckPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Service") {
					kk = i;
					_rowCheckPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "AppStore") {
					kk = i;
					_rowCheckPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "HomePage") {
					kk = i;
					_rowCheckPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "IME") {
					kk = i;
					_rowCheckPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "SysApp") {
					kk = i;
					_rowCheckPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "TV") {
					kk = i;
					_rowCheckPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "Other") {
					kk = i;
					_rowCheckPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
				} else if(data.data[i].category == "PlayerLibrary") {
					checkId++;
					kk = i;
					if (checkId == 1) {
						firstChecked = data.data[kk]._id;
					}
					_rowCheckPagePlayerLibrary.innerHTML += "<div class='col-xs-3'><input type='radio' name='PlayerLibrary' id='" + data.data[kk]._id + "' value=''><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
				}
			}
      	}
    document.getElementById(firstChecked).setAttribute('checked', '');
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
            //document.getElementById("mkbutton").setAttribute("background-color: rgb(230, 230, 230);");
            var data = JSON.parse(this.responseText);
            console.log(data);
            var kk = 0;
            var checkId = 0;
			var firstChecked = "";
            var _rowCheckPageApp = document.getElementById("myCheckModalMkTableApp");
            var _rowCheckPageService = document.getElementById("myCheckModalMkTableService");
            var _rowCheckPageAppStore = document.getElementById("myCheckModalMkTableAppStore");
            var _rowCheckPageHomePage = document.getElementById("myCheckModalMkTableHomePage");
            var _rowCheckPageIME = document.getElementById("myCheckModalMkTableIME");
            var _rowCheckPageSysApp = document.getElementById("myCheckModalMkTableSysApp");
            var _rowCheckPageTV = document.getElementById("myCheckModalMkTableTV");
            var _rowCheckPageOther = document.getElementById("myCheckModalMkTableOther");
            var _rowCheckPagePlayerLibrary = document.getElementById("myCheckModalMkTablePlayerLibrary");
            _rowCheckPageApp.innerHTML = "<div title='App'>App:</div>";
            _rowCheckPageService.innerHTML = "<div title='Service'>Service:</div>";
            _rowCheckPageAppStore.innerHTML = "<div title='AppStore'>AppStore:</div>";
            _rowCheckPageHomePage.innerHTML = "<div title='HomePage'>HomePage:</div>";
            _rowCheckPageIME.innerHTML = "<div title='IME'>IME:</div>";
            _rowCheckPageSysApp.innerHTML = "<div title='SysApp'>SysApp:</div>";
            _rowCheckPageTV.innerHTML = "<div title='TV'>TV:</div>";
            _rowCheckPageOther.innerHTML = "<div title='Other'>Other:</div>";
            _rowCheckPagePlayerLibrary.innerHTML = "<div title='PlayerLibrary'>PlayerLibrary:</div>";
            
            for(var i = 0; i < data.data.length; i++) {
                console.log("lxw " + data.data[i].category);
                if(data.data[i].category == "App") {
                    kk = i;
                    _rowCheckPageApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "Service") {
                    kk = i;
                    _rowCheckPageService.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "AppStore") {
                    kk = i;
                    _rowCheckPageAppStore.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "HomePage") {
                    kk = i;
                    _rowCheckPageHomePage.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "IME") {
                    kk = i;
                    _rowCheckPageIME.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "SysApp") {
                    kk = i;
                    _rowCheckPageSysApp.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "TV") {
                    kk = i;
                    _rowCheckPageTV.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "Other") {
                    kk = i;
                    _rowCheckPageOther.innerHTML += "<div class='col-xs-3'><input type='checkbox' id='" + data.data[kk]._id + "' cvalue='"+data.data[kk].cnName+"' oldstatus='0' onchange='changeChex(this)'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "'title = '" + data.data[kk].desc + "' name='" + data.data[kk].engName + "'>" + data.data[kk].cnName + "</span></div>";
                } else if(data.data[i].category == "PlayerLibrary") {
                    checkId++;
					kk = i;
					if (checkId == 1) {
						firstChecked = data.data[kk]._id;
					}
                    _rowCheckPagePlayerLibrary.innerHTML += "<div class='col-xs-3'><input type='radio' name='PlayerLibrary' id='" + data.data[kk]._id + "' value='' onclick = 'changePlayer()'><span category='" + data.data[kk].category + "' gitPath='" + data.data[kk].gitPath + "' name='" + data.data[kk].engName + "' title='" + data.data[kk].desc + "'>" + data.data[kk].cnName + "</span></div>";
                }
            }
        }
        document.getElementById(firstChecked).setAttribute('checked', '');
    //查询config信息接口
    sendHTTPRequest("/fybv2_api/configQuery", '{"data":{}}', configResult2); 
    }
}

function changeChex(obj){
    if (obj.checked && (obj.getAttribute("oldstatus") == '0')) {
        // obj.oldstatus = '1';
        obj.setAttribute("oldstatus","1");
        changeAdd.push(obj.getAttribute("cvalue"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }
    else if(!(obj.checked) && (obj.getAttribute("oldstatus") == '0'))
    {
        obj.setAttribute("oldstatus","2");
        changeReduce.push(obj.getAttribute("cvalue"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
    }
    else 
    {
        obj.setAttribute("oldstatus","0");
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        changeReduce.remove(obj.getAttribute("cvalue"));
        changeAdd.remove(obj.getAttribute("cvalue"));
        console.log("add"+changeAdd);
        console.log("changeReduce"+changeReduce);
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
			var _rowCheckPageConfigBase = document.getElementById("myCheckModalConfigTableTdBase");
			var _rowCheckPageConfigServerip = document.getElementById("myCheckModalConfigTableTdServerip");
			var _rowCheckPageConfigAd = document.getElementById("myCheckModalConfigTableTdAd");
			var _rowCheckPageConfigChannel = document.getElementById("myCheckModalConfigTableTdChannel");
			var _rowCheckPageConfigLocalmedia = document.getElementById("myCheckModalConfigTableTdLocalmedia");
			var _rowCheckPageConfigOther = document.getElementById("myCheckModalConfigTableTdOther");

			_rowCheckPageConfigBase.innerHTML = "<div title='base'>基本功能：</div>";
			_rowCheckPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
			_rowCheckPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
			_rowCheckPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
			_rowCheckPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
			_rowCheckPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

			for(var i = 0; i < data.data.length; i++) {
				if(data.data[i].category == "base") {
					kk = i;
					pullDataOne = JSON.stringify(data.data[kk]);
					// console.log("base:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigBase.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text'  id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value +"'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						// console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigBase.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "serverip") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					// console.log("serverip:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigServerip.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
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
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigServerip.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "ad") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("ad:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigAd.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
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
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigAd.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "channel") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					console.log("channel:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigChannel.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
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
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigChannel.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "localmedia") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					// console.log("localmedia:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						// console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigLocalmedia.innerHTML += _myAddselect;
					}
				} else if(data.data[i].category == "other") {
					kk = i;
					pullDataTwo = JSON.stringify(data.data[kk]);
					// console.log("other:" + kk);
					if(data.data[i].type == "string") {
						_rowCheckPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
					} else if(data.data[i].type == "enum") {
						var _myAddselect = "<select id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
						// console.log("lxw " + data.data[kk].options.length);
						for(var k = 0; k < data.data[kk].options.length; k++) {
							if(data.data[kk].options[k] == data.data[kk].value) {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
							} else {
								_myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
							}
						}
						_myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
						_rowCheckPageConfigOther.innerHTML += _myAddselect;
					}
				}
			}
      	}
      	document.getElementById("loading").style.display = "none";
      	$('#myCheckModal').modal();
        $(".modal-backdrop").addClass("new-backdrop");
	    // 查询对应机芯机型的配置信息
	    sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult);   
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
            var _rowCheckPageConfigBase = document.getElementById("myCheckModalConfigTableTdBase");
            var _rowCheckPageConfigServerip = document.getElementById("myCheckModalConfigTableTdServerip");
            var _rowCheckPageConfigAd = document.getElementById("myCheckModalConfigTableTdAd");
            var _rowCheckPageConfigChannel = document.getElementById("myCheckModalConfigTableTdChannel");
            var _rowCheckPageConfigLocalmedia = document.getElementById("myCheckModalConfigTableTdLocalmedia");
            var _rowCheckPageConfigOther = document.getElementById("myCheckModalConfigTableTdOther");

            _rowCheckPageConfigBase.innerHTML = "<div title='base'>基础功能：</div>";
            _rowCheckPageConfigServerip.innerHTML = "<div title='serverip'>服务器IP配置：</div>";
            _rowCheckPageConfigAd.innerHTML = "<div title='ad'> 广告配置：</div>";
            _rowCheckPageConfigChannel.innerHTML = "<div title='channel'>TV通道：</div>";
            _rowCheckPageConfigLocalmedia.innerHTML = "<div title='localmedia'>本地媒体：</div>";
            _rowCheckPageConfigOther.innerHTML = "<div title='other'>其它功能：</div>";

            for(var i = 0; i < data.data.length; i++) {
                if(data.data[i].category == "base") {
                    kk = i;
                    pullDataOne = JSON.stringify(data.data[kk]);
                    console.log("base:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigBase.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"' oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigBase.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "serverip") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("serverip:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigServerip.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"' oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigServerip.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "ad") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("ad:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigAd.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"' oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigAd.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "channel") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("channel:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigChannel.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"' oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigChannel.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "localmedia") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("localmedia:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigLocalmedia.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"' oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigLocalmedia.innerHTML += _myAddselect;
                    }
                } else if(data.data[i].category == "other") {
                    kk = i;
                    pullDataTwo = JSON.stringify(data.data[kk]);
                    console.log("other:" + kk);
                    if(data.data[i].type == "string") {
                        _rowCheckPageConfigOther.innerHTML += "<div class='col-xs-6'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span><input type='text' onchange = 'changeConfig(this)' cnName = '"+data.data[kk].cnName+"'  oldvalue = '"+data.data[kk].value+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "' value='" + data.data[kk].value + "'title='" + data.data[kk].value  + "'></div>";
                    } else if(data.data[i].type == "enum") {
                        var _myAddselect = "<select onchange='changeConfig(this)' cnName = '"+data.data[kk].cnName+"' id='" + data.data[kk]._id + "' name='" + data.data[kk].type + "'>";
                        console.log("lxw " + data.data[kk].options.length);
                        for(var k = 0; k < data.data[kk].options.length; k++) {
                            if(data.data[kk].options[k] == data.data[kk].value) {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'selected>" + data.data[kk].options[k] + "</option>";
                            } else {
                                _myAddselect += "<option value='" + data.data[kk].options[k] + "'>" + data.data[kk].options[k] + "</option>";
                            }
                        }
                        _myAddselect = "<div class='col-xs-6 videoCKChange'><span name='" + data.data[kk].engName + "'title = '" + data.data[kk].desc + "' cnName='" + data.data[kk].cnName + "' configkey='" + data.data[kk].configKey + "'>" + data.data[kk].cnName + " :</span>" + _myAddselect + "</select></div>";
                        _rowCheckPageConfigOther.innerHTML += _myAddselect;
                    }
                }
            }
        }
    changListen("videoCKChange");
    document.getElementById("loading").style.display = "none";
    $('#myCheckModal').modal();
    $(".modal-backdrop").addClass("new-backdrop");
    // 查询对应机芯机型的配置信息
    sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult2);   
    }
}

function changeConfig(obj){
    var x = obj.value;
    console.log(x);
    console.log(obj.getAttribute("oldvalue"))
    if(x == obj.getAttribute("oldvalue")){
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        changeConf.remove(obj.getAttribute("cnName"));
        console.log("change"+changeConf);
    }
    else{
        if (changeConf.indexOf(obj.getAttribute("cnName")) == -1){
            changeConf.push(obj.getAttribute("cnName"));
            console.log("change"+changeConf);
        }else{}
    }
  
}

function changeDevice(obj){
    var x = obj.value;
    console.log(x);
    console.log(obj.getAttribute("oldvalue"))
    if(x == obj.getAttribute("oldvalue")){
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        changeDev.remove(obj.getAttribute("cnName"));
        console.log("change"+changeDev);
    }
    else{
        if (changeDev.indexOf(obj.getAttribute("cnName")) == -1) {
            changeDev.push(obj.getAttribute("cnName"));
            console.log("change"+changeDev);
        }else{}
    }
  
}


function changePlayer(){
    var arr=document.getElementsByName("PlayerLibrary");
    for(var i=0;i<arr.length;i++)
        {
            if(arr[i].checked)
            {
                console.log("id=="+arr[i].id);
                console.log("oldid==="+olrplayerid)
               if(arr[i].id == olrplayerid){
                    Array.prototype.indexOf = function(val) {
                        for (var i = 0; i < this.length; i++) {
                            if (this[i] == val) return i;
                        }
                        return -1;
                    };
                    Array.prototype.remove = function(val) {
                        var index = this.indexOf(val);
                        if (index > -1) {
                            this.splice(index, 1);
                        }
                    };

                    changeConf.remove("PlayerLibrary");
                    console.log("change"+changeConf);
               }
               else{
                if (changeConf.indexOf("PlayerLibrary") == -1){
                    changeConf.push("PlayerLibrary");
                    console.log("ssdsaddasdasdas"+changeConf)
                }else{}
               }
            }
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
            console.log(data);
            targetForMK = data.data[0].mkFile;
            hashObj = data.data[0];
            changeDesc = data.data[0].desc;
            console.log("修改:"+JSON.stringify(changeDesc));
            $("#changeInfo4").text(changeDesc.changeConf);
            $("#changeInfo3").text(changeDesc.changeReduce);
            $("#changeInfo2").text(changeDesc.changeAdd);
            $("#changeInfo1").text(changeDesc.changeDev);
            if (changeDesc.changeDev.length != "0") {
                document.getElementById('changeDeviceDesc').style.display="block";
            }
            if (changeDesc.changeReduce.length != "0") {
                document.getElementById('removeModelDesc').style.display="block";
            }
            if (changeDesc.changeAdd.length != "0") {
                document.getElementById('addModelDesc').style.display="block";
            }
            if (changeDesc.changeConf.length != "0") {
                document.getElementById('changeConfigDesc').style.display="block";
            }
            if (changeDesc.changeConf.length == "0" && changeDesc.changeReduce.length == "0" && changeDesc.changeAdd.length == "0"&& changeDesc.changeDev.length == "0") {
                document.getElementById('newFileDesc').style.display="block";
            };
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
				// console.log("lxw counter = " + mkcounter + "--" + mkkey);
				document.getElementById(mkkey).removeAttribute("checked");
				//document.getElementById(mkkey).setAttribute('checked', '');
				document.getElementById(mkkey).checked = true;
				// console.log(document.getElementById(mkkey).checked);
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
                    document.getElementById("ReviewCat").style.display="block";              
                    var inputcounts = document.getElementsByTagName("input");
                    var selectcounts = document.getElementsByTagName("select");
                    // console.log("inputcounts="+inputcounts.length);
                    document.getElementById("noPassReview").onclick = noPassIssue;
                    document.getElementById('ReviewCat').onclick = reviewCat;
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
                document.getElementById("ReviewCat").style.display="none"; 
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

function reviewCat(){
    $("#myPreviewModalLabel").text("预览");
    $('#myPreviewModal').modal(); //弹出编辑页（即新增页，只是每项都有数据，这个数据从后台获取）
    $(".modal-backdrop").addClass("new-backdrop");
    sendHTTPRequest("/fybv2_api/preview", '{"data":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"}}', getPreviewInfo);
}

function getPreviewInfo(){
    if(this.readyState == 4) {
        //console.log("this.responseText = " + this.responseText);
        if(this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            if(data.msg == "success") {
                console.log("lxw " + "预览-成功"+ data.configRes);
                document.getElementById("myPreviewBodyOne").innerHTML = data.configRes;
                document.getElementById("myPreviewBodyTwo").innerHTML = data.mkRes;
            } else if(data.msg == "failure") {
                console.log("lxw " + "预览-失败");
                document.getElementById("myPreviewBodyOne").innerHTML = data.configRes;
                document.getElementById("myPreviewBodyTwo").innerHTML = data.mkRes;
            };
        };
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
            document.getElementById("newCheckDevice").setAttribute("oldvalue",data.data[0].targetProduct);
            document.getElementById("newCheckDevice").setAttribute("cnName","TARGET_PRODUCT");
            document.getElementById("newCheckDevice").setAttribute("onchange","changeDevice(this)");
            document.getElementById("newCheckAndroidVersion").value=data.data[0].androidVersion;
            document.getElementById("newCheckAndroidVersion").setAttribute("oldvalue",data.data[0].androidVersion);
            document.getElementById("newCheckAndroidVersion").setAttribute("cnName","Android版本");
            document.getElementById("newCheckAndroidVersion").setAttribute("onchange","changeDevice(this)");
            document.getElementById("newCheckChipMode").value=data.data[0].chipModel;
            document.getElementById("newCheckChipMode").setAttribute("oldvalue",data.data[0].chipModel);
            document.getElementById("newCheckChipMode").setAttribute("cnName","芯片型号");
            document.getElementById("newCheckChipMode").setAttribute("onchange","changeDevice(this)");
            document.getElementById("newCheckMemory").value=data.data[0].memorySize;
            document.getElementById("newCheckMemory").setAttribute("oldvalue",data.data[0].memorySize);
            document.getElementById("newCheckMemory").setAttribute("cnName","内存");
            document.getElementById("newCheckMemory").setAttribute("onchange","changeDevice(this)");
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
            var arr=document.getElementsByName("PlayerLibrary");
            
            for(var i=0;i<arr.length;i++)
            {
                if(arr[i].checked)
                {
                   olrplayerid = arr[i].id;
                   console.log("ssssssssssssssssssss"+olrplayerid);
                }
            }
            //生成config文件
            //console.log("lxw " + JSON.stringify(data.data[0].configFile));
            var configkey, configcounter = 0;
            for(configkey in data.data[0].configFile) {
                configcounter++;
                if(data.data[0].configFile[configkey].type == "string") {
                    document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
                    document.getElementById(configkey).setAttribute("oldvalue",data.data[0].configFile[configkey].value) ;
                } else {
                    document.getElementById(configkey).value = data.data[0].configFile[configkey].value;
                    document.getElementById(configkey).setAttribute("oldvalue",data.data[0].configFile[configkey].value) ;
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
            document.getElementById("ReviewCat").style.display="none"; 
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
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "删除操作";
    document.getElementById("dialogword").innerHTML = "确认要删除该配置信息吗？";
    document.getElementById("myDeleteModalEnsure").onclick = deleteSure;
    scrollTopStyle("myCheckModal");
}

//审核弹窗
function passIssue(){
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "确认通过审核吗？";
    document.getElementById("myDeleteModalEnsure").onclick = passSure;
    scrollTopStyle("myCheckModal");
}

//审核不通过弹窗
function noPassIssue(){
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "是否确认不通过该文件？";
    document.getElementById("myDeleteModalEnsure").onclick = noPassSure;
    scrollTopStyle("myCheckModal");
}

//编辑提交弹窗
function editIssue(){
   	document.getElementById("mydialog").style.display = "block";
    document.getElementById("dialogword").setAttribute("style","text-align:left");
    document.getElementById("myDeleteModalLabel").innerHTML = "编辑操作";
    
    document.getElementById("dialogword").innerHTML = "您做了以下操作，确认提交该修改吗？<br>"+"<span id='txt1'>修改设备信息：<br><span id='txt11'>　"+changeDev+"</span></span><span id='txt2'>新增模块：<br><span id='txt22'>　"+changeAdd+"</span></span><span id='txt3'>删除模块：<br><span id='txt33'>　"+changeReduce+"</span></span><span id='txt4'>修改配置：<br>　<span id='txt44'>"+changeConf+"</span></span>";
    if (changeDev.length != 0) {
        document.getElementById("txt1").style.display="block";
    }
    if(changeAdd.length != 0    ){
        document.getElementById("txt2").style.display="block";
    }
    if (changeReduce.length != 0) {
        document.getElementById("txt3").style.display="block";
    }
    if (changeConf.length != 0) {
        document.getElementById("txt4").style.display="block";
    }
    document.getElementById("dialogword").setAttribute("max-height","350px");
    
    document.getElementById("myDeleteModalEnsure").onclick = reviewEdit;
    scrollTopStyle("myCheckModal");
}

//审核通过（针对编辑）
function passSure(){
    var operateTime = new Date().getTime();
    console.log(operateTime);
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"operateType":"0","gerritState":"0","operateTime":"'+operateTime+'"}}}',passResult);
}

//审核不通过
function noPassSure(){
    var operateTime = new Date().getTime();
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"gerritState":"2","operateTime":"'+operateTime+'"}}}',passnotResult);
}

//删除操作
function deleteSure(){
    sendHTTPRequest("/fybv2_api/productDelete",'{"data":{"condition":{"targetProduct":"'+targetProduct+'","chip":"'+chip+'","model":"'+model+'"}}}',deleteResult);
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
                var maildata = "您提交删除的机芯："+chip+",机型："+model+" 的配置文档已经通过审核，请确认";
                maildata += "<br/> -----<br/>To view visit <a href='http://localhost:3000/v2/scmplatform/index.html'>scmplatform</a>"
                sendHTTPRequest("/fybv2_api/sendmail", '{"data":{"desc":"'+maildata+'","from":"'+fromEmail+'","to":"'+toEmail+'","subject":"软件配置平台通知-自动发送，请勿回复"}}', Deletesendmailfun);  
            };
        }
    }
}

function Deletesendmailfun(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            freshReviewHtml();
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

        var maildata = "您提交的机芯："+chip+",机型："+model+" 的配置文档已经通过审核，请确认";
        maildata += "<br/> -----<br/>To view visit <a href='http://localhost:3000/v2/scmplatform/index.html'>scmplatform</a>"
        sendHTTPRequest("/fybv2_api/sendmail", '{"data":{"desc":"'+maildata+'","from":"","to":"'+toEmail+'","subject":"软件配置平台通知-自动发送，请勿回复"}}', DTwicemailfun2);  
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
                var maildata = "您提交的机芯："+chip+",机型："+model+" 的配置文档暂未通过审核，请前往《审核未通过文件》菜单进行修改并再次提交";
                maildata += "<br/> -----<br/>To view visit <a href='http://localhost:3000/v2/scmplatform/index.html'>scmplatform</a>"
                sendHTTPRequest("/fybv2_api/sendmail", '{"data":{"desc":"'+maildata+'","from":"","to":"'+toEmail+'","subject":"软件配置平台通知-自动发送，请勿回复"}}', sendmailfun2);  
            };

        }
    }
}

function creatFile(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            freshReviewHtml();
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                console.log("生成文件成功！！！！");
            }
            else{
                console.log(data.reason);
            }

        }
    }
}

function DTwicemailfun2(){
    if (this.readyState == 4) {
        if (this.status == 200){
            // 同步更新相同target下的MK信息
            var oEnode = '{"data":{"condition":{"gerritState":"0","targetProduct":"'+targetProduct+'"},"action":"set","update":{"mkFile":' + JSON.stringify(targetForMK) + '}}}';
            sendHTTPRequest("/fybv2_api/productUpdate", oEnode, creatFile);
        }
    }
}

function sendmailfun(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            console.log("发送成功！");
        }
        console.log("生成文件的机芯机型是："+chip+";"+model);
        sendHTTPRequest("/fybv2_api/generateFile",'{"data":{"chip":"'+chip+'","model":"'+model+'"}}',creatFile);
    }
}


function sendmailfun2(){
    if (this.readyState == 4) {
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) 
        {
            console.log("审核未过，发送邮件")
            freshReviewHtml();
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
    oEchip123 = oEchip;
	var oEmodel = document.getElementById("newCheckModel").value;
    oEmodel123 = oEmodel;
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
			oEstuInfo.cnName = oEconfigTrDiv[thisConfigindex].childNodes[0].getAttribute("cnName");
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
				oEstuInfoTwo.desc = oEMkTrDivTwo[oEMkindex].childNodes[1].getAttribute("title");
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
    var operateTime = new Date().getTime();
    console.log(operateTime);
    var changedesc = '{"changeDev":"'+changeDev+'","changeAdd":"'+changeAdd+'","changeReduce":"'+changeReduce+'","changeConf":"'+changeConf+'"}';
    var a = JSON.parse(changedesc);
	var oEnode = '{"data":{"condition":{"targetProduct":"'+oEtargetProduct+'","chip":"' + oEchip + '","model":"' + oEmodel + '"},"action":"set","update":{"userName":"' + loginusername +'","operateTime":"' + operateTime + '","memorySize":"' + oEmemorySize + '","chipModel":"' + oEchipModel + '","androidVersion":"' + oEandroidVersion + '","targetProduct":"' + oEtargetProduct + '","gerritState":"1","operateType":"3","androidVersion":"' + oEandroidVersion + '","mkFile":' + JSON.stringify(editMkFile) + ',"configFile":' + JSON.stringify(editConfigFile) + ',"desc":'+JSON.stringify(a) + '}}}';
	console.log("lxw " + oEnode);
    allTargetMk = editMkFile;
	submitStatus(hashObj,dataObj,oEnode);
}


function reviewEditResult(){
    if (this.readyState == 4) {
        if (this.status == 200)
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {

                //发送邮件
                var maildata = "用户："+loginusername+"<br/>针对机芯："+oEchip123+",机型："+oEmodel123+"做出了如下修改：";
                if (changeDev.length != 0) {
                 maildata += "<br/>修改设备信息："+ changeDev;
                 // console.log("maildata:"+changeDev);
                }
                if(changeAdd.length != 0    ){
                    maildata += "<br/>新增模块："+ changeAdd;
                }
                if (changeReduce.length != 0) {
                    maildata += "<br/>删除模块："+ changeReduce;
                }
                if (changeConf.length != 0) {
                    maildata += "<br/>修改配置："+ changeConf;
                }
                
                maildata += "<br/>请前往《待审核文件》菜单进行审核处理<br/> -----<br/>To view visit <a href='http://localhost:3000/v2/scmplatform/index.html'>scmplatform</a>";
                console.log("maildata:"+maildata);
                console.log("fromEmail:"+fromEmail);
                sendHTTPRequest("/fybv2_api/sendmail", '{"data":{"desc":"'+maildata+'","from":"'+fromEmail+'","to":"fanyanbo@skyworth.com","subject":"软件配置平台通知-自动发送，请勿回复"}}', DTwicemailfun)

                
            }
            else{
                freshReviewHtml();
            }

        }
    }
}

function DTwicemailfun(){
    if (this.readyState == 4) {
        if (this.status == 200){
            document.getElementById("mydialog").style.display = "none";
            freshReviewHtml();
            //同步更新相同target下的MK信息
            // var oEnode = '{"data":{"condition":{"targetProduct":"'+targetProduct+'"},"action":"set","update":{"mkFile":' + JSON.stringify(allTargetMk) + '}}}';
            // sendHTTPRequest("/fybv2_api/productUpdate", oEnode, DTwicemailfun2);

        }
    }
}
// function DTwicemailfun2(){
//     if (this.readyState == 4) {
//         if (this.status == 200){
//             document.getElementById("mydialog").style.display = "none";
//             freshReviewHtml();
//         }
//     }
// }

//刷新当前iframe
function freshReviewHtml() {
    var htmlObject = parent.document.getElementById("tab_userMenu2");
    var htmlObject2 = parent.document.getElementById("tab_userMenu3");
    var indexObject = parent.document.getElementById("home");
    var iframe = indexObject.getElementsByTagName("iframe");
    htmlObject.firstChild.src = "review.html";
    if (htmlObject2) {
        htmlObject2.firstChild.src = "nopass.html";
    }
    iframe[0].src = "wait.html";
}   
//关闭当前dialog
function closeCurPage(){
	document.getElementById("mydialog").style.display = "none";
	document.getElementById("myDeleteModalLabel").style.display = "none";
    changeAdd.splice(0,changeAdd.length);
    changeConf.splice(0,changeConf.length);
    changeDev.splice(0,changeDev.length);
    changeReduce.splice(0,changeReduce.length);
	$("#myCheckModal").modal('hide');
}

document.getElementById("closeReview").onclick=closeFun;
function closeFun(){
    console.log("用户等级："+level);
    if (level == 1) {
        freshReviewHtml();
    }
    else{
        document.getElementById("mydialog").style.display = "block";
        document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
        document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
        document.getElementById("myDeleteModalEnsure").onclick = closeCurPage;
    }
    
}

function closeFunT(){
    console.log("用户等级："+level);
    document.getElementById("mydialog").style.display = "block";
    document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
    document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
    document.getElementById("myDeleteModalEnsure").onclick = closeCurPage;
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
			if(typeof(dataObj.mkFile[ookey])==="undefined"){
				changeStatus = 1;
			}else{
				//console.log("mk未做修改");
			}
		}
		var nnkey = 0;
		for(nnkey in hashObj.configFile) {
			if(hashObj.configFile[nnkey].value == dataObj.configFile[nnkey].value){
			}else{
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
		document.getElementById("mydialog").style.display = "none";
	} else{
		console.log("做了修改...");
		sendHTTPRequest("/fybv2_api/productUpdate", oEnode, reviewEditResult);
	}
}

function scrollTopStyle(name){
	var div = document.getElementById(name);
	var body = parent.document.getElementById("homePage");
	console.log(div.scrollTop+"---"+body.scrollTop);
	document.getElementById(name).scrollTop = 0;
	parent.document.getElementById("homePage").scrollTop = 0;
}

function changListen(className){
	var omyVideoObj = new Array();
	omyVideoObj = document.getElementsByClassName(className);
	console.log(omyVideoObj.length);
	for(var ii = 0; ii < omyVideoObj.length; ii++) {
		omyVideoObj[ii].childNodes[1].onchange = function() {
			var configKeyName = this.previousSibling.getAttribute("configKey");
			console.log(configKeyName);
			console.log(this.type + "---" + this.getAttribute("oldvalue") + "|" + this.value);
			if(configKeyName == "PLAYER_KERNEL"&&this.getAttribute("oldvalue") != this.value) { 
				console.log("Let us do next.");
				document.getElementById("myVideoChangeDivTwo").style.display = "block";
			}
		}
	}
}
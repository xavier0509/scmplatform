document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");
//加载自执行，传递参数请求列表
$(function () {
    var level = parent.adminFlag;
    var loginusername = parent.loginusername;
    // console.log("得到的用户名："+loginusername+"得到的权限标志："+level);
    if (level == 1) {
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"gerritState":"1"},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1}}}', reviewlist);
    }
    else{
        sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"userName":"'+loginusername+'","$or":[{"gerritState":"1"},{"gerritState":"2"}]},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1,"gerritState":1,"userName":1}}}', reviewlist);
    }                                                        
})

var chip = null;
var model = null;
var operate = null;
var fileUsername = null;

//在待审核页面出现列表
function reviewlist(){
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
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
                // console.log(datalength);
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
                        _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>审核</button></div>";
                    }
                    else{
                        if (operateType == 2) {
                             _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='recover(this)'>恢复</button></div>";

                        }
                        else{
                            _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>编辑</button></div>";

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
    $('#mydialog').modal();
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
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                freshReviewHtml();
            };

        }
    }

}

//点击编辑、审核出现页面的执行函数
function review(obj){
    chip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    operate = obj.parentNode.parentNode.parentNode.children[8].innerHTML;
    fileUsername = obj.parentNode.parentNode.parentNode.children[7].innerHTML;
    //查询模块信息接口
    sendHTTPRequest("/fybv2_api/moduleQuery", '{"data":{}}', moduleResult);    
    
}

//罗列出所有的mk信息
function moduleResult(){
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            $('#myMoreDeleteModal').modal();

            var app = [];
            var appstore = [];
            var homepage = [];
            var ime = [];
            var service = [];
            var sysapp = [];
            var tv = [];
            var mkother = [];
            // var main = [];
            // var other = [];

            var data = JSON.parse(this.responseText);
            for (var i = 0; i < data.data.length; i++) {
                if(data.data[i].category == "App"){app.push(data.data[i]);}
                else if (data.data[i].category == "AppStore") {appstore.push(data.data[i]);}
                else if (data.data[i].category == "HomePage") {homepage.push(data.data[i]);}
                else if (data.data[i].category == "IME") {ime.push(data.data[i]);}
                else if (data.data[i].category == "Service") {service.push(data.data[i]);}
                else if (data.data[i].category == "SysApp") {sysapp.push(data.data[i]);}
                else if (data.data[i].category == "TV") {tv.push(data.data[i]);}
                else if (data.data[i].category == "Other") {mkother.push(data.data[i]);}
            };

            document.getElementById("appcont").innerHTML="";
            document.getElementById("appstorecont").innerHTML="";
            document.getElementById("homecont").innerHTML="";
            document.getElementById("imecont").innerHTML="";
            document.getElementById("servicecont").innerHTML="";
            document.getElementById("syscont").innerHTML="";
            document.getElementById("tvcont").innerHTML="";
            document.getElementById("mkothercont").innerHTML="";

            creatMK(app,"appcont");
            creatMK(appstore,"appstorecont");
            creatMK(homepage,"homecont");
            creatMK(ime,"imecont");
            creatMK(service,"servicecont");
            creatMK(sysapp,"syscont");
            creatMK(tv,"tvcont");
            creatMK(mkother,"mkothercont");

            function creatMK(name,divname){
                for (var i = 0; i < name.length; i++) {
                    var cont = document.getElementById(divname);
                    var child = document.createElement("div");
                    child.setAttribute('class','col-sm-3 form-group');
                    var text = document.createTextNode(name[i].cnName);
                    var input = document.createElement("input");
                    input.setAttribute('value',name[i].engName);
                    input.setAttribute('id',name[i]._id);
                    input.setAttribute('engName',name[i].engName);
                    input.setAttribute('category',name[i].category);
                    input.setAttribute('gitPath',name[i].gitPath);
                    input.setAttribute('desc',name[i].desc);
                    input.setAttribute('type','checkbox');
                    // if (name[i].state == 1) {input.setAttribute('checked','');};//勾选状态
                    child.appendChild(input);
                    child.appendChild(text);
                    cont.appendChild(child);
                }
            }
        }
    
    //查询config信息接口
    sendHTTPRequest("/fybv2_api/configQuery", '{"data":{}}', configResult); 
    }
}

function configResult(){
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            var configfile = data.data;
            var main = [];
            var other = [];
            var hardware = [];
            var ad = [];
            var channel = [];
            var localmedia = [];
            var browser = [];
            var serverip = [];

            for (var i = 0; i < configfile.length; i++) {
                if(configfile[i].category == "main"){main.push(configfile[i]);}
                else if (configfile[i].category == "other") {other.push(configfile[i]);}
                else if (configfile[i].category == "hardware") {hardware.push(configfile[i]);}
                else if (configfile[i].category == "serverip") {serverip.push(configfile[i]);}
                else if (configfile[i].category == "ad") {ad.push(configfile[i]);}
                else if (configfile[i].category == "channel") {channel.push(configfile[i]);}
                else if (configfile[i].category == "localmedia") {localmedia.push(configfile[i]);}
                else if (configfile[i].category == "browser") {browser.push(configfile[i]);}
            };

            document.getElementById("maincont").innerHTML="";
            document.getElementById("hardwarecont").innerHTML="";
            document.getElementById("serveripcont").innerHTML="";
            document.getElementById("adcont").innerHTML="";
            document.getElementById("channelcont").innerHTML="";
            document.getElementById("localmediacont").innerHTML="";
            document.getElementById("browsercont").innerHTML="";
            document.getElementById("othercont").innerHTML="";

            creatConfig(main,"maincont");
            creatConfig(other,"othercont");
            creatConfig(hardware,"hardwarecont");
            creatConfig(serverip,"serveripcont");
            creatConfig(ad,"adcont");
            creatConfig(channel,"channelcont");
            creatConfig(localmedia,"localmediacont");
            creatConfig(browser,"browsercont");

            function creatConfig(name,divname){
                for (var i = 0; i < name.length; i++) {
                    var cont = document.getElementById(divname);
                    var child = document.createElement("div");
                    child.setAttribute('class','col-sm-6 form-group text-right reviewconfigInput');
                    var text = document.createTextNode(name[i].cnName+":　");
                    if (name[i].type == "string") {
                        var input = document.createElement("input");
                        input.setAttribute("engName",name[i].engName);
                        input.setAttribute("id",name[i]._id);
                        input.setAttribute("engName",name[i].engName);
                        input.setAttribute("configKey",name[i].configKey);
                        input.setAttribute("type",name[i].type);
                        input.setAttribute("desc",name[i].desc);
                        input.setAttribute("category",name[i].category);
                        input.setAttribute("options",name[i].options);
                        input.setAttribute("cnName",name[i].cnName);
                        input.value = name[i].value;
                    }
                    else if (name[i].type == "enum"){
                        var opt = [];
                        for (var j = 0; j < name[i].options.length; j++) {
                            opt.push(name[i].options[j]);
                            // console.log(opt);
                        };
                        var input = document.createElement("select");
                        input.setAttribute("engName",name[i].engName);
                        input.setAttribute("id",name[i]._id);
                        input.setAttribute("engName",name[i].engName);
                        input.setAttribute("configKey",name[i].configKey);
                        input.setAttribute("type",name[i].type);
                        input.setAttribute("desc",name[i].desc);
                        input.setAttribute("category",name[i].category);
                        input.setAttribute("options",opt);
                        input.setAttribute("cnName",name[i].cnName);
                        input.setAttribute("value",name[i].value);
                        input.setAttribute("class","form-group");
                        for (var j = 0; j< name[i].options.length; j++) {
                            var txt = name[i].options[j];
                            var option =document.createElement("option");
                            option.setAttribute("value",txt);
                            if (txt == name[i].value) {
                                option.setAttribute("selected","")
                            };
                            var txtvalue = document.createTextNode(txt);
                            option.appendChild(txtvalue);
                            input.appendChild(option);
                        };
                    }
                    child.appendChild(text);
                    child.appendChild(input);
                    cont.appendChild(child);
                }
            }

            

        }
    
        // 查询对应机芯机型的配置信息
    sendHTTPRequest("/fybv2_api/productQuery", '{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult);   
    }
}


function reviewresult(){
    var level = parent.adminFlag;
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {

            $('#myMoreDeleteModal').modal();

            var data = JSON.parse(this.responseText);
            // console.log(data[0]);

            //更新设备信息
            document.getElementById("chip").value=data.data[0].chip;
            document.getElementById("model").value=data.data[0].model;
            document.getElementById("device").value=data.data[0].targetProduct;
            document.getElementById("android").value=data.data[0].androidVersion;
            document.getElementById("chipid").value=data.data[0].chipModel;
            document.getElementById("memory").value=data.data[0].memorySize;
            console.log("更新设备信息完毕！！");


            //更新mk文件信息，匹配后勾选
            var mkfile = data.data[0].mkFile;
            var key, counter = 0;
            for (key in mkfile) {
                console.log("更新mk信息开始！！");
                counter++;
                console.log("counter = " + counter + "--" + key);
                document.getElementById(key).setAttribute('checked', '');
                document.getElementById(key).parentNode.style="font-weight:bold";
                
            };

            //生成config文件

            var configfile = data.data[0].configFile;
            // var main = [];
            // var other = [];

            var configkey, configcounter = 0;
            for(configkey in configfile) {
                configcounter++;
                console.log("lxw counter = " + configcounter + "--" + configkey);
                console.log(configfile[configkey].type);
                if(configfile[configkey].type == "string") {
                    document.getElementById(configkey).value = configfile[configkey].value;
                } 
                else {
                    document.getElementById(configkey).value = configfile[configkey].value;
                    var childSelect = document.getElementById(configkey).childNodes;
                    for(var j = 0; j < childSelect.length; j++) {
                        childSelect[j].removeAttribute("selected");
                        if(childSelect[j].value == configfile[configkey].value) {
                            childSelect[j].setAttribute("selected", "");
                        }
                    }
                }
            }

            // for (var i = 0; i < configfile.length; i++) {
            //     if (configfile[i].type == "string") {
            //         document.getElementById(configfile[i].engName).value = configfile[i].value;
            //     }
            //     else{
            //         document.getElementById(configfile[i].engName).value = configfile[i].value;
            //         var childSelect = document.getElementById(configfile[i].engName).childNodes;
            //         for (var j = 0; j < childSelect.length; j++) {
            //             childSelect[j].removeAttribute("selected");
            //             if (childSelect[j].value == configfile[i].value) {
            //                 childSelect[j].setAttribute("selected","");
            //             }
            //         };
            //     }
                
            // };

            

//如果是管理员，不允许修改-----------更改提示框
            if(level == 1){
                if (fileUsername == "liujinpeng") {
                    document.getElementById("noPassReview").style.display="none";
                }
                else{
                    document.getElementById("noPassReview").style.display="block";
                }                
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
            }
            else{
                document.getElementById("noPassReview").style.display="none";
                document.getElementById("reviewSubmit").innerHTML = "提交";
                document.getElementById("reButton").innerHTML = "提交";
                // document.getElementById("btn_submit").onclick = reviewEdit;
                document.getElementById("btn_submit").onclick = editIssue;
                document.getElementById("button_submit").onclick = editIssue;
            }
            
        }
    }
}

//删除弹窗
function deleteIssue(){
    $('#mydialog').modal();
    document.getElementById("myDeleteModalLabel").innerHTML = "删除操作";
    document.getElementById("dialogword").innerHTML = "确认要删除该配置信息吗？";
    
    document.getElementById("myDeleteModalEnsure").onclick = deleteSure;
}

//审核弹窗
function passIssue(){
    $('#mydialog').modal();
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "确认通过审核吗？";
    
    document.getElementById("myDeleteModalEnsure").onclick = passSure;
}

//审核不通过弹窗
function noPassIssue(){
    $('#mydialog').modal();
    document.getElementById("myDeleteModalLabel").innerHTML = "审核操作";
    document.getElementById("dialogword").innerHTML = "是否确认不通过该文件？";
    
    document.getElementById("myDeleteModalEnsure").onclick = noPassSure;
}

//编辑提交弹窗
function editIssue(){
    $('#mydialog').modal();
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
    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"gerritState":"2"}}}',passResult);
}

//删除操作
function deleteSure(){
    sendHTTPRequest("/fybv2_api/productDelete",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"}}}',deleteResult);
}

//点击删除的回调
function deleteResult(){
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
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
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                // console.log("审核成功！！！！");
                freshReviewHtml();
            };

        }
    }
}

//点击编辑提交的函数
function reviewEdit(){
    // console.log("开始提交数据");

    var mkdataarry = [];//用于存放全部数据
    var mkdd =[];
    var configdataarry = [];
    var configdd =[];

    getmkdata("#appcont");
    getmkdata("#appstorecont");
    getmkdata("#homecont");
    getmkdata("#imecont");
    getmkdata("#servicecont");
    getmkdata("#syscont");
    getmkdata("#tvcont");
    getmkdata("#mkothercont");
    getconfigdata("#maincont");
    getconfigdata("#othercont");
    getconfigdata("#hardwarecont");
    getconfigdata("#serveripcont");
    getconfigdata("#adcont");
    getconfigdata("#channelcont");
    getconfigdata("#localmediacont");
    getconfigdata("#browsercont");

    //获取mk文件数据
    var editMK = {};
    function getmkdata(name){
        $size = $(name).find("div");
        // if ($size.length!=0) {console.log($size);}else{console.log("ddd")};        
        // var array1 = [];//用于存放当前name分类下的数据
        for (var i = 0; i < $size.length; i++) {
            if($size[i].childNodes[0].checked){
                var _id = $size[i].childNodes[0].getAttribute("id");
                var cnName = $size[i].innerText;
                var engName = $size[i].childNodes[0].value;
                var desc = $size[i].childNodes[0].getAttribute("desc") ;
                var gitPath = $size[i].childNodes[0].getAttribute("gitPath");
                var category = $size[i].childNodes[0].getAttribute("category");
                var data = '{"cnName":"'+cnName+'","desc":"'+desc+'","engName":"'+engName+'","gitPath":"'+gitPath+'","category":"'+category+'"}';
                console.log(data);
                console.log(_id);
                editMK[_id] = JSON.parse(data);
                // array1.push(JSON.parse(data));//将当前name分类下的数据存到数组中
            }
        }
        console.log("mk文件信息是："+editMK);
        // console.log("mktest!!!!!!!!!!!"+JSON.stringify(array1));
        // mkdd.push(array1);//将分类之后的数组存到一个数组中
        // console.log(mkdd[0]);
        // console.log(JSON.stringify(mkdd));
    }
    // for (var i = 0; i < mkdd.length; i++) {
    //     if (mkdd[i].length>0) {
    //         for (var j = 0; j < mkdd[i].length; j++) {
    //             mkdataarry.push(mkdd[i][j]);
    //         }
    //     };
    // };
    // console.log("更新的mk信息："+JSON.stringify(mkdataarry));

    //获取config文件数据
    function getconfigdata(name){
        $size = $(name).find("div");
        var array2 = [];
        for (var i = 0; i < $size.length; i++) {
            var engName = $size[i].childNodes[1].getAttribute("engName");
            var value = $size[i].childNodes[1].value;
            var cnName = $size[i].childNodes[1].getAttribute("cnName");
            var configkey = $size[i].childNodes[1].getAttribute("configkey");
            var desc = $size[i].childNodes[1].getAttribute("desc");
            var category = $size[i].childNodes[1].getAttribute("category");
            // var opt = $size[i].childNodes[1].getAttribute("options");
            // var options = opt.split(",");
            // console.log("opt==="+opt+"&&&&&&&options:"+options);
            var type = $size[i].childNodes[1].getAttribute("type");
            if (type == "string") {
                var data = '{"engName":"'+engName+'","value":"'+value+'","cnName":"'+cnName+'","configkey":"'+configkey+'","desc":"'+desc+'","category":"'+category+'","options":[],"type":"'+type+'"}';
                // console.log(data);
                array2.push(JSON.parse(data));
            }
            else{
                var opt = [];
                var child = $size[i].childNodes[1].childNodes;
                // console.log(child.length+"内容是："+child[1].value);
                for (var j = 0; j < child.length; j++) {
                    opt.push(child[j].value);
                };
                // console.log(opt);
                var data={"engName":"","value":"","cnName":"","configkey":"","desc":"","category":"","options":[],"type":""}
                data.engName = engName;
                data.value = value;
                data.cnName = cnName;
                data.configkey = configkey;
                data.desc = desc;
                data.category = category;
                data.options = opt;
                data.type = type;
                // var data = '{"engName":"'+engName+'","value":"'+value+'","cnName":"'+cnName+'","configkey":"'+configkey+'","desc":"'+desc+'","category":"'+category+'","options":"'+opt+'","type":"'+type+'"}';
                // console.log(JSON.stringify(data));
                array2.push(data);

            }
            // console.log(JSON.stringify(array2));
        };
        configdd.push(array2);
        // console.log(JSON.stringify(configdd));
    }
    for (var i = 0; i < configdd.length; i++) {
        if (configdd[i].length>0) {
            for (var j = 0; j < configdd[i].length; j++) {
                configdataarry.push(configdd[i][j]);
            }
        };
    };
    // console.log("更新的config信息："+JSON.stringify(configdataarry));

    var target_product = document.getElementById("device").value;
    var android = document.getElementById("android").value;
    var chipid = document.getElementById("chipid").value;
    var memory = document.getElementById("memory").value;

    sendHTTPRequest("/fybv2_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"targetProduct":"'+target_product+'","androidVersion":"'+android+'","chipModel":"'+chipid+'","memorySize":"'+memory+'","mkFile":'+JSON.stringify(mkdataarry)+',"configFile":'+JSON.stringify(configdataarry)+',"gerritState":"1"}}}',reviewEditResult);

}


function reviewEditResult(){
    // console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        // console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg=="success") {
                // console.log("编辑提交成功！！！！");
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
     $('#mydialog').modal();
    document.getElementById("myDeleteModalLabel").innerHTML = "关闭操作";
    document.getElementById("dialogword").innerHTML = "当前操作未保存，是否确认退出？";
    document.getElementById("myDeleteModalEnsure").onclick = freshReviewHtml;
    
    
}


$('#configbutton').click(function(){
    $("#reviewconfigfile").css("display","block");
    $("#reviewmkfile").css("display","none");
})

$('#mkbutton').click(function(){
    $("#reviewconfigfile").css("display","none");
    $("#reviewmkfile").css("display","block");
})
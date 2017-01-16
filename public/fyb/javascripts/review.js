document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function () {
    var level = parent.adminFlag;
    var loginusername = parent.loginusername;
    console.log("得到的用户名："+loginusername+"得到的权限标志："+level);
    if (level == 1) {
        sendHTTPRequest("/fyb_api/productQuery", '{"data":{"condition":{"gerritState":"1"},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1}}}', reviewlist);
    }
    else{
        sendHTTPRequest("/fyb_api/productQuery", '{"data":{"condition":{"userName":"'+loginusername+'","gerritState":"1"},"option":{"chip":1,"model":1,"androidVersion":1,"memorySize":1,"chipModel":1,"operateType":1}}}', reviewlist);
    }    
})

var chip = null;
var model = null;

function reviewlist(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {

            var title=document.getElementById("reviewmytable"); //获取tbody的表格内容
            for (var i = title.childNodes.length-1; i > 0; i--) {
                title.removeChild(title.childNodes[i]); //删除掉每个子节点的内容
            };          

            var data = JSON.parse(this.responseText);
            var level = parent.adminFlag;
            console.log("level:"+level)
            var _row;

            var msg = data.msg;
            if (msg == "success") {
                var datalength = data.data;
                console.log(datalength);
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
                    if (level == 1) {
                        _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>审核</button></div>";
                    }
                    else{
                        if (operateType == 2) {
                             _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>恢复</button></div>";

                        }
                        else{
                            _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>编辑</button></div>";

                        }
                    }
                };
            }
            else{
                //查询为空

            }
            
        }
    }
}

function review(obj){
    chip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    sendHTTPRequest("/fyb_api/moduleQuery", '{"data":{}}', moduleResult);
    // sendHTTPRequest("/reviewcontent", '{"data":{"platformModel":"'+chip+'","productModel":"'+model+'"}}', reviewresult);
}

function moduleResult(){
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            $('#myMoreDeleteModal').modal();

            var app = [];
            var appstore = [];
            var homepage = [];
            var ime = [];
            var service = [];
            var sysapp = [];
            var main = [];
            var other = [];

            var data = JSON.parse(this.responseText);
            for (var i = 0; i < data.data.length; i++) {
                if(data.data[i].category == "App"){app.push(data.data[i]);}
                else if (data.data[i].category == "AppStore") {appstore.push(data.data[i]);}
                else if (data.data[i].category == "HomePage") {homepage.push(data.data[i]);}
                else if (data.data[i].category == "IME") {ime.push(data.data[i]);}
                else if (data.data[i].category == "Service") {service.push(data.data[i]);}
                else if (data.data[i].category == "SysApp") {sysapp.push(data.data[i]);}
            };

            document.getElementById("appcont").innerHTML="";
            document.getElementById("appstorecont").innerHTML="";
            document.getElementById("homecont").innerHTML="";
            document.getElementById("imecont").innerHTML="";
            document.getElementById("servicecont").innerHTML="";
            document.getElementById("syscont").innerHTML="";

            creatMK(app,"appcont");
            creatMK(appstore,"appstorecont");
            creatMK(homepage,"homecont");
            creatMK(ime,"imecont");
            creatMK(service,"servicecont");
            creatMK(sysapp,"syscont");

            function creatMK(name,divname){
                for (var i = 0; i < name.length; i++) {
                    var cont = document.getElementById(divname);
                    var child = document.createElement("div");
                    child.setAttribute('class','col-sm-3 form-group');
                    var text = document.createTextNode(name[i].cnName);
                    var input = document.createElement("input");
                    input.setAttribute('value',name[i].engName);
                    input.setAttribute('id',name[i].engName);
                    input.setAttribute('type','checkbox');
                    // if (name[i].state == 1) {input.setAttribute('checked','');};//勾选状态
                    child.appendChild(input);
                    child.appendChild(text);
                    cont.appendChild(child);
                }
            }
        }
    sendHTTPRequest("/fyb_api/configQuery", '{"data":{}}', configResult);   
    }
}
function configResult(){
    if (this.readyState == 4) {
        // console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var main = [];
            var other = [];

            var data = JSON.parse(this.responseText);
            for (var i = 0; i < data.data.length; i++) {
                if(data.data[i].category == "main"){main.push(data.data[i]);}
                else if (data.data[i].category == "other") {other.push(data.data[i]);}
            };

            document.getElementById("maincont").innerHTML="";
            document.getElementById("othercont").innerHTML="";

            creatConfig(main,"maincont");
            creatConfig(other,"othercont");

            function creatConfig(name,divname){
                for (var i = 0; i < name.length; i++) {
                    var cont = document.getElementById(divname);
                    var child = document.createElement("div");
                    child.setAttribute('class','col-sm-5 form-group text-right');
                    var text = document.createTextNode(name[i].cnName+"("+name[i].engName+")　");
                    if (name[i].type == "string") {
                        var input = document.createElement("input");
                        input.setAttribute("title",name[i].engName);
                        input.value = name[i].value;
                    }
                    else if (name[i].type == "select"){
                        var input = document.createElement("select");
                        input.setAttribute("title",name[i].engName);
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
    sendHTTPRequest("/fyb_api/productQuery", '{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult);   
    }    
}


function reviewresult(){
    var level = parent.adminFlag;
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {

            $('#myMoreDeleteModal').modal();

            var data = JSON.parse(this.responseText);
            // console.log(data[0]);
            document.getElementById("chip").value=data.data[0].chip;
            document.getElementById("model").value=data.data[0].model;
            document.getElementById("device").value=data.data[0].targetProduct;
            document.getElementById("android").value=data.data[0].androidVersion;
            document.getElementById("chipid").value=data.data[0].chipModel;
            document.getElementById("memory").value=data.data[0].memorySize;

            var mkfile = data.data[0].mkFile;
            for (var i = 0; i < mkfile.length; i++) {
                document.getElementById(mkfile[i].engName).setAttribute('checked','');
            };

            

//如果是管理员，不允许修改
            if(level == 1){
                var inputcounts = document.getElementsByTagName("input");
                var selectcounts = document.getElementsByTagName("select");
                console.log("inputcounts="+inputcounts.length);
                for (var i = 0; i < inputcounts.length; i++) {
                    inputcounts[i].setAttribute('disabled','')
                }
                for (var i = 0; i < selectcounts.length; i++) {
                    selectcounts[i].setAttribute('disabled','')
                }
            }
            
        }
    }
}


$('#configbutton').click(function(){
    $("#reviewconfigfile").css("display","block");
    $("#reviewmkfile").css("display","none");
})

$('#mkbutton').click(function(){
    $("#reviewconfigfile").css("display","none");
    $("#reviewmkfile").css("display","block");
})
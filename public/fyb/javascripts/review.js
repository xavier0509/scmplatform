document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");
//加载自执行，传递参数请求列表
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

//在待审核页面出现列表
function reviewlist(){
    console.log("this.readyState = " + this.readyState);
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
                             _cell6.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='recover(this)'>恢复</button></div>";

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

//点击恢复按钮执行函数-----将待审核状态置0
function recover(obj){
    var rechip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    var remodel = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    sendHTTPRequest("/fyb_api/productUpdate",'{"data":{"condition":{"chip":"'+rechip+'","model":"'+remodel+'"},"action":"set","update":{"operateType":"0","gerritState":"0"}}}',recoverResult);

}

//恢复的回调函数
function recoverResult(){

}

//点击编辑、审核出现页面的执行函数
function review(obj){
    chip = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    model = obj.parentNode.parentNode.parentNode.children[1].innerHTML;
    //查询模块信息接口
    sendHTTPRequest("/fyb_api/moduleQuery", '{"data":{}}', moduleResult);    
    
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
    // 查询对应机芯机型的配置信息
    sendHTTPRequest("/fyb_api/productQuery", '{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"option":{}}}', reviewresult);   
    }
}


function reviewresult(){
    var level = parent.adminFlag;
    console.log("this.readyState = " + this.readyState);
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


            //更新mk文件信息，匹配后勾选
            var mkfile = data.data[0].mkFile;
            for (var i = 0; i < mkfile.length; i++) {
                document.getElementById(mkfile[i].engName).setAttribute('checked','');
            };

            //生成config文件

            var configfile = data.data[0].configFile;
            var main = [];
            var other = [];

            for (var i = 0; i < configfile.length; i++) {
                if(configfile[i].category == "main"){main.push(configfile[i]);}
                else if (configfile[i].category == "other") {other.push(configfile[i]);}
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
                            console.log(opt);
                        };
                        var input = document.createElement("select");
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
                document.getElementById("reviewSubmit").innerHTML = "审核通过";
                document.getElementById("btn_submit").onclick = function(){
                    sendHTTPRequest("/fyb_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"operateType":"0","gerritState":"0"}}}',passResult);
                }
                
            }
            else{
                document.getElementById("reviewSubmit").innerHTML = "提交";
                document.getElementById("btn_submit").onclick = reviewEdit;
            }
            
        }
    }
}

//点击审核通过的回调
function passResult(){

}

//点击编辑提交的函数
function reviewEdit(){
    console.log("开始提交数据");

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
    getconfigdata("#maincont");
    getconfigdata("#othercont");

    //获取mk文件数据
    function getmkdata(name){
        $size = $(name).find("div");
        // if ($size.length!=0) {console.log($size);}else{console.log("ddd")};        
        var array1 = [];//用于存放当前name分类下的数据
        for (var i = 0; i < $size.length; i++) {
            if($size[i].childNodes[0].checked){
                var cnName = $size[i].innerText;
                var engName = $size[i].childNodes[0].value;
                var desc = $size[i].childNodes[0].getAttribute("desc") ;
                var gitPath = $size[i].childNodes[0].getAttribute("gitPath");
                var category = $size[i].childNodes[0].getAttribute("category");
                var data = '{"cnName":"'+cnName+'","desc":"'+desc+'","engName":"'+engName+'","gitPath":"'+gitPath+'","category":"'+category+'"}';
                // console.log(data);
                array1.push(JSON.parse(data));//将当前name分类下的数据存到数组中
            }
        };
        // console.log("mktest!!!!!!!!!!!"+JSON.stringify(array1));
        mkdd.push(array1);//将分类之后的数组存到一个数组中
        // console.log(mkdd[0]);
        // console.log(JSON.stringify(mkdd));
    }
    for (var i = 0; i < mkdd.length; i++) {
        if (mkdd[i].length>0) {
            for (var j = 0; j < mkdd[i].length; j++) {
                mkdataarry.push(mkdd[i][j]);
            }
        };
    };
    console.log("更新的mk信息："+JSON.stringify(mkdataarry));

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
                console.log(data);
                array2.push(JSON.parse(data));
            }
            else{
                var opt = [];
                var child = $size[i].childNodes[1].childNodes;
                for (var i = 0; i < child.length; i++) {
                    opt.push(child[i].value);
                };
                console.log(opt);
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
                console.log(JSON.stringify(data));
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
    console.log("更新的config信息："+JSON.stringify(configdataarry));

    sendHTTPRequest("/fyb_api/productUpdate",'{"data":{"condition":{"chip":"'+chip+'","model":"'+model+'"},"action":"set","update":{"mkFile":'+JSON.stringify(mkdataarry)+',"configFile":'+JSON.stringify(configdataarry)+'}}}',reviewEditResult);

}

function reviewEditResult(){
    
}















$('#configbutton').click(function(){
    $("#reviewconfigfile").css("display","block");
    $("#reviewmkfile").css("display","none");
})

$('#mkbutton').click(function(){
    $("#reviewconfigfile").css("display","none");
    $("#reviewmkfile").css("display","block");
})
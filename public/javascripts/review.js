document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function () {
    sendHTTPRequest("/review", '{"data":""}', reviewlist);
})

function reviewlist(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            var _row;
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                _row = document.getElementById("reviewmytable").insertRow(0);  
                var _cell0 = _row.insertCell(0); 
                _cell0.innerHTML = data[i]. chip;
                var _cell1 = _row.insertCell(1);
                _cell1.innerHTML = data[i].android;
                var _cell2 = _row.insertCell(2);
                _cell2.innerHTML = data[i].chipid;
                var _cell3 = _row.insertCell(3);
                if (level == 1) {
                    _cell3.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>审核</button></div>";
                }
                else{
                    _cell3.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>编辑</button></div>";
                }
            };
            // loginId = data.data;
            // printlog(loginId);
            
        }
    }
}

function review(obj){
    var node = obj.parentNode.parentNode.parentNode.children[0].innerHTML;
    console.log(node);
    sendHTTPRequest("/reviewcontent", '{"data":""}', reviewresult);
}

function reviewresult(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {

            $('#myMoreDeleteModal').modal();

            var data = JSON.parse(this.responseText);
            // console.log(data[0]);
            var app = data.app;
            var appstore = data.appstore;
            var main = data.main;

            console.log(appstore);
            document.getElementById("appcont").innerHTML="";
            document.getElementById("appstorecont").innerHTML="";
            document.getElementById("maincont").innerHTML="";
            //mk文件生成
            for (var i = 0; i < app.length; i++) {
                var appcont = document.getElementById("appcont");
                var child = document.createElement("div");
                child.setAttribute('class','col-sm-3 form-group');
                var text = document.createTextNode(app[i].name);
                var input = document.createElement("input");
                input.setAttribute('type','checkbox');
                if (app[i].state == 1) {input.setAttribute('checked','');};//勾选状态
                child.appendChild(input);
                child.appendChild(text);
                appcont.appendChild(child);
            };
            for (var i = 0; i < appstore.length; i++) {
                var appstorecont = document.getElementById("appstorecont");
                var child = document.createElement("div");
                child.setAttribute('class','col-sm-3 form-group');
                var text = document.createTextNode(appstore[i].name);
                var input = document.createElement("input");
                input.setAttribute('type','checkbox');
                if (appstore[i].state == 1) {input.setAttribute('checked','');};
                child.appendChild(input);
                child.appendChild(text);
                appstorecont.appendChild(child);
            };
            //config生成
            for (var i = 0; i < main.length; i++) {
                var maincont = document.getElementById("maincont");
                var child = document.createElement("div");
                child.setAttribute('class','col-sm-5 form-group text-right');
                var text = document.createTextNode(main[i].name);
                if (main[i].type == "text") {
                    var input = document.createElement("input");
                    input.value = main[i].value;
                }
                else if (main[i].type == "select"){
                    var input = document.createElement("select");
                    input.setAttribute("class","form-group");
                    for (var j = 0; j< main[i].option.length; j++) {
                        var txt = main[i].option[j];
                        var option =document.createElement("option");
                        option.setAttribute("value",txt);
                        var txtvalue = document.createTextNode(txt);
                        option.appendChild(txtvalue);
                        input.appendChild(option);
                    };
                }
                child.appendChild(text);
                child.appendChild(input);
                maincont.appendChild(child);
            };

//如果是管理员，不允许修改
            if(false){
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
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='../javascripts/login.js' charset=\"utf-8\"></script>");

$(function () {
    sendHTTPRequest("/review", "node", reviewlist);
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
            var level = 1;
            for (var i = 0; i < data.length; i++) {
                _row = document.getElementById("mytable").insertRow(0);  
                var _cell0 = _row.insertCell(0); 
                _cell0.innerHTML = data[i]. chip;
                var _cell1 = _row.insertCell(1);
                _cell1.innerHTML = data[i].android;
                var _cell2 = _row.insertCell(2);
                _cell2.innerHTML = data[i].chipid;
                var _cell3 = _row.insertCell(3);
                _cell3.innerHTML = data[i].author;
                console.log("level=="+level);
                var _cell4 = _row.insertCell(4);
                if (level == 1) {
                    _cell4.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>审核</button></div>";
                }
                else{
                    _cell4.innerHTML = "<div class='btn-group'><button type='button' class='btn btn-default' onclick='review(this)'>编辑</button></div>";
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
    sendHTTPRequest("/reviewcontent", "node", reviewresult);
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
            var app = data[0].app;
            var appstore = data[0].appstore;

            console.log(appstore);
            document.getElementById("appcont").innerHTML="";
            document.getElementById("appstorecont").innerHTML="";
            for (var i = 0; i < app.length; i++) {
                var appcont = document.getElementById("appcont");
                var child = document.createElement("div");
                child.setAttribute('class','col-sm-3 form-group');
                var text = document.createTextNode(app[i].name);
                var input = document.createElement("input");
                input.setAttribute('type','checkbox');
                if (app[i].state == 1) {input.setAttribute('checked','');};
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
            
        }
    }
}

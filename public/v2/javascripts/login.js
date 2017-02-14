document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

var level = 0;//等级权限，0为管理员，1为一般用户

document.getElementById("username").addEventListener("focus",focusPosition);
document.getElementById("password").addEventListener("focus",focusPosition);

function focusPosition(){
    document.getElementById("logintxt").innerHTML = "　";
}

function loginfun() {
    document.getElementById("logintxt").innerHTML = "　";
    var username = document.getElementById('username').value;
    var pwd = document.getElementById('password').value;
    // var node = '{"username":"' + username + '","password":"' + pwd +'"}';
    var node = '{"data":{"username":"' + username + '","password":"' + pwd + '"}}';
    console.log(node);
    if (username != "" && pwd != "") {
        sendHTTPRequest("/fybv2_api/login", node, loginresult);
    }
    else if(username == ""){
        var loginmsg = document.getElementById("logintxt");
        loginmsg.innerHTML = loginmsg.innerHTML+"请输入用户名！";
    }
    else{
        var loginmsg = document.getElementById("logintxt");
            loginmsg.innerHTML = loginmsg.innerHTML+"请输入密码！";
    }

}

function loginresult() {
    
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                document.location.href="index.html" ;  
            }
            else if (data.msg == "failure") {
	    	var loginmsg = document.getElementById("logintxt");
            loginmsg.innerHTML = loginmsg.innerHTML+"请输入正确用户名或密码！";
            // setTimeout("document.getElementById('logintxt').innerHTML='　'",2000);
	    };

            // loginId = data.data;
            // printlog(loginId);

        }
    }
}


function keyLogin(){
    if (event.keyCode==13)   //回车键的键值为13
     document.getElementById("loginbutton").click();  //调用登录按钮的登录事件
}
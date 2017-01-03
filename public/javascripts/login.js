document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

var level = 0;//等级权限，0为管理员，1为一般用户

function loginfun(){
    var username = document.getElementById('username').value;
    var pwd = document.getElementById('password').value;
    var node = '{"username":"' + username + '","password":"' + pwd +'"}';
    console.log(node);
    if (username != "" && pwd != "") {
        sendHTTPRequest("http://172.20.132.225:3000/api/login", node, loginresult);
    }
    else if(username == ""){
        var usermessage = document.getElementById('usermessage');
        usermessage.innerHTML="请输入账号";
        setTimeout("usermessage.innerHTML=''",2000);
    }
    else{
        var pwdmessage = document.getElementById('pwdmessage');
        pwdmessage.innerHTML="请输入账号";
        setTimeout("pwdmessage.innerHTML=''",2000);
    }

}

function loginresult(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                level = 1;
                document.location.href="index.html" ;
                
            }
            else if (data.msg == "failure") {
	    	var loginmsg = document.getElementById("logintxt");
            loginmsg.innerHTML = loginmsg.innerHTML+"!请输入正确账号或密码";
            setTimeout("document.getElementById('logintxt').innerHTML='　'",2000);
	    };
            // loginId = data.data;
            // printlog(loginId);
            
        }
    }
}

document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");

var level = 0;//等级权限，0为管理员，1为一般用户

function loginfun() {
    var username = document.getElementById('username').value;
    var pwd = document.getElementById('password').value;
    // var node = '{"username":"' + username + '","password":"' + pwd +'"}';
    var node = '{"data":{"username":"' + username + '","password":"' + pwd + '"}}';
    console.log(node);
    if (username != "" && pwd != "") {
        sendHTTPRequest("/users", node, loginresult);
        // sendHTTPRequest("http://127.0.0.1:3000/api/login", node, loginresult);
    }
    else {
        console.log("请填写完整")
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
                level = 1;
                document.location.href = "index.html";

            }
            ;
            // loginId = data.data;
            // printlog(loginId);

        }
    }
}

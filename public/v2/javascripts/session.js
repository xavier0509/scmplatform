document.write("<script language=javascript src='../javascripts/bootstrap.addtabs.js' charset=\"utf-8\"></script>");

var adminFlag = null;   //访问session之后存取管理员标志位
var loginusername = null;  //访问session之后存取登录用户名
var loginEmail = null;   //当前用户的邮箱地址

//访问session接口
// function forsession(){
//     sendHTTPRequest("/users", '{"data":""}', sessionresult);
// }

//访问session接口
function forsession(){
    Addtabs.add({
            id: 'userMenu1',
            title: '配置文件管理',
            // content: 'content',
            url: 'wait.html',
            ajax: false
        });
    sendHTTPRequest("/fybv2_api/session", '{"data":""}', sessionresult);
}

//session返回数据
function sessionresult(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                if (data.data.data.logined == true) {
                    loginusername = data.data.data.author;
                    document.getElementById("indexUserName").innerHTML = loginusername;
                    if (data.data.data.adminFlag == "1") {
                        adminFlag = 1;   //非管理员标志位                
                        // console.log(loginusername);
                        for (var i = 1; i < 5; i++) {//隐藏左边管理员的部分
                            document.getElementById("_hidden"+i).style.display="block";
                        };
                    }
                    else if (data.data.data.adminFlag == "0") {
                        adminFlag = 0;
                    }
                }else{
                    document.location.href="login.html" ; 
                }

            }
            else {
                console.log("未登录");
                document.location.href="login.html" ;  
            }            
        }
        sendHTTPRequest("/fybv2_api/userQuery", '{"data":{"condition":{"userName":"' + loginusername + '"}}}', userInfoResult);    
    }
}

function userInfoResult(){
    if (this.readyState == 4) {
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            if (data.msg == "success") {
                // console.log(data);
                loginEmail = data.data[0].email;
                // console.log("邮箱地址："+loginEmail);
            }
            else{
                
            }            
        }
    }
}

function logout(){
    sendHTTPRequest("/fybv2_api/logout", '', logoutResult);    

}
function logoutResult(){
    if (this.readyState == 4) {
        if (this.status == 200) //TODO
        {
          alert("ok")
        }
        else{
            // alert("qqok")
        }
    }
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
// tab导航栏
$(function () {
    $('#tabs').addtabs({contextmenu:true});
})

var adminFlag = null;   //访问session之后存取管理员标志位
var loginusername = null;  //访问session之后存取登录用户名

//访问session接口
// function forsession(){
//     sendHTTPRequest("/users", '{"data":""}', sessionresult);
// }

//访问session接口
function forsession(){
    sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
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
            console.log("msg="+data.msg);
            console.log("users"+data.data.author);
            if (data.msg == "success") {
                loginusername = data.data.author;
                if (data.data.adminFlag == "0") {
                    adminFlag = 0;   //非管理员标志位                
                    console.log(loginusername);
                    for (var i = 1; i < 5; i++) {//隐藏左边管理员的部分
                        document.getElementById("_hidden"+i).style.display="none";
                    };
                }
                else if (data.data.adminFlag == "1") {
                    adminFlag = 1;
                }
            };
            
        }
    }
}
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
            if (data.msg == "success") {
                loginusername = data.data.data.author;
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

            }
            else if (data.code == "0"){
                console.log("未登录");
                document.location.href="login.html" ;  
            }            
        }
    }
}
document.write("<script language=javascript src='../javascripts/sentHTTP.js' charset=\"utf-8\"></script>");
// tab������
$(function () {
    $('#tabs').addtabs({contextmenu:true});
})

var adminFlag = null;   //����session֮���ȡ����Ա��־λ
var loginusername = null;  //����session֮���ȡ��¼�û���

//����session�ӿ�
// function forsession(){
//     sendHTTPRequest("/users", '{"data":""}', sessionresult);
// }

// //session��������
// function sessionresult(){
//     console.log("this.readyState = " + this.readyState);
//     if (this.readyState == 4) {
//         console.log("this.status = " + this.status);
//         console.log("this.responseText = " + this.responseText);
//         if (this.status == 200) //TODO
//         {
//             var data = JSON.parse(this.responseText);
//             loginusername = data.username;
//             if (data.adminFlag == "0") {
//                 adminFlag = 0;   //����Ա��־λ                
//                 console.log(loginusername);
//                 for (var i = 1; i < 5; i++) {//������߹���Ա�Ĳ���
//                     document.getElementById("_hidden"+i).style.display="none";
//                 };
//             }
//             else if (data.adminFlag == "1") {
//                 adminFlag = 1;
//         };
//         }
//     }
// }

//����session�ӿ�
function forsession(){
    sendHTTPRequest("/api/session", '{"data":""}', sessionresult);
}

//session��������
function sessionresult(){
    console.log("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            // var data = JSON.parse(this.responseText);
            // loginusername = data.username;
            // if (data.adminFlag == "0") {
            //     adminFlag = 0;   //����Ա��־λ                
            //     console.log(loginusername);
            //     for (var i = 1; i < 5; i++) {//������߹���Ա�Ĳ���
            //         document.getElementById("_hidden"+i).style.display="none";
            //     };
            // }
            // else if (data.adminFlag == "1") {
            //     adminFlag = 1;
            // };
        }
    }
}
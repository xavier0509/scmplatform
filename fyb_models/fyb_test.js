var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    secureConnection: true,
    port:465,
    auth: {
        user: 'fanyanbo917@163.com',
        pass: 'wo2small',
    }
});

var sendmail = function(html){
    var option = {
        from:"fanyanbo917@163.com",
        to:"xiejr_work@163.com,fanyanbo@skyworth.com,16187525@qq.com"
    }
    option.subject = 'hello 系统支持组'
    option.html= html;
    transporter.sendMail(option, function(error, response){
        if(error){
            console.log("fail: " + error);
        }else{
            console.log("success: " + response);
        }
    });
}

 
sendmail("邮件内容：<br/>这是来自软件配置管理平台发送的邮件");



var nodemailer = require('nodemailer');
//require('ssl-root-cas').inject();

/*var transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    secureConnection: true,
    port:465,
    auth: {
        user: 'fanyanbo917@163.com',
        pass: 'wo2small',
    }
});*/

var transporter = nodemailer.createTransport({
    host: "mail.skyworth.com",
    port:465,
    auth: {
        user: 'fanyanbo@skyworth.com',
        pass: 'fyb.1117',
    },
    tls: {rejectUnauthorized: false},
    debug:true
});

/*var sendmail = function(html){
    var option = {
        from:"fanyanbo@skyworth.com",
        to:"xiejinrong@skyworth.com,fanyanbo@skyworth.com,linxinwang@skyworth.com,liangquanqing@skyworth"
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
}*/

var sendmail = function(from,to,subject,content){
    var option = {
        from:from,
        to:to
    }
    option.subject = subject;
    option.text = content;
    //option.html= html;
    transporter.sendMail(option, function(error, response){
        if(error){
            console.log("fail: " + error);
        }else{
            console.log("success: " + response);
        }
    });
}

 
//sendmail("邮件内容：<br/>这是来自软件配置管理平台发送的邮件");

module.exports = sendmail;
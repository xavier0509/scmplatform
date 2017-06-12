var nodemailer = require('nodemailer');
//require('ssl-root-cas').inject();


//var transporter = nodemailer.createTransport({
//  host:'smtp.163.com',
//  port:465,
//  auth: {
//      user: 'fanyanbo917@163.com',
//      pass: 'wo2small',
//  },
//  tls: {rejectUnauthorized: false},
//  debug:true
//});

//var transporter = nodemailer.createTransport({
//  service:'qq',
//  auth: {
//      user: '16187525@qq.com',
//      pass: 'oyaupgqgsucubhdg',
//  }
//});

var transporter = nodemailer.createTransport({
    host: "mail.skyworth.com",
    port:465,
    auth: {
        user: 'fanyanbo@skyworth.com',
        pass: 'fyb.1115',
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

var sendmail = function(from,to,cc,subject,html,callback){
    var option = {
        from:from,
        to:to
    }
    option.subject = subject;
    //option.text = content;
    option.html= html;
    option.cc = cc;
    transporter.sendMail(option, function(error, response){
        if(error){
            console.log("fail: " + error);
            callback(-1,"error");
        }else{
            console.log("success: " + response);
            callback(0,"success");
        }
    });
}

 
//sendmail("邮件内容：<br/>这是来自软件配置管理平台发送的邮件");

module.exports = sendmail;
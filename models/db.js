// 引包
var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// 创建链接,每一个用户都会自动创建一个连接请求
var db = mongoose.createConnection('mongodb://127.0.0.1/scmplatform');
// var db = mongoose.createConnection('mongodb://172.20.132.225/scmplatform');

// 监听open事件
db.once("open", function (callback) {
    console.log("数据库成功连接");
});

// 向外暴露这个db对象
module.exports = db;
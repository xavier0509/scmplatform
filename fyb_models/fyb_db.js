var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://172.20.217.11:27018/fybv3');

db.once("open", function (callback) {
    console.log("数据库成功连接");
});

db.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

module.exports = db;

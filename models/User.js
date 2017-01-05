/**
 * Created by d on 16/12/29.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var userSchema = new mongoose.Schema({
    username: {type: String, default: "匿名用户"},
    password: {type: String},
    adminFlag: {type: Number}
});


// 创建静态方法
userSchema.statics.zhaoren = function (username, callback) {
    this.model("User").find({"username": username}, callback);
};

// 创建静态方法
userSchema.statics.zhaoren1 = function (username, password, callback) {
    this.model("User").find({"username": username, "password": password}, callback);
};

// 修改静态方法
userSchema.statics.xiugai = function (conditions, update, options, callback) {
    this.model("User").update(conditions, update, options, callback);
};

// 类是基于schema创建的。
var userModel = db.model("User", userSchema);

// 向外暴露
module.exports = userModel;
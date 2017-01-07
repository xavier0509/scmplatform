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


// 查询记录,username
userSchema.statics.zhaoren = function (username, callback) {
    this.model("User").find({"username": username}, callback);
};

// 查询记录,username,password
userSchema.statics.zhaoren1 = function (username, password, callback) {
    this.model("User").find({"username": username, "password": password}, callback);
};

// 修改记录
userSchema.statics.xiugai = function (conditions, update, options, callback) {
    this.model("User").update(conditions, update, options, callback);
};

// 通过Schema创建Model
var userModel = db.model("User", userSchema);

module.exports = userModel;
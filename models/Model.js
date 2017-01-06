/**
 * Created by d on 16/12/29.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var modelSchema = new mongoose.Schema({
    name: {type: String},
});

// 查询记录
modelSchema.statics.searchBy = function (name, callback) {
    this.model("Model").find({"name": name}, {"name": 1, "_id": 0}, callback);
};

// 查询所有记录
modelSchema.statics.searchAll = function (callback) {
    this.model("Model").find({}, {"name": 1, "_id": 0}, callback);
};

// 修改
modelSchema.statics.xiugai = function (conditions, update, options, callback) {
    this.model("Model").update(conditions, update, options, callback);
};


// 类是基于schema创建的。
var modelModel = db.model("Model", modelSchema);

// 向外暴露
module.exports = modelModel;
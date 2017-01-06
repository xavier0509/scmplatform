/**
 * Created by d on 16/12/29.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var productSchema = new mongoose.Schema({
    name: {type: String},
});


// 查询记录
productSchema.statics.searchBy = function (name, callback) {
    this.model("Product").find({"name": name}, {"name": 1, "_id": 0}, callback);
};

// 查询所有记录
productSchema.statics.searchAll = function ( callback) {
    this.model("Product").find({},{"name":1,"_id":0}, callback);
};

// 修改
productSchema.statics.xiugai = function (conditions, update, options, callback) {
    this.model("Product").update(conditions, update, options, callback);
};

// 类是基于schema创建的。
var productModel = db.model("Product", productSchema);

// 向外暴露
module.exports = productModel;
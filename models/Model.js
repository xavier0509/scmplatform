/**
 * Created by d on 16/12/29.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var modelSchema = new mongoose.Schema({
    name: {type: String},
});


// 类是基于schema创建的。
var modelModel = db.model("Model", modelSchema);

// 向外暴露
module.exports = modelModel;
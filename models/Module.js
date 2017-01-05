/**
 * Created by d on 16/12/29.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var moduleSchema = new mongoose.Schema({
    moduleName: {type: String},
    modulePath: {type: String},
    moduleDescription: {type: String},
    moduleCategory: {type: String},
});

// 类是基于schema创建的。
var moduleModel = db.model("Module", moduleSchema);

// 向外暴露
module.exports = moduleModel;
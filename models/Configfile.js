/**
 * Created by d on 17/1/3.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var configfileSchema = new mongoose.Schema({
    platformModel: {type: String},
    productModel: {type: String},
    androidVersion: {type: String},
    chipModel: {type: String},
    memorySize: {type: String},
    pendingReview: {type: String},
    App: {type: Array},
    AppStore: {type: Array},
    HomePage: {type: Array},
    IME: {type: Array},



});


// 类是基于schema创建的。
var configfileModel = db.model("Configfile", configfileSchema);

// 向外暴露
module.exports = configfileModel;
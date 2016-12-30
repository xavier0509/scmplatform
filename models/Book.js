/**
 * Created by d on 16/12/30.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var bookSchema = new mongoose.Schema({
    name  : {type: String},
    author: {type: String},
    price : {type: Number},
    type  : {type:Array}
});

// 模型需要用到schema
var bookModel = db.model("Book", bookSchema);

module.exports = bookModel;
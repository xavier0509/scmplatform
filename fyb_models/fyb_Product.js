var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require("./fyb_db");

var productSchema = new mongoose.Schema({
    operateType:Number,
    gerritState:Number,
    userName:String,
    desc:String,
    memorySize:String,
    chipModel:String,
    androidVersion:String,
    model:String,
    chip:String,
    targetProduct:String,
    mkFile:Schema.Types.Mixed,
    configFile:Schema.Types.Mixed
//    mkFile:{type: Array},
//    configFile:{type: Array}
});

productSchema.statics.productAdd = function (jsonStr,callback) {

    this.model("Product").create(jsonStr,callback);
};

productSchema.statics.productQuery = function (whereStr,optStr,callback) {

    this.model("Product").find(whereStr,optStr,callback);
};

productSchema.statics.productUpdate = function (whereStr,updateStr,optStr,callback) {

    this.model("Product").update(whereStr, updateStr, optStr, callback);
};

productSchema.statics.productDelete = function (whereStr,callback) {

    this.model("Product").remove(whereStr, callback);
};

var productModel = db.model("Product", productSchema);

module.exports = productModel;


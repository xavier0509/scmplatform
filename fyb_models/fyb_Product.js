var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require("./fyb_db");

var productSchema = new mongoose.Schema({
    operateTime:String,
    operateType:Number,// 0表示无状态，1表示增加，2表示删除，3表示修改
    gerritState:Number,// 0表示正常状态，1表示待审核状态，2表示审核不通过状态
    userName:String,
    desc:Schema.Types.Mixed,
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

productSchema.statics.productQuery = function (whereStr,fields,sortStr,callback) {

    this.model("Product").find(whereStr,fields,sortStr,callback);
};

productSchema.statics.productUpdate = function (whereStr,updateStr,optStr,callback) {

    this.model("Product").update(whereStr, updateStr, optStr, callback);
};

productSchema.statics.productDelete = function (whereStr,callback) {

    this.model("Product").remove(whereStr, callback);
};

var productModel = db.model("Product", productSchema);

module.exports = productModel;


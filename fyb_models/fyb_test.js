var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require("./fyb_db");

var configSchema = new mongoose.Schema({
    cnName:String,
    engName:String,
    configKey:String,
    type:String,   
    value:String,
    category:String,
    options:Array,
    desc:String
});

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
    mkFile: Schema.Types.Mixed,
    configFile: Schema.Types.Mixed
});


configSchema.statics.configUpdate = function (conditions, update, options, callback) {

    this.model("Config").update(conditions, update, options, callback);
};

productSchema.statics.productUpdate = function (whereStr,updateStr,optStr,callback) {

    this.model("Product").update(whereStr, updateStr, optStr, callback);
};


var configModel = db.model("Config", configSchema);

var productModel = db.model("Product", productSchema);

function test(){
	var conditions = {"_id":Object("5887f84887f639072bdaae0c")};
	var update = {"desc":"fanyanbo test!"};
	var options = {multi:true};
	configModel.configUpdate(conditions, update, options, function(err,res){
		if (err) {
			console.log(err);
		}else{
			console.log(res);
		}

	});
}

function test1(){
	var conditions = {};
	var update = {$set:{"mkFile.ObjectId('4fd58ecbb9ac507e96276f1a').desc": "liangquanqing XXXXXX"}};
	var options = {multi:true};
	productModel.productUpdate(conditions, update, options, function(err,res){
		if (err) {
			console.log(err);
		}else{
			console.log(res);
		}

	});
}

test1();

module.exports = configModel;

var mongoose = require('mongoose');
var db = require("./fyb_db");

var moduleSchema = new mongoose.Schema({
    cnName:String,
    engName:String,
    gitPath:String,
    desc:String,
    category:String
});

moduleSchema.statics.moduleQuery = function (whereStr,optStr,callback) {

    this.model("Module").find(whereStr,optStr,callback);
};

moduleSchema.statics.moduleAdd = function (jsonStr,callback) {

    this.model("Module").create(jsonStr,callback);
};

moduleSchema.statics.moduleUpdate = function (conditions, update, options, callback) {

    this.model("Module").update(conditions, update, options, callback);
};

moduleSchema.statics.moduleDelete = function (conditions, callback) {

    this.model("Module").remove(conditions, callback);
};


var modulelModel = db.model("Module", moduleSchema);


module.exports = modulelModel;

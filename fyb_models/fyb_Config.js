var mongoose = require('mongoose');
var db = require("./fyb_db");

var configSchema = new mongoose.Schema({
    cnName:String,
    engName:String,
    configKey:String,
    type:String,
    desc:String,
    value:String,
    category:String,
    options:Array,
});

configSchema.statics.configQuery = function (whereStr,optStr,callback) {
    this.model("Config").find(whereStr,optStr,callback);
};

configSchema.statics.configAdd = function (jsonStr,callback) {

    this.model("Config").create(jsonStr,callback);
};

configSchema.statics.configUpdate = function (conditions, update, options, callback) {

    this.model("Config").update(conditions, update, options, callback);
};

configSchema.statics.configDelete = function (conditions, callback) {

    this.model("Config").remove(conditions, callback);
};


var configModel = db.model("Config", configSchema);

module.exports = configModel;

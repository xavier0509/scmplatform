var mongoose = require('mongoose');
var db = require("./fyb_db");

var modelSchema = new mongoose.Schema({
    name: {type: String},
});

modelSchema.statics.modelQuery = function (whereStr,optStr,callback) {
        
        this.model("Model").find(whereStr,optStr,callback);
};

modelSchema.statics.modelAdd = function (wherestr,callback) {

        this.model("Model").create(wherestr,callback);
};

modelSchema.statics.modelUpdate = function (conditions, update, options, callback) {

        this.model("Model").update(conditions, update, options, callback);
};

modelSchema.statics.modelDelete = function (conditions, callback) {

    this.model("Model").remove(conditions, callback);
};


var modelModel = db.model("Model", modelSchema);

module.exports = modelModel;

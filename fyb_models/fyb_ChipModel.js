var mongoose = require('mongoose');
var db = require("./fyb_db");

var chipModelSchema = new mongoose.Schema({
    name: {type: String},
});

chipModelSchema.statics.chipModelQuery = function (whereStr,optStr,callback) {

        this.model("ChipModel").find(whereStr,optStr,callback);
};

chipModelSchema.statics.chipModelAdd = function (wherestr,callback) {

        this.model("ChipModel").create(wherestr,callback);
};

chipModelSchema.statics.chipModelUpdate = function (conditions, update, options, callback) {

        this.model("ChipModel").update(conditions, update, options, callback);
};

chipModelSchema.statics.chipModelDelete = function (conditions, callback) {

    this.model("ChipModel").remove(conditions, callback);
};

var chipModelModel = db.model("ChipModel", chipModelSchema,"chipModels");

module.exports = chipModelModel;

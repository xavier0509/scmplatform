var mongoose = require('mongoose');
var db = require("./fyb_db");

var chipSchema = new mongoose.Schema({
    name: {type: String},
});

chipSchema.statics.chipQuery = function (whereStr,optStr,callback) {

        this.model("Chip").find(whereStr,optStr,callback);
};

chipSchema.statics.chipAdd = function (wherestr,callback) {

        this.model("Chip").create(wherestr,callback);
};

chipSchema.statics.chipUpdate = function (conditions, update, options, callback) {

        this.model("Chip").update(conditions, update, options, callback);
};

chipSchema.statics.chipDelete = function (conditions, callback) {

    this.model("Chip").remove(conditions, callback);
};

var chipModel = db.model("Chip", chipSchema);

module.exports = chipModel;

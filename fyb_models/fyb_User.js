var mongoose = require('mongoose');
var db = require("./fyb_db");

var userSchema = new mongoose.Schema({
    userName: {type: String},
    password: {type: String},
    level: {type: Number}
});

userSchema.statics.userQuery = function (condition, callback) {

    this.model("User").find(condition,callback);
};

userSchema.statics.userUpdate = function (conditions, update, options, callback) {
  
    this.model("User").find(conditions, update, options, callback);
};

var userModel = db.model("User", userSchema);

module.exports = userModel;

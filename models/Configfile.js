/**
 * Created by d on 17/1/3.
 */
var mongoose = require('mongoose');
var db = require("./db");

// 创建了一个schema结构。
var configfileSchema = new mongoose.Schema({
    DevInfo: {type: Array},
    mkFile: {
        App: {type: Array},
        AppStore: {type: Array},
        HomePage: {type: Array},
        IME: {type: Array},
        Service: {type: Array},
        SysApp: {type: Array},
        TV: {type: Array}
    },
    configFile: {
        main: {type: Array},
        other: {type: Array}
    }
});


// 创建静态方法
configfileSchema.statics.zhaoren = function (productModel, platformModel, callback) {
    console.log("find---->" + productModel+ "," + platformModel + "<----");
    this.model("Configfile").find({
        "DevInfo.productModel": productModel,
        "DevInfo.platformModel": platformModel
    }, callback);
};


// 类是基于schema创建的。
var configfileModel = db.model("Configfile", configfileSchema);


// 向外暴露
module.exports = configfileModel;
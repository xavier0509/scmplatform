/**
 * Created by d on 17/1/3.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require("./db");

// 创建了一个schema结构。
//第二种方式就是复杂类型数据数组，例如我们可以再数组中添加不同类型的schemas:

var DevInfoSchema = new mongoose.Schema({
    chipModel: {type: Array},
    productModel: [Schema.Types.Mixed]
});


var configfileSchema = new mongoose.Schema({
    // DevInfo: [{productModel: Schema.Types.Mixed},{chipModel: Schema.Types.Mixed}],
    // DevInfo: [DevInfoSchema],
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

// 查询所有记录
configfileSchema.statics.searchAll = function (callback) {
    this.model("Configfile").find({}, {"DevInfo": 1}, callback);
};

configfileSchema.statics.searchBy = function (searchStr, callback) {
    var s = [];
    var l = {};
    var m = "";
    for (var index = 0; index < searchStr.data.length; index++) {
        for (var a in searchStr.data[index]) {
            if (a !== null) {
                l[a] = searchStr.data[index][a];
            }
        }

        s[index] = l;
    }
    // console.log(" 5--> " + JSON.stringify(l));

    // {"platformModel":"102","androidVersion":"102","chipModel":"102","memorySize":"102"}

    for (var key in l) {
        if (l[key] == "" || l[key] == undefined) {
            // console.log(key + " :这个要干掉");
            delete l[key];
        } else {
            // console.log("DevInfo." + key + ":" + l[key]);
            // {DevInfo.productModel:1},{DevInfo.platformModel:2},{DevInfo.androidVersion:3},{DevInfo.chipModel:4},{DevInfo.memorySize:5},
            // "DevInfo.productModel":"1","DevInfo.platformModel":"2","DevInfo.androidVersion":"3","DevInfo.chipModel":"4","DevInfo.memorySize":"5",
            m += "\"" + "DevInfo." + key + "\"" + ":" + "{$regex:/" + l[key] + "/i}" + ",";

        }
    }
    var newstr = "{" + m.substring(0, m.length - 1) + "}";
    console.log(newstr);   // {"DevInfo.productModel":{$regex:/a43/i}}

    var obj = (eval('(' + newstr + ')'));
    this.model("Configfile").find(obj, {"DevInfo": 1}, callback);
};

// 查询未审核记录
configfileSchema.statics.searchByPendingReview = function (searchStr, callback) {
    this.model("Configfile").find({"DevInfo.pendingReview":{$in:["0","1","2"]}}, {"DevInfo": 1}, callback);
};


// 类是基于schema创建的。
var configfileModel = db.model("Configfile", configfileSchema);


// 向外暴露
module.exports = configfileModel;
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


// 查询所有记录
configfileSchema.statics.searchAll = function (callback) {
    this.model("Configfile").find({}, {"DevInfo": 1}, callback);
};

// 创建静态方法
// 1,2,3,4
// 0,2,3,4


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
    console.log(" 5--> " + JSON.stringify(l));

    // {"platformModel":"102","androidVersion":"102","chipModel":"102","memorySize":"102"}

    for (var key in l) {
        if (l[key] == "" || l[key] == undefined) {
            console.log(key + " :这个要干掉");
            delete l[key];
        } else {
            // console.log("DevInfo." + key + ":" + l[key]);
            // {DevInfo.productModel:1},{DevInfo.platformModel:2},{DevInfo.androidVersion:3},{DevInfo.chipModel:4},{DevInfo.memorySize:5},
            // "DevInfo.productModel":"1","DevInfo.platformModel":"2","DevInfo.androidVersion":"3","DevInfo.chipModel":"4","DevInfo.memorySize":"5",
            m += "\"" + "DevInfo." + key + "\"" + ":" + "{$regex:/" + l[key] + "/i}"+ ",";
        }
    }
    console.log(" 6--> " + m);

    var newstr = m.substring(0, m.length - 1);
    console.log(" 7--> " + "{" + newstr + "}");
    // var newjson = JSON.parse("{" + newstr + "}");

    // 6-->            "DevInfo.androidVersion":"android6.0","DevInfo.chipModel":"海思502","DevInfo.memorySize":"512M",
    // 7-->           {"DevInfo.androidVersion":"android6.0","DevInfo.chipModel":"海思502","DevInfo.memorySize":"512M"}
    // var whereStr = {"DevInfo.androidVersion":{$regex:/android6.0/i},"DevInfo.productModel":{$regex:/a43/i},"DevInfo.platformModel":{$regex:/Hisi-8s61/i}};


    this.model("Configfile").find(newstr, {"DevInfo": 1}, callback);
};


// 类是基于schema创建的。
var configfileModel = db.model("Configfile", configfileSchema);


// 向外暴露
module.exports = configfileModel;
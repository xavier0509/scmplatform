var express = require('express');
var router = express.Router();


// 定义了一个模型，用户模型，"学生类"
var User = require("../models/User");
var Book = require("../models/Book");
var Configfile = require("../models/Configfile");

var success = {};
var failure = {"code": 0, "msg": "failure"};


router.get('/', function (req, res) {
    "use strict";
    res.json("api");
});

router.post('/register', function (req, res) {
        "use strict";
        var username = req.body.username;
        var password = req.body.password;
        var adminFlag = req.body.adminFlag;
        if (username.trim() !== null || typeof username.trim() !== "undefined" ||
            username.trim() !== "") {
            User.create({"username": username, "password": password, "adminFlag": adminFlag}, function (error) {
                res.json(success);
            });
        } else {
            res.json(failure);
        }
        /*
         // 实例化了一个用户类,需要再调用save()
         var xiaoming = new User({"username": username, "password": password, "adminFlag": adminFlag});
         // 保存这个学生类
         xiaoming.save(function (err) {
         if (err) {
         res.json({
         "code": 0,
         "msg": "failure"
         })
         } else {
         res.json({
         "code": 1,
         "msg": "success"
         });
         }
         });
         */
    }
);

router.post('/login', function (req, res) {
    "use strict";
    var username;
    var password;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        username = req.body.data.username;
        password = req.body.data.password;
        console.log("username->" + username);
        console.log("password->" + password);

        User.zhaoren1(username, password, function (err, result) {
            console.log(result);
            if (result[0] == null) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success", "data": result});
            }
        });
    }
    else {
        //不能正确解析json 格式的post参数
        var body = '', jsonStr;
        req.on('data', function (chunk) {
            body += chunk; //读取参数流转化为字符串
        });
        req.on('end', function () {
            //读取参数流结束后将转化的body字符串解析成 JSON 格式
            try {
                jsonStr = JSON.parse(body);
            } catch (err) {
                jsonStr = null;
            }
            username = jsonStr.data.username;
            password = jsonStr.data.password;
            User.zhaoren1(username, password, function (err, result) {
                console.log(result);
                if (result[0] == null) {
                    res.json(failure);
                } else {
                    res.json({"code": 1, "msg": "success", "data": result});
                }
            });
        });
    }
    /*
     if ("liujinpeng" === username.toLocaleLowerCase()) {
     res.json({
     "code": 1,
     "msg": "success",
     "data": {
     "_id": "11111111111111111111",
     "username": "liujinpeng",
     "adminFlag": "1"
     }
     });
     } else {
     res.json({
     "code": 0,
     "msg": "failure"
     })
     }
     */
})
;

router.get('/xiugai', function (req, res) {
    User.xiugai({"username": "liujinpeng"}, {$set: {"password": "1234567"}}, {}, function () {
        console.log("密码修改成功");
    });
});

router.get("/addbook", function (req, res) {

});


router.post('/configmananger/add', function (req, res) {
    "use strict";

    var a = new Array(10);
    for (var i = 0; i < a.length; i++) {
        a[i] = {};
        a[i].status = true;
    }
    console.log(JSON.stringify(a));


    var platformModel = req.body.platformModel;
    var productModel = req.body.productModel;
    var androidVersion = req.body.androidVersion;
    var chipModel = req.body.chipModel;
    var memorySize = req.body.memorySize;
    var pendingReview = req.body.pendingReview;
    var mkFile = req.body.mkFile;
    var App = req.body.App;
    var SkyCCMall = req.body.SkyCCMall;
    var SkyEDU = req.body.SkyEDU;
    var SkyManual = req.body.SkyManual;


    var AppStore = req.body.AppStore;
    var HomePage = req.body.HomePage;
    var IME = req.body.IME;

    console.log("platformModel: " + platformModel);
    console.log("productModel: " + productModel);
    console.log("androidVersion: " + androidVersion);
    console.log("chipModel: " + chipModel);
    console.log("memorySize: " + memorySize);
    console.log("pendingReview: " + pendingReview);
    console.log("mkFile: " + mkFile);
    console.log("App: " + App);
    console.log("AppStore: " + AppStore);
    console.log("HomePage: " + HomePage);
    console.log("HomePage: " + IME);


    Configfile.create({
        "platformModel": platformModel,
        "productModel": productModel,
        "androidVersion": androidVersion,
        "chipModel": chipModel,
        "memorySize": memorySize,
        "pendingReview": pendingReview,
        "mkFile": mkFile,
        "App": [SkyCCMall, SkyEDU, SkyManual],
        // "AppStore": AppStore,
        // "HomePage": HomePage,
        // "IME": IME


    }, function (error) {
        res.json(success);
    });


    /*
     if (username.trim() !== null || typeof username.trim() !== "undefined" ||username.trim() !== "") {
     User.create({"username": username, "password": password, "adminFlag": adminFlag}, function (error) {
     res.json(success);
     });
     } else {
     res.json(failure);
     }
     */

});

module.exports = router;

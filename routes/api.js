var express = require('express');
var router = express.Router();


// 定义了一个模型，用户模型，"学生类"
var User = require("../models/User");
var Book = require("../models/Book");


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
    var username = req.body.username;
    var password = req.body.password;
    console.log("username->"+username);
    console.log("password->"+password);
    
    User.zhaoren1(username, password, function (err, result) {
        console.log(result);
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data":result});
        }
    });
    // if ("liujinpeng" === username.toLocaleLowerCase()) {
    //     res.json({
    //         "code": 1,
    //         "msg": "success",
    //         "data": {
    //             "_id": "11111111111111111111",
    //             "username": "liujinpeng",
    //             "adminFlag": "1"
    //         }
    //     });
    // } else {
    //     res.json({
    //         "code": 0,
    //         "msg": "failure"
    //     })
    // }
});

router.get('/xiugai', function (req, res) {
    User.xiugai({"username": "liujinpeng"}, {$set: {"password": "1234567"}}, {}, function () {
        console.log("密码修改成功");
    });
});

router.get("/addbook", function (req, res) {

});


router.post('/configmananger/add', function (req, res) {
    "use strict";
    var platformModel = req.body.platformModel;
    var productModel = req.body.productModel;
    var androidVersion = req.body.androidVersion;
    var chipModel = req.body.chipModel;
    var memorySize = req.body.memorySize;
    var pendingReview = req.body.pendingReview;
    var mkFile = req.body.mkFile;

});

module.exports = router;

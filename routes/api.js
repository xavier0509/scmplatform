var express = require('express');
var router = express.Router();

// 定义了一个模型，用户模型
var User = require("../models/User");
var Model = require("../models/Model");
var Product = require("../models/Product");
var Module = require("../models/Module");

var Configfile = require("../models/Configfile");

var success = {"code": 1, "msg": "success"};
var failure = {"code": 0, "msg": "failure"};
var failure1 = {"code": 0, "msg": "failure", "reason": "xxxx 已存在"};
var failure2 = {"code": 0, "msg": "failure"};


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
});

router.post('/login', function (req, res) {
    "use strict";
    var username;
    var password;
    var session = req.session;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        username = req.body.data.username;
        password = req.body.data.password;
        console.log("username->" + username);
        console.log("password->" + password);
        User.zhaoren1(username, password, function (err, result) {
            if (result[0] == null) {
                res.json(failure);
            } else {
                if (req.session.username) {
                    console.log('Last page was: ' + req.session.username + ".");
                }
                req.session.username = username;

                console.log("the session id " + req.session.id);
                console.log(req.session.username);

                req.session.regenerate(function (err) {
                    if (err) console.log("session重新初始化失败.");
                    else console.log("session被重新初始化.");
                });
                req.session.username = username;
                req.session.regenerate(function (err) {
                    if (err) {
                        return res.json({code: 2, ret_msg: '登录失败'});
                    }
                    // 保存session信息
                    req.session.logined = true;
                    req.session.username = username;
                    req.session.adminFlag = result[0].adminFlag;
                    res.json({"code": 1, "msg": "success", "data": result});
                    console.log("set session username =" + req.session.username);
                });
            }
        });
    }
    /*

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
     */

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
});

// 退出登录
router.post('/logout', function (req, res) {
    req.session.destroy(function (err, result) {
        if (err) {
            res.json({"code": 0, "msg": "failure", "reason": "7"});
        }
    });
});


router.post('/session', function (req, res) {
    if (req.session.username) {
        res.json(success)
    } else {
        res.json({"code": 0, "msg": "failure", "reason": "7"});
    }
});


router.get('/xiugai', function (req, res) {
    User.xiugai({"username": "liujinpeng"}, {$set: {"password": "1234567"}}, {}, function () {
        console.log("密码修改成功");
    });
});

router.post('/configmananger/add', function (req, res) {
    "use strict";
    var a = new Array(10);
    for (var i = 0; i < a.length; i++) {
        a[i] = {};
        a[i].status = true;
    }
    // console.log(JSON.stringify(a));


    // DevInfo
    var platformModel = req.body.platformModel;
    var productModel = req.body.productModel;
    var androidVersion = req.body.androidVersion;
    var chipModel = req.body.chipModel;
    var memorySize = req.body.memorySize;
    var pendingReview = req.body.pendingReview;

    // App
    var App = req.body.App;
    var SkyCCMall = req.body.SkyCCMall;
    var SkyEDU = req.body.SkyEDU;
    var SkyMovie = req.body.SkyMovie;
    var SkyQrcode = req.body.SkyQrcode;
    var SkyTVAgent = req.body.SkyTVAgent;
    var SkyTVQQ = req.body.SkyTVQQ;
    var SkyUser = req.body.SkyUser;
    var SkyWeather = req.body.SkyWeather;
    var SkyVoice = req.body.SkyVoice;
    var SkyManual = req.body.SkyManual;

    // Appstore
    var SkyAppStore = req.body.SkyAppStore;
    var SkyAppStore_OEM = req.body.SkyAppStore_OEM;
    var SkyAppStore_Oversea = req.body.SkyAppStore_Oversea;
    var SkyAppStore_PE = req.body.SkyAppStore_PE;
    var SkyHall = req.body.SkyHall;
    var OperaStore = req.body.OperaStore;

    // HomePage
    var SimpleHome5 = req.body.SimpleHome5;
    var SimpleHomepage = req.body.SimpleHomepage;
    var SimpleHomepage_OEM = req.body.SimpleHomepage_OEM;
    var SkyHomeShell = req.body.SkyHomeShell;
    var SkyOverseaHomepage = req.body.SkyOverseaHomepage;
    var SkyPanasonicHome = req.body.SkyPanasonicHome;

    // IME
    var AndroidKeyboard = req.body.AndroidKeyboard;
    var SkyTianciIME = req.body.SkyTianciIME;
    var SogouIME = req.body.SogouIME;

    // Service
    var SkyADService = req.body.SkyADService;
    var SkyDEService = req.body.SkyDEService;
    var SkyDataService = req.body.SkyDataService;
    var SkyIPCService = req.body.SkyIPCService;
    var SkyPushService = req.body.SkyPushService;
    var SkySSService = req.body.SkySSService;
    var SkySystemService = req.body.SkySystemService;

    // SysApp
    var SkyAutoInstaller = req.body.SkyAutoInstaller;
    var SkyAutoTest = req.body.SkyAutoTest;
    var SkyBrowser = req.body.SkyBrowser;
    var SkyCommonFactory = req.body.SkyCommonFactory;
    var SkyLocalMedia = req.body.SkyLocalMedia;
    var SkyMirrorPlayer = req.body.SkyMirrorPlayer;
    var SkyPackageInstaller = req.body.SkyPackageInstaller;
    var SkyPayCenter = req.body.SkyPayCenter;
    var SkySetting = req.body.SkySetting;
    var SkyTaskManager = req.body.SkyTaskManager;

    // TV
    var SkyDigitalDTV = req.body.SkyDigitalDTV;
    var SkyTV = req.body.SkyTV;
    var SkyTVCaUI = req.body.SkyTVCaUI;
    var SkyTV_OverSea = req.body.SkyTV_OverSea;


    // configFile
    // main
    var PANEL = req.body.PANEL;
    var NETWORK = req.body.NETWORK;
    var Source = req.body.Source;
    var BleRemote = req.body.BleRemote;
    var H = req.body.H;
    var Log_appender = req.body.Log_appender;

    // other
    var HDMIDelay = req.body.HDMIDelay;
    var SourceSwitch = req.body.SourceSwitch;
    var DTVSubTitle = req.body.DTVSubTitle;


    Configfile.create({
        "DevInfo": [{
            "platformModel": platformModel,
            "productModel": productModel,
            "androidVersion": androidVersion,
            "chipModel": chipModel,
            "memorySize": memorySize,
            "pendingReview": pendingReview
        }],
        "mkFile": {
            "App": [
                {"name": "酷开商城", state: "1", pkgname: SkyCCMall},
                {"name": "教育中心", state: "0", pkgname: SkyEDU},
                {"name": "电子说明书", state: "0", pkgname: SkyManual},
                {"name": "影视中心", state: "1", pkgname: SkyMovie},
                {"name": "二维码", state: "1", pkgname: SkyQrcode},
                {"name": "远程服务", state: "1", pkgname: SkyTVAgent},
                {"name": "亲友圈", state: "1", pkgname: SkyTVQQ},
                {"name": "酷开用户", state: "1", pkgname: SkyUser},
                {"name": "天气", state: "1", pkgname: SkyWeather},
                {"name": "智慧家庭", state: "1", pkgname: SkyCCMall},
                {"name": "搜狗语音", state: "1", pkgname: SkyVoice}
            ],
            "AppStore": [
                {"name": "应用圈", state: "1", pkgname: SkyAppStore},
                {"name": "应用圈OEM版本", state: "0", pkgname: SkyAppStore_OEM},
                {"name": "应用圈海外版本", state: "0", pkgname: SkyAppStore_Oversea},
                {"name": "应用圈外包版本", state: "1", pkgname: SkyAppStore_PE},
                {"name": "运营大厅", state: "1", pkgname: SkyHall},
                {"name": "Opera浏览器", state: "1", pkgname: OperaStore}
            ],
            "HomePage": [
                {"name": "简易首页4.4", state: "1", pkgname: SimpleHome5 + ".0"},
                {"name": "简易首页5.0", state: "0", pkgname: SimpleHomepage},
                {"name": "简易首页OEM", state: "0", pkgname: SimpleHomepage_OEM},
                {"name": "常规首页", state: "1", pkgname: SkyHomeShell},
                {"name": "海外首页", state: "1", pkgname: SkyOverseaHomepage},
                {"name": "松下首页", state: "1", pkgname: SkyPanasonicHome}
            ],
            "IME": [
                {"name": "Android输入法", state: "1", pkgname: AndroidKeyboard},
                {"name": "酷开系统输入法", state: "0", pkgname: SkyTianciIME},
                {"name": "搜狗输入法", state: "0", pkgname: SogouIME}
            ],
            "Service": [
                {"name": "广告服务", state: "1", pkgname: SkyADService},
                {"name": "设备服务", state: "0", pkgname: SkyDEService},
                {"name": "数据采集服务", state: "0", pkgname: SkyDataService},
                {"name": "通讯服务", state: "0", pkgname: SkyIPCService},
                {"name": "推送服务", state: "0", pkgname: SkyPushService},
                {"name": "智慧启动", state: "0", pkgname: SkySSService},
                {"name": "系统服务", state: "0", pkgname: SkySystemService}
            ],
            "SysApp": [
                {"name": "自动安装器", state: "1", pkgname: SkyAutoInstaller},
                {"name": "自动化测试", state: "0", pkgname: SkyAutoTest},
                {"name": "酷开浏览器", state: "0", pkgname: SkyBrowser},
                {"name": "通用工厂", state: "0", pkgname: SkyCommonFactory},
                {"name": "本地媒体", state: "0", pkgname: SkyLocalMedia},
                {"name": "Mirror播放器", state: "0", pkgname: SkyMirrorPlayer},
                {"name": "应用安装器", state: "0", pkgname: SkyPackageInstaller},
                {"name": "支付中心", state: "0", pkgname: SkyPayCenter},
                {"name": "设置", state: "0", pkgname: SkySetting},
                {"name": "任务管理器", state: "0", pkgname: SkyTaskManager}
            ],
            "TV": [
                {"name": "数字外挂DTV", state: "1", pkgname: SkyDigitalDTV},
                {"name": "TV", state: "0", pkgname: SkyTV},
                {"name": "TV_CA界面", state: "0", pkgname: SkyTVCaUI},
                {"name": "TV海外版", state: "0", pkgname: SkyTV_OverSea}
            ]
        },
        "configFile": {
            "main": [
                {"name": "屏幕", state: "1", pkgname: PANEL},
                {"name": "网络", state: "1", pkgname: NETWORK},
                {"name": "通道", state: "1", pkgname: Source},
                {"name": "蓝牙遥控", state: "1", pkgname: BleRemote},
                {"name": "H.265解码", state: "1", pkgname: H + ".265"},
                {"name": "打印等级", state: "1", pkgname: Log_appender},
            ],
            "other": [
                {"name": "HDMI延时", state: "1", pkgname: HDMIDelay},
                {"name": "信源自切换", state: "1", pkgname: SourceSwitch},
                {"name": "数字通道字幕", state: "1", pkgname: DTVSubTitle},
            ]
        }
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

router.post('/configmananger/search', function (req, res) {
    "use strict";

    var productModel;
    var platformModel;
    var androidVersion;
    var chipModel;
    var memorySize;

    if (req.body.data) {
        //能正确解析 json 格式的post参数
        productModel = req.body.data.productModel;
        platformModel = req.body.data.platformModel;
        androidVersion = req.body.data.androidVersion;
        chipModel = req.body.data.chipModel;
        memorySize = req.body.data.memorySize;

        console.log("productModel->" + productModel);
        console.log("platformModel->" + platformModel);
        console.log("androidVersion->" + androidVersion);
        console.log("chipModel->" + chipModel);
        console.log("memorySize->" + memorySize);

        var searchStr = {
            "data": [
                {"productModel": productModel},
                {"platformModel": platformModel},
                {"androidVersion": androidVersion},
                {"chipModel": chipModel},
                {"memorySize": memorySize},
            ]
        };

        if (productModel == null) {
            delete searchStr.data[0];
        } else if (platformModel == null) {
            delete searchStr.data[1];
        } else if (androidVersion == null) {
            delete searchStr.data[2];
        } else if (chipModel == null) {
            delete searchStr.data[3];
        } else if (memorySize == null) {
            delete searchStr.data[4];
        } else {
            console.log("参数都为空");
        }
        Configfile.searchBy(searchStr, function (err, result) {
            if (result[0] == null) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success", "data": result});
            }
        });
    }
});

/*
 * 查询待审核内容
 * 参数说明
 * DevInfo.pendingReview: 审核标识
 * 0 : 创建
 * 1 : 修改
 * 2 : 删除
 * 3 : 已审核
 *
 * */


router.post('/review', function (req, res) {
    "use strict";
    var author;
    var adminFlag;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        author = req.body.data.author;
        adminFlag = req.body.data.adminFlag;
        if (adminFlag === "1") {
            // 是管理员
            Configfile.searchByPendingReview({}, function (err, result) {
                if (result[0] == null) {
                    res.json(failure);
                } else {
                    res.json({"code": 1, "msg": "success", "data": result});
                }
            });
        } else {
            Configfile.searchByPendingReviewOwn(author, function (err, result) {
                if (result[0] == null) {
                    res.json(failure);
                } else {
                    res.json({"code": 1, "msg": "success", "data": result});
                }
            });
        }
    }
});


// 新增机芯
router.post('/createplatformmodel', function (req, res) {
    "use strict";
    var name;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        name = req.body.data.platformModel;
        if (name.trim() !== null || typeof name.trim() !== "undefined" ||
            name.trim() !== "") {
            Model.searchBy(name, function (err, result) {
                console.log(result);
                if (result[0] == null) {
                    Model.create({"name": name}, function (error) {
                        res.json(success);
                    });
                } else {
                    res.json(failure);
                }
            });
        } else {
            res.json(failure);
        }
    }
});

// 查询机芯
router.post('/searchplatformmodel', function (req, res) {
    Model.searchAll(function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

// 修改机芯
router.post('/modifyplatformmodel', function (req, res) {
    "use strict";
    var before;
    var after;
    // '{"data":{"before":"A55","after":"14A55"}}';
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        before = req.body.data.before;
        after = req.body.data.after;
        var beforeObj = {"name": before};
        var afterObj = {"name": after};
        Model.xiugai(beforeObj, {$set: afterObj}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
        });
    }
});

// 新增机型
router.post('/createproductmodel', function (req, res) {
    "use strict";
    var name;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        name = req.body.data.productModel;
        if (name.trim() !== null || typeof name.trim() !== "undefined" ||
            name.trim() !== "") {
            Product.searchBy(name, function (err, result) {
                if (result[0] == null) {
                    Product.create({"name": name}, function (error) {
                        res.json(success);
                    });
                } else {
                    res.json(failure);
                }
            });
        } else {
            res.json(failure);
        }
    }
});

// 查询机型
router.post('/searchproductmodel', function (req, res) {
    Product.searchAll(function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

// 修改机型
router.post('/modifyproductmodel', function (req, res) {
    "use strict";
    var before;
    var after;
    // var result = '{"data":{"before":"A43","after":"14A43"}}';
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        before = req.body.data.before;
        after = req.body.data.after;
        var beforeObj = {"name": before};
        var afterObj = {"name": after};
        console.log(before);
        console.log(after);
        Product.xiugai(beforeObj, {$set: afterObj}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
        });
    }
});

// 新增模块
router.post('/createmodule', function (req, res) {
    "use strict";
    var moduleName;
    var modulePath;
    var moduleDescription;
    var moduleCategory;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        moduleName = req.body.moduleName;
        modulePath = req.body.modulePath;
        moduleDescription = req.body.moduleDescription;
        moduleCategory = req.body.moduleCategory;

        console.log(moduleName);
        console.log(modulePath);
        console.log(moduleDescription);
        console.log(moduleCategory);

        if (moduleName.trim() !== null || typeof moduleName.trim() !== "undefined" ||
            moduleName.trim() !== "") {
            Module.create({
                "moduleName": moduleName,
                "modulePath": modulePath,
                "moduleDescription": moduleDescription,
                "moduleCategory": moduleCategory
            }, function (error) {
                res.json(success);
            });
        } else {
            res.json(failure);
        }
    }
});

// 新增配置
router.post('/createconfig', function (req, res) {
    "use strict";

    var moduleCategory;
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        moduleCategory = req.body.moduleCategory;

        console.log(moduleName);
        console.log(modulePath);
        console.log(moduleDescription);
        console.log(moduleCategory);

        if (moduleName.trim() !== null || typeof moduleName.trim() !== "undefined" ||
            moduleName.trim() !== "") {
            Module.create({
                "moduleName": moduleName,
                "modulePath": modulePath,
                "moduleDescription": moduleDescription,
                "moduleCategory": moduleCategory
            }, function (error) {
                res.json(success);
            });
        } else {
            res.json(failure);
        }
    }
});

module.exports = router;

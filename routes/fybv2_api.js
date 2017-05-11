var express = require('express');
var router = express.Router();

var User = require("../fyb_models/fyb_User");
var Chip = require("../fyb_models/fyb_Chip");
var Model = require("../fyb_models/fyb_Model");
var Module = require("../fyb_models/fyb_Module");
var Config = require("../fyb_models/fyb_Config");
var Product = require("../fyb_models/fyb_Product");
var Generator = require("../fyb_models/generate");
var Sendmail = require("../fyb_models/fyb_Mailer");
var ChipModel = require("../fyb_models/fyb_ChipModel");

var success = {"code": 1, "msg": "success"};
var failure = {"code": 0, "msg": "failure"};

router.get('/fyb', function (req, res) {
    "use strict";
    res.json("fybv2_api");
});

router.post('/userQuery', function (req, res) {
    if (req.body.data) {
        var whereStr = req.body.data.condition;
        if (typeof whereStr == "undefined" || whereStr == null) {
          whereStr = {};
        }
        User.userQuery(whereStr, function (err, result) {
          if (result[0] == null) {
              res.json({"code": 0, "msg": "failure", "reason": "userQuery result[0] == null"});
          } else {
             res.json({"code": 1, "msg": "success", "data": result});
          }
        });
     }else{
        res.json({"code": 0, "msg": "failure","reason": "req.body.data is null"});
     }
});

router.post('/chipQuery', function (req, res) {
    var whereStr = {};
    var optStr = {};
    Chip.chipQuery(whereStr,optStr,function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/chipAdd', function (req, res) {
    if (req.body.data) {
        var name = req.body.data.name;
        if (name.trim() !== null && typeof name.trim() !== "undefined" &&
            name.trim() !== "") {
            var whereStr = {"name":name};
            Chip.chipQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    Chip.chipAdd(whereStr, function (err1,result1) {
                        res.json(success);
                    });
                } 
                else {
                    res.json(failure);
                }
            });
        } else {
            res.json(failure);
        }
    }
});

router.post('/chipDelete', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        Chip.chipDelete(conditionStr, function (err, result) {
            if (result.n == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success","data":result});
            }
        });
    }
});

router.post('/chipUpdate', function (req, res) {
    if (req.body.data) {
        var id = req.body.data._id;     
        if (id == null && typeof id == "undefined") {
            res.json({"code": 0, "msg": "failure", "reason":"id is null"});
        };

        if(req.body.data.update){
            var newer = req.body.data.update.newer;
            var old = req.body.data.update.old;
            var whereStr = {"name": newer};   
            Chip.chipQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var conditionStr = {"_id": id};
                    var updateStr = {"name":newer};
                    Chip.chipUpdate(conditionStr, {$set: updateStr}, {}, function (err, result) {
                        if (result.nModified == 0) {
                            res.json({"code": 0, "msg": "failure", "reason":"chipUpdate nModified == 0"});
                        } else {
                            Product.productUpdate({"chip":old}, {$set: {"chip":newer,"gerritState":1,"operateType":3}}, {multi:true}, function (err1, result1){
                                if (err1)
                                    res.json({"code": 0, "msg": "failure", "reason":"productUpdate failed"});
                                else
                                    res.json({"code": 1, "msg": "success"});
                            });    
                        }
                    });
                } 
                else {
                    res.json({"code": 0, "msg": "failure", "reason":"chipQuery failed"});
                }
            });
        }
    
    }
});

router.post('/chipModelQuery', function (req, res) {
    var whereStr = {};
    var optStr = {};
    ChipModel.chipModelQuery(whereStr,optStr,function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/chipModelAdd', function (req, res) {
    if (req.body.data) {
        var name = req.body.data.name;
        if (name.trim() !== null && typeof name.trim() !== "undefined" &&
            name.trim() !== "") {
            var whereStr = {"name":name};
            ChipModel.chipModelQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    ChipModel.chipModelAdd(whereStr, function (err1,result1) {
                        res.json(success);
                    });
                } 
                else {
                    res.json(failure);
                }
            });
        } else {
            res.json(failure);
        }
    }
});

router.post('/chipModelDelete', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        ChipModel.chipModelDelete(conditionStr, function (err, result) {
            if (result.n == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success","data":result});
            }
        });
    }
});

router.post('/chipModelUpdate', function (req, res) {
    if (req.body.data) {
        var id = req.body.data._id;     
        if (id == null && typeof id == "undefined") {
            res.json({"code": 0, "msg": "failure", "reason":"id is null"});
        };

        if(req.body.data.update){
            var newer = req.body.data.update.newer;
            var old = req.body.data.update.old;
            var whereStr = {"name": newer};   
            ChipModel.chipModelQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var conditionStr = {"_id": id};
                    var updateStr = {"name":newer};
                    ChipModel.chipModelUpdate(conditionStr, {$set: updateStr}, {}, function (err, result) {
                        if (result.nModified == 0) {
                            res.json({"code": 0, "msg": "failure", "reason":"chipModelUpdate nModified == 0"});
                        } else {
                            Product.productUpdate({"chipModel":old}, {$set: {"chipModel":newer,"gerritState":1,"operateType":3}}, {multi:true}, function (err1, result1){
                                if (err1)
                                    res.json({"code": 0, "msg": "failure", "reason":"productUpdate failed"});
                                else
                                    res.json({"code": 1, "msg": "success"});
                            });    
                        }
                    });
                } 
                else {
                    res.json({"code": 0, "msg": "failure", "reason":"chipModelQuery failed"});
                }
            });
        }
    
    }
});

router.post('/modelAdd', function (req, res) {
    if (req.body.data) {
        var name = req.body.data.name;
        if (name.trim() !== null && typeof name.trim() !== "undefined" &&
            name.trim() !== "") {
            var whereStr = {"name":name};
            Model.modelQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    Model.modelAdd(whereStr, function (err1,result1) {
                        res.json(success);
                    });
                } 
                else {
                    res.json(failure);
                }
            });
        } else {
            res.json(failure);
        }
    }
});

router.post('/modelQuery', function (req, res) {
    var whereStr = {};
    var optStr = {};
    Model.modelQuery(whereStr, optStr, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/modelDelete', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        Model.modelDelete(conditionStr, function (err, result) {
            if (err) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success","data":result});
            }
        });
    }
});

router.post('/modelUpdate', function (req, res) {
    if (req.body.data) {
        var id = req.body.data._id;     
        if (id == null && typeof id == "undefined") {
            res.json({"code": 0, "msg": "failure", "reason":"id is null"});
        };

        if(req.body.data.update){
            var newer = req.body.data.update.newer;
            var old = req.body.data.update.old;
            var whereStr = {"name": newer}; 
            Model.modelQuery(whereStr, function (err, result) {
		 if (result[0] == null || typeof result[0] == "undefined") {
                    var conditionStr = {"_id": id};
                    var updateStr = {"name":newer};
                    Model.modelUpdate(conditionStr, {$set: updateStr}, {}, function (err, result) {
                        if (result.nModified == 0) {
                            res.json({"code": 0, "msg": "failure", "reason":"modelUpdate nModified == 0"});
                        } else {
                            Product.productUpdate({"model":old}, {$set: {"model":newer,"gerritState":1,"operateType":3}}, {multi:true}, function (err1, result1){
                                if (err1)
                                    res.json({"code": 0, "msg": "failure", "reason":"productUpdate failed"});
                                else
                                    res.json({"code": 1, "msg": "success"});
                            });    
                        }
                    });
                } 
                else {
                    res.json({"code": 0, "msg": "failure", "reason":"modelQuery failed"});
                }
            });
        }
    
    }
});

router.post('/moduleQuery', function (req, res) {
    var whereStr = {};
    var optStr = {};
    Module.moduleQuery(whereStr, optStr, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/moduleAdd', function (req, res) {
    if (req.body.data) {
        var engName = req.body.data.engName;
        var cnName = req.body.data.cnName;
        var gitPath = req.body.data.gitPath;
        var desc = req.body.data.desc;
        var category = req.body.data.category;
        whereStr = {"$or":[{'engName':engName},{'cnName':cnName},{'gitPath':gitPath}]};
        Module.moduleQuery(whereStr, function (err, result) {
            if (result[0] == null || typeof result[0] == "undefined") {
                var jsonStr = {"cnName":cnName,"engName":engName,"gitPath":gitPath,"desc":desc,"category":category};
                Module.moduleAdd(jsonStr, function (err1,result1) {
                    res.json(success);
                });
            } 
            else {
                res.json({"code": 0, "msg": "failure", "reason":"moduleQuery failed"});
            }
        });
    }
});

router.post('/moduleUpdate', function (req, res) {
    if (req.body.data) {
        var moduleUpdateStr = {};
        var productUpdateStr = {};
        var id = req.body.data._id;
        if (id == null && id == "" && typeof id == "undefined") {
            res.json({"code": 0, "msg": "failure","reason":"id is null"});
        };

        var moduleWhereStr = {"_id":id};
        
        if (req.body.data.update) {
            var cnName = req.body.data.update.cnName;
            var engName = req.body.data.update.engName;
            var gitPath = req.body.data.update.gitPath;
            var category = req.body.data.update.category;
            var desc = req.body.data.update.desc;

            if (cnName != null) {
                moduleUpdateStr["cnName"] = cnName;
                productUpdateStr["mkFile." + id + ".cnName"] = cnName;
            };

            if (engName != null) {
                moduleUpdateStr["engName"] = engName;
                productUpdateStr["mkFile." + id + ".engName"] = engName;
            };

            if (gitPath != null) {
                moduleUpdateStr["gitPath"] = gitPath;
                productUpdateStr["mkFile." + id + ".gitPath"] = gitPath;
            };

            if (category != null) {
                moduleUpdateStr["category"] = category;
                productUpdateStr["mkFile." + id + ".category"] = category;
            };

            if (desc != null) {
                moduleUpdateStr["desc"] = desc;
                productUpdateStr["mkFile." + id + ".desc"] = desc;
            };         
        };

        whereStr = {"$or":[{'engName':engName},{'cnName':cnName},{'gitPath':gitPath}],"_id":{"$ne":id}};
        Module.moduleQuery(whereStr, function (err, result) {
            if (result[0] == null || typeof result[0] == "undefined") {
                Module.moduleUpdate(moduleWhereStr, {$set: moduleUpdateStr}, {multi:true}, function (err, result) {
                    if (result.nModified == 0) {
                        res.json({"code": 0, "msg": "failure", "reason":"moduleUpdate nModified == 0"});
                    } else {
                        Product.productUpdate({}, {$set: productUpdateStr}, {multi:true}, function (err1, result1){
                            if (err1) 
                                res.json({"code": 0, "msg": "failure", "reason":"productUpdate failed"});
                            else
                                res.json({"code": 1, "msg": "success"});
                        });  
                    }
                });
            } 
            else {
                res.json({"code": 0, "msg": "failure", "reason":"moduleQuery failed"});
            }
        });
    }
});

router.post('/configQuery', function (req, res) {
    var whereStr = {};
    var optStr = {};
    Config.configQuery(whereStr, optStr, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/configAdd', function (req, res) {
    if (req.body.data) {
        var cnName = req.body.data.cnName;
        var engName = req.body.data.engName;
        var configKey = req.body.data.configKey;
        var type = req.body.data.type;
        var desc = req.body.data.desc;
        var category = req.body.data.category;
        var value = req.body.data.value;
        var options = req.body.data.options;

        whereStr = {"$or":[{'engName':engName},{'cnName':cnName},{'configKey':configKey}]};
        Config.configQuery(whereStr, function (err, result) {
            if (result[0] == null || typeof result[0] == "undefined") {
                var jsonStr = {"cnName":cnName,"engName":engName,"configKey":configKey,
                      "type":type,"desc":desc,"category":category,"value":value,"options":options};
                Config.configAdd(jsonStr, function (err1,result1) {
                    if (err1) {
                        res.json({"code": 0, "msg": "failure", "reason":"configAdd failed"});
                    }else {
                        Config.configQuery({"engName":engName,"configKey":configKey}, function (err2, result2){
                            if(result2[0] == null || typeof result2[0] == "undefined"){

                            }else{
                                console.log(result2);
                                var productUpdateStr = {};
                                var id = result2[0]._id;
                                productUpdateStr["configFile." + id + ".cnName"] = result2[0].cnName;
                                productUpdateStr["configFile." + id + ".engName"] = result2[0].engName;
                                productUpdateStr["configFile." + id + ".configKey"] = result2[0].configKey;
                                productUpdateStr["configFile." + id + ".category"] = result2[0].category;
                                productUpdateStr["configFile." + id + ".desc"] = result2[0].desc;
                                productUpdateStr["configFile." + id + ".type"] = result2[0].type;
                                productUpdateStr["configFile." + id + ".value"] = result2[0].value;
                                productUpdateStr["configFile." + id + ".options"] = result2[0].options;
                                productUpdateStr["gerritState"] = 1;
                                productUpdateStr["operateType"] = 3;
                                Product.productUpdate({}, {$set: productUpdateStr}, {multi:true}, function (err3, result3){
                                    if (err3) 
                                        res.json({"code": 0, "msg": "failure","reason":"productUpdate failed"});
                                    else
                                        res.json({"code": 1, "msg": "success"});
                                });  
			    }  
                        });    
                    };
		});
            } 
            else {
                res.json({"code": 0, "msg": "failure", "reason":"configQuery failed"});
            }
        });
    }
});

router.post('/configUpdate', function (req, res) {
    if (req.body.data) {
        var configUpdateStr = {};
        var productUpdateStr = {};
        var id = req.body.data._id;
        if (id == null && id == "" && typeof id == "undefined") {
            res.json({"code": 0, "msg": "failure","reason":"id is null"});
        };

        var configWhereStr = {"_id":id};

        if (req.body.data.update) {
            var cnName = req.body.data.update.cnName;
            var engName = req.body.data.update.engName;
            var configKey = req.body.data.update.configKey;
            var desc = req.body.data.update.desc;
            var type = req.body.data.update.type;
            var value = req.body.data.update.value;
            var category = req.body.data.update.category;
            var options = req.body.data.update.options;

            if (cnName != null) {
                configUpdateStr["cnName"] = cnName;
                productUpdateStr["configFile." + id + ".cnName"] = cnName;
            };

            if (engName != null) {
                configUpdateStr["engName"] = engName;
                productUpdateStr["configFile." + id + ".engName"] = engName;
            };

            if (configKey != null) {
                configUpdateStr["configKey"] = configKey;
                productUpdateStr["configFile." + id + ".configKey"] = configKey;
            };

            if (category != null) {
                configUpdateStr["category"] = category;
                productUpdateStr["configFile." + id + ".category"] = category;
            };

            if (desc != null) {
                configUpdateStr["desc"] = desc;
                productUpdateStr["configFile." + id + ".desc"] = desc;
            };     

            if (type != null) {
                configUpdateStr["type"] = type;
                productUpdateStr["configFile." + id + ".type"] = type;
            };

            if (value != null) {
                configUpdateStr["value"] = value;
                productUpdateStr["configFile." + id + ".value"] = value;
            };

            if (options != null) {
                configUpdateStr["options"] = options;
                productUpdateStr["configFile." + id + ".options"] = options;
            };       
        };

        whereStr = {"$or":[{'engName':engName},{'cnName':cnName},{'configKey':configKey}],"_id":{"$ne":id}};
        Config.configQuery(whereStr, function (err, result) {
            if (result[0] == null || typeof result[0] == "undefined") {
                Config.configUpdate(configWhereStr, {$set: configUpdateStr}, {multi:true}, function (err, result) {
                    if (result.nModified == 0) {
                        res.json({"code": 0, "msg": "failure","reason":"configUpdate nModified == 0"});
                    } else {
                        Product.productUpdate({}, {$set: productUpdateStr}, {multi:true}, function (err1, result1){
                            if (err1) 
                                res.json({"code": 0, "msg": "failure","reason":"productUpdate failed"});
                            else
                                res.json({"code": 1, "msg": "success"});
                        });  
                    }
                });
            }
            else{
                res.json({"code": 0, "msg": "failure", "reason":"configQuery failed"});
            }
        });
    }
});

router.post('/productQuery', function (req, res) {
    if (req.body.data) {
        var whereStr = req.body.data.condition;
        var opt = req.body.data.option;
        var sortStr = req.body.data.sort;
        var sortObj = {};
        if (typeof whereStr == "undefined") {
          whereStr = {};
        }
        if (typeof opt == "undefined") {
          opt = {};
        }
        if (typeof sortStr == "undefined") {

        }else{
            sortObj["sort"] = sortStr;
        }

        Product.productQuery(whereStr, opt, sortObj,function (err, result) {
          if (result[0] == null) {
              res.json({"code": 0, "msg": "failure", "reason": "productQuery result[0] == null"});
          } else {
             res.json({"code": 1, "msg": "success", "data": result});
          }
        });
     }else{
        res.json({"code": 0, "msg": "failure","reason": "req.body.data is null"});
     }
});

router.post('/productRegexQuery', function (req, res) {
    if (req.body.data && req.body.data.condition) {
        var whereStr = "";
        var chip = req.body.data.condition.chip;
        var model = req.body.data.condition.model;
        var androidVersion = req.body.data.condition.androidVersion;
        var memorySize = req.body.data.condition.memorySize;
        var chipModel = req.body.data.condition.chipModel;
        var opt = req.body.data.option;
        var sortStr = req.body.data.sort;
        var sortObj = {};

        if(chip != null && chip != ""){
            whereStr += "\"chip\":{$regex:/" + chip +"/i},";
        }
        if(model != null && model != ""){
            whereStr += "\"model\":{$regex:/" + model +"/i},";
        }
        if(androidVersion != null && androidVersion != ""){
            whereStr += "\"androidVersion\":{$regex:/" + androidVersion +"/i},";
        }
        if(memorySize != null && memorySize != ""){
            whereStr += "\"memorySize\":{$regex:/" + memorySize +"/i},";
        }
        if(chipModel != null && chipModel != ""){
            whereStr += "\"chipModel\":{$regex:/" + chipModel +"/i},";
        }
        if(typeof opt == "undefined" && opt == null){
          opt = {};
        }
        if(typeof sortStr == "undefined" && sortStr == null){
        }else{
            sortObj["sort"] = sortStr;
        }

        var newStr = "{" + whereStr.substring(0,whereStr.length-1) + "}";
        var obj = (eval('(' + newStr + ')'));
        Product.productQuery(obj,opt,sortObj,function(err,result){
            if (result[0] == null) {
                res.json({"code": 0, "msg":"failure", "reason": "productQuery result[0] == null"});
            }else{
                res.json({"code": 1, "msg": "success", "data": result});
            }
        });
     }
});

router.post('/productDelete', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        Product.productDelete(conditionStr, function (err, result) {
            if(err){
               res.json({"code": 0, "msg": "failure", "reason": "productDelete error"});
	    }else{
               res.json({"code": 1, "msg": "success"});
            }
        });
    }
});

router.post('/productUpdate', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        var action = req.body.data.action;
        var updateStr = req.body.data.update;

        if (action == "set") {
          Product.productUpdate(conditionStr, {$set: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json({"code": 0, "msg": "failure", "reason": "productUpdate set nModified == 0"});
            } else {
                res.json({"code": 1, "msg": "success"});
            }
          });
        }else if(action == "unset"){
          Product.productUpdate(conditionStr, {$unset: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json({"code": 0, "msg": "failure", "reason": "productUpdate unset nModified == 0"});
            } else {
                res.json({"code": 1, "msg": "success"});
            }
          });
        }
    }
});

router.post('/productAdd', function (req, res) {
    if (req.body.data) {
        var chip = req.body.data.chip;
        var model = req.body.data.model;
        if (chip.trim() !== null || chip.trim() !== "" || 
            model.trim() !== null || model.trim() !== "") {
            whereStr = {"chip":chip,"model":model};
            Product.productQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var jsonStr = req.body.data;
                    Product.productAdd(jsonStr, function (err1,result1) {
                        if (err1) {
                            res.json({"code": 1, "msg": "failure", "reason": "productAdd error"});
                        }else{
                            res.json(success);
                        }     
                    });
                } 
                else {
                    res.json({"code": 1, "msg": "failure", "reason": "productQuery result[0] != null"});
                }
            });
        } else {
            res.json({"code": 1, "msg": "failure", "reason": "param error"});
        }
    }
});


router.post('/generateFile', function (req, res) {
    if(req.body.data){
        var data = req.body.data;
	    Generator.generate(data, "Rel6.0", function(err,result){
            if(err != 0){
                res.json({"code": 0, "msg": "failure", "reason": result});
            }else{
                res.json({"code": 1, "msg": "success", "data": result});
            }
        });   
     }
});

router.post('/login', function (req, res) {
    var session = req.session;
    if (req.body.data) {
        var userName = req.body.data.username;
        var password = req.body.data.password;
        var whereStr = {"userName":userName,"password":password};
        User.userQuery(whereStr, function (err, result) {
            if (result[0] == null) {
                res.json({"code": 0, "msg": "failure", "reason": "userQuery result[0] == null"});
            } else {
                req.session.regenerate(function (err) {
                    if (err) {
                        res.json({"code": 0, "msg": "failure", "reason": "regenerate error"});
                    }else{
                        req.session.logined = true;
                        req.session.username = userName;
                        req.session.adminFlag = result[0].level;
                        res.json({"code": 1, "msg": "success", "data": result});
                    }
                });
            }
        });
    }
});

router.post('/logout', function (req, res) {
    if (req.session.username) {
        var userName = req.session.username;
        var whereStr = {"userName":userName};
        User.userQuery(whereStr, function (err, result) {
            if (result[0] == null) {
                res.json({"code": 0, "msg": "failure", "reason": "logout userQuery result[0] == null"});
            } else {
            	req.session.logined = false;
            	res.json({"code": 1, "msg": "success", "data": "logout ok"});
            }
        });
    }
});


router.post('/session', function (req, res) {
    if (req.session.username) {
    	if(req.session.logined){
			res.json({"code": 0, "msg": "failure", "reason": "该用户已登录"});
    	}else{
    		req.session.logined = true;
    		var data = {data: {"author": req.session.username, "adminFlag": req.session.adminFlag}};
        	res.json({"code": 1, "msg": "success", "data": data})   		
    	}     
    } else {
        res.json({"code": 0, "msg": "failure", "reason": "该用户不存在"});
    }
});

router.post('/preview', function (req, res) {
  if (req.body.data) {
        var chip = req.body.data.chip;
        var model = req.body.data.model;
        Generator.preview(chip, model, function(err,configRes,mkRes){
            if(err != 0){
                res.json({"code": 0, "msg": "failure", "reason": err});
            }else{
                res.json({"code": 1, "msg": "success", "configRes":configRes, "mkRes": mkRes});
            }
        }); 
    }
});

router.post('/sendmail', function (req, res) {
  if (req.body.data) {    
        var from = req.body.data.from;
        var to = req.body.data.to;
        var subject = req.body.data.subject;
        var desc = req.body.data.desc;
        console.log("/sendmail from：" + from);
        console.log("/sendmail to：" + to);
        console.log("/sendmail subject：" + subject);
        console.log("/sendmail desc：" + desc);
        Sendmail("fanyanbo@skyworth.com",to,from,subject,desc,function(err,res1){
            if(err != 0){
                res.json({"code": 0, "msg": "failure", "reason": res1});
            }else{
                res.json({"code": 1, "msg": "success", "data": res1});
            }
        });
    }
});


router.get('/home', function (req, res) {
	//res.render('index', { title: 'Express' });
	res.redirect('../v2/scmplatform/login.html');
});



module.exports = router;

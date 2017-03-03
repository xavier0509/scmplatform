var express = require('express');
var router = express.Router();

var User = require("../fyb_models/fyb_User");
var Chip = require("../fyb_models/fyb_Chip");
var Model = require("../fyb_models/fyb_Model");
var Module = require("../fyb_models/fyb_Module");
var Config = require("../fyb_models/fyb_Config");
var Product = require("../fyb_models/fyb_Product");
var Generator = require("../public/test/generate");

var success = {"code": 1, "msg": "success"};
var failure = {"code": 0, "msg": "failure"};

function printErrorInfo(errCode, errMsg) {
    var str = '{"code" : ' + errCode + ', "msg" : ' + errMsg + '}';
    return str;
}

router.post('/test', function (req, res) {
     
});

router.get('/', function (req, res) {
    "use strict";
    res.json("fyb_api");
});

router.post('/chipAdd', function (req, res) {
    if (req.body.data) {
        var name = req.body.data.chip;
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

router.post('/chipQuery', function (req, res) {
    var whereStr = {};
    Chip.chipQuery(whereStr, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});


router.post('/chipUpdate', function (req, res) {
    if (req.body.data) {
        var old = req.body.data.old;
        var newer = req.body.data.newer;
        if (newer == "" && newer == null && typeof newer == "undefined") {
            res.json(failure);
        };
        var oldObj = {"name": old};
        var newerObj = {"name": newer};
        Chip.chipUpdate(oldObj, {$set: newerObj}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                Product.productUpdate({"chip":old}, {$set: {"chip":newer}}, {multi:true}, function (err1, result1){
                    if (err1) 
                        res.json(failure);
                    else
                        res.json({"code": 1, "msg": "success"});
                });       
            }
        });
    }
});



router.post('/modelAdd', function (req, res) {
    if (req.body.data) {
        var name = req.body.data.model;
        if (name.trim() != null &&  typeof name.trim() !== "undefined" &&
            name.trim() != "") {
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
    Model.modelQuery(whereStr, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

/*router.post('/modelUpdate', function (req, res) {
    if (req.body.data) {
        var old = req.body.data.old;
        var newer = req.body.data.newer;
        var oldObj = {"name": old};
        var newerObj = {"name": newer};
        Model.modelUpdate(oldObj, {$set: newerObj}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
        });
    }
});*/

router.post('/modelUpdate', function (req, res) {
    if (req.body.data) {
        var old = req.body.data.old;
        var newer = req.body.data.newer;
        if (newer == "" && newer == null && typeof newer == "undefined") {
            res.json(failure);
        };
        var oldObj = {"name": old};
        var newerObj = {"name": newer};
        Model.modelUpdate(oldObj, {$set: newerObj}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                Product.productUpdate({"model":old}, {$set: {"model":newer}}, {multi:true}, function (err1, result1){
                    if (err1)
                        res.json(failure);
                    else
                        res.json({"code": 1, "msg": "success"});
                });    
            }
        });
    }
});

router.post('/moduleAdd', function (req, res) {
    if (req.body.data) {
        var engName = req.body.data.engName;
        if (engName.trim() !== null && typeof engName.trim() !== "undefined" &&
            engName.trim() !== "") {
            whereStr = {"engName":engName};
            Module.moduleQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var cnName = req.body.data.cnName;
                    var gitPath = req.body.data.gitPath;
                    var desc = req.body.data.desc;
                    var category = req.body.data.category;

                    var jsonStr = {"cnName":cnName,"engName":engName,"gitPath":gitPath,"desc":desc,"category":category};
                    Module.moduleAdd(jsonStr, function (err1,result1) {
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

router.post('/moduleQuery', function (req, res) {
    var whereStr = {};
    var opt = {};
    Module.moduleQuery(whereStr, opt, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/moduleUpdate', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        var updateStr = req.body.data.update;
        var engName = req.body.data.condition.engName;
        if (engName == null && engName == "" && typeof engName == "undefined") {
            res.json(failure);
        };
        Module.moduleUpdate(conditionStr, {$set: updateStr}, {}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                Product.productUpdate({"mkFile.engName":engName}, {$set: {"mkFile.$":updateStr}}, {multi:true}, function (err1, result1){
                    if (err1) 
                        res.json(failure);
                    else
                        res.json({"code": 1, "msg": "success"});
                });  
            }
        });
    }
});

router.post('/configAdd', function (req, res) {
    if (req.body.data) {
        var engName = req.body.data.engName;
        if (engName.trim() !== null && typeof engName.trim() !== "undefined" &&
            engName.trim() !== "") {
            whereStr = {"engName":engName};
            Config.configQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var jsonStr = req.body.data;
                    Config.configAdd(jsonStr, function (err1,result1) {
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

router.post('/configQuery', function (req, res) {
    var whereStr = {};
    var opt = {};
    Config.configQuery(whereStr, opt, function (err, result) {
        if (result[0] == null) {
            res.json(failure);
        } else {
            res.json({"code": 1, "msg": "success", "data": result});
        }
    });
});

router.post('/configUpdate', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        var updateStr = req.body.data.update;
        var engName = req.body.data.condition.engName;
        if (engName == null && engName == "" && typeof engName == "undefined") {
            res.json(failure);
        };
        Config.configUpdate(conditionStr, {$set: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                Product.productUpdate({"configFile.engName":engName}, {$set: {"configFile.$":updateStr}}, {multi:true}, function (err1, result1){
                    if (err1) 
                        res.json(failure);
                    else
                        res.json({"code": 1, "msg": "success"});
                });  
	    }
        });
    }
});

router.post('/configDelete', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        Config.configDelete(conditionStr, function (err, result) {
            if (err) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
        });
    }
});

router.post('/productAdd', function (req, res) {
    if (req.body.data) {
        var chip = req.body.data.chip;
        var model = req.body.data.model;
        if (chip.trim() !== null || typeof chip.trim() !== "undefined" ||
            chip.trim() !== "" || model.trim() !== null || typeof model.trim() !== "undefined" ||
            model.trim() !== "") {
            whereStr = {"chip":chip,"model":model};
            Product.productQuery(whereStr, function (err, result) {
                if (result[0] == null || typeof result[0] == "undefined") {
                    var jsonStr = req.body.data;
                    Product.productAdd(jsonStr, function (err1,result1) {
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

router.post('/productQuery', function (req, res) {
    if (req.body.data) {
        var whereStr = req.body.data.condition;
        var opt = req.body.data.option;
        if (typeof whereStr == "undefined") {
          whereStr = {};
        }
        if (typeof opt == "undefined") {
          opt = {};
        }
	Product.productQuery(whereStr, opt, function (err, result) {
          if (result[0] == null) {
              res.json(failure);
          } else {
             res.json({"code": 1, "msg": "success", "data": result});
          }
        });
     }
});

router.post('/productUpdate', function (req, res) {
    if (req.body.data) {
        var conditionStr = req.body.data.condition;
        var action = req.body.data.action;
        var updateStr = req.body.data.update;
        if(action == "push") {
          Product.productUpdate(conditionStr, {$push: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
          });
        }else if (action == "pull") {
          Product.productUpdate(conditionStr, {$pull: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
          });
        }else {
          Product.productUpdate(conditionStr, {$set: updateStr}, {multi:true}, function (err, result) {
            if (result.nModified == 0) {
                res.json(failure);
            } else {
                res.json({"code": 1, "msg": "success"});
            }
          });
        }
    }
});

router.post('/productRegexQuery', function (req, res) {
   "use strict";
 if (req.body.data && req.body.data.condition) {
        var whereStr = "";
        var chip = req.body.data.condition.chip;
        var model = req.body.data.condition.model;
        var androidVersion = req.body.data.condition.androidVersion;
        var memorySize = req.body.data.condition.memorySize;
	var chipModel = req.body.data.condition.chipModel;        
	var opt = req.body.data.option;

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

	if(opt == null || typeof opt == "undefined"){
           opt = {};
        }
        var newStr = "{" + whereStr.substring(0,whereStr.length-1) + "}";
        var obj = (eval('(' + newStr + ')'));
        Product.productQuery(obj, opt, function (err, result) {
          if (result[0] == null) {
              res.json(failure);
          } else {
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
              res.json(failure);
            }else{
              res.json({"code": 1, "msg": "success"});
            }
        });
    }
});

router.post('/submitConfirm', function (req, res) {
     if(req.body.data){
        var chip = req.body.data.chip;
        var model = req.body.data.model;
        if(chip != "" && chip != null && typeof chip != "undefined" &&
          model != "" && model != null && typeof model != "undefined"){
          Generator.generate(chip, model,function(result){
            res.json(result);
          });
	}
     }
});

module.exports = router;

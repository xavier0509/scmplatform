
var url = 'mongodb://localhost:27017/fyb';
var fs = require('fs');

function Generator()
{
}

Generator.prototype.generate = function(
                                tv_chip,        // 电视机机芯
                                tv_model,       // 电视机机型 
								callback		// 回调函数
								)
{
	var randValue = Math.ceil(1000 * Math.random());
	var configFileName =  "/tmp/_config_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
	var mkFileName =  "/tmp/_androidMk_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
	var deviceTabFileName =  "/tmp/_deviceTab_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
	return this.generateFiles(callback, tv_chip, tv_model, configFileName, mkFileName, deviceTabFileName);
}

Generator.prototype.generateFiles = function(
								callback,			// 回调函数
                                tv_chip,        	// 电视机机芯
                                tv_model,       	// 电视机机型
                                config_filename,	// config文件名
								mk_filename,		// mk文件名
								target_filename		// target文件名
								)
{
	var result = 0;
	var mongo = require("mongodb");
	var client = mongo.MongoClient;
	var assert = require('assert');
	var device = "";
	
	// Use connect method to connect to the server
	client.connect(url, function(err, db) 
	{
		if (err)
		{
			if (callback != null)
				callback("connect database error!");
		}
		
		assert.equal(null, err);
		console.log("Connected successfully to server");
		
		var collection = db.collection('products');
		
		collection.find({}).toArray(function(err, docs) 
		{
			if (err)
			{
				if (callback != null)
					callback("query database table error!");
			}
		
            assert.equal(null, err);
            //console.log(docs);

			recordList = docs;
			
			var exist = false;
			
			for (var i in recordList)
			{
				var record = recordList[i];
				var curmodel = record.model;
				var curchip = record.chip;
				device = record.targetProduct;
				
				if (tv_chip == curchip && tv_model == curmodel)
				{
					var configsList = record.configFile;
				
					writeConfigStart(config_filename);
					for (var j in configsList)
					{
						console.log("config: " + JSON.stringify(configsList[j]));
						var key = configsList[j].engName;
						var value = configsList[j].value;
						var desc = configsList[j].desc;
						writeConfigItem(config_filename, key, value, desc);
					}
					writeConfigEnd(config_filename);
				
					var mkList = record.mkFile;
					writeAndroidmkStart(mk_filename, "mix");
					for (var k in mkList)
					{
						console.log("mk: " + JSON.stringify(mkList[k]));
						var path = mkList[k].gitPath;
						writeAndroidmkItem(mk_filename, path);
					}
					writeAndroidmkEnd(mk_filename);
				
					exist = true;
					break;
				}
			}
			
			if (exist == true)
			{
				var targets = new Array();
				var tvlist = new Array();
				
				for (var i in recordList)
				{
					var record = recordList[i];
					var targetProduct = record.targetProduct;
					var curmodel = record.model;
					var curchip = record.chip;
					
					console.log("targetProduct: " + targetProduct + "  " + curchip + "_" + curmodel);
					
					index = targetArrayIndex(targets, targetProduct);
					if (index >= 0)
					{
						tvlist[index] += (" " + curchip + "_" + curmodel);
					}
					else
					{
						var index = targets.length;
						targets[index] = targetProduct;
						tvlist[index] = curchip + "_" + curmodel;
					}
				}
				
				console.log(targets);
				console.log(tvlist);
				
				if (targets.length > 0)
				{
					writeDeviceTabStart(target_filename);
					for (var j in targets)
					{
						writeDeviceTabItem(target_filename, targets[j], tvlist[j]);
					}
					writeDeviceTabEnd(target_filename);
				}
				db.close();
				
				//gitpush(callback, "Rel6.0", device, tv_chip, tv_model, target_filename, mk_filename, config_filename);
				if (callback != null)
					callback(0);
			}
			else
			{
				db.close();
				if (callback != null)
					callback("query table result empty!");
			}
			
			
        });
	});
}

function targetArrayIndex(arr, obj)
{
	var i = arr.length;
	while (i--)
	{
		if (i < 0)
			break;
		if (arr[i] == obj) {
			return i;
		}
	}
	return -1;
}

function gitpush(
            systemVersion,                      // 系统版本，例如 'Rel6.0' 
            targetProduct,                      // target_product的值, 例如 'full_sky828_5s02'    
            chip,                               // 机芯, 例如 '5S02' 
            model,                              // 机型, 例如 'A2'  
            deviceTabTempFileName,              // device_tab.mk 临时文件名 
            mkTempFileName,                     // mk临时文件名 
            configTempFileName                  // config临时文件名 
            )
{
	var git = require("./gitcommit");
	git.push(systemVersion, targetProduct, chip, model, deviceTabTempFileName, mkTempFileName, configTempFileName);
	//deleteTempFile(deviceTabTempFileName, mkTempFileName, configTempFileName);
}

function writeConfigStart(configFileName)
{
    var startStr = '<?xml version="1.0" encoding="utf-8"?>   \n<!--  此文件是自动化配置平台根据配置值自动生成  -->   \n\n<SkyGeneralCfgs>\n';
    fs.writeFile(configFileName, startStr, function(err){
        if (err) {throw err};
    });
}

function writeConfigItem(configFileName, key, value, desc)
{
	var str = '';
	str += '    <!--  ' + desc + '  -->  \n';
    str += '    <config' + ' name="' + key + '" value="' + value + '" />  \n\n';
    fs.appendFile(configFileName, str, function(err){
        if (err) {throw err};
    });
}

function writeConfigEnd(configFileName)
{
    var endStr = "</SkyGeneralCfgs>\n\n\n\n";
    fs.appendFile(configFileName, endStr, function(err){
        if (err) {throw err};
    });
}

function writeAndroidmkStart(mkFileName, playerType)
{
    var str = "\n";
	
	str += "#路径定义，sky_def.mk处理  \n";
	str += "COOCAAOS_PATH := $(CUSTOM_BUILD_PATH)/../\n";
	str += "$(shell rm $(TOP)/packages/sky_def.mk)\n";
	str += "$(shell ln -s $(ANDROID_BUILD_TOP)/$(COOCAAOS_PATH)/Framework/sky_def.mk $(TOP)/packages/sky_def.mk)\n";
	str += "\n";
	str += "#北京播放器选择(北京播放器的类型是自动化平台根据配置值生成)   \n";
	str += "BJ_PLAYER := " + playerType + "\n";
	str += "\n";
	str += "#酷开系统核心SDK及版本    \n";
	str += "include $(COOCAAOS_PATH)/Framework/Android.mk\n";
	str += "include $(COOCAAOS_PATH)/VersionInfo/Android.mk\n";
	str += "\n";
	str += "# 产品自选的模块    \n";
	str += "# 格式：    \n";
	str += "# include $(COOCAAOS_PATH)/xxxx/xxxx/xxxxx/Android.mk\n";
	str += "# 中间xxx部分，来自模块配置的路径    \n";
	str += "\n";
	str += "#===================================================================================\n";
	str += "#===================================================================================\n";
	str += "#=========================以下由自动化平台根据配置生成==============================\n";
	str += "#===================================================================================\n\n";
	
    fs.writeFile(mkFileName, str, function(err){
        if (err) {throw err};
    });
}

function writeAndroidmkItem(mkFileName, value)
{
    var str = "include $(COOCAAOS_PATH)/" + value + "/Android.mk\n";
    fs.appendFile(mkFileName, str, function(err){
        if (err) {throw err};
    });
}

function writeAndroidmkEnd(mkFileName)
{
    var str = "\n"
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n\n"; 
    str += "include $(COOCAAOS_PATH)/Framework/analyze.mk\n\n\n\n\n\n\n\n";
    fs.appendFile(mkFileName, str, function(err){
        if (err) {throw err};
    });
}

function writeDeviceTabStart(tabFileName)
{
	var str = '\n';
	
	str += '### This file is automatically generated, do not edit it   \n';
	str += '### This file Recorded each device corresponding to the    \n';
	str += '### CoocaaOS customization mk,                             \n';
	str += '### As well as the corresponding product configuration     \n\n\n';

    fs.writeFile(tabFileName, str, function(err){
        if (err) {throw err};
    });
}

function writeDeviceTabItem(tabFileName, key, value)
{
	var configItem = key + " = " + value + "\n";
    fs.appendFile(tabFileName, configItem, function(err){
        if (err) {throw err};
    });
}

function writeDeviceTabEnd(tabFileName)
{
	var endStr = "\n";
    fs.appendFile(tabFileName, endStr, function(err){
        if (err) {throw err};
    });
}

function deleteTempFile(filename1, filename2, filename3)
{
    fs.unlink(filename1);
	fs.unlink(filename2);
	fs.unlink(filename3);
}


var generator = new Generator();

//generator.generate('8S61', 'A43');
//generator.generate('A2', 'A2');

module.exports = generator;






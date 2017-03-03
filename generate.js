
var url = 'mongodb://localhost:27017/fybv2';
var fs = require('fs');

function Generator()
{
}

Generator.prototype.generate = function(
                                machines,		// 机器列表
								version,		// 版本
								callback		// 回调函数
								)
{
	return generateFiles(machines, version, callback);
}

function generateFiles(	machines,			// 机器列表
						version,			// 版本
						callback 			// 回调函数
								)
{
	var result = 0;
	var mongo = require("mongodb");
	var client = mongo.MongoClient;
	var assert = require('assert');
	
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

			var boHaveWriteShellHeader = false;
			var tempFileList = new Array();
			var randValue = Math.ceil(1000 * Math.random());
			var temp_shell_filename =  "/tmp/_shell" + "_" + randValue + ".sh";
			tempFileList[tempFileList.length] = temp_shell_filename;

			var existRecord = false;
			
			for (var h in machines)
			{
				var machine = machines[h];
				var tv_chip = machine.chip;
				var tv_model = machine.model;
				//console.log("tv_chip = " + tv_chip + ", tv_model = " + tv_model);
				
				var recordList = docs;
				
				var randValue = Math.ceil(1000 * Math.random());
				var temp_config_filename =  "/tmp/_config_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				var temp_mk_filename =  "/tmp/_androidMk_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				
				tempFileList[tempFileList.length] = temp_config_filename;
				tempFileList[tempFileList.length] = temp_mk_filename;
				
				for (var i in recordList)
				{
					var record = recordList[i];
					var curmodel = record.model;
					var curchip = record.chip;
					var targetProduct = record.targetProduct;
					
					if (tv_chip == curchip && tv_model == curmodel)
					{
						generateConfigFile(temp_config_filename, record.configFile);
						generateMkFile(temp_mk_filename, record.mkFile);
					
						if (boHaveWriteShellHeader == false)
						{
							shellScriptStart(temp_shell_filename);
							boHaveWriteShellHeader = true;
						}
						
						shellScriptAddConfigFile(temp_shell_filename, temp_config_filename, tv_chip, tv_model);
						shellScriptAddMkFile(temp_shell_filename, temp_mk_filename, targetProduct);
						
						existRecord = true;
						break;
					}
				}
				
			}

			if (existRecord == true)
			{
				var targets = new Array();
				var tvlist = new Array();
				var recordList = docs;
				
				var randValue = Math.ceil(1000 * Math.random());
				var tempDeviceTabFileName =  "/tmp/_deviceTab_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				
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
					writeDeviceTabStart(tempDeviceTabFileName);
					for (var j in targets)
					{
						writeDeviceTabItem(tempDeviceTabFileName, targets[j], tvlist[j]);
					}
					writeDeviceTabEnd(tempDeviceTabFileName);
					
					shellScriptAddDeviceTab(temp_shell_filename, tempDeviceTabFileName);
				}
				shellScriptEnd(temp_shell_filename);

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

function generateConfigFile(config_filename, configsList)
{
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
}

function generateMkFile(mk_filename, mkList)
{
	writeAndroidmkStart(mk_filename, "mix");
	for (var k in mkList)
	{
		console.log("mk: " + JSON.stringify(mkList[k]));
		var path = mkList[k].gitPath;
		writeAndroidmkItem(mk_filename, path);
	}
	writeAndroidmkEnd(mk_filename);
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

function getGitDir(systemVersion)
{
	var gitdir;
	if (systemVersion == 'Rel6.0')
        gitdir = '/home/scmplatform/gitfiles/Rel6.0/Custom/';
    else
        gitdir = '/home/scmplatform/gitfiles/Rel6.0/Custom/';
	return gitdir;
}

function getGitBranch(systemVersion)
{
	var gitbranch;
	if (systemVersion == 'Rel6.0')
        gitbranch = 'CCOS/Rel6.0';
	else
        gitbranch = 'CCOS/Rel6.0';
    return gitbranch;
}

function shellScriptStart(shellFileName)
{
	var systemVersion = 'Rel6.0';
	var shcmd = "#!/bin/sh\n\n";
	
	var gitdir = getGitDir(systemVersion);	// 把git仓库下载到这里,并且要加上commit-msg脚本,并且设置可执行的权限 
	
	shcmd += "cd " + gitdir + " \n";
    shcmd += "git pull \n\n";
	
	fs.writeFile(shellFileName, shcmd, function(err){
        if (err) {throw err};
    });
}

function shellScriptAddConfigFile(shellFileName, tempConfigName, chip, model)
{			
    var shcmd = "";
	var config_dir_relpath = "pcfg/" + chip + "_" + model + "/config/";
	var config_file_relpath = config_dir_relpath + "general_config.xml";
	
	shcmd += "mkdir -p " + config_dir_relpath + "\n";
    shcmd += "cp -f " + tempConfigName + '  ' + config_file_relpath + "\n";
	shcmd += "git add " + config_file_relpath + "\n\n";
	
	fs.appendFile(shellFileName, shcmd, function(err){
        if (err) {throw err};
    });
}

function shellScriptAddMkFile(shellFileName, tempMkName, targetProduct)
{
	var shcmd = "";
	var mkFileName = targetProduct + ".mk";
	
    shcmd += "cp -f " + tempMkName + '  ' + mkFileName + "\n";
	shcmd += "git add " + mkFileName + "\n\n";
	
	fs.appendFile(shellFileName, shcmd, function(err){
        if (err) {throw err};
    });
}

function shellScriptAddDeviceTab(shellFileName, tempDeviceTabFileName)
{
	var shcmd = "";
	var mkFileName = "device_tab.mk";
	
    shcmd += "cp -f " + tempDeviceTabFileName + '  ' + mkFileName + "\n";
	shcmd += "git add " + mkFileName + "\n\n";
	
	fs.appendFile(shellFileName, shcmd, function(err){
        if (err) {throw err};
    });
}

function shellScriptEnd(shellFileName)
{
	var systemVersion = 'Rel6.0';
	var shcmd = "";
	var gitbranch = getGitBranch(systemVersion);
	shcmd += "git commit -m scmplatform_auto_commit_and_push  \n";
    shcmd += "git push origin HEAD:refs/for/" + gitbranch + "  \n\n";
	
	fs.appendFile(shellFileName, shcmd, function(err){
        if (err) {throw err};
    });
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

var info = [
		{"chip":"5S07", "model":"A2" },
		{"chip":"5S02", "model":"15U" }
	];

generator.generate(info, "Rel6.0", null);

module.exports = generator;






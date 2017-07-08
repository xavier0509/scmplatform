
var url = 'mongodb://172.20.5.239/fybv3';
var fs = require('fs');
var infoTxt = "";
var tempFileList = null;
var commit_msg = "";

function getGitDir(systemVersion)
{
	var gitdir;
	if (systemVersion == "Rel6.0")
        gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
    else
        gitdir = "/home/scmplatform/gitfiles/Rel6.0/Custom/";
	return gitdir;
}

function getGitBranch(systemVersion)
{
	var gitbranch;
	if (systemVersion == "Rel6.0")
        gitbranch = "CCOS/Rel6.0";
	else
        gitbranch = "CCOS/Rel6.0";
    return gitbranch;
}

function getTmpDir()
{
	var os = require('os');
	console.log(os.tmpdir());
	return os.tmpdir();
}

function Generator()
{
}

Generator.prototype.generate = function(
                                machines,		// 机器列表
								systemVersion,	// 系统版本
								callback		// 回调函数
								)
{
	var type = Object.prototype.toString.call(machines);
	
	infoTxt = "";
	
	if (type == "[object Array]")
	{
		//console.log("1111111111111111");
		return generateFiles(machines, systemVersion, callback);
	}
	else if (type == "[object Object]")
	{
		//console.log("2222222222222222222");
		var machineArray = new Array();
		machineArray[0] = machines;
		return generateFiles(machineArray, systemVersion, callback);
	}
	else
	{
		if (callback != null)
			callback(-1, "connect database error!");
	}
}

function generateFiles(	machines,			// 机器列表
						systemVersion,		// 系统版本
						callback 			// 回调函数
								)
{
	var result = 0;
	var mongo = require("mongodb");
	var client = mongo.MongoClient;
	var assert = require('assert');
	
	if (systemVersion == null)
		systemVersion = "Rel6.0";
	
	infoTxt = "";
	commit_msg = "";
	
	// Use connect method to connect to the server
	client.connect(url, function(err, db) 
	{
		if (err)
		{
			if (callback != null)
				callback(-2, "connect database error!");
		}
		
		assert.equal(null, err);
		console.log("Connected successfully to server");
		
		var collection = db.collection('products');
		
		collection.find({}).toArray(function(err, docs) 
		{
			if (err)
			{
				if (callback != null)
					callback(-3, "query database table error!");
			}
		
            assert.equal(null, err);
            //console.log(docs);

			tempFileList = new Array();

			var boHaveWriteShellHeader = false;
			var randValue = Math.ceil(1000 * Math.random());
			var temp_shell_filename =  getTmpDir() + "/temp_git_commit_shell_script" + "_" + randValue + ".txt";
			tempFileList[tempFileList.length] = temp_shell_filename;

			var existRecord = false;
			
			for (var h in machines)
			{
				var commit_msg_cnounter = 1;
				var machine = machines[h];
				var tv_chip = machine.chip;
				var tv_model = machine.model;
				//console.log("tv_chip = " + tv_chip + ", tv_model = " + tv_model);
				
				var recordList = docs;
				
				var randValue = Math.ceil(1000 * Math.random());
				var temp_config_filename =  getTmpDir() + "/temp_general_config_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				var temp_mk_filename =  getTmpDir() + "/temp_android_mk_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				
				tempFileList[tempFileList.length] = temp_config_filename;
				tempFileList[tempFileList.length] = temp_mk_filename;

				for (var i in recordList)
				{
					var record = recordList[i];
					var curmodel = record.model;
					var curchip = record.chip;
					var curuser = record.userName;
					var targetProduct = record.targetProduct;
					
					if (tv_chip == curchip && tv_model == curmodel)
					{
						generateConfigFile(temp_config_filename, record.configFile);
						generateMkFile(temp_mk_filename, record.mkFile);
					
						if (boHaveWriteShellHeader == false)
						{
							shellScriptStart(temp_shell_filename, systemVersion);
							boHaveWriteShellHeader = true;
						}
						
						shellScriptAddConfigFile(temp_shell_filename, temp_config_filename, tv_chip, tv_model);
						shellScriptAddMkFile(temp_shell_filename, temp_mk_filename, targetProduct);
						
						commit_msg += ("" + (commit_msg_cnounter++) + ". " + curuser + " modified " + curchip + "_" + curmodel + " , \n");
						
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
				var tempDeviceTabFileName =  getTmpDir() + "/temp_devicetab_mk_" + tv_chip + "_" + tv_model + "_" + randValue + ".txt";
				
				for (var i in recordList)
				{
					var record = recordList[i];
					var targetProduct = record.targetProduct;
					var curmodel = record.model;
					var curchip = record.chip;
					
					//console.log("targetProduct: " + targetProduct + "  " + curchip + "_" + curmodel);
					
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
				
				//console.log(targets);
				//console.log(tvlist);
				
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
				shellScriptEnd(temp_shell_filename, systemVersion);

				db.close();
				
				gitpush(temp_shell_filename, callback);
			}
			else
			{
				db.close();
				if (callback != null)
					callback(-4, "query table result empty!");
			}
			
			
        });
	});
}

Generator.prototype.preview = function(chip, model, callback)
{
	var errno = 0;
	var errorTxt = "";
	var mongo = require("mongodb");
	var client = mongo.MongoClient;
	var assert = require("assert");
	
	getTmpDir();
	// Use connect method to connect to the server
	client.connect(url, function(err, db) 
	{
		if (err)
		{
			errno = -1;
			errorTxt = "connect database error!";
			if (callback != null)
				callback(errno, errorTxt, errorTxt);
		}
		
		assert.equal(null, err);
		console.log("Connected successfully to server");
		
		var collection = db.collection('products');
		var cond = {"model" : model, "chip" : chip};
		
		collection.find(cond).toArray(function(err, docs) 
		{
			if (err)
			{
				errno = -2;
				errorTxt = "query database table error!";
				if (callback != null)
					callback(errno, errorTxt, errorTxt);
			}
			
			assert.equal(null, err);
            //console.log(docs);

			var randValue = Math.ceil(1000 * Math.random());
			var tmpfile1 = getTmpDir() + "/preview_config" + "_" + randValue + ".txt";
			var tmpfile2 = getTmpDir() + "/preview_mk" + "_" + randValue + ".txt";
			var existRecord = false;
			var recordList = docs;
			
			for (var i in recordList)
			{
				var record = recordList[i];
				var curmodel = record.model;
				var curchip = record.chip;

				if (chip == curchip && model == curmodel)
				{
					generateConfigFile(tmpfile1, record.configFile);
					generateMkFile(tmpfile2, record.mkFile);
					existRecord = true;
					break;
				}
			}

			db.close();
			
			if (existRecord == true)
			{
				var content1 = fs.readFileSync(tmpfile1, "utf-8");
				var content2 = fs.readFileSync(tmpfile2, "utf-8");
				if (callback != null)
					callback(0, content1, content2);
				fs.unlinkSync(tmpfile1);
				fs.unlinkSync(tmpfile2);
			}
			else
			{
				errno = -3;
				errorTxt = "query table result empty!";
				if (callback != null)
					callback(errno, errorTxt, errorTxt);
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
		//console.log("config: " + JSON.stringify(configsList[j]));
		var key = configsList[j].engName;
		var value = configsList[j].value;
		var desc = configsList[j].desc;
		writeConfigItem(config_filename, key, value, desc);
	}
	writeConfigEnd(config_filename);
}

function generateMkFile(mk_filename, mkList)
{
	var playerType = "";
	
	for (var i in mkList)
	{
		var category = mkList[i].category;
		if (category == "PlayerLibrary")
		{
			playerType = mkList[i].gitPath;
		}
	}
	
	console.log("playerType = " + playerType);
	
	writeAndroidmkStart(mk_filename, playerType);
	for (var k in mkList)
	{
		var category = mkList[k].category;
		if (category != "PlayerLibrary")
		{
			//console.log("mk: " + JSON.stringify(mkList[k]));
			var path = mkList[k].gitPath;
			writeAndroidmkItem(mk_filename, path);
		}
	}
	writeAndroidmkEnd(mk_filename);
}

function gitpush(shellFileName, callback)
{
	var shcmd = "";
	
	shcmd += "sleep 0.2s ; ";
	shcmd += "sh " + shellFileName;
	
	var spawn = require('child_process').spawn;
    var free = spawn('/bin/sh', ['-c', shcmd]); 
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) { 
		console.log("" + data); 
    }); 
    
    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function (data) { 
		console.log('stderr output:\n' + data); 
		infoTxt += data;
    }); 
    
    // 注册子进程关闭事件 
    free.on('exit', function (code, signal) { 
		console.log('child process eixt ,exit:' + code); 
		if (callback != null) 
		{
			callback(code, infoTxt);
		}
		deleteTempFiles();
    });
}

function shellScriptStart(shellFileName, systemVersion)
{
	var cmd;
	var shcmd = "#!/bin/sh\n\n";
	
	var gitdir = getGitDir(systemVersion);	// 把git仓库下载到这里,并且要加上commit-msg脚本,并且设置可执行的权限 
	
	cmd = "cd " + gitdir + " \n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	cmd = "git pull \n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
    shcmd += "\n";
	
	fs.writeFileSync(shellFileName, shcmd);
}

function shellScriptAddConfigFile(shellFileName, tempConfigName, chip, model)
{		
	var cmd;
    var shcmd = "";
	var config_dir_relpath = "pcfg/" + chip + "_" + model + "/config/";
	var config_file_relpath = config_dir_relpath + "general_config.xml";
	
	cmd = "mkdir -p " + config_dir_relpath + "\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
    cmd = "cp -f " + tempConfigName + '  ' + config_file_relpath + "\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	cmd = "git add " + config_file_relpath + "\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
}

function shellScriptAddMkFile(shellFileName, tempMkName, targetProduct)
{
	var cmd;
	var shcmd = "";
	var mkFileName = targetProduct + ".mk";
	
    cmd = "cp -f " + tempMkName + '  ' + mkFileName + "\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	cmd = "git add " + mkFileName + "\n\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
}

function shellScriptAddDeviceTab(shellFileName, tempDeviceTabFileName)
{
	var cmd;
	var shcmd = "";
	var mkFileName = "device_tab.mk";
	
    cmd = "cp -f " + tempDeviceTabFileName + '  ' + mkFileName + "\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	cmd = "git add " + mkFileName + "\n\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
}

function shellScriptEnd(shellFileName, systemVersion)
{
	var cmd;
	var shcmd = "";
	var gitbranch = getGitBranch(systemVersion);
	
	cmd = "git commit -m  '\n";
	cmd += commit_msg;
	cmd += "'\n";
	
	//shcmd += "echo " + cmd;
	shcmd += cmd;
	
    // cmd = "git push origin HEAD:refs/for/" + gitbranch + "  \n\n";
    cmd = "git push 1 HEAD:refs/for/" + gitbranch + "  \n\n";
	shcmd += "echo " + cmd;
	shcmd += cmd;
	
	shcmd += "\n";
	
	fs.appendFileSync(shellFileName, shcmd);
}

function writeConfigStart(configFileName)
{
    var startStr = '<?xml version="1.0" encoding="utf-8"?>   \n<!--  此文件是自动化配置平台根据配置值自动生成  -->   \n\n<SkyGeneralCfgs>\n';
    fs.writeFileSync(configFileName, startStr);
}

function writeConfigItem(configFileName, key, value, desc)
{
	var str = '';
	str += '    <!--  ' + desc + '  -->  \n';
    str += '    <config' + ' name="' + key + '" value="' + value + '" />  \n\n';
    fs.appendFileSync(configFileName, str);
}

function writeConfigEnd(configFileName)
{
    var endStr = "</SkyGeneralCfgs>\n\n\n\n";
    fs.appendFileSync(configFileName, endStr);
}

function writeAndroidmkStart(mkFileName, playerType)
{
    var str = "\n";
	var playerTypeStr;
	
	if (playerType == "mix")
		playerTypeStr = "mix";
	else if (playerType == "intact")
		playerTypeStr = "intact";
	else
		playerTypeStr = "null";
	
	str += "#路径定义，sky_def.mk处理  \n";
	str += "COOCAAOS_PATH := $(CUSTOM_BUILD_PATH)/../\n";
	str += "$(shell rm $(TOP)/packages/sky_def.mk)\n";
	str += "$(shell ln -s $(ANDROID_BUILD_TOP)/$(COOCAAOS_PATH)/Framework/sky_def.mk $(TOP)/packages/sky_def.mk)\n";
	str += "\n";
	str += "#北京播放器选择(北京播放器的类型是自动化平台根据配置值生成)   \n";
	str += "BJ_PLAYER := " + playerTypeStr + "\n";
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
	
    fs.writeFileSync(mkFileName, str);
}

function writeAndroidmkItem(mkFileName, value)
{
    var str = "include $(COOCAAOS_PATH)/" + value + "/Android.mk\n";
    fs.appendFileSync(mkFileName, str);
}

function writeAndroidmkEnd(mkFileName)
{
    var str = "\n"
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n"; 
	str += "#===================================================================================\n\n"; 
    str += "include $(COOCAAOS_PATH)/Framework/analyze.mk\n\n\n\n\n\n\n\n";
    fs.appendFileSync(mkFileName, str);
}

function writeDeviceTabStart(tabFileName)
{
	var str = '\n';
	
	str += '### This file is automatically generated, do not edit it   \n';
	str += '### This file Recorded each device corresponding to the    \n';
	str += '### CoocaaOS customization mk,                             \n';
	str += '### As well as the corresponding product configuration     \n\n\n';

    fs.writeFileSync(tabFileName, str);
}

function writeDeviceTabItem(tabFileName, key, value)
{
	var configItem = key + " := " + value + "\n";
    fs.appendFileSync(tabFileName, configItem);
}

function writeDeviceTabEnd(tabFileName)
{
	var endStr = "\n";
    fs.appendFileSync(tabFileName, endStr);
}

function deleteTempFiles()
{
	if (tempFileList != null)
	{
		for (var i in tempFileList)
		{
			var filename = tempFileList[i];
			fs.unlinkSync(filename);
		}
	}
}

var generator = new Generator();

//var info = [
//		{"chip":"5S07", "model":"A2" },
//		{"chip":"5S02", "model":"15U" }
//	];

//var info = {"chip":"5S09", "model":"A3" };

//generator.generate(info, "Rel6.0", null);

//generator.preview("5S02", "15U", function(errno, text1, text2){
//	if (errno == 0)
//	{
//		console.log(text2);
//	}
//});

module.exports = generator;







function SkyGit()
{
}

SkyGit.prototype.push = function(
			callback,							// 回调函数
            systemVersion,                      // 系统版本，例如 'Rel6.0' 
            targetProduct,                      // target_product的值, 例如 'full_sky828_5s02'    
            chip,                               // 机芯, 例如 '5S02' 
            model,                              // 机型, 例如 'A2'  
            deviceTabTempFileName,              // device_tab.mk 临时文件名 
            mkTempFileName,                     // mk临时文件名 
            configTempFileName                  // config临时文件名 
            )
{
    var gitdir, gitbranch;
    var shcmd = '';

    if (systemVersion == 'Rel6.0')
    {
        // 把git仓库下载到这里,并且要加上commit-msg脚本,并且设置可执行的权限  
        gitdir = '/home/scmplatform/gitfiles/Rel6.0/Custom/';
        gitbranch = 'CCOS/Rel6.0';
    }
    else
    {
        gitdir = '/home/scmplatform/gitfiles/Rel6.0/Custom/';
        gitbranch = 'CCOS/Rel6.0';
    }

    shcmd += 'cp -f ' + deviceTabTempFileName + ' ' + gitdir + 'device_tab.mk ; ';
    shcmd += 'cp -f ' + mkTempFileName + ' ' + gitdir + targetProduct + '.mk ; '
    shcmd += 'mkdir -p ' + gitdir + 'pcfg/' + chip + '_' + model + '/config ; ';
    shcmd += 'cp -f ' + configTempFileName + ' ' + gitdir + 'pcfg/' + chip + '_' + model + '/config/general_config.xml ; '

    shcmd += 'cd ' + gitdir + ' ; ';
    shcmd += 'git pull ; '
    shcmd += 'git add device_tab.mk ; ';
    shcmd += 'git add ' + targetProduct + '.mk ; ';
    shcmd += 'git add pcfg/' + chip + '_' + model + '/config/general_config.xml ; '
    shcmd += 'git commit -m scmplatform_auto_commit_and_push ; ';
    shcmd += 'git push origin HEAD:refs/for/' + gitbranch + ' ; ';
    
    var spawn = require('child_process').spawn;
    var free = spawn('/bin/sh', ['-c', shcmd]); 
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) { 
     console.log('standard output:\n' + data); 
    }); 
    
    // 捕获标准错误输出并将其打印到控制台 
     free.stderr.on('data', function (data) { 
     console.log('standard error output:\n' + data); 
     }); 
    
     // 注册子进程关闭事件 
     free.on('exit', function (code, signal) { 
     console.log('child process eixt ,exit:' + code); 
     });
	 
	 if (callback != null)
		callback(0);
};

var skygit = new SkyGit;

// for test
//skygit.push(null, 'Rel6.0', 'my_target', '1W22', 'Z100', '1.txt', '2.txt', '3.txt');

module.exports = skygit;

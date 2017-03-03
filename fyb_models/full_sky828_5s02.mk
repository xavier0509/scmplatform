
#路径定义，sky_def.mk处理  
COOCAAOS_PATH := $(CUSTOM_BUILD_PATH)/../
$(shell rm $(TOP)/packages/sky_def.mk)
$(shell ln -s $(ANDROID_BUILD_TOP)/$(COOCAAOS_PATH)/Framework/sky_def.mk $(TOP)/packages/sky_def.mk)

#北京播放器选择(北京播放器的类型是自动化平台根据配置值生成)   
BJ_PLAYER := mix

#酷开系统核心SDK及版本    
include $(COOCAAOS_PATH)/Framework/Android.mk
include $(COOCAAOS_PATH)/VersionInfo/Android.mk

# 产品自选的模块    
# 格式：    
# include $(COOCAAOS_PATH)/xxxx/xxxx/xxxxx/Android.mk
# 中间xxx部分，来自模块配置的路径    

#===================================================================================
#===================================================================================
#=========================以下由自动化平台根据配置生成==============================
#===================================================================================

include $(COOCAAOS_PATH)/SkyworthApp/Service/SkyIPCService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkySystemService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkyPushService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkyDataService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkyDEService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkyADService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/Service/SkySSService/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyTaskManager/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkySetting/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyPayCenter/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyPackageInstaller/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyLocalMedia/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyAutoInstaller/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyCommonFactory/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyBrowser/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyAutoTest/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/SysApp/SkyMirrorPlayer/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyEDU/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyUser/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyTVQQ/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyVoice/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyMovie/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyCCMall/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyQrcode/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SmartHome/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyManual/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyWeather/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/App/SkyTVAgent/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/HomePage/SkyVastHomePage/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/IME/SogouIME/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/AppStore/SkyHall/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/AppStore/SkyAppStore/Android.mk
include $(COOCAAOS_PATH)/SkyworthApp/TV/SkyTV/Android.mk
include $(COOCAAOS_PATH)/ThirdPartyApp/kuyun/Android.mk
include $(COOCAAOS_PATH)/ThirdPartyApp/ifly/Android.mk
include $(COOCAAOS_PATH)/null/Android.mk

#===================================================================================
#===================================================================================
#===================================================================================
#===================================================================================

include $(COOCAAOS_PATH)/Framework/analyze.mk








#include "AppDelegate.h"

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "generated/cocos2dx.hpp"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_ccbreader.h"
#include "js_bindings_system_registration.h"
#include "SPJSManager.h"

using namespace CocosDenshion;

USING_NS_CC;

AppDelegate::AppDelegate()
{

}

AppDelegate::~AppDelegate()
{
    SimpleAudioEngine::end();
}

bool AppDelegate::applicationDidFinishLaunching()
{
	// initialize director
	CCDirector *pDirector = CCDirector::sharedDirector();
	pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());

	// turn on display FPS
	pDirector->setDisplayStats(true);

	// set FPS. the default value is 1.0/60 if you don't call this
	pDirector->setAnimationInterval(1.0 / 60);

	ScriptingCore* sc = ScriptingCore::getInstance();
	sc->addRegisterCallback(register_all_cocos2dx);
	sc->addRegisterCallback(register_cocos2dx_js_extensions);
	sc->addRegisterCallback(register_CCBuilderReader);
	sc->addRegisterCallback(jsb_register_chipmunk);
	sc->addRegisterCallback(jsb_register_system);
	sc->addRegisterCallback( SP_JSBind::CJSManager::InitJSManager );

	sc->start();

	CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
	CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
	//ScriptingCore::getInstance()->runScript("main.js");
	SP_JSBind::CJSManager::Instance()->ExecuteShellToJS( "libs/module/epic.js", "js/app.js" );
	//SP_JSBind::CJSManager::Instance()->ExecuteShellToJS( "libs/module/epic.js", "main.js" );
	//SP_JSBind::CJSManager::Instance()->ExecuteShellToJS( "libs/module/epic.js", "samples/tests-boot-jsb.js" );

    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    CCDirector::sharedDirector()->stopAnimation();

    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CCDirector::sharedDirector()->startAnimation();

    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
}

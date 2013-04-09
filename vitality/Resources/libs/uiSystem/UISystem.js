

/**
 * @fileOverview uiSystem
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var UIInputManager = require( 'libs/uiSystem/UIInputManager.js' );
var ActionManager = require( 'libs/uiSystem/ActionManager.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description ui system
 * @extends aBase
 */
//var SPII = this ;

var uiSystem = module.exports = {};

uiSystem.init = function(){
    this._pCurScene = null;
    this._pUIInputManager = null;
    this._pUIActionManager = null;

    this.uiFiles = new Array();

    this.uiSystemInited = false;
    this.comWidgets = new Array();
    this._pUIInputManager = new UIInputManager();
    this._pUIActionManager = new ActionManager();

    this._updateEnableChildren = new Array();
    this._fLastTime = Date.now();
    this._fCurTime = 0.0;
    this.uiSystemInited = true;
};

uiSystem.pushUIFile = function(fileName){
    this.uiFiles.push(fileName);
};

uiSystem.loadUIFiles = function(){
    for (var i=0;i<this.uiFiles.length;i++){
        Require(this.uiFiles[i]);
    }
};

uiSystem.initSceneWithFile = function(uiOptions){
    this._pCurScene.loadUISceneWithFile(uiOptions);
};

uiSystem.replaceUIScene = function(fileName,gameScene){
    this.cleanUIScene();
    RequireUIJS(fileName);
    this._pCurScene.loadUISceneWithFile(ui_file_json);
    this.conectToGameScene(gameScene);
};

uiSystem.createWidgetFromFile = function(fileName){
    RequireUIJS(fileName);
    return this._pCurScene.loadWidgetFromFile(ui_file_json);
};
                            
uiSystem.createWidget = function(parent,data){
    var UIControls = require( 'libs/uiSystem/' + data.classname + '.js' );
    //var widget = new SPII[data.classname](data.options);
    if( data.scriptJS ){
        data.options.scriptJS = require( data.scriptJS );
    }
    var widget = new UIControls(data.options);
    if (parent != null){
        parent.addChild(widget);
    }
    for (var i in data.children ){
        var subData = data.children[i];
        widget[subData.options.name] = this.createWidget(widget,subData);
    }
    return widget;
};
                        
uiSystem.test = function(com){
    print('testtesttesttest  '+com);
//    com.widget = this.createWidget(null,data);
//    com.widget.conectComponent(com,1);
};
                        
uiSystem.createWidgetWithName = function(name){
    var UIControls = require( 'libs/uiSystem/' + data.classname + '.js' );
    //var widget = new SPII[name]({});
    var widget = new UIControls({});
    print('create widget with name '+widget);
};

uiSystem.resetSystem = function(gameScene){
    this._pCurScene.cleanScene();
    this._pCurScene.init();
    this.conectToGameScene(gameScene);
};

uiSystem.cleanUIScene = function(){
    this._pUIActionManager.stopAllActions();
    this._pCurScene.cleanScene();
};

uiSystem.update = function( dt ){
    this._fCurTime = Date.now();
    var dt = this._fCurTime - this._fLastTime;
    this._fLastTime = this._fCurTime;

    this._pUIActionManager.update(dt);
    this._pUIInputManager.update(dt);
    for (var i in this._updateEnableChildren){
        this._updateEnableChildren[i].update(dt);
    }
};

uiSystem.updateWithDT = function(dt){
    this._pCurScene.update(dt);
    this._pUIActionManager.update(dt);
};

uiSystem.conectToGameScene = function(gameScene){
    gameScene.addUICRenderNode(this._pCurScene._pRootWidget._pCContainerNode);
};

uiSystem.getCurTime = function(){
                        print('get cur time');
};
                        
uiSystem.removeWidgetFromGUIComponent = function(guiCom,widget){
    var removeIdx = -1;
    for (var i=0;i<this.comWidgets.length;i++){
        if (widget == this.comWidgets[i] && guiCom.getStrName() == this.comWidgets[i]._sComName){
            removeIdx = i;
            break;
        }
    }
    if (removeIdx != -1){
        this.comWidgets.splice(removeIdx,1);
        this._pUIInputManager.removeComponentManageredWidget(widget);
        guiCom.removeGUICRenderNodeWithName(widget._sName);
    }
};
                        
uiSystem.getComponentWidgetByName = function(guiCom,name){
    for (var i=0;i<this.comWidgets.length;i++){
        if (this.comWidgets[i]._sName == name && guiCom.getStrName() == this.comWidgets[i]._sComName){
            return this.comWidgets[i];
        }
    }
};

uiSystem.addUpdateEnableWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }

    this._updateEnableChildren.push(widget);
 };

uiSystem.removeUpdateEnableWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    for ( var i in this._updateEnableChildren ){
        if (widget == this._updateEnableChildren[i]){
            this._updateEnableChildren.splice(i,1);
            return;
        }
    }
 };

//interface for input
uiSystem.onTouchPressed = function(touches){
    return (!this.uiSystemInited) ? 0 : this._pUIInputManager.onTouchPressed(touches);
};

uiSystem.onTouchPressed_COCOS = function(touches){
    return this._pUIInputManager.onTouchPressed_COCOS(touches);
};

uiSystem.onTouchPressed_COCOS_C = function(x,y){
    this._pUIInputManager.onTouchPressed_COCOS_C(x,y);
};

uiSystem.onTouchMoved = function(touches){
    return (!this.uiSystemInited) ? 0 : this._pUIInputManager.onTouchMoved(touches);
};

uiSystem.onTouchMoved_COCOS = function(touches){
    return this._pUIInputManager.onTouchMoved_COCOS(touches);
};

uiSystem.onTouchMoved_COCOS_C = function(x,y){
    this._pUIInputManager.onTouchMoved_COCOS_C(x,y);
};

uiSystem.onTouchReleased = function(touches){
    return (!this.uiSystemInited) ? 0 : this._pUIInputManager.onTouchReleased(touches);
};

uiSystem.onTouchReleased_COCOS = function(touches){
    return this._pUIInputManager.onTouchReleased_COCOS(touches);
};

uiSystem.onTouchReleased_COCOS_C = function(x,y){
    this._pUIInputManager.onTouchReleased_COCOS_C(x,y);
};

uiSystem.onTouchCanceled = function(touches){
    return (!this.uiSystemInited) ? 0 : this._pUIInputManager.onTouchCanceled(touches);
};

uiSystem.onTouchCanceled_COCOS = function(touches){
    return this._pUIInputManager.onTouchCanceled_COCOS(touches);
};

onTouchCanceled_COCOS_C = function(x,y){
    this._pUIInputManager.onTouchCanceled_COCOS_C(x,y);
};



/**
 * @fileOverview UIScene
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description the manager of current ui scene
 * @extends aBase
 */
var UIScene = function(system){
    this._pRootWidget = null;
    this._bTouchAble = false;
    this._bVisible = true;
    this._bUpdateAble = true;
    this._pUISystem = system;
    this._updateEnableChildren = null;
 };

module.exports = UIScene;

UIScene.prototype.init = function(){
    this._pRootWidget = new RootWidget({});
    this._pRootWidget._nZOrder = 0;
    this._pRootWidget.uiScene = this;
    this._updateEnableChildren = new Array();
 };

UIScene.prototype.loadUISceneWithFile = function(uiOptions){
    if (this._pRootWidget == null){
        this.init();
    }
    this.createWidget(uiOptions,this._pRootWidget);
 };

UIScene.prototype.loadWidgetFromFile = function(uiOptions){
    return this.createWidget(uiOptions,null);
 };

UIScene.prototype.addWidget = function(widget){
    this._pRootWidget.addChild(widget);
 };

UIScene.prototype.removeWidgetAndCleanUp = function(widget,cleanUp){
    this._pRootWidget.removeChildAndCleanUp(widget,cleanUp);
 };

UIScene.prototype.setVisible = function(visible){
    if (this._bVisible == visible){
        return;
    }
    this._bVisible = visible;
    this._pRootWidget.setVisible(visible);
 };

UIScene.prototype.update = function(dt){
    if (this._updateEnableChildren == null || this._updateEnableChildren == undefined){
        return;
    }
    for (var i=0;i<this._updateEnableChildren.length;i++){
        this._updateEnableChildren[i].update(dt);
    }
 };

UIScene.prototype.addUpdateEnableWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    var newZOrder = widget._nZOrder;
    this._updateEnableChildren.push(widget);
 };

UIScene.prototype.removeUpdateEnableWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    for (var i=0;i<this._updateEnableChildren.length;i++){
        if (widget == this._updateEnableChildren[i]){
            this._updateEnableChildren.splice(i,1);
            return;
        }
    }
 };

UIScene.prototype.createWidget = function(data,parent){
    var widget = new SPII[data.classname](data.options);
    if (parent != null){
        parent.addChild(widget);
    }
    for (var i=0;i<data.children.length;i++){
        var subData = data.children[i];
        widget[subData.options.name] = this.createWidget(subData,widget);
    }

    return widget;
 };

UIScene.prototype.getWidgetByTag = function(tag){
    return this.checkWidgetByTag(this._pRootWidget,tag);
 };

UIScene.prototype.checkWidgetByTag = function(root,tag){
    if (root._nTag == tag){
        return root;
    }
    for (var i=0;i<root._children.length;i++){
        var res = this.checkWidgetByTag(root._children[i],tag);
        if (res != null){
            return res;
        }
    }
    return null;
 };

UIScene.prototype.getWidgetByName = function(name){
    return this.checkWidgetByName(this._pRootWidget,name);
 };

UIScene.prototype.checkWidgetByName = function(root,name){
    if (root._sName == name){
        return root;
    }
    for (var i=0;i<root._children.length;i++){
        var res = this.checkWidgetByName(root._children[i],name);
        if (res != null){
            return res;
        }
    }
    return null;
 };

UIScene.prototype.cleanScene = function(){
    if (this._pRootWidget != null && this._pRootWidget != undefined){
        this._pRootWidget.releaseResoures();
        this._pRootWidget = null;
        this._updateEnableChildren = null;
    }
};
                

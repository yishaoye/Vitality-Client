
/**
 * @fileOverview Widget
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var UIPoint = require( 'libs/uiSystem/Math.js' ).UIPoint;
var UIRect = require( 'libs/uiSystem/Math.js' ).UIRect;
var UISize = require( 'libs/uiSystem/Math.js' ).UISize;
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var uiSystem = require( 'libs/uiSystem/UISystem.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description base widget
 * @extends aBase
 */
var Widget = function(options){
    this._bEnabled = true;
    this._bVisible = options.visible || true;
    this._bActived = false;
    this._bFocus = false;
    this._bBeTouchEnabled = options.touchAble || false;

    this._nZOrder = -1;
    this._fScale = 1;
    this._fScaleX = options.scaleX || 1;
    this._fScaleY = options.scaleY || 1;
    this._fRotation = options.rotation || 0;
    this._pParent = null;
    this._nCurPressState = -1;
    this._nPrevPressstate = -1;
    this._bUpdateAble = false;
    this._pCContainerNode = null;
    this._pCElementsContainerNode = null;
    this._fContentSizeWidth = 0;
    this._fContentSizeHeight = 0;
    this._nTag = options.tag || -1;
    this._sName = options.name || 'default';
    this._sComName = '';
    this._position =  new UIPoint();
    this._position.x = options.x || 0;
    this._position.y = options.y || 0;
    this._bVisibleTouch = this._bVisible;

    this._locationInWindow = new UIPoint();
    this._contentSize = new UISize();
    this._rect = new UIRect();
    this._relativeRect = new UIRect();
    this._touchStartPos = new UIPoint(); 
    this._touchEndPos = new UIPoint();


    //children container
    this._children = new Array();
    this._UIElements = new Array();

    //Events
    if( options.scriptJS ){
        this.events = {
            onPush: options.scriptJS[options.onPush] , 
            onMove: options.scriptJS[options.onMove] , 
            onRelease: options.scriptJS[options.onRelease] , 
            onLongClicked: options.scriptJS[options.onLongClicked]
        };
    }
    else{
        this.events = {};
    }
    //animation
    this.animations = new Array();
    if ( typeof options.actions === 'Array' ) {
        for ( var i in options.actions ){
            var UIAnimation = require( 'libs/uiSystem/' + options.actions[i].actionname + '.js' );
            var action = new UIAnimation( options.actions[i].options );
            this.animations.push(action);
        }
    }

    //animation
    this._bRunningAction = false;

    //type
    this._nWidgetType = 0; //0 normal 1 container
    this.initNodes();
    //this.conectComponent(this._pGUIComponent);
    this.setPosition(this._position);
    this.setScaleX( this._fScaleX );
    this.setScaleY( this._fScaleY );
    this.setRotation( this._fRotation );

    this._bFlipX = options.flipX || false;
    this._bFlipY = options.flipY || false;
    this._bNeedCheckVisibleDependParent = false;
    this.setVisible(this._bVisible);
    this.setVisibleTouch( this._bVisibleTouch );

    this._pComponentGUI = null;
    this._nColorR = options.colorR || 0;
    this._nColorG = options.colorG || 0;
    this._nColorB = options.colorB || 0;
    this._nColorO = options.colorO || 0;
 };

module.exports = Widget;

Widget.prototype.releaseResoures = function(){
    this.removeAllChildrenAndCleanUp(true);
    this.removeAllUIElementsAndCleanUp(true);
    this._pCContainerNode.removeFromParentAndCleanUp(true);
    this._children = null;
    this._UIElements = null;
    //action memery
    var actionCount = this.animations.length;
    for (var i=0;i<actionCount;i++){
    this.animations[i] = null;
    }
    this.animations = null;
    
    //js res
    this._locationInWindow = null;
    this._contentSize = null;
    this._rect = null;
    this._relativeRect = null;
    this._touchStartPos = null;
    this._touchEndPos = null;
    this.events = null;
    this.animations = null;
    this._sName = null;
                      
 };

Widget.prototype.initNodes = function(){
    this._pCContainerNode = new CRenderNode();
    this._pCContainerNode.initNode( NodeType.NODE_CCSPRITE );
 };
                      
Widget.prototype.getContainerNode = function(){
    return this._pCContainerNode;
};
Widget.prototype.conectComponent = function(com,z){
    this._pComponentGUI = com;
    if (this.checkObjectUseable(com)){
        com.addGUICRenderNode(this._pCContainerNode);
        this.setZOrder(z);
        this.activeToUIInputManager();
    }
 };

Widget.prototype.getRenderNode = function(){
    this.activeToUIInputManager();
    return this._pCContainerNode.getRenderNode();
 };

Widget.prototype.addChild = function(child){
    if (child == null || child == undefined){
        return false;
    }
    child._pParent = this;
    child._bActived = true;
    child.setZOrder(this._nZOrder+1+(this._children.length/10000.0));
    this._children.push(child);
    this.addChildNode(child);
    this.activeToUIInputManager();
    uiSystem._pUIInputManager.uiSceneHasChanged();
    return true;
 };
                      
Widget.prototype.activeToUIInputManager = function(){
    if (this._bBeTouchEnabled){
        uiSystem._pUIInputManager.registWidget(this);
    }
    for (var i=0;i<this._children.length;i++){
        this._children[i].activeToUIInputManager();
    }
 };

Widget.prototype.setZOrder = function(z){
    this._nZOrder = z;
    this.updateChildrenZOrder();
 };

Widget.prototype.updateChildrenZOrder = function(){
    if (this.checkObjectUseable(this._children)){
        for (var i=0;i<this._children.length;i++){
            this._children[i].setZOrder(this._nZOrder+1+i/10000.0);
        }
    }
 };
                      
Widget.prototype.setNeedCheckVisibleDepandParent = function(need){
    this._bNeedCheckVisibleDependParent = need;
    if (this.checkObjectUseable(this._children)){
        for (var i=0;i<this._children.length;i++){
            this._children[i].setNeedCheckVisibleDepandParent(need);
        }
    }
 };
                      
Widget.prototype.setVisibleTouch = function(visible){
    this._bVisibleTouch = visible;
    if (this.checkObjectUseable(this._children)){
        for (var i=0;i<this._children.length;i++){
            this._children[i].setVisibleTouch(visible);
        }
    }
 };

Widget.prototype.addChildNode = function(child){
    if (child == null || child == undefined){
        return;
    }
    this._pCContainerNode.addRenderNode(child._pCContainerNode);
 };

Widget.prototype.addUIElement = function(element){
    if (element == null || element == undefined){
        return false;
    }
    this._UIElements.push(element);
    this.addElementNode(element);
 };

Widget.prototype.addElementNode = function(element){
    if (element == null || element == undefined){
        return;
    }
    this._pCContainerNode.addRenderNode(element._pCRenderNode);
 };

Widget.prototype.removeChildAndCleanUp = function(child,cleanUp){
    if (!this.checkObjectUseable(child)){
        return false;
    }
    if (cleanUp){
        this.removeChildMoveToTrash(child);
    }else{
        this.removeChildReferenceOnly(child);
    }
    return true;
 };

Widget.prototype.removeChildMoveToTrash = function(child){
    if (!this.checkObjectUseable(child)){
        return;
    }
    var childIdx = this.checkContainedChild(child);
    if (childIdx != -1){
        child.cleanFromUIInputManager();
        child.setUpdateEnable(false);
        child.releaseResoures();
        child = null;
        this._children[childIdx] = null;
        this._children.splice(childIdx,1);
        this.updateChildrenZOrder();
    }
 };

Widget.prototype.removeChildReferenceOnly = function(child){
    if (!this.checkObjectUseable(child)){
        return;
    }
    var childIdx = this.checkContainedChild(child);
    if (childIdx != -1){
                      child.cleanFromUIInputManager();
        child.cleanFromUIInputManager();
        this._pCContainerNode.removeRenderNodeAndCleanUp(child._pCContainerNode,false);
        child.setNeedCheckVisibleDepandParent(false);
        this._children.splice(childIdx,1);
        this.updateChildrenZOrder();
    }
 };
                      
Widget.prototype.cleanFromUIInputManager = function(){
    uiSystem._pUIInputManager.removeManageredWidget(this);
    for (var i=0;i<this._children.length;i++){
        this._children[i].cleanFromUIInputManager();
    }
 };

Widget.prototype.removeAllChildrenAndCleanUp = function(cleanUp){
    if (cleanUp){
        var times = this._children.length;
        for (var i=0;i<times;i++){
            if (this.checkObjectUseable(this._children[i])){
                this._children[i].setBeTouchAble(false);
                this._children[i].releaseResoures();
                this._children[i] = null;
            }
        }
    }else{
        var times = this._children.length;
        for (var i=0;i<times;i++){
            if (this.checkObjectUseable(this._children[i])){
                this._children[i].setBeTouchAble(false);
                this._children[i].releaseResoures();
                this._children[i] = null;
            }
        }
    }
    this._children.length = 0;
 };

Widget.prototype.removeFromParentAndCleanUp = function(cleanUp){
    if (this.checkObjectUseable(this._pParent)){
        if (cleanUp){
            this._pParent.removeChildMoveToTrash(this);
        }else{
            this._pParent.removeChildReferenceOnly(this);
        }
        return true;
    }
    return false;
 };

Widget.prototype.removeUIElementAndCleanUp = function(cleanUp){
                      
 };

Widget.prototype.removeAllUIElementsAndCleanUp = function(cleanUp){
    var times = this._UIElements.length;
    for (var i=0;i<times;i++){
        var element = this._UIElements[i];
        element.releaseResoures();
        element = null;
        this._UIElements[i] = null;
    }
    this._UIElements.length = 0;
 };

Widget.prototype.checkContainedChild = function(child){
    if (!this.checkObjectUseable(child)){
        return -1;
    }
    for (var i=0;i<this._children.length;i++){
        if (child == this._children[i]){
            return i;
        }
    }
    return -1;
 };

Widget.prototype.setPosition = function(position){
    this._position.x = position.x;
    this._position.y = position.y;
    this._pCContainerNode.setPositionXY(this._position.x,this._position.y);
 };

Widget.prototype.setPositionXY = function(x,y){
    this._position.x = x;
    this._position.y = y;
    this._pCContainerNode.setPositionXY(this._position.x,this._position.y);
 };
Widget.prototype.setPositionX = function(x){
    this._position.x = x;
    this._pCContainerNode.setPositionXY(this._position.x,this._position.y);
};

Widget.prototype.setPositionY = function(y){
    this._position.y = y;
    this._pCContainerNode.setPositionXY(this._position.x,this._position.y);
};
Widget.prototype.getPosition = function(){
    return this._position;
 };
Widget.prototype.getPositionX = function(){
    return this._position.x;
};

Widget.prototype.getPositionY = function(){
    return this._position.y;
};
Widget.prototype.checkObjectUseable = function(obj){
    if (obj == null || obj == undefined){
        return false;
    }
    return true;
 };

Widget.prototype.setVisible = function(visible){
    if (this._bVisible == visible){
        return;
    }
    this._bVisible = visible;
    this._pCContainerNode.setVisible(visible);
 };
Widget.prototype.getVisible = function(){
    return this._bVisible;
};

Widget.prototype.setScale = function(scale){
    this._fScale = scale;
    this._pCContainerNode.setScale(this._fScale);
 };

Widget.prototype.setScaleX = function(scaleX){
    this._fScaleX = scaleX;
    this._pCContainerNode.setScaleX(this._fScaleX);
 };

Widget.prototype.setScaleY = function(scaleY){
    this._fScaleY = scaleY;
    this._pCContainerNode.setScaleY(this._fScaleY);
 };

Widget.prototype.getScale = function(){
    return this._fScale;
 };

Widget.prototype.getScaleX = function(){
    return this._fScaleX;
 };

Widget.prototype.getScaleY = function(){
    return this._fScaleY;
 };

Widget.prototype.setRotation = function(rotation){
    this._fRotation = rotation;
    this._pCContainerNode.setRotation(rotation);
 };

Widget.prototype.getRotation = function(){
    return this._pCContainerNode.getRotation();
 };
                      
Widget.prototype.setFlipX = function(flipX){
    this._bFlipX = flipX;
 };

Widget.prototype.setFlipY = function(flipY){
    this._bFlipY = flipY;
 };
 
Widget.prototype.getFlipX = function(){
    return this._bFlipX;
};

Widget.prototype.getFlipY = function(){
    return this._bFlipY;
};

Widget.prototype.setBeTouchAble = function(able){
    if (this._bBeTouchEnabled == able){
        return;
    }
    this._bBeTouchEnabled = able;
    if (this._bBeTouchEnabled && this.checkObjectUseable(uiSystem._pUIInputManager)){
        uiSystem._pUIInputManager.registWidget(this);
    }else{
        uiSystem._pUIInputManager.removeManageredWidget(this);
    }
 };

Widget.prototype.getParent = function(){
    if (!this.checkObjectUseable(this._pParent)){
        return 0;
    }
    return this._pParent;
 };

Widget.prototype.getLocationInWindow = function(){
    var p = this._pCContainerNode.convertToWorldSpace();
    this._locationInWindow.x = p.x;
    this._locationInWindow.y = p.y;
 };

Widget.prototype.setBeFocus = function(fucos){
    if (fucos == this._bFocus){
        return;
    }
    this._bFocus = fucos;
    if (this._bFocus){
        this.setPressState(1);
    }else{
        this.setPressState(0);
    }
 };

Widget.prototype.didNotSelectSelf = function(){

 };
                      
Widget.prototype.playAction = function(actionIdx){
    if (actionIdx < 0 || actionIdx >= this.animations.length){
        return;
    }
    this.animations[actionIdx].runWithTarget(this);
 };

//to be overrideed
Widget.prototype.onTouchPressed = function(touchPoint){
    this.setBeFocus(true);
    this._touchStartPos.x = touchPoint.x;
    this._touchStartPos.y = touchPoint.y;
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(0,this,touchPoint);
    }
    this.pushDownEvent();
 };

Widget.prototype.onTouchMoved = function(touchPoint){
    var x = touchPoint.x;
    var y = touchPoint.y;
    this.setBeFocus(this.pointAtSelfBody(x,y))
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(1,this,touchPoint);
    }
 };

Widget.prototype.onTouchReleased = function(touchPoint){
    var x = touchPoint.x;
    var y = touchPoint.y;
    this._touchEndPos.x = touchPoint.x;
    this._touchEndPos.y = touchPoint.y;
    var focus = this._bFocus;
    this.setBeFocus(false);
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(2,this,touchPoint);
    }
    if (focus){
        this.releaseUpEvent();
        }else{
            this.cancelUpEvent();
    }
 };

Widget.prototype.onTouchCanceled = function(touchPoint){
    this.setPressState(0);
 };

Widget.prototype.onTouchLongClicked = function(touchPoint){
    this.longClickEvent();
 };

Widget.prototype.setPressState = function(state){
    if (this._nCurPressState == state){
        return;
    }
    this._nPrevPressstate = this._nCurPressState;
    this._nCurPressState = state;
    switch (this._nCurPressState){
        case 0:
        this.onPressStateChangedToNormal();
        break;
        case 1:
        this.onPressStateChangedToPressed();
        break;
        case 2:
        this.onPressStateChangedToDisabled();
        break;
    }
 };

Widget.prototype.onPressStateChangedToNormal = function(){

 };

Widget.prototype.onPressStateChangedToPressed = function(){

 };

Widget.prototype.onPressStateChangedToDisabled = function(){

 };

Widget.prototype.getRect = function(){
    this.obtainRect(this.getValidNode(),0);
    return this._rect;
 };

Widget.prototype.getRelativeRect = function(){
    this.obtainRect(this.getValidNode(),1);
    return this._relativeRect;
 };

Widget.prototype.getValidNode = function(){
    return this._pCContainerNode;
 };

Widget.prototype.obtainRect = function(validNode,type){
    switch (type){
        case 0:
        var width = 0;
        var height = 0;
        var anchorPointX = 0;
        var anchorPointY = 0;
        this.getLocationInWindow();
        width = validNode.getContentSizeWidth();
        height = validNode.getContentSizeHeight();
        anchorPointX = validNode.getAnchorPoint().x;
        anchorPointY = validNode.getAnchorPoint().y;
        switch (this._nWidgetType){
            case 0:
            this._rect.origin.x = this._locationInWindow.x - width * anchorPointX;
            this._rect.origin.y = this._locationInWindow.y - height * anchorPointY;
            break;
            case 1:
            this._rect.origin.x = this._locationInWindow.x;
            this._rect.origin.y = this._locationInWindow.y;
            break;
        }
        this._rect.size.width = width;
        this._rect.size.height = height;
        break;
        case 1:
        var width = 0;
        var height = 0;
        var anchorPointX = 0;
        var anchorPointY = 0;
        width = validNode.getContentSizeWidth();
        height = validNode.getContentSizeHeight();
        anchorPointX = validNode.getAnchorPoint().x;
        anchorPointY = validNode.getAnchorPoint().y;
        switch (this._nWidgetType){
            case 0:
            this._relativeRect.origin.x = this._position.x - width * anchorPointX;
            this._relativeRect.origin.y = this._position.y - height * anchorPointY;
            break;
            case 1:
            this._relativeRect.origin.x = this._position.x;
            this._relativeRect.origin.y = this._position.y;
            break;
        }
        this._relativeRect.size.width = width;
        this._relativeRect.size.height = height;
        break;
    }
 };

Widget.prototype.getRelativeLeftPos = function(){
    return this.getRelativeRect().origin.x;
 };

Widget.prototype.getRelativeBottomPos = function(){
    return this.getRelativeRect().origin.y;
 };

Widget.prototype.getRelativeRightPos = function(){
    var rect = this.getRelativeRect();
    return rect.origin.x + rect.size.width;
 };

Widget.prototype.getRelativeTopPos = function(){
    var rect = this.getRelativeRect();
    return rect.origin.y + rect.size.height;
 };

Widget.prototype.pointAtSelfBody = function(x,y){
    var parent = this;
    while (parent != 0){
        if (!parent._bVisible){
            return false;
        }
        parent = parent.getParent();
    }
                      
    var rect = this.getRect();
    var bRet = false;
    if (x >= rect.origin.x && x <= rect.origin.x+rect.size.width && y >= rect.origin.y && y <= rect.origin.y +rect.size.height){
        bRet = true;
    }
    return bRet;
 };
 
Widget.prototype.pointAtSelfBody_ed = function(pt){
    var parent = this;
    while (parent != 0){
        if (!parent._bVisible){
            return false;
        }
        parent = parent.getParent();
    }
    var x = pt.x;
    var y = pt.y;

    var rect = this.getRect();
    var bRet = false;
    if (x >= rect.origin.x+(rect.size.width/2)*this._fScaleX && x <= rect.origin.x+(rect.size.width/2)*this._fScaleX+rect.size.width*this._fScaleX && y >= rect.origin.y+(rect.size.height/2)*this._fScaleY && y <= rect.origin.y+(rect.size.height/2)*this._fScaleY +rect.size.height*this._fScaleY){
        bRet = true;
    }
    return bRet;
};

Widget.prototype.checkVisibleDependParent = function(x,y){
    if (!this._bNeedCheckVisibleDependParent){
        return true;
    }
    if (this.checkObjectUseable(this._pParent)){
            var rect = this._pParent.getRect();
            var bRet = false;
            if (x >= rect.origin.x && x <= rect.origin.x+rect.size.width && y >= rect.origin.y && y <= rect.origin.y +rect.size.height){
                bRet = true;
            }
            if (bRet){
                return this._pParent.checkVisibleDependParent(x,y);
            }
            return false;
    }
    return true;
 };

Widget.prototype.pushDownEvent = function(){
    if (this.checkObjectUseable(this.events['onPush'])){
        this.events['onPush'].apply(this,[this]);
    }
 };

Widget.prototype.moveEvent = function(){
    if (this.checkObjectUseable(this.events['onMove'])){
        this.events['onMove'].apply(this,[this]);
    }
 };

Widget.prototype.releaseUpEvent = function(){
    if (this.checkObjectUseable(this.events['onRelease'])){
        this.events['onRelease'].apply(this,[this]);
    }
 };
 
Widget.prototype.cancelUpEvent = function(){
    if (this.checkObjectUseable(this.events['onCancel']))
    {
        this.events['onCancel'].apply(this, [this]);
    }
};

Widget.prototype.longClickEvent = function(){
    if (this.checkObjectUseable(this.events['onLongClicked'])){
        this.events['onLongClicked'].apply(this,[this]);
    }
 };

Widget.prototype.checkTheRightListenerType = function(checkedType,rightType){
    if (checkedType == rightType){
        return true;
    }
    return false;
 };

Widget.prototype.checkBeVisibleInParent = function(){
    var parentRect = this._pParent.getRect();
    var selfRect = this.getRect();
    var res = !((selfRect.origin.x+selfRect.size.width) < parentRect.origin.x ||
       (parentRect.origin.x+parentRect.size.width) <   selfRect.origin.x ||
       (selfRect.origin.y+selfRect.size.height) < parentRect.origin.y ||
       parentRect.origin.y+parentRect.size.height <    selfRect.origin.y);
    return res;
 };

Widget.prototype.setUpdateEnable = function(able){
    log( 'setUpdateEnable' );
    if (able)
    {                          
        uiSystem.addUpdateEnableWidget(this);
    }
    else
    {
        uiSystem.removeUpdateEnableWidget(this);
    }
 };

Widget.prototype.update = function(dt){

 };

Widget.prototype.checkChildInfo = function(handleState,sender,touchPoint){
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(handleState,sender,touchPoint);
    }
 };
 
Widget.prototype.getChildByName = function(name){
    return uiSystem.checkWidgetByName(this,name);
};

Widget.prototype.getChildByTag = function(name){

};
       
//editor
Widget.prototype.setTag = function(tag){
    this._nTag = tag;
};

Widget.prototype.getTag = function(){
    return this._nTag;
};
                      
Widget.prototype.setName = function(name){
    this._sName = name;
};

Widget.prototype.getName = function(){
    return this._sName;
};
       
//virtual
Widget.prototype.setColorR = function(cr){
    this._nColorR = cr;
};
//virtual
Widget.prototype.setColorG = function(cg){
    this._nColorG = cg;
};
//virtual
Widget.prototype.setColorB = function(cb){
    this._nColorB = cb;
};
//virtual
Widget.prototype.getColorR = function(){
    return this._nColorR;
};
//virtual
Widget.prototype.getColorG = function(){
    return this._nColorG;
};
//virtual
Widget.prototype.getColorB = function(){
    return this._nColorB;
};
//virtual
Widget.prototype.setAlpha = function(alpha){
    this._nColorO = alpha;
};
//virtual
Widget.prototype.getAlpha = function(){
    return this._nColorO;
};
//virtual
Widget.prototype.setWidth = function(width){

};
//virtual
Widget.prototype.getWidth = function(){
    return this.getValidNode().getContentSizeWidth();
},
//virtual
Widget.prototype.setHeight = function(height){

};
//virtual
Widget.prototype.getHeight = function(){
    return this.getValidNode().getContentSizeHeight();
};
                      
Widget.prototype.getBeTouchAble = function(){
    ;return this._bBeTouchEnabled;
}

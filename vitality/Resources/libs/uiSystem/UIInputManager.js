

/**
 * @fileOverview UIInputManager
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var UIPoint = require( 'libs/uiSystem/Math.js' ).UIPoint;
/**
 * @author SPII
 * @constructor onCreate
 * @description the manager of input
 * @extends aBase
 */
var UIInputManager = function(){
    this._manageredWidget = new Array();
    this._pCurSelectedWidget = null;
    this.unusedWidget = 0;
    this.touchBeganedPoint = new UIPoint();
    this.touchMovedPoint = new UIPoint();
    this.touchEndedPoint = new UIPoint();
    this.touchCanceledPoint = new UIPoint();
    this._widgetBeSorted = false;
    this._bTouchDown = false;
    this._fLongClickTime = 700;
    this._fLongClickRecordTime = 0;
    this.checkedDoubleClickWidget = new Array();
};

module.exports = UIInputManager;

UIInputManager.prototype.registWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    for (var i=0;i<this._manageredWidget.length;i++){
        if (widget == this._manageredWidget[i]){
            return;
        }
    }
    this._manageredWidget.push(widget);
    this.uiSceneHasChanged();
};

UIInputManager.prototype.uiSceneHasChanged = function(){
    this._widgetBeSorted = false;
 };

UIInputManager.prototype.sortWidgets = function(){
    var count = this._manageredWidget.length;
    for ( var i = 0; i < count; ++i) {
        for ( var j = 0; j < count - 1; ++j) {
            if (this._manageredWidget[j]._nZOrder < this._manageredWidget[j + 1]._nZOrder) 
            {
                this.swap(this._manageredWidget, j, j + 1);
            }
        }
    }
 };
                              
UIInputManager.prototype.sortComponentWidgets = function(){
    var count = this._manageredComponentWidget.length;
    for ( var i = 0; i < count; ++i) {
        for ( var j = 0; j < count - 1; ++j) {
            if (this._manageredComponentWidget[j]._nZOrder < this._manageredComponentWidget[j + 1]._nZOrder)
            {
                this.swap(this._manageredComponentWidget, j, j + 1);
            }
        }
    }
 };

UIInputManager.prototype.swap = function(elements, i, j) {
    var tmp = elements[i];
    elements[i] = elements[j];
    elements[j] = tmp;
 };

UIInputManager.prototype.removeManageredWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    for (var i=0;i<this._manageredWidget.length;i++){
        if (widget == this._manageredWidget[i]){
            this._manageredWidget.splice(i,1);
            return;
        }
    }
 };
                              
UIInputManager.prototype.removeComponentManageredWidget = function(widget){
    if (widget == null || widget == undefined){
        return;
    }
    for (var i=0;i<this._manageredComponentWidget.length;i++){
        if (widget == this._manageredComponentWidget[i]){
            this._manageredComponentWidget.splice(i,1);
            return;
        }
    }
 };

UIInputManager.prototype.checkEventWidget = function(touchPoint){
    var x = touchPoint.x;
    var y = touchPoint.y;
    if (!this._widgetBeSorted){
        this.sortWidgets();
        this._widgetBeSorted = true;
    }
    for (var i=0;i<this._manageredWidget.length;i++){
        if(this._manageredWidget[i].pointAtSelfBody(x,y)){
            if (!this._manageredWidget[i].checkVisibleDependParent(x,y)){
                continue;
            }
            if (i != this._manageredWidget.length-1){
                var j = i+1;
                for (;j < this._manageredWidget.length;j++){
                    this._manageredWidget[j].didNotSelectSelf();
                }
            }
            return this._manageredWidget[i];
        }else{
            this._manageredWidget[i].didNotSelectSelf();
        }
    }
    return 0;
 };

UIInputManager.prototype.addCheckedDoubleClickWidget = function(widget){
    this.checkedDoubleClickWidget.push(widget);
 };

UIInputManager.prototype.update = function(dt){
    if (this._bTouchDown){
        this._fLongClickRecordTime += dt;
        if (this._fLongClickRecordTime >= this._fLongClickTime){
            this._fLongClickRecordTime = 0;
            this._bTouchDown = false;
            this._pCurSelectedWidget.onTouchLongClicked(this.touchBeganedPoint);
        }
    }
    for (var i=0;i<this.checkedDoubleClickWidget.length;i++){
        if (!this.checkedDoubleClickWidget[i]._bVisible){
            continue;
        }
        this.checkedDoubleClickWidget[i].checkDoubleClick(dt);
    }
 };

UIInputManager.prototype.onTouchPressed = function(touches){
    this.touchBeganedPoint.x = touches.getPosByIndex(0).getX();
    this.touchBeganedPoint.y = touches.getPosByIndex(0).getY();
    var hitWidget = this.checkEventWidget(this.touchBeganedPoint);
    if (hitWidget == 0){
        this._pCurSelectedWidget = this.unusedWidget;
        return 0;
    }
    this._pCurSelectedWidget = hitWidget;
    hitWidget.onTouchPressed(this.touchBeganedPoint);
    this._bTouchDown = true;
    return 1;
 };

UIInputManager.prototype.onTouchPressed_COCOS = function(touches){
    this.touchBeganedPoint.x = touches[0].getLocation().x;
    this.touchBeganedPoint.y = touches[0].getLocation().y;
    var hitWidget = this.checkEventWidget(this.touchBeganedPoint);
    if (hitWidget == 0){
        this._pCurSelectedWidget = this.unusedWidget;
        return 0;
    }
    this._pCurSelectedWidget = hitWidget;
    hitWidget.onTouchPressed(this.touchBeganedPoint);
    return 1;
 };

UIInputManager.prototype.onTouchPressed_COCOS_C = function(x,y){
    this.touchBeganedPoint.x = x;
    this.touchBeganedPoint.y = y;
    var hitWidget = this.checkEventWidget(this.touchBeganedPoint);
    if (hitWidget == 0){
        this._pCurSelectedWidget = this.unusedWidget;
        return;
    }
    this._pCurSelectedWidget = hitWidget;
    hitWidget.onTouchPressed(this.touchBeganedPoint);
 };

UIInputManager.prototype.onTouchMoved = function(touches){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchMovedPoint.x = touches.getPosByIndex(0).getX();
    this.touchMovedPoint.y = touches.getPosByIndex(0).getY();
    hitWidget.onTouchMoved(this.touchMovedPoint);
    if (this._bTouchDown){
        this._fLongClickRecordTime = 0;
        this._bTouchDown = false;
    }
    return 1;
 };

UIInputManager.prototype.onTouchMoved_COCOS = function(touches){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchMovedPoint.x = touches[0].getLocation().x;
    this.touchMovedPoint.y = touches[0].getLocation().y;
    hitWidget.onTouchMoved(this.touchMovedPoint);
    return 1;
 };

UIInputManager.prototype.onTouchMoved_COCOS_C = function(x,y){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return;
    }
    this.touchMovedPoint.x = x;
    this.touchMovedPoint.y = y;
    hitWidget.onTouchMoved(this.touchMovedPoint);
 };

UIInputManager.prototype.onTouchReleased = function(touches){
    this._bTouchDown = false;
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchEndedPoint.x = touches.getPosByIndex(0).getX();
    this.touchEndedPoint.y = touches.getPosByIndex(0).getY();
    hitWidget.onTouchReleased(this.touchEndedPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
    return 1;
 };

UIInputManager.prototype.onTouchReleased_COCOS = function(touches){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchEndedPoint.x = touches[0].getLocation().x;
    this.touchEndedPoint.y = touches[0].getLocation().y;
    hitWidget.onTouchReleased(this.touchEndedPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
    return 1;
 };

UIInputManager.prototype.onTouchReleased_COCOS_C = function(x,y){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return;
    }
    this.touchEndedPoint.x = x;
    this.touchEndedPoint.y = y;
    hitWidget.onTouchReleased(this.touchEndedPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
 };

UIInputManager.prototype.onTouchCanceled = function(touches){
    this._bTouchDown = false;
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchCanceledPoint.x = touches.getPosByIndex(0).getX();
    this.touchCanceledPoint.y = touches.getPosByIndex(0).getY();
    hitWidget.onTouchReleased(this.touchCanceledPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
    return 1;
 };

UIInputManager.prototype.onTouchCanceled_COCOS = function(touches){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return 0;
    }
    this.touchCanceledPoint.x = touches[0].getLocation().x;
    this.touchCanceledPoint.y = touches[0].getLocation().y;
    hitWidget.onTouchReleased(this.touchCanceledPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
    return 1;
 };

UIInputManager.prototype.onTouchCanceled_COCOS_C = function(x,y){
    var hitWidget = this._pCurSelectedWidget;
    if (hitWidget == this.unusedWidget){
        return;
    }
    this.touchCanceledPoint.x = x;
    this.touchCanceledPoint.y = y;
    hitWidget.onTouchReleased(this.touchCanceledPoint);
    this._pCurSelectedWidget = this.unusedWidget;
    this.hitWidget = this.unusedWidget;
}




/**
 * @fileOverview BaseAction
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description base action
 * @extends aBase
 */
var BaseAction = function(options){
    this._nActionType = -1;
    this._pTarget = null;
    this._fDuration = options.duration;
    this._elapsed = 0.0;
    this._bActived = false;
    this._bBeCleaned = false;
    this.actionOverCallBack = null;
    this._storeAction = false;
 };

BaseAction.prototype.update = function(dt){
    this._elapsed += dt;
    this.updateAction(gUIMath.max(0,gUIMath.min(1, this._elapsed / this._fDuration)));
 };

BaseAction.prototype.updateAction = function(time){

 };

BaseAction.prototype.actionOver = function(){
    return (this._elapsed >= this._fDuration);
 };

BaseAction.prototype.runWithTarget = function(target){
    if (this._bActived == true){
        return false;
    }
    this.setTarget(target);
    this._bActived = true;
    uiSystem._pUIActionManager.addAction(this);
    return true;
 };

BaseAction.prototype.setTarget = function(target){
    this._pTarget = target;
 };

BaseAction.prototype.callBackFunction = function(){
    if (this.actionOverCallBack == null || this.actionOverCallBack == undefined){
        return;
    }
    this.actionOverCallBack.apply(this,[this]);
};


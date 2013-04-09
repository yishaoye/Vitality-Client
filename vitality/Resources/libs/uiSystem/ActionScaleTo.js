
/**
 * @fileOverview ActionScaleTo
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var BaseAction = require( 'libs/uiSystem/BaseAction.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the scale action
 * @extends BaseAction
 */
var ActionScaleTo = function(options){
    BaseAction.call( this, options );
    this._fStartScaleX = 0.0;
    this._fStartScaleY = 0.0;
    this._fEndScaleX = options.desScaleX;
    this._fEndScaleY = options.desScaleY;
    this._fDeltaX = 0.0;
    this._fDeltaY = 0.0;
 };

util.inherits(ActionScaleTo, BaseAction);
module.exports = ActionScaleTo;

ActionScaleTo.prototype.setTarget = function(target){
    BaseAction.prototype.setTarget.call( this, target );
    this._fStartScaleX = this._pTarget.getScaleX();
    this._fStartScaleY = this._pTarget.getScaleY();
    this._fDeltaX = this._fEndScaleX - this._fStartScaleX;
    this._fDeltaY = this._fEndScaleY - this._fStartScaleY;
 };

ActionScaleTo.prototype.updateAction = function(time){
    this._pTarget.setScaleX(this._fStartScaleX + this._fDeltaX * time);
    this._pTarget.setScaleY(this._fStartScaleY + this._fDeltaY * time);
};


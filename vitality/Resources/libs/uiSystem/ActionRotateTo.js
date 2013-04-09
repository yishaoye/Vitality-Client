
/**
 * @fileOverview ActionRotateTo
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var BaseAction = require( 'libs/uiSystem/BaseAction.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the rotate action
 * @extends BaseAction
 */
var ActionRotateTo = function(options){
    BaseAction.call( this, options );
    this._fDstAngle = options.desRotation;
    this._fStartAngle = 0.0;
    this._fDiffAngle = 0.0;
 };

util.inherits(ActionRotateTo, BaseAction);
module.exports = ActionRotateTo;

ActionRotateTo.prototype.setTarget = function(target){
    BaseAction.prototype.setTarget.call( this, target );
    this._fStartAngle = target.getRotation();
    if (this._fStartAngle > 0){
        this._fStartAngle = gUIMath.fmod(this._fStartAngle, 360.0);
    }else{
        this._fStartAngle = gUIMath.fmod(this._fStartAngle, -360.0);
    }
    this._fDiffAngle = this._fDstAngle - this._fStartAngle;
    if (this._fDiffAngle > 180){
        this._fDiffAngle -= 360;
    }
    if (this._fDiffAngle < -180){
        this._fDiffAngle += 360;
    }
 };

ActionRotateTo.prototype.updateAction = function(time){
    this._pTarget.setRotation(this._fStartAngle + this._fDiffAngle * time);
};


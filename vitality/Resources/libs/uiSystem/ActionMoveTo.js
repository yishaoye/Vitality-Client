
/**
 * @fileOverview ActionMoveTo
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var UIPoint = require( 'libs/uiSystem/Math.js' ).UIPoint;
var BaseAction = require( 'libs/uiSystem/BaseAction.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the move action
 * @extends BaseAction
 */
var ActionMoveTo = function(options){
    BaseAction.call( this, options );
    this._endPosition = new UIPoint();
    this._endPosition.x = options.desX;
    this._endPosition.y = options.desY;
    this._startPosition = new UIPoint();
    this._delta = null;
    this._targetMovedPoint = new UIPoint();
 };

util.inherits(ActionMoveTo, BaseAction);
module.exports = ActionMoveTo;

ActionMoveTo.prototype.setTarget = function(target){
    BaseAction.prototype.setTarget.call( this, target );
    this._startPosition.x = target.getPosition().x;
    this._startPosition.y = target.getPosition().y;
    this._delta = gUIMath.vectorSub(this._endPosition,this._startPosition);
 };

ActionMoveTo.prototype.updateAction = function(time){
    this._targetMovedPoint.x = this._startPosition.x + this._delta.x * time;
    this._targetMovedPoint.y = this._startPosition.y + this._delta.y * time;
    this._pTarget.setPosition(this._targetMovedPoint);
};

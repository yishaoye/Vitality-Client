
/**
 * @fileOverview ActionSpawn
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var BaseAction = require( 'libs/uiSystem/BaseAction.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the spawn action
 * @extends BaseAction
 */
var ActionSpawn = function(options){
    BaseAction.call( this, options );
    this._nActionLength = options.actions.length;
    this._pSubActions = new Array();
    for (var i=0;i<this._nActionLength;i++){
        var sa = new SPII[options.actions[i].actionname](options.actions[i].options);
        this._pSubActions.push(sa);
    }
 };

util.inherits(ActionRotateTo, BaseAction);
module.exports = ActionRotateTo;

ActionSpawn.prototype.setTarget = function(target){
    BaseAction.prototype.setTarget.call( this, target );
    for (var i=0;i<this._pSubActions.length;i++){
        var action = this._pSubActions[i];
        action.setTarget(target);
        action._bActived = true;
    }
 };

ActionSpawn.prototype.update = function(dt){
    if (this._nActionLength <= 0){
        return;
    }
    for (var i=0;i<this._pSubActions.length;i++){
        var action = this._pSubActions[i];
        if (!action._bActived){
            continue;
        }
        action.update(dt);
        if (action.actionOver()){
            this._nActionLength--;
            action._bActived = false;
        }
    }
 };

ActionSpawn.prototype.actionOver = function(){
    return (this._nActionLength <= 0);
};


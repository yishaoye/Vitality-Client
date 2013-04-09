
/**
 * @fileOverview ActionSequence
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var BaseAction = require( 'libs/uiSystem/BaseAction.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the sequence action
 * @extends BaseAction
 */
var ActionSequence = function(options){
    BaseAction.call( this, options );
    this._bSubActionRunning = false;
    this._bSequenceRunning = false;
    this._nRunningIdx = 0;
    this._nActionLength = options.actions.length;
    this._pSubActions = new Array();
    for (var i=0;i<this._nActionLength;i++){
        var sa = new SPII[options.actions[i].actionname](options.actions[i].options);
        this._pSubActions.push(sa);
    }
 };

util.inherits(ActionSequence, BaseAction);
module.exports = ActionSequence;

ActionSequence.prototype.setTarget = function(target){
    BaseAction.prototype.setTarget.call( this, target );
    this._bSubActionRunning = true;
    this._bSequenceRunning = true;
    this._pSubActions[0].runWithTarget(this._pTarget);
 };

ActionSequence.prototype.update = function(dt){
    if (this.actionOver()){
        return;
    }
    if (!this._bSubActionRunning){
        this._pSubActions[this._nRunningIdx].runWithTarget(this._pTarget);
        this._bSubActionRunning = true;
    }else{
        if (this._pSubActions[this._nRunningIdx].actionOver()){
            this._nRunningIdx++;
            this._bSubActionRunning = false;
            if (this._nRunningIdx >= this._nActionLength){
                this._bSequenceRunning = false;
            }
        }
    }
 };

ActionSequence.prototype.actionOver = function(){
    return !this._bSequenceRunning;
};



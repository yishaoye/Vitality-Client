
/**
 * @fileOverview ActionManager
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */

/**
 * @author SPII
 * @constructor onCreate
 * @description the manager of actions
 * @extends aBase
 */
var ActionManager = function(){
    this.runningActions = new Array();
 };

 module.exports = ActionManager;

ActionManager.prototype.init = function(){

 };

ActionManager.prototype.addAction = function(action){
    this.runningActions.push(action);
 };

ActionManager.prototype.update = function(dt){
    for (var i=0;i<this.runningActions.length;i++){
        var action = this.runningActions[i];
        if (action._bActived){
            action.update(dt);
            if (action.actionOver() || action._bBeCleaned){
                action.callBackFunction();
                action._bActived = false;
                this.runningActions.splice(i,1);
            }
        }
    }
 };

ActionManager.prototype.stopAllActions = function(){
    var length = this.runningActions.length;
    for (var i=0;i<length;i++){
        var action = this.runningActions.pop();
        action = null;
    }
};



/**
 * @fileOverview WrapContentPanel
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Panel = require( 'libs/uiSystem/Panel.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description WrapContentPanel widget
 * @extends Panel
 */
var WrapContentPanel = function(options){
    Panel.call( this, options );

    this._bWidthChangeEnable = options.widthChangeEnable || true;
    this._bHeightChangeEnable = options.heightChangeEnable || true;

 };

util.inherits(WrapContentPanel, Panel);
module.exports = WrapContentPanel;


WrapContentPanel.prototype.addChild = function(widget){
    Panel.prototype.addChild.call( this, widget );
    this.updateWidthAndHeight();
 };

WrapContentPanel.prototype.removeChildAndCleanUp = function(child,cleanUp){
    Panel.prototype.removeChildAndCleanUp.call( this, child, cleanUp );
    this.updateWidthAndHeight();
 };

WrapContentPanel.prototype.updateWidthAndHeight = function(){
    if (!this.checkObjectUseable(this._children) || this._children.length <= 0){
        return;
    }
    var leftChild = this._children[0];
    var rightChild = this._children[0];
    var topChild = this._children[0];
    var bottomChild = this._children[0];
    for (var i=0;i<this._children.length;i++){
        if (this._bWidthChangeEnable){
            if (leftChild.getRelativeRect().origin.x > this._children[i].getRelativeRect().origin.x){
                leftChild = this._children[i];
            }
            if (rightChild.getRelativeRect().origin.x + rightChild.getRelativeRect().size.width < this._children[i].getRelativeRect().origin.x + this._children[i].getRelativeRect().size.width){
                rightChild = this._children[i];
            }
        }
        if (this._bHeightChangeEnable){
            if (topChild.getRelativeRect().origin.y + topChild.getRelativeRect().size.height < this._children[i].getRelativeRect().origin.y + this._children[i].getRelativeRect().size.height){
                topChild = this._children[i];
            }
            if (bottomChild.getRelativeRect().origin.y > this._children[i].getRelativeRect().origin.y){
                bottomChild = this._children[i];
            }
        }
    }
    var leftBoundary = 0;
    var rightBoundary = 0;
    if (this._bWidthChangeEnable){
        leftBoundary = leftChild.getRelativeLeftPos();
        rightBoundary = rightChild.getRelativeRightPos();
    }
    var topBoundary = 0;
    var bottomBoundary = 0;
    if (this._bHeightChangeEnable){
        topBoundary = topChild.getRelativeTopPos();
        bottomBoundary = bottomChild.getRelativeBottomPos();
    }
    var resWidth = rightBoundary-leftBoundary;
    var resHeight = topBoundary-bottomBoundary;
    this.setSize(this._bWidthChangeEnable?resWidth:this._fWidth,this._bHeightChangeEnable?resHeight:this._fHeight);
    if (this._bWidthChangeEnable || this._bHeightChangeEnable){
        this.setPositionXY(this.getPosition().x+(leftBoundary),this.getPosition().y+(bottomBoundary));
        for (var i=0;i<this._children.length;i++){
            this._children[i].setPositionXY(this._children[i].getPosition().x-leftBoundary,this._children[i].getPosition().y-bottomBoundary);
        }
    }
};

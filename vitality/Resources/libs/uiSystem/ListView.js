
/**
 * @fileOverview ListView
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var ScrollView = require( 'libs/uiSystem/ScrollView.js' );
var WrapContentPanel = require( 'libs/uiSystem/WrapContentPanel.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description ListView widget
 * @extends ScrollView
 */
var ListView = function(options){
    ScrollView.call( this, options );

    this._nIntervalX = options.intervalX || 0;
    this._nIntervalY = options.intervalY || 0; 
 };

util.inherits(ListView, ScrollView);
module.exports = ListView;

//ListView.prototype.pushItem = function(widget){
//    var needAdjusPosition = false;
//    if (this._innerPanel._fHeight <= this._fHeight){
//        needAdjusPosition = true;
//    }
//    widget.setPositionXY(this.getPushLocationX(widget),this.getPushLocationY(widget));
//    this._innerPanel.addChild(widget);
//    this._fChildrenSizeHeight = this._innerPanel._fHeight;
//    if (needAdjusPosition){
//        this._innerPanel.setPositionXY(this._innerPanel.getPosition().x,this._fHeight-this._innerPanel._fHeight);
//    }
// };
//                             
//ListView.prototype.getPushLocationX = function(widget){
//    if (widget._nWidgetType == 0){
//        return this._innerPanel._fWidth/2;
//    }else{
//        return (-widget.getValidNode().getContentSizeWidth()/2+this._innerPanel._fWidth/2);
//    }
// };
//
//ListView.prototype.getPushLocationY = function(widget){
//    if (this._innerPanel._children.length <= 0){
//        if (widget._nWidgetType == 0){
//            return (this._fHeight-widget.getValidNode().getContentSizeHeight()/2);
//        }else{
//            return (this._fHeight-widget.getValidNode().getContentSizeHeight());
//        }
//    }else{
//        if (widget._nWidgetType == 0){
//            if (this._innerPanel._children[this._innerPanel._children.length-1]._nWidgetType == 0){
//                var lastChildY = this._innerPanel._children[this._innerPanel._children.length-1].getPosition().y;
//                var lastChildHeightHalf = this._innerPanel._children[this._innerPanel._children.length-1].getValidNode().getContentSizeHeight()/2;
//                var widgetHeightHalf = widget.getValidNode().getContentSizeHeight()/2;
//                return (lastChildY-lastChildHeightHalf-widgetHeightHalf);
//            }else{
//                var lastChildY = this._innerPanel._children[this._innerPanel._children.length-1].getPosition().y;
//                var widgetHeightHalf = widget.getValidNode().getContentSizeHeight()/2;
//                return (lastChildY-widgetHeightHalf);
//            }
//        }else{
//            if (this._innerPanel._children[this._innerPanel._children.length-1]._nWidgetType == 0){
//                var lastChildY = this._innerPanel._children[this._innerPanel._children.length-1].getPosition().y;
//                var lastChildHeightHalf = this._innerPanel._children[this._innerPanel._children.length-1].getValidNode().getContentSizeHeight()/2;
//                var widgetHeight = widget.getValidNode().getContentSizeHeight();
//                return (lastChildY-lastChildHeightHalf-widgetHeight);
//            }else{
//                var lastChildY = this._innerPanel._children[this._innerPanel._children.length-1].getPosition().y;
//                var widgetHeight = widget.getValidNode().getContentSizeHeight();
//                return (lastChildY-widgetHeight);
//            }
//        }
//    }
// };


ListView.prototype.addChild = function(widget){

    widget.setPositionXY(this.getPushLocationX(widget),this.getPushLocationY(widget));
    ScrollView.prototype.addChild.call( this, widget );
};
                             
ListView.prototype.getPushLocationX = function(widget){
    
    switch( this._nDirection )
    {
        case 0:
        {
            return this._fWidth/2;
        }break;
        case 1:
        {
             if (this._children.length <= 0){
                return (widget.getValidNode().getContentSizeWidth()/2) + this._nIntervalX;
            }else{

                var lastChildX = this._nRightPos;
                var widgetWidthHalf = widget.getValidNode().getContentSizeWidth()/2;
                log( 'x ' + (lastChildX + widgetWidthHalf + this._nIntervalX) );
                return (lastChildX + widgetWidthHalf + this._nIntervalX);
            }
        }break;
    }
 };

ListView.prototype.getPushLocationY = function(widget){
    
    switch( this._nDirection )
    {
        case 0:
        {
            if (this._children.length <= 0){

                return (this._fHeight-widget.getValidNode().getContentSizeHeight()/2) + this._nIntervalY;
            }else{

                var lastChildY = this._nBottomPos;
                var widgetHeightHalf = widget.getValidNode().getContentSizeHeight()/2;
                log( 'y ' + (lastChildY-widgetHeightHalf + this._nIntervalY) );
                return (lastChildY-widgetHeightHalf + this._nIntervalY);
            }
        }break;
        case 1:
        {
            return this._fHeight/2;
        }break;
    }
 };
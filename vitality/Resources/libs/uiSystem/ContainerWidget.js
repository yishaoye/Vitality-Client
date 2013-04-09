
/**
 * @fileOverview ContainerWidget
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var Widget = require( 'libs/uiSystem/Widget.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description container widget
 * @extends Widget
 */
var ContainerWidget = function(options){
    Widget.call( this, options );
    this._nWidgetType = 1;
        this._fWidth = options.width || 0.0;
        this._fHeight = options.height || 0.0;
    if (this.checkObjectUseable(options.clipAble)){
        this._bClipAble = options.clipAble;
        this._pCContainerNode.setClipAble(this._bClipAble);
    }else{
        this._bClipAble = false;
    }
 };

util.inherits(ContainerWidget, Widget);
module.exports = ContainerWidget;

ContainerWidget.prototype.initNodes = function(){
    this._pCContainerNode = new CRenderNode();
    this._pCContainerNode.initNode( NodeType.NODE_CLIPLAYERCOLOR );
 };
                                
ContainerWidget.prototype.addChild = function(widget){
    Widget.prototype.addChild.call( this, widget );
    if (this._bClipAble){
        widget.setNeedCheckVisibleDepandParent(true);
    }
 };

ContainerWidget.prototype.setClipAble = function(able){
    this._bClipAble = able;
    this._pCContainerNode.setClipAble(able);
 };

ContainerWidget.prototype.setClipRect = function(rect){
    this._pCContainerNode.setClipRect(rect.origin.x,rect.origin.y,rect.size.width,rect.size.height);
 };

ContainerWidget.prototype.updateWidth = function(){

 };

ContainerWidget.prototype.updateHeight = function(){

 };

ContainerWidget.prototype.setColorAndSize = function(r,g,b,o,width,height){
    this._pCContainerNode.setColorAndSize(r,g,b,o,width,height);
    this._fWidth = width;
    this._fHeight = height;
 };
                                
ContainerWidget.prototype.setSize = function(width,height){
    this._pCContainerNode.setSize(width,height);
    this._fWidth = width;
    this._fHeight = height;
};

ContainerWidget.prototype.setWidth = function(width){
    this._fWidth = width;
    this.setSize(this._fWidth,this._fHeight);
};
                                
ContainerWidget.prototype.getWidth = function(){
    return this._fWidth;
};

ContainerWidget.prototype.setHeight = function(height){
    this._fHeight = height;
    this.setSize(this._fWidth,this._fHeight);
};

ContainerWidget.prototype.getHeight = function(){
    return this._fHeight;
};
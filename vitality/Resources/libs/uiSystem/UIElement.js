
/**
 * @fileOverview UIElement
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var UIPoint = require( 'libs/uiSystem/Math.js' ).UIPoint;
var UISize = require( 'libs/uiSystem/Math.js' ).UISize;
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element
 * @extends aBase
 */
var UIElement = function(){
    this._bVisible = true;
    this._nOpacity = 255;
    this._position = new UIPoint();
    this._anchorPoint = new UIPoint();
    this._anchorPoint.x = 0.5;
    this._anchorPoint.y = 0.5;
    this._contentSize = new UISize();
    this._pCRenderNode = null;
    this._pParentWidget = null;
 };

module.exports = UIElement;

UIElement.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_CCNODE );
 };
                         
UIElement.prototype.releaseResoures = function(){

 };

UIElement.prototype.setVisible = function(visible){
    if (this._bVisible == visible){
        return;
    }
    this._bVisible = visible;
    this._pCRenderNode.setVisible(visible);
 };

UIElement.prototype.setScale = function(scale){
    this._pCRenderNode.setScale(scale);
 };

UIElement.prototype.setScaleX = function(scaleX){
    this._pCRenderNode.setScaleX(scaleX);
 };

UIElement.prototype.setScaleY = function(scaleY){
    this._pCRenderNode.setScaleX(scaleY);
 };

UIElement.prototype.setFlipX = function(flipX){
    this._pCRenderNode.setFlipX(flipX);
 };

UIElement.prototype.setFlipY = function(flipY){
    this._pCRenderNode.setFlipY(flipY);
 };

UIElement.prototype.setPosition = function(position){
    this._position.x = position.x;
    this._position.y = position.y;
    this._pCRenderNode.setPositionXY(this._position.x,this._position.y);
 };

UIElement.prototype.setAnchorPoint = function(point){
    this._anchorPoint.x = point.x;
    this._anchorPoint.y = point.y;
    this._pCRenderNode.setAnchorPointXY(this._anchorPoint.x,this._anchorPoint.y);
 };

//to be overrided
UIElement.prototype.getContentSize = function(){
    this._contentSize.width = this._pCRenderNode.getContentSizeWidth();
    this._contentSize.height = this._pCRenderNode.getContentSizeHeight();
    return this._contentSize;
 };

UIElement.prototype.getContentSizeWidth = function(){
    this._contentSize.width = this._pCRenderNode.getContentSizeWidth();
    return this._contentSize.width;
 };

UIElement.prototype.getContentSizeHeight = function(){
    this._contentSize.height = this._pCRenderNode.getContentSizeHeight();
    return this._contentSize.height;
 };

UIElement.prototype.getAnchorPoint = function(){
    return this._anchorPoint;
 };

UIElement.prototype.update = function(dt){

};

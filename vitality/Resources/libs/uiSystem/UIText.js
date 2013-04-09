

/**
 * @fileOverview UIText
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var UIElement = require( 'libs/uiSystem/UIElement.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element of text
 * @extends UIElement
 */
var UIText = function(){
    UIElement.call( this );
};

util.inherits(UIText, UIElement);
module.exports = UIText;

UIText.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_TEXT );
 };

UIText.prototype.setStringValue = function(value){
    this._pCRenderNode.setStringValue(value+"");
 };

UIText.prototype.getStringValue = function(){
    return this._pCRenderNode.getStringValue();
 };
                          
UIText.prototype.getStringLength = function(){
    var str = this.getStringValue();
    return str.length;
 };

UIText.prototype.setTextColor = function(r,g,b){
    this._pCRenderNode.setTextColor(r,g,b);
 };

UIText.prototype.setFontSize = function(size){
    this._pCRenderNode.setFontSize(size);
 };
                          
UIText.prototype.setFontName = function(name){
    this._pCRenderNode.setFontName(name);
};
UIText.prototype.setFlipX = function(flipX){
    this._pCRenderNode.setFlipX(flipX);
 };

UIText.prototype.setFlipY = function(flipY){
    this._pCRenderNode.setFlipY(flipY);
 };


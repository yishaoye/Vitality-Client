

/**
 * @fileOverview UITextArea
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var UIElement = require( 'libs/uiSystem/UIElement.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
/**
 * @author SPII
 * @constructor onCreate
 * @description 
 * @extends UIElement
 */
var UITextArea = function(){
    UIElement.call( this );
};

util.inherits(UITextArea, UIElement);
module.exports = UITextArea;

UITextArea.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_TEXTAREA );
 };
                              
UITextArea.prototype.setStringValue = function(value){
    this._pCRenderNode.setStringValue(value+"");
 };

UITextArea.prototype.getStringValue = function(){
    return this._pCRenderNode.getStringValue();
 };
                              
UITextArea.prototype.getStringLength = function(){
    var str = this.getStringValue();
    return str.length;
 };

UITextArea.prototype.setTextColor = function(r,g,b){
    this._pCRenderNode.setTextColor(r,g,b);
 };

UITextArea.prototype.setFontSize = function(size){
    this._pCRenderNode.setFontSize(size);
 };
                              
UITextArea.prototype.setFontName = function(name){
    this._pCRenderNode.setFontName(name);
}
UITextArea.prototype.setTextAreaSize = function(width,height){
    this._pCRenderNode.setTextAreaSize(width,height);
 };

UITextArea.prototype.setTextHorizontalAlignment = function(alignment){
    this._pCRenderNode.setTextHorizontalAlignment(alignment);
 };

UITextArea.prototype.setTextVerticalAlignment = function(alignment){
    this._pCRenderNode.setTextVerticalAlignment(alignment);
};


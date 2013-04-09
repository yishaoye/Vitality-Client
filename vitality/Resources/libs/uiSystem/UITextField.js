

/**
 * @fileOverview UITextField
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var UIElement = require( 'libs/uiSystem/UIElement.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element of textfield
 * @extends UIElement
 */
var UITextField = function(){
    UIElement.call( this );
};

util.inherits(UITextField, UIElement);
module.exports = UITextField;

UITextField.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_TEXTFIELD );
 };

UITextField.prototype.openIME = function(){
    this._pCRenderNode.openIME();
 };

UITextField.prototype.closeIME = function(){
    this._pCRenderNode.closeIME();
 };

UITextField.prototype.setPlaceHolder = function(value){
    this._pCRenderNode.setPlaceHolder(value);
 };

UITextField.prototype.setStringValue = function(value){
    this._pCRenderNode.setStringValue(value+"");
 };
                               
UITextField.prototype.setSize = function(width,height){
    this._pCRenderNode.setTextFieldSize(width,height);
 };

UITextField.prototype.setTextColor = function(r,g,b){
    this._pCRenderNode.setTextColor(r,g,b);
 };

UITextField.prototype.setFontSize = function(size){
    this._pCRenderNode.setFontSize(size);
 };
UITextField.prototype.setFontName = function(name){
    this._pCRenderNode.setFontName(name);
 };

UITextField.prototype.getStringValue = function(){
    return this._pCRenderNode.getStringValue();
 };


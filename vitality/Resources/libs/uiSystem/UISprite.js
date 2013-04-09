

/**
 * @fileOverview UISprite
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var UIElement = require( 'libs/uiSystem/UIElement.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element of image
 * @extends UIElement
 */
var UISprite = function(){
    UIElement.call( this );
 };

util.inherits(UISprite, UIElement);
module.exports = UISprite;

UISprite.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_CCSPRITE );
 };

UISprite.prototype.loadTexture = function(fileName){
    this._pCRenderNode.setTextureWithFile(fileName);
 };

UISprite.prototype.setRect = function(x,y,w,h){
    this._pCRenderNode.setRect(x,y,w,h);
 };
                            
UISprite.prototype.setFlipX = function(flipX){
    this._pCRenderNode.setFlipX(flipX);
 };

UISprite.prototype.setFlipY = function(flipY){
    this._pCRenderNode.setFlipY(flipY);
 };

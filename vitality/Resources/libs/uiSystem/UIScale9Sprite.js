

/**
 * @fileOverview UIScale9Sprite
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var UIElement = require( 'libs/uiSystem/UIElement.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element of scale9 image
 * @extends UIElement
 */
var UIScale9Sprite = function(){
    UIElement.call( this );
 };

util.inherits(UIScale9Sprite, UIElement);
module.exports = UIScale9Sprite;

UIScale9Sprite.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_SCALE9SPRITE );
 };

UIScale9Sprite.prototype.loadTexture = function(fileName,x,y,w,h){
    if (x < 0 || y < 0 || w < 0 || h < 0){
        x = 0;
        y = 0;
        w = 0;
        h = 0;
    }
    this._pCRenderNode.setScale9FileAndCapInsets(fileName,x,y,w,h);
 };

UIScale9Sprite.prototype.setScaleSize = function(width,height){
    this._pCRenderNode.setScale9Size(width,height);
}

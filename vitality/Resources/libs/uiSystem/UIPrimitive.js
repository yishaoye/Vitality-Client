

/**
 * @fileOverview UIPrimitive
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var UIElement = require( 'libs/uiSystem/UIElement.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the render element of primitive
 * @extends UIElement
 */
var UIPrimitive = function(){
    UIElement.call( this );
 };

util.inherits(UIPrimitive, UIElement);
module.exports = UIPrimitive;    

UIPrimitive.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_CCSPRITE );
};
    

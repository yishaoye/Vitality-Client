

/**
 * @fileOverview UILabelAtlas
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var NodeType = require( 'libs/uiSystem/NodeType.js' ).NodeType;
var UIElement = require( 'libs/uiSystem/UIElement.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description label atlas
 * @extends UIElement
 */
var UILabelAtlas = function(){
    UIElement.call( this );
};

util.inherits(UILabelAtlas, UIElement);
module.exports = UILabelAtlas; 

UILabelAtlas.prototype.init = function(){
    this._pCRenderNode = new CRenderNode();
    this._pCRenderNode.initNode( NodeType.NODE_LABELATLAS );
 };

UILabelAtlas.prototype.setProperty = function(stringValue, charMapFile, itemWidth, itemHeight, startCharMap){
    this._pCRenderNode.setLabelAtlasProperty(stringValue, charMapFile, itemWidth, itemHeight, startCharMap);
        this._pCRenderNode.setAnchorPointXY(0.5,0.25);
 };

UILabelAtlas.prototype.setStringValue = function(value){
    this._pCRenderNode.setStringValue(value+"");
};

UILabelAtlas.prototype.getStringValue = function() {
    return this._pCRenderNode.getStringValue();
};



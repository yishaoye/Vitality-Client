
/**
 * @fileOverview LabelAtlas
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UILabelAtlas = require( 'libs/uiSystem/UILabelAtlas.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description LabelAtlas widget
 * @extends Widget
 */
var LabelAtlas = function(options){
    Widget.call( this, options );
    this.uiLabelAtlas = new UILabelAtlas();
    this.uiLabelAtlas.init();
    this.addUIElement(this.uiLabelAtlas);
    this.uiLabelAtlas.setProperty(options.stringValue, options.charMapFile, options.itemWidth, options.itemHeight, options.startCharMap);
 };

util.inherits(LabelAtlas, Widget);
module.exports = LabelAtlas;

//to be overrideed
LabelAtlas.prototype.onTouchPressed = function(touchePoint){
    Widget.prototype.onTouchPressed.call( this, touchePoint );
 };

LabelAtlas.prototype.onTouchMoved = function(touchePoint){
    Widget.prototype.onTouchMoved.call( this, touchePoint );
 };

LabelAtlas.prototype.onTouchReleased = function(touchePoint){
    Widget.prototype.onTouchReleased.call( this, touchePoint );
 };

LabelAtlason.prototype.TouchCanceled = function(touchePoint){
    Widget.prototype.TouchCanceled.call( this, touchePoint );
 };

LabelAtlas.prototype.onPressStateChangedToNormal = function(){

 };

LabelAtlas.prototype.onPressStateChangedToPressed = function(){

 };

LabelAtlas.prototype.onPressStateChangedToDisabled = function(){

 };

LabelAtlas.prototype.setStringValue = function(value){
    this.uiLabelAtlas.setStringValue(value);
 };
LabelAtlas.prototype.getStringValue = function() {
    return this.uiLabelAtlas.getStringValue();
};

LabelAtlas.prototype.getValidNode = function(){
    return this.uiLabelAtlas;
};


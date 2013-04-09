
/**
 * @fileOverview Label
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UIText = require( 'libs/uiSystem/UIText.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description Label widget
 * @extends Widget
 */
var Label = function(options){
    Widget.call( this, options );

    
    this._pTextLable = new UIText();
    this._pTextLable.init();
    
    this._nGravity = options.gravity || 0;

    switch (this._nGravity){
        case 0:
        this._pTextLable.setAnchorPoint({x:0.5,y:0.5});
        break;
        case 1:
        this._pTextLable.setAnchorPoint({x:0.0,y:0.5});
        break;
        case 2:
        this._pTextLable.setAnchorPoint({x:1.0,y:0.5});
        break;
    }

    this._bTouchScaleChangeAble = options.touchSacleEnable || false;
    this._fOnSelectedScaleOffset = options.scaleOffset || 0.5;

    this._text = options.text || 'label';
    this.setText(options.text);

    this._nFontSize = options.fontSize || 20;
    this.setFontSize( this._nFontSize );

    this._sFontName = options.fontName || "宋体";
    this.setFontName( this._sFontName );

    this.setTextColor( this._nColorR, this._nColorG, this._nColorB );
                      
    if ( options.flipX ){
        this.setFlipX(options.flipX);
    }
    if ( options.flipY ){
        this.setFlipY(options.flipY);
    }

    this.addUIElement(this._pTextLable);
    this.setPressState(0);
 };

util.inherits(Label, Widget);
module.exports = Label;

Label.prototype.setText = function(text){
    this._pTextLable.setStringValue(text);
 };

Label.prototype.getStringValue = function(){
    return this._pTextLable.getStringValue();
 };
                      
Label.prototype.getStringLength = function(){
    return this._pTextLable.getStringLength();
 };

Label.prototype.setTextColor = function(r,g,b){
    this._pTextLable.setTextColor(r,g,b);
 };

Label.prototype.setFontSize = function(size){
    this._pTextLable.setFontSize(size);
 };
Label.prototype.setFontName = function(name) {
    this._pTextLable.setFontName(name);
};

Label.prototype.setTouchScaleChangeAble = function(able){
    this._bTouchScaleChangeAble = able;
 };
Label.prototype.getTouchScaleChangeAble = function(){
    return this._bTouchScaleChangeAble;
};

//to be overrideed
Label.prototype.onTouchPressed = function(touchePoint){
    Widget.prototype.onTouchPressed.call( this, touchePoint );
 };

Label.prototype.onTouchMoved = function(touchePoint){
    Widget.prototype.onTouchMoved.call( this, touchePoint );
 };

Label.prototype.onTouchReleased = function(touchePoint){
    Widget.prototype.onTouchReleased.call( this, touchePoint );
 };

Label.prototype.onTouchCanceled = function(touchePoint){
    Widget.prototype.onTouchCanceled.call( this, touchePoint );
 };

Label.prototype.onPressStateChangedToNormal = function(){
    if (!this._bTouchScaleChangeAble){
        return;
    }
    this.clickScale(this._fScale);
 };

Label.prototype.onPressStateChangedToPressed = function(){
    if (!this._bTouchScaleChangeAble){
        return;
    }
    this.clickScale(this._fScale + this._fOnSelectedScaleOffset)
 };

Label.prototype.onPressStateChangedToDisabled = function(){

 };

Label.prototype.clickScale = function(scale){
    this._pCContainerNode.setScale(scale);
 };

Label.prototype.getValidNode = function(){
    return this._pTextLable;
 };

Label.prototype.setFlipX = function(flipX){
    Widget.prototype.setFlipX.call(this,flipX);
    this._pTextLable.setFlipX(flipX);
 };

Label.prototype.setFlipY = function(flipY){
    Widget.prototype.setFlipY.call(this,flipY);
    this._pTextLable.setFlipY(flipY);
 };

 //editor
 Label.prototype.getFontName = function(){
    return this._sFontName;
 };

 Label.prototype.getFontSize = function(){
    return this._nFontSize;
 };

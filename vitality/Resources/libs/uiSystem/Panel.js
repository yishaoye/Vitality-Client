
/**
 * @fileOverview Panel
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var UIPointMake = require( 'libs/uiSystem/Math.js' ).UIPointMake;
var ContainerWidget = require( 'libs/uiSystem/ContainerWidget.js' );
var UIScale9Sprite = require( 'libs/uiSystem/UIScale9Sprite.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description Panel widget
 * @extends Widget
 */
 var Panel = function(options){
    ContainerWidget.call( this, options );
    
    this._bBackGroundScale9Enable = options.backGroundScale9Enable || false;

    var newClassName = this._bBackGroundScale9Enable?UIScale9Sprite:UISprite;
    this._pBackGroundImage = new newClassName();
    this._pBackGroundImage.init();
    this.addUIElement(this._pBackGroundImage);

    this.setColorAndSize( this._nColorR, this._nColorG, this._nColorB, this._nColorO, this._fWidth, this._fHeight );
    this._sBackGroundImageFileName = '';
    if ( options.backGroundImage ){
        if (this._bBackGroundScale9Enable){
            var cx = options.capInsetsX || 0;
            var cy = options.capInsetsY || 0;
            var cw = options.capInsetsWidth || 0;
            var ch = options.capInsetsHeight || 0;
            this._sBackGroundImageFileName = options.backGroundImage;
            this._pBackGroundImage.loadTexture(options.backGroundImage,cx,cy,cw,ch);
        }else{
            this._sBackGroundImageFileName = options.backGroundImage;
            this.setBackGroundImage(options.backGroundImage);
        }
    }
    this._pBackGroundImage.setPosition(UIPointMake(this._pCContainerNode.getContentSizeWidth()/2,this._pCContainerNode.getContentSizeHeight()/2));
    if (this._bBackGroundScale9Enable){
        this._pBackGroundImage.setScaleSize( this._fWidth, this._fHeight );
    }
 };

util.inherits(Panel, ContainerWidget);
module.exports = Panel;

Panel.prototype.setBackGroundImage = function(fileName){
    if (!this.checkObjectUseable(fileName)){
        return;
    }
        this._sBackGroundImageFileName = fileName;
    this._pBackGroundImage.loadTexture(fileName);
 };
Panel.prototype.etBackGroundImageFileName = function(){
    return this._sBackGroundImageFileName;
};

//to be overrideed
Panel.prototype.onTouchPressed = function(touchPoint){
    ContainerWidget.prototype.onTouchPressed.call( this, touchPoint );
 };

Panel.prototype.onTouchMoved = function(touchPoint){
    ContainerWidget.prototype.onTouchMoved.call( this, touchPoint );
 };

Panel.prototype.onTouchReleased = function(touchPoint){
    ContainerWidget.prototype.onTouchReleased.call( this, touchPoint );
 };

Panel.prototype.onTouchCanceled = function(touchPoint){
    ContainerWidget.prototype.onTouchCanceled.call( this, touchPoint );
 };

Panel.prototype.onPressStateChangedToNormal = function(){

 };

Panel.prototype.onPressStateChangedToPressed = function(){

 };

Panel.prototype.onPressStateChangedToDisabled = function(){

};


/**
 * @fileOverview LoadingBar
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );
var UIPointMake = require( 'libs/uiSystem/Math.js' ).UIPointMake;
/**
 * @author SPII
 * @constructor onCreate
 * @description LoadingBar widget
 * @extends Widget
 */
var LoadingBar = function(options){
    Widget.call( this, options );
    this._nBarType = 0;//0 1
    this._nPercent = 100;
    this._fTotalLength = 0;
    this._fBarHeight = 0;
        this._sTextureFileName = '';
    this._pRenderBar = new UISprite();
    this._pRenderBar.init();
    this.addUIElement(this._pRenderBar);

    if (this.checkObjectUseable(options.direction)){
        this._nBarType = options.direction;
    }
    if (this.checkObjectUseable(options.texture)){
            this._sTextureFileName = options.texture;
        this.setTexture(options.texture);
    }else{
    }
    if (this.checkObjectUseable(options.percent)){
        this.setPercent(options.percent);
    }else{
        this.setPercent(0);
    }

    this.setPressState(0);
 };

util.inherits(LoadingBar, Widget);
module.exports = LoadingBar;

LoadingBar.prototype.setDirection = function(dir){
    this._nBarType = dir;
};

LoadingBar.prototype.getDirection = function(){
    return this._nBarType;
};
    
LoadingBar.prototype.setTexture = function(texture){
    this._pRenderBar.loadTexture(texture);
    this._fTotalLength = this._pRenderBar.getContentSize().width;
    this._fBarHeight = this._pRenderBar.getContentSize().height;
    switch (this._nBarType){
        case 0:
        this._pRenderBar.setAnchorPoint(UIPointMake(0.0,0.5));
        break;
        case 1:
        this._pRenderBar.setAnchorPoint(UIPointMake(1.0,0.5));
        break;
    }
 };
 LoadingBar.prototype.getTextureFileName = function(){
    return this._sTextureFileName;
 };

LoadingBar.prototype.setPercent = function(percent){
    if (this._nPercent == percent || percent < 0 || percent > 100){
        return;
    }
    if (this._fTotalLength <= 0){
        return;
    }
    this._nPercent = percent;
    var res = this._nPercent/100;
    switch (this._nBarType){
    case 0:
        this._pRenderBar.setRect(0,0,this._fTotalLength*res,this._fBarHeight);
    break;
    case 1:
        this._pRenderBar.setRect(this._fTotalLength*(1-res),0,this._fTotalLength*res,this._fBarHeight);
    break;
    }
 };

    //to be overrideed
LoadingBar.prototype.onTouchPressed = function(touchePoint){
    Widget.prototype.onTouchPressed.call( this, touchePoint );
 };

LoadingBar.prototype.onTouchMoved = function(touchePoint){
    Widget.prototype.onTouchMoved.call( this, touchePoint );
 };

LoadingBar.prototype.onTouchReleased = function(touchePoint){
    Widget.prototype.onTouchReleased.call( this, touchePoint );
 };

LoadingBar.prototype.TouchCanceled = function(touchePoint){
    Widget.prototype.TouchCanceled.call( this, touchePoint );
 };

LoadingBar.prototype.getValidNode = function(){
    return this._pRenderBar;
 };


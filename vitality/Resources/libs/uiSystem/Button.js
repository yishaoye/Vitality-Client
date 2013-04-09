
/**
 * @fileOverview Button
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UIScale9Sprite = require( 'libs/uiSystem/UIScale9Sprite.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );

/**
 * @author SPII
 * @constructor onCreate
 * @description button widget
 * @extends Widget
 */
var Button = function(options){
    Widget.call( this, options );

    //button create
    this._pButtonNormal = null;
    this._pButtonClicked = null;
    this._pButtonDisable = null;
    this.normalFileName = options.normal;
    this.pressedFileName = options.pressed;
    this.disabledFileName = options.disabled;
    this._bScale9Enable = options.scale9Enable || false;


    //initNodes
    var cx = options.capInsetsX || 0;
    var cy = options.capInsetsY || 0;
    var cw = options.capInsetsWidth || 0;
    var ch = options.capInsetsHeight || 0;
    var newClassName = this._bScale9Enable?UIScale9Sprite:UISprite;

    this._pButtonNormal = new newClassName();
    this._pButtonNormal.init();
    this._pButtonNormal.loadTexture(this.normalFileName,cx,cy,cw,ch);



    this._pButtonClicked = new newClassName();
    this._pButtonClicked.init();
    this._pButtonClicked.loadTexture(this.pressedFileName,cx,cy,cw,ch);
    

    this._pButtonDisable = new newClassName();
    this._pButtonDisable.init();
    this._pButtonDisable.loadTexture(this.disabledFileName,cx,cy,cw,ch);
                       
    if (this._bScale9Enable && options.scale9Width && options.scale9Height)
    {
        this._pButtonNormal.setScaleSize(options.scale9Width,options.scale9Height);
        this._pButtonSelected.setScaleSize(options.scale9Width,options.scale9Height);
        this._pButtonDisable.setScaleSize(options.scale9Width,options.scale9Height);
    }
                       
    if ( options.flipX ){
        this.setFlipX(options.flipX);
    }
    if ( options.flipY ){
        this.setFlipY(options.flipY);
    }
                       
    this.addUIElement(this._pButtonNormal);
    this.addUIElement(this._pButtonClicked);
    this.addUIElement(this._pButtonDisable);
    this.setPressState(0);
 };

util.inherits(Button, Widget);
module.exports = Button;

Button.prototype.setTextures = function(normal,selected,disabled){
    this.setNormalTexture(normal);
    this.setPressedTexture(selected);
    this.setDisabledTexture(disabled);
},
                       
Button.prototype.setNormalTexture = function(normal){
    this.normalFileName = normal;
    this._pButtonNormal.loadTexture(normal);
};

Button.prototype.setPressedTexture = function(pressed){
    this.pressedFileName = pressed;
    this._pButtonClicked.loadTexture(pressed);
};

Button.prototype.setDisabledTexture = function(disabled){
    this.disabledFileName = disabled;
    this._pButtonDisable.loadTexture(disabled);
};

//to be overrideed
Button.prototype.onTouchPressed = function(touchPoint){
    Widget.prototype.onTouchPressed.call(this, touchPoint);
 };

Button.prototype.onTouchMoved = function(touchPoint){
    Widget.prototype.onTouchMoved.call(this, touchPoint);
 };

Button.prototype.onTouchReleased = function(touchPoint){
    Widget.prototype.onTouchReleased.call(this, touchPoint);
 };

Button.prototype.onTouchCanceled = function(touchPoint){
    Widget.prototype.onTouchCanceled.call(this, touchPoint);
 };

Button.prototype.onPressStateChangedToNormal = function(){
    this._pButtonNormal.setVisible(true);
    this._pButtonClicked.setVisible(false);
    this._pButtonDisable.setVisible(false);
 };

Button.prototype.onPressStateChangedToPressed = function(){
    this._pButtonNormal.setVisible(false);
    this._pButtonClicked.setVisible(true);
    this._pButtonDisable.setVisible(false);
 };

Button.prototype.onPressStateChangedToDisabled = function(){
    this._pButtonNormal.setVisible(false);
    this._pButtonClicked.setVisible(false);
    this._pButtonDisable.setVisible(true);
 };

Button.prototype.getValidNode = function(){
    var validNode = null;
    switch (this._nCurPressState){
        case 0:
        validNode = this._pButtonNormal;
        break;
        case 1:
        validNode = this._pButtonClicked;
        break;
        case 2:
        validNode = this._pButtonDisable;
        break;
    }
    return validNode;
 };

Button.prototype.update = function(dt){
    Widget.prototype.update.call(this, dt);
 };
                       
Button.prototype.setFlipX = function(flipX){
    Widget.prototype.setFlipX(this, flipX);
    this._pButtonNormal.setFlipX(flipX);
    this._pButtonClicked.setFlipX(flipX);
    this._pButtonDisable.setFlipX(flipX);
 };

Button.prototype.setFlipY = function(flipY){
    Widget.prototype.setFlipY(this, flipY);
    this._pButtonNormal.setFlipY(flipY);
    this._pButtonClicked.setFlipY(flipY);
    this._pButtonDisable.setFlipY(flipY);
 };

//editor
Button.prototype.getNormalTextureFileName = function(){
    return this.normalFileName;
};

Button.prototype.getPressedTextureFileName = function(){
    return this.pressedFileName;
};

Button.prototype.getDisabledTextureFileName = function(){
    return this.disabledFileName;
};


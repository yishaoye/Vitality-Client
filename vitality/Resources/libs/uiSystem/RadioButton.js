/**
 * @fileOverview RadioButton
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
 * @description RadioButton widget
 * @extends Widget
 */

 var RadioButton = function(options){
    Widget.call( this, options );

    //radioButton create
    this._pButtonNormal = null;
    this._pButtonClicked = null;
    this._pButtonSelected = null;
    this._pButtonDisable = null;
    this.normalFileName = options.normal;
    this.pressedFileName = options.pressed;
    this.selectedFileName = options.selected;
    this.disabledFileName = options.disabled;
    this._bIsSelected = true;
    this._offset = {};
    this._offset.x = options.offsetX || 0;
    this._offset.y = options.offsetY || 0;

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



    this._pButtonSelected = new newClassName();
    this._pButtonSelected.init();
    this._pButtonSelected.loadTexture(this.selectedFileName,cx,cy,cw,ch);
    

    this._pButtonDisable = new newClassName();
    this._pButtonDisable.init();
    this._pButtonDisable.loadTexture(this.disabledFileName,cx,cy,cw,ch);

    if( this.pressedFileName )
    {
        this._pButtonClicked = new newClassName();
        this._pButtonClicked.init();
        this._pButtonClicked.loadTexture(this.pressedFileName,cx,cy,cw,ch);   
    }
                       
    if (this._bScale9Enable && options.scale9Width && options.scale9Height)
    {
        this._pButtonNormal.setScaleSize(options.scale9Width,options.scale9Height);
        this._pButtonSelected.setScaleSize(options.scale9Width,options.scale9Height);
        this._pButtonDisable.setScaleSize(options.scale9Width,options.scale9Height);
        if( this._pButtonClicked )
        {
            this._pButtonClicked.setScaleSize(options.scale9Width,options.scale9Height);
        }
    }

    this.addUIElement(this._pButtonNormal);
    this.addUIElement(this._pButtonSelected);
    this.addUIElement(this._pButtonDisable);
    if( this._pButtonClicked )
    {
        this.addUIElement(this._pButtonClicked);
    }
    this.setPressState(0);
    this.setSelectedState( false );
 };

util.inherits(RadioButton, Widget);
module.exports = RadioButton;

RadioButton.prototype.setTextures = function(normal,selected,disabled,pressed){
    this.setNormalTexture(normal);
    this.setSelectedTexture(selected);
    this.setDisabledTexture(disabled);
    if( pressed )
    {
        this.setPressedTexture(pressed);
    }
},
                       
RadioButton.prototype.setNormalTexture = function(normal){
    this.normalFileName = normal;
    this._pButtonNormal.loadTexture(normal);
};

RadioButton.prototype.setSelectedTexture = function(selected){
    this.selectedFileName = selected;
    this._pButtonSelected.loadTexture(selected);
};

RadioButton.prototype.setPressedTexture = function(pressed){
    this.pressedFileName = pressed;
    if( this._pButtonClicked )
    {
        this._pButtonClicked.loadTexture(pressed);
    }
};

RadioButton.prototype.setDisabledTexture = function(disabled){
    this.disabledFileName = disabled;
    this._pButtonDisable.loadTexture(disabled);
};

RadioButton.prototype.onTouchPressed = function(touchPoint){
    Widget.prototype.onTouchPressed.call(this, touchPoint);
 };

RadioButton.prototype.onTouchMoved = function(touchPoint){
    Widget.prototype.onTouchMoved.call(this, touchPoint);
 };

RadioButton.prototype.onTouchReleased = function(touchPoint){
    if (this._bFocus){
        this.releaseUpEvent();
        this.setSelectedState(true);
    }
    this.setBeFocus(false);
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(2,this,touchPoint);
    }
 };

RadioButton.prototype.onTouchCanceled = function(touchPoint){
    Widget.prototype.onTouchCanceled.call(this, touchPoint);
 };

RadioButton.prototype.onPressStateChangedToNormal = function(){
    if( this._pButtonClicked )
    {
        this._pButtonClicked.setVisible(false);
    }
    this._pButtonDisable.setVisible(false);
 };

RadioButton.prototype.onPressStateChangedToPressed = function(){
    if( this._pButtonClicked )
    {
        this._pButtonClicked.setVisible(true);
    }
    this._pButtonDisable.setVisible(false);
 };

RadioButton.prototype.onPressStateChangedToDisabled = function(){
    this._pButtonNormal.setVisible(false);
    this._pButtonSelected.setVisible(false);
    if( this._pButtonClicked )
    {
        this._pButtonClicked.setVisible(false);
    }
    this._pButtonDisable.setVisible(true);
 };

RadioButton.prototype.setSelectedState = function(selected){
    if (selected == this._bIsSelected){
        return;
    }
    this._bIsSelected = selected;
    if( this._bIsSelected )
    {
        this._pButtonNormal.setVisible(false);
        this._pButtonSelected.setVisible(true);
        this.setPosition( {x: this._position.x + this._offset.x, y: this._position.y + this._offset.y} );
        if( this._pParent && ( typeof this._pParent.onSelectedRadio === 'function' ) )
        {
            this._pParent.onSelectedRadio( this );
        }
    }
    else
    {
        this._pButtonNormal.setVisible(true);
        this._pButtonSelected.setVisible(false);
        this.setPosition( {x: this._position.x - this._offset.x, y: this._position.y - this._offset.y} );
    }
};

RadioButton.prototype.getSelectedState = function(){
    return this._bIsSelected;
};;

RadioButton.prototype.getValidNode = function(){
    var validNode = null;
    switch (this._nCurPressState){
        case 0:
        case 1:
        validNode = this._bIsSelected ? this._pButtonSelected : this._pButtonNormal;
        break;
        case 2:
        validNode = this._pButtonDisable;
        break;
    }
    return validNode;
 };

RadioButton.prototype.update = function(dt){
    Widget.prototype.update.call(this, dt);
 };

//editor
RadioButton.prototype.getNormalTextureFileName = function(){
    return this.normalFileName;
};

RadioButton.prototype.getPressedTextureFileName = function(){
    return this.pressedFileName;
};

RadioButton.prototype.getDisabledTextureFileName = function(){
    return this.disabledFileName;
};
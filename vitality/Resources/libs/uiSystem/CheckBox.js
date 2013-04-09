
/**
 * @fileOverview CheckBox
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description CheckBox widget
 * @extends Widget
 */
var CheckBox = function(options){
    Widget.call( this, options );

    this._pBackGroundBox = null;
    this._pBackGroundSelectedBox = null;
    this._pFrontCross = null;
    this._bIsSelected = options.state || false;
    
    //Events
    if( options.scriptJS ){
        this.events = {
            onSelected: options.scriptJS[options.onSelected] , 
            onUnSelected: options.scriptJS[options.onUnSelected]
        };
    }
    else{
        this.events = {};
    }

    this.backGroundBoxImageFileName = options.backGroundBox;
    this.backGroundSelectedBoxFileName = options.backGroundBoxSelected;
    this.frontCrossImageFileName = options.frontCross;

    this._pBackGroundBox = new UISprite();
    this._pBackGroundBox.init();
    this._pBackGroundBox.loadTexture( this.backGroundBoxImageFileName );

    this._pBackGroundSelectedBox = new UISprite();
    this._pBackGroundSelectedBox.init();
    this._pBackGroundSelectedBox.loadTexture(this.backGroundSelectedBoxFileName);

    this._pFrontCross = new UISprite();
    this._pFrontCross.init();
    this._pFrontCross.loadTexture(this.frontCrossImageFileName);

    this.addUIElement(this._pBackGroundBox);
    this.addUIElement(this._pBackGroundSelectedBox);
    this.addUIElement(this._pFrontCross);
    this.setPressState(0);
    this.setSelectedState( this._bIsSelected );
 };

util.inherits(CheckBox, Widget);
module.exports = CheckBox;

CheckBox.prototype.setTextures = function(backGround,backGroundSelected,cross){
    this.setBackGroundTexture(backGround);
    this.setBackGroundSelectedTexture(backGroundSelected);
    this.setFrontCrossTexture(cross);
};
                         
CheckBox.prototype.setBackGroundTexture = function(backGround){
    this.backGroundBoxImageFileName = backGround;
    this._pBackGroundBox.loadTexture(backGround);
};
                         
CheckBox.prototype.setBackGroundSelectedTexture = function(backGroundSelected){
    this.backGroundSelectedBoxFileName = backGroundSelected;
    this._pBackGroundSelectedBox.loadTexture(backGroundSelected);
};
                         
CheckBox.prototype.setFrontCrossTexture = function(cross){
    this.frontCrossImageFileName = cross;
    this._pFrontCross.loadTexture(cross);
};
                         
CheckBox.prototype.getBackGroundTextureFileName = function(){
    return this.backGroundBoxImageFileName;
};

CheckBox.prototype.getBackGroundSelectTextureFileName = function(){
    return this.backGroundSelectedBoxFileName;
};

CheckBox.prototype.getFrontCrossTextureFileName = function(){
    return this.frontCrossImageFileName;
};

//to be overrideed
CheckBox.prototype.onTouchPressed = function(touchPoint){
    Widget.prototype.onTouchPressed.call( this, touchPoint );
 };

CheckBox.prototype.onTouchMoved = function(touchPoint){
    Widget.prototype.onTouchMoved.call( this, touchPoint );
 };

CheckBox.prototype.onTouchReleased = function(touchPoint){
    if (this._bFocus){
        this.releaseUpEvent();
        if (this._bIsSelected){
            this.setSelectedState(false);
            this.unSelectedEvent();
        }else{
            this.setSelectedState(true);
            this.selectedEvent();
        }
    }
    this.setBeFocus(false);
    if (this.checkObjectUseable(this._pParent)){
        this._pParent.checkChildInfo(2,this,touchPoint);
    }
 };

CheckBox.prototype.onTouchCanceled = function(touchPoint){
    Widget.prototype.onTouchCanceled.call( this, touchPoint );
 };

CheckBox.prototype.onPressStateChangedToNormal = function(){
    this._pBackGroundBox.setVisible(true);
    this._pBackGroundSelectedBox.setVisible(false);
 };

CheckBox.prototype.onPressStateChangedToPressed = function(){
    this._pBackGroundBox.setVisible(false);
    this._pBackGroundSelectedBox.setVisible(true);
 };

CheckBox.prototype.onPressStateChangedToDisabled = function(){
    this._pBackGroundBox.setVisible(true);
    this._pBackGroundSelectedBox.setVisible(false);
 };

CheckBox.prototype.setSelectedState = function(selected){
    if (selected == this._bIsSelected){
        return;
    }
    this._bIsSelected = selected;
    this._pFrontCross.setVisible(this._bIsSelected);
 };

CheckBox.prototype.getSelectedState = function(){
    return this._bIsSelected;
};

CheckBox.prototype.selectedEvent = function(){
    if (this.checkObjectUseable(this.events['onSelected'])){
        this.events['onSelected'].apply(this,[this]);
    }
 };

CheckBox.prototype.unSelectedEvent = function(){
    if (this.checkObjectUseable(this.events['onUnSelected'])){
        this.events['onUnSelected'].apply(this,[this]);
    }
 };

CheckBox.prototype.getRect = function(){
    this.obtainRect(this._pBackGroundSelectedBox,0);
    return this._rect;
 };

CheckBox.prototype.getRelativeRect = function(){
    this.obtainRect(this._pBackGroundSelectedBox,1);
    return this._relativeRect;
};


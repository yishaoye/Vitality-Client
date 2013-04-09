
/**
 * @fileOverview TextField
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UITextField = require( 'libs/uiSystem/UITextField.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description TextField widget
 * @extends Widget
 */
var TextField = function(options){
    Widget.call( this, options );
    this.uiTextField = new UITextField();
    this.uiTextField.init();
    this.addUIElement(this.uiTextField);
    if (this.checkObjectUseable(options.placeHolder)){
        this.uiTextField.setPlaceHolder(options.placeHolder);
    }
    if (this.checkObjectUseable(options.text)){
        this.setText(options.text);
    }else{
        this.setText('');
    }
        this._sFontName = '';
        this._nFontSize = 10;
        if (this.checkObjectUseable(options.fontSize)){
            this.setFontSize(options.fontSize);
        }
        if (this.checkObjectUseable(options.fontName)){
            this.setFontName(options.fontName);
        }
                          
    this._fTouchWidth = 0;
    this._fTouchHeight = 0;
    this._bUseTouchArea = false;
    if (this.checkObjectUseable(options.touchSizeWidth) && this.checkObjectUseable(options.touchSizeHeight)){
        this.setTouchSize(options.touchSizeWidth,options.touchSizeHeight);
    }
                          
    var cr = (this.checkObjectUseable(options.colorR))?options.colorR:0;
    var cg = (this.checkObjectUseable(options.colorG))?options.colorG:0;
    var cb = (this.checkObjectUseable(options.colorB))?options.colorB:0;
    this.uiTextField.setTextColor(cr,cg,cb);
                          
    if (this.checkObjectUseable(options.onOpenIME)){
        this.events.onOpenIME = options.onOpenIME;
    }

    if (this.checkObjectUseable(options.onCloseIME)){
        this.events.onCloseIME = options.onCloseIME;
    }
 };

util.inherits(TextField, Widget);
module.exports = TextField;

TextField.prototype.setTouchSize = function(width,height){
    this.setWidth(width);
    this.setHeight(height);
 };
 
TextField.prototype.setWidth = function(width){
    this._bUseTouchArea = true;
    this._fTouchWidth = width;
};
//virtual
TextField.prototype.getWidth = function(){
    return this._fTouchWidth;
};
//virtual
TextField.prototype.setHeight = function(height){
    this._bUseTouchArea = true;
    this._fTouchHeight = height;
};

//virtual
TextField.prototype.getHeight = function(){
    return this._fTouchHeight;
};
                         
TextField.prototype.setText = function(text){
    this.uiTextField.setStringValue(text);
 };
                          
TextField.prototype.setSize = function(width,height){
    this.uiTextField.setSize(width,height);
 };

TextField.prototype.setFontSize = function(size){
    this._nFontSize = size;
    this.uiTextField.setFontSize(this._nFontSize);
};
                          
TextField.prototype.getFontSize = function(){
    return this._nFontSize;
};
                          
TextField.prototype.setFontName = function(name){
    this._sFontName = name;
    this.uiTextField.setFontName(name);
};
                          
TextField.prototype.getFontName = function(){
    return this._sFontName;
};
    
TextField.prototype.didNotSelectSelf = function(){
    this.uiTextField.closeIME();
    if (this.checkObjectUseable(this.events['onCloseIME'])){
        this.events['onCloseIME'].apply(this,[this]);
    }
 };

TextField.prototype.getStringValue = function(){
    return this.uiTextField.getStringValue();
 };

//to be overrideed
TextField.prototype.onTouchPressed = function(touchePoint){
    Widget.prototype.onTouchPressed.call( this, touchePoint );
    this.uiTextField.openIME();
    if (this.checkObjectUseable(this.events['onOpenIME'])){
        this.events['onOpenIME'].apply(this,[this]);
    }
};

TextField.prototype.onTouchMoved = function(touchePoint){
    Widget.prototype.onTouchMoved.call( this, touchePoint );
};

TextField.prototype.onTouchReleased = function(touchePoint){
    Widget.prototype.onTouchReleased.call( this, touchePoint );
};

TextField.prototype.onTouchCanceled = function(touchePoint){
    Widget.prototype.onTouchCanceled.call( this, touchePoint );
};

TextField.prototype.onPressStateChangedToNormal = function(){

};

TextField.prototype.onPressStateChangedToPressed = function(){

 };

TextField.prototype.onPressStateChangedToDisabled = function(){

};
                          
TextField.prototype.pointAtSelfBody = function(x,y){
    if (!this._bUseTouchArea){
        return Widget.prototype.pointAtSelfBody.call( this, x,y );
    }
    var parent = this;
    while (parent != 0){
        if (!parent._bVisible){
            return false;
        }
        parent = parent.getParent();
    }
    var rect = {
            origin:{
                x:this.getPosition().x-this._fTouchWidth/2,
                y:this.getPosition().y-this._fTouchHeight/2
            },
            size:{
                width:this._fTouchWidth,
                height:this._fTouchHeight
            }
        };
    var bRet = false;
    if (x >= rect.origin.x && x <= rect.origin.x+rect.size.width && y >= rect.origin.y && y <= rect.origin.y +rect.size.height){
        bRet = true;
    }
    return bRet;
};

TextField.prototype.getValidNode = function(){
    return this.uiTextField;
};

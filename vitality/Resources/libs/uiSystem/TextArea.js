
/**
 * @fileOverview TextArea
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UITextArea = require( 'libs/uiSystem/UITextArea.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description 
 * @extends Widget
 */
var TextArea = function(options){
    Widget.call( this, options );
    this._pArea = new UITextArea();
    this._pArea.init();
    this.addUIElement(this._pArea);
    if (this.checkObjectUseable(options.text)){
        this.setText(options.text);
    }
    if (this.checkObjectUseable(options.fontSize)){
        this.setFontSize(options.fontSize);
        }
        if (this.checkObjectUseable(options.fontName))
        {
            this.setFontName(options.fontName);
        }
    var cr = (this.checkObjectUseable(options.colorR))?options.colorR:0;
    var cg = (this.checkObjectUseable(options.colorG))?options.colorG:0;
    var cb = (this.checkObjectUseable(options.colorB))?options.colorB:0;
    this.setTextColor(cr,cg,cb);
    if (this.checkObjectUseable(options.areaWidth) && this.checkObjectUseable(options.areaHeight)){
        this.setTextAreaSize(options.areaWidth,options.areaHeight);
    }
    if (this.checkObjectUseable(options.hAlignment)){
        this.setTextHorizontalAlignment(options.hAlignment);
    }
    if (this.checkObjectUseable(options.vAlignment)){
        this.setTextHorizontalAlignment(options.vAlignment);
    }
 };

util.inherits(TextArea, Widget);
module.exports = TextArea;

TextArea.prototype.setText = function(text){
    this._pArea.setStringValue(text);
 };

TextArea.prototype.setTextAreaSize = function(width,height){
    this._pArea.setTextAreaSize(width,height);
 };

TextArea.prototype.setTextHorizontalAlignment = function(alignment){
    this._pArea.setTextHorizontalAlignment(alignment);
 };

TextArea.prototype.setTextVerticalAlignment = function(alignment){
    this._pArea.setTextVerticalAlignment(alignment);
 };

TextArea.prototype.getStringLength = function(){
    return this._pArea.getStringLength();
 };

TextArea.prototype.getStringValue: function(){
    return this._pArea.getStringValue();
 };

TextArea.prototype.setTextColor = function(r,g,b){
    this._pArea.setTextColor(r,g,b);
 };

TextArea.prototype.setFontSize = function(size){
    this._pArea.setFontSize(size);
 };
TextArea.prototype.setFontName = function(name){
    this._pArea.setFontName(name);
};

TextArea.prototype.setTouchScaleChangeAble = function(able){
    this._bTouchScaleChangeAble = able;
 };

TextArea.prototype.getValidNode = function(){
    return this._pArea;
};

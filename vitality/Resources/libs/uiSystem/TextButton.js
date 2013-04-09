
/**
 * @fileOverview TextButton
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Button = require( 'libs/uiSystem/Button.js' );
var UIText = require( 'libs/uiSystem/UIText.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description TextButton widget
 * @extends Button
 */
var TextButton = function(options){
    Button.call( this, options );
    this._pTextLable = new UIText();
    this._pTextLable.init();
    this.addUIElement(this._pTextLable);
    this.setText(options.title);
    if (this.checkObjectUseable(options.flipX)){
        this.setFlipX(options.flipX);
    }
    if (this.checkObjectUseable(options.flipY)){
        this.setFlipY(options.flipY);
    }
 };

util.inherits(TextButton, Button);
module.exports = TextButton;

TextButton.prototype.setText = function(text){
    this._pTextLable.setStringValue(text);
 };

TextButton.prototype.setTextColor = function(r,g,b){
    this._pTextLable.setTextColor(r,g,b);
 };

TextButton.prototype.setFontSize = function(size){
    this._pTextLable.setFontSize(size);
 };
                           
TextButton.prototype.setFontName = function(name){
    this._pTextLable.setFontName(name);
}
TextButton.prototype.setFlipX = function(flipX){
    Button.prototype.setFlipX.call( this, flipX );
    if (this.checkObjectUseable(this._pTextLable)){
        this._pTextLable.setFlipX(flipX);
    }
 };

TextButton.prototype.setFlipY = function(flipY){
    Button.prototype.setFlipY.call( this, flipY );
    if (this.checkObjectUseable(this._pTextLable)){
        this._pTextLable.setFlipY(flipY);
    }
};

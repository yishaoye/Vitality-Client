
/**
 * @fileOverview ImageView
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description ImageView widget
 * @extends Widget
 */
var ImageView = function(options){
    Widget.call( this, options );

    this._nViewType = 1;

    this._pImage = new UISprite();
    this._pImage.init();

    this._nClickCount = 0;
    this._fClickTimeInterval = 0.0;
    this._bStartCheckDoubleClick = false;
    this._touchRelease = false;
    this._bDoubleClickEnable = false;


    this._sTextureFilename = options.fileName;
    this.setTexture(this._sTextureFilename);

    //Events
    if( options.scriptJS ){
        this.events = {
            onDoubleClick: options.scriptJS[options.onDoubleClick]
        };
    }
    else{
        this.events = {};
    }

    if ( options.flipX ){
        this.setFlipX(options.flipX);
    }
    if ( options.flipY ){
        this.setFlipY(options.flipY);
    }

    this.addUIElement(this._pImage);
 };

util.inherits(ImageView, Widget);
module.exports = ImageView;

ImageView.prototype.setTexture = function(fileName){
    this._sTextureFilename = fileName;
    this._pImage.loadTexture(fileName);
};
                              
ImageView.prototype.getTextureFileName = function(){
    return this._sTextureFilename;
};
ImageView.prototype.setTextureRect = function(x,y,width,height){
    this._pImage.setRect(x,y,width,height);
 };

ImageView.prototype.getValidNode = function(){
    return this._pImage;
 };

ImageView.prototype.onTouchPressed = function(touchPoint){
    this.setBeFocus(true);
    this._touchStartPos.x = touchPoint.x;
    this._touchStartPos.y = touchPoint.y;
    this._pParent.checkChildInfo(0,this,touchPoint);
    this.pushDownEvent();

    if (this._bDoubleClickEnable){
        this._fClickTimeInterval = 0;
        this._bStartCheckDoubleClick = true;
        this._nClickCount++;
        this._touchRelease = false;
    }
 };

ImageView.prototype.onTouchReleased = function(touchPoint){
    if (this._bDoubleClickEnable){
        if (this._nClickCount >= 2){
            this.doubleClickEvent();
            this._nClickCount = 0;
            this._bStartCheckDoubleClick = false;
        }else{
            this._touchRelease = true;
        }
    }else{
        this._super(touchPoint);
    }
 };

ImageView.prototype.doubleClickEvent = function(){
    if (this.checkObjectUseable(this.events['onDoubleClick'])){
        this.events['onDoubleClick'].apply(this,[this]);
    }
 };

ImageView.prototype.checkDoubleClick = function(dt){
    if (this._bStartCheckDoubleClick){
        this._fClickTimeInterval += dt;
        if (this._fClickTimeInterval >= 200 && this._nClickCount > 0){
            this._fClickTimeInterval = 0;
            this._nClickCount--;
            this._bStartCheckDoubleClick = false;
        }
    }else{
        if (this._nClickCount <= 1){
            if (this._touchRelease){
                this.releaseUpEvent();
                this._fClickTimeInterval = 0;
                this._nClickCount = 0;
                this._touchRelease = false;
            }
        }
    }
 };

ImageView.prototype.setDoubleClickEnable = function(able){
    if (able == this._bDoubleClickEnable){
        return;
    }
    this._bDoubleClickEnable = able;
    if (able){
        uiSystem._pUIInputManager.addCheckedDoubleClickWidget(this);
    }else{

    }
 };
                          
ImageView.prototype.setFlipX = function(flipX){
    Widget.prototype.setFlipX.call( this, flipX);
    this._pImage.setFlipX(flipX);
 };

ImageView.prototype.setFlipY = function(flipY){
    Widget.prototype.setFlipY.call( this, flipY);
    this._pImage.setFlipY(flipY);
 };


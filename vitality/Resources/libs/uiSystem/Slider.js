
/**
 * @fileOverview Slider
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var UIPoint = require( 'libs/uiSystem/Math.js' ).UIPoint;
var util = require( 'libs/util/util.js' );
var Widget = require( 'libs/uiSystem/Widget.js' );
var UISprite = require( 'libs/uiSystem/UISprite.js' );
var Button = require( 'libs/uiSystem/Button.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description Slider widget
 * @extends Widget
 */
var Slider = function(options){
    Widget.call( this, options );
    this._pBarNode = new UISprite();
    this._pBarNode.init();
    this._pBarNode.loadTexture('gui/New/slider_bar_normal_9patchcopy_test.png');
    this.addUIElement(this._pBarNode);
    this._fMinLength = this._pBarNode.getContentSize().width;
    this._fBarLength = 0.0;
    this._nDirection = 0;
    this._nBarPercent = 0;
    this.events.onSlidChanged = options.onSlidChanged;
    //temp method
    this._pBarNodeLeftC = new UISprite();
    this._pBarNodeLeftC.init();
    this._pBarNodeLeftC.loadTexture('gui/New/slider_bar_normal_leftcircle.png');
    this.addUIElement(this._pBarNodeLeftC);
    this._fCircleSize = this._pBarNodeLeftC.getContentSize().width;

    this._pBarNodeRightC = new UISprite();
    this._pBarNodeRightC.init();
    this._pBarNodeRightC.loadTexture('gui/New/slider_bar_normal_leftcircle.png');
    this._pBarNodeRightC.setFlipX(true);
    this.addUIElement(this._pBarNodeRightC);

        this._pSlidBall = new Button({normal : 'gui/New/slider.png' , pressed : 'gui/New/slider_press.png' , disabled : 'gui/New/slider_disable.png',});
    this.addChild(this._pSlidBall);
        this._ballRect = new UIRect();

    this._fBarNodeScaleValue = 1.0;
    this._fTouchMoveStartLocation = 0.0;
    if (this.checkObjectUseable(options.length)){
        this.setBarLength(options.length);
    }else{
        this.setBarLength(this._fMinLength);
    }
    if (this.checkObjectUseable(options.percent)){
        this.setSlidBallPercent(options.percent);
    }else{
        this.setSlidBallPercent(50);
    }
    this.setPressState(0);
};

util.inherits(Slider, Widget);
module.exports = Slider;

Slider.prototype.setBarLength = function(length){
    if (length < this._fMinLength){
        return;
    }
    this._fBarLength = length;
    this._fBarNodeScaleValue = length/this._fMinLength;
    this._pBarNode.setScaleX(this._fBarNodeScaleValue);
    var p1 = new UIPoint();
    p1.x = (-this._fBarLength/2 - this._fCircleSize/2);
    p1.y = 0;
    this._pBarNodeLeftC.setPosition(p1);
    p1.x = (this._fBarLength/2 + this._fCircleSize/2);
    this._pBarNodeRightC.setPosition(p1);
 };

Slider.prototype.setSlidBallPercent = function(percent){
    this._nBarPercent = percent;
    var dis = this._fBarLength*(percent/100);
    this._pSlidBall.setPositionXY(-this._fBarLength/2+dis,0);
 };

Slider.prototype.getClickPercent = function(location){
    this.getLocationInWindow();
    var leftEndPos = this._locationInWindow.x - this._fBarLength/2;
    var per = (location - leftEndPos)/this._fBarLength;
    return per;
 };

Slider.prototype.checkSlidBoundary = function(){
    if (this._pSlidBall.getPosition().x > this._fBarLength/2){
        this._pSlidBall.setPositionXY(this._fBarLength/2,0);
    }else if(this._pSlidBall.getPosition().x < -this._fBarLength/2){
        this._pSlidBall.setPositionXY(-this._fBarLength/2,0);
    }
 };

//to be overrideed
Slider.prototype.onTouchPressed = function(touchPoint){
    Widget.prototype.onTouchPressed.call( this, touchPoint );
    this._pSlidBall.setPressState(1);
    this._fTouchMoveStartLocation = touchPoint.x;
    this.setSlidBallPercent(this.getClickPercent(this._fTouchMoveStartLocation) * 100);
    this._nBarPercent = this.getPercentWithBallPos(this._pSlidBall.getPosition().x,0);
    if (this.checkObjectUseable(this.events['onSlidChanged'])){
        this.events['onSlidChanged'].apply(this,[this]);
    }
 };

Slider.prototype.onTouchMoved = function(touchPoint){
    var moveX = touchPoint.x;
    var offset = moveX - this._fTouchMoveStartLocation;
    this._fTouchMoveStartLocation = moveX;
    var nx = this._pSlidBall.getPosition().x + offset;
    this._pSlidBall.setPositionXY(nx,0);
    this.checkSlidBoundary();
    this._nBarPercent = this.getPercentWithBallPos(this._pSlidBall.getPosition().x,0);
    if (this.checkObjectUseable(this.events['onSlidChanged'])){
        this.events['onSlidChanged'].apply(this,[this]);
    }
 };

Slider.prototype.onTouchReleased = function(touchPoint){
    Widget.prototype.onTouchReleased.call( this, touchPoint );
    this._pSlidBall.setPressState(0);
 };

Slider.prototype.onTouchCanceled = function(touchPoint){
    Widget.prototype.onTouchCanceled.call( this, touchPoint );
 };

Slider.prototype.onPressStateChangedToNormal = function(){

 };

Slider.prototype.onPressStateChangedToPressed = function(){

 };

Slider.prototype.onPressStateChangedToDisabled = function(){

 };
                       
Slider.prototype.getPercentWithBallPos = function(px,py){
    return (((px-(-this._fBarLength/2))/this._fBarLength)*100);
 };
 
 Slider.prototype.pointAtSelfBody = function(x,y) {
    var parent = this;
    while (parent != 0) {
        if (!parent._bVisible) {
            return false;
        }
        parent = parent.getParent();
    }

    var rect = this.getRect();
    var bRet = false;
    if (x >= rect.origin.x && x <= rect.origin.x+rect.size.width && y >= rect.origin.y && y <= rect.origin.y +rect.size.height) {
        bRet = true;
    }
   
    var ballRect = this.getBallRect();
    var bBallRet = false;
    if (x >= ballRect.origin.x && x <= ballRect.origin.x + ballRect.size.width
        && y >= ballRect.origin.y && y <= ballRect.origin.y + ballRect.size.height) {
        bBallRet = true;
    }
   
    return (bRet || bBallRet);
};

Slider.prototype.getRect = function(){
    var width = 0;
    var height = 0;
    var anchorPointX = 0;
    var anchorPointY = 0;
    this.getLocationInWindow();
    switch (this._nCurPressState){
        case 0:
        width = this._pBarNode.getContentSize().width;
        height = this._pBarNode.getContentSize().height;
        anchorPointX = this._pBarNode.getAnchorPoint().x;
        anchorPointY = this._pBarNode.getAnchorPoint().y;
        break;
        case 1:
        width = this._pBarNode.getContentSize().width;
        height = this._pBarNode.getContentSize().height;
        anchorPointX = this._pBarNode.getAnchorPoint().x;
        anchorPointY = this._pBarNode.getAnchorPoint().y;
        break;
    }
    this._rect.origin.x = (this._locationInWindow.x - width * anchorPointX * this._fBarNodeScaleValue);
    this._rect.origin.y = this._locationInWindow.y - height * anchorPointY;
    this._rect.size.width = width*this._fBarNodeScaleValue;
    this._rect.size.height = height;
    return this._rect;
 };

Slider.prototype.getRelativeRect = function(){
    var width = 0;
    var height = 0;
    var anchorPointX = 0;
    var anchorPointY = 0;
    switch (this._nCurPressState){
        case 0:
        width = this._pBarNode.getContentSize().width;
        height = this._pBarNode.getContentSize().height;
        anchorPointX = this._pBarNode.getAnchorPoint().x;
        anchorPointY = this._pBarNode.getAnchorPoint().y;
        break;
        case 1:
        width = this._pBarNode.getContentSize().width;
        height = this._pBarNode.getContentSize().height;
        anchorPointX = this._pBarNode.getAnchorPoint().x;
        anchorPointY = this._pBarNode.getAnchorPoint().y;
        break;
    }
    this._relativeRect.origin.x = this._position.x - width * anchorPointX * this._fBarNodeScaleValue;
    this._relativeRect.origin.y = this._position.y - height * anchorPointY;
    this._relativeRect.size.width = width;
    this._relativeRect.size.height = height;
    return this._relativeRect;
};

Slider.prototype.getBallRect : function() {
    var width = 0;
    var height = 0;
    var anchorPointX = 0;
    var anchorPointY = 0;
                       
    this.getLocationInWindow();
   
    switch (this._nCurPressState) {
        case 0:
            width = this._pSlidBall.getValidNode().getContentSize().width;
            height = this._pSlidBall.getValidNode().getContentSize().height;
            anchorPointX = this._pSlidBall.getValidNode().getAnchorPoint().x;
            anchorPointY = this._pSlidBall.getValidNode().getAnchorPoint().y;
            break;
   
        case 1:
            width = this._pSlidBall.getValidNode().getContentSize().width;
            height = this._pSlidBall.getValidNode().getContentSize().height;
            anchorPointX = this._pSlidBall.getValidNode().getAnchorPoint().x;
            anchorPointY = this._pSlidBall.getValidNode().getAnchorPoint().y;
            break;
    }
                       
    this._ballRect.origin.x = this._locationInWindow.x - width * anchorPointX * this._fBarNodeScaleValue;
    this._ballRect.origin.y = this._locationInWindow.y - height * anchorPointY;
    this._ballRect.size.width = width * this._fBarNodeScaleValue;
    this._ballRect.size.height = height;
    return this._ballRect;
};
    


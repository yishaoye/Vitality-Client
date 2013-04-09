
/**
 * @fileOverview ScrollView
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Panel = require( 'libs/uiSystem/Panel.js' );
var UIPointMake = require( 'libs/uiSystem/Math.js' ).UIPointMake;
/**
 * @author SPII
 * @constructor onCreate
 * @description ScrollView widget
 * @extends Widget
 */
var ScrollView = function(options){
    Panel.call( this, options );

    this._nDirection = options.direction || 0; // 0 vertical. 1 horizontal.
    this._fTouchStartLocation = 0.0;
    this._fTouchEndLocation = 0.0;
    this._fTouchMoveStartLocation = 0.0;
    this._fTopBoundary = 0.0;//test
    this._fBottomBoundary = 0.0;//test
    this._fLeftBoundary = 0.0;
    this._fRightBoundary = 0.0;
    this._fVerticalCenterBoundary = 0.0;

    this._pTopChild = null;
    this._pBottomChild = null;
    this._pLeftChild = null;
    this._pRightChild = null;

    this._nTopPos = this._fHeight;
    this._nBottomPos = this._fHeight;
    this._nLeftPos = 0;
    this._nRightPos = 0;

    this._nHandleState = 0;//0 normal, 1 top boundary, 2 bottom boundary
    this._nMoveDirection = 0; // vertical: 0 pull down, 1 push up. horizontal: 0 push left, 1 pull right.
    this._nBerthDirection = 0;  // vertical: 0 berth top, 1 berth bottom. horizontal: 0 berth left, 1 berth right.

    this._bTopEnd = false;
    this._bBottomEnd = false;
    this._bLeftEnd = false;
    this._bRightEnd = false;

    this._bAutoScroll = false;
    this._fAutoScrollOriginalSpeed = 0.0;
    this._fAutoScrollAcceleration = options.acceleration || 600.0;

    this._bAutoRollback = false;
    this._fAutoRollbackSpeed = 0.0;

    this._bBePressed = false;
    this._fSlidTime = 0.0;
    this.moveChildPoint = UIPointMake(0,0);
    this._fTopBoundary = this._fHeight;
    this._fRightBoundary = this._fHeight;
    this._fChildrenSizeHeight = 0.0;
    this._fChildrenSizeWidth = 0.0;
                          
    this.events.onScrollToTop = options.onScrollToTop;
    this.events.onScrollToBottom = options.onScrollToBottom;
    this.events.onScrollToLeft = options.onScrollToLeft;
    this.events.onScrollToRight = options.onScrollToRight;

    this.setUpdateEnable( true );

 };

util.inherits(ScrollView, Panel);
module.exports = ScrollView;

ScrollView.prototype.releaseResoures = function(){
    Panel.prototype.lreleaseResoures.call( this );
    this.moveChildPoint = null;
};

ScrollView.prototype.addChild = function(widget){

    if (widget.getRelativeTopPos() > this._nTopPos ){
        this._nTopPos = widget.getRelativeTopPos();
    }
    if (widget.getRelativeBottomPos() < this._nBottomPos ){
        this._nBottomPos = widget.getRelativeBottomPos();
    }
    if (widget.getRelativeRightPos() > this._nRightPos ){
        this._nRightPos = widget.getRelativeRightPos();
    }
    if (widget.getRelativeRect().origin.x < this._nLeftPos ){
        this._nLeftPos = widget.getRelativeLeftPos();
    }
    
    this._fChildrenSizeHeight = this._nTopPos - this._nBottomPos;
    this._fChildrenSizeWidth = this._nRightPos - this._nLeftPos; 

    widget._bCheckVisibleDependParentEnable = true;
    Panel.prototype.addChild.call( this, widget );
    widget.setVisible(widget.checkBeVisibleInParent());
 };
                          
ScrollView.prototype.removeChildMoveToTrash = function(child){
    if (!this.checkObjectUseable(child)){
        return;
    }
    Panel.prototype.removeChildMoveToTrash.call( this, child );
    this.resortChildren();
 };
                          
ScrollView.prototype.removeChildReferenceOnly = function(child){
    if (!this.checkObjectUseable(child)){
        return;
    }
    Panel.prototype.removeChildReferenceOnly.call( this, child );
    this.resortChildren();
 };

ScrollView.prototype.removeAllChildrenAndCleanUp = function(cleanUp){
    Panel.prototype.removeAllChildrenAndCleanUp.call( this, cleanUp );
    this._nTopPos = this._fHeight;
    this._nBottomPos = this._fHeight;
    this._nLeftPos = 0;
    this._nRightPos = 0;
 };
                          
ScrollView.prototype.resortChildren = function(){
    if (!this.checkObjectUseable(this._children) || this._children.length <= 0){
        return;
    }
    var leftChild = this._children[0];
    var rightChild = this._children[0];
    var topChild = this._children[0];
    var bottomChild = this._children[0];
    for (var i=0;i<this._children.length;i++){
        if (leftChild.getRelativeRect().origin.x > this._children[i].getRelativeRect().origin.x){
            leftChild = this._children[i];
        }
        if (rightChild.getRelativeRect().origin.x + rightChild.getRelativeRect().size.width < this._children[i].getRelativeRect().origin.x + this._children[i].getRelativeRect().size.width){
            rightChild = this._children[i];
        }
        if (topChild.getRelativeRect().origin.y + topChild.getRelativeRect().size.height < this._children[i].getRelativeRect().origin.y + this._children[i].getRelativeRect().size.height){
            topChild = this._children[i];
        }
        if (bottomChild.getRelativeRect().origin.y > this._children[i].getRelativeRect().origin.y){
            bottomChild = this._children[i];
        }
    }
    this._pTopChild = topChild;
    this._pBottomChild = bottomChild;
    this._pLeftChild = leftChild;
    this._pRightChild = rightChild;
 };

ScrollView.prototype.moveChildren = function(offset){
    switch (this._nDirection){
        case 0:
        {
            this._nTopPos += offset;
            this._nBottomPos += offset;
            for (var i=0;i<this._children.length;i++){
                var child = this._children[i];
                this.moveChildPoint.x = child.getPosition().x;
                this.moveChildPoint.y = child.getPosition().y+offset;
                child.setPosition(this.moveChildPoint);
                child.setVisible(child.checkBeVisibleInParent());
            }
        }break;
        case 1:
        {
            this._nLeftPos += offset;
            this._nRightPos += offset;
            for (var i=0;i<this._children.length;i++){
                var child = this._children[i];
                this.moveChildPoint.x = child.getPosition().x+offset;
                this.moveChildPoint.y = child.getPosition().y;
                child.setPosition(this.moveChildPoint);
                child.setVisible(child.checkBeVisibleInParent());
            }
        }break;
    }
 };

ScrollView.prototype.autoRollbackChildren = function(dt){

    var distance = this._fAutoRollbackSpeed * (dt/100);
    switch (this._nDirection){
        case 0:
        switch (this._nMoveDirection){
            case 0: // pull down
            {
                if (this._fChildrenSizeHeight < this._fHeight) {
                    if (this._nTopPos + distance <= this._fTopBoundary) {
                        distance = this._fTopBoundary - this._nTopPos;
                        this._bAutoRollback = false;
                    }
                }
                else{
                    if( this._nBottomPos + distance <= this._fBottomBoundary )
                    {
                        distance = this._fBottomBoundary - this._nBottomPos;
                        this._bAutoRollback = false;
                    }
                }
            }break;
            case 1: // push up
            {
                if( this._nTopPos + distance >= this._fTopBoundary )
                {
                    distance = this._fTopBoundary - this._nTopPos;
                    this._bAutoRollback = false;
                }
            }break;
        }
        break;
        case 1:
        switch (this._nMoveDirection){
            case 0: // push left
            {
                if( this._nLeftPos + distance <= this._fLeftBoundary )
                {
                    distance = this._fLeftBoundary - this._nLeftPos ;
                    this._bAutoRollback = false;
                }
            }break;
            case 1: // pull right
            {
                if (this._fChildrenSizeWidth < this._fWidth) {
                    if (this._nLeftPos + distance >= this._fLeftBoundary) {
                        distance = this._fLeftBoundary - this._nLeftPos;
                        this._bAutoRollback = false;
                    }
                }
                else{
                    if( this._nRightPos + distance >= this._fRightBoundary )
                    {
                        distance = this._fRightBoundary - this._nRightPos;
                        this._bAutoRollback = false;
                    }
                }
            }break;
        }
        break;
    }
    this.scrollChildren(distance);
};

ScrollView.prototype.autoScrollChildren = function(dt){
    switch (this._nDirection){
        case 0:
        switch (this._nMoveDirection){
            case 0:
            var curDis = this.getCurAutoScrollDistance(dt);
            if (curDis <= 0){
                curDis = 0;
                this.stopAutoScrollChildren();
            }
            if (!this.scrollChildren(-curDis)){
                this.stopAutoScrollChildren();
            }
            break;
            case 1:
            var curDis = this.getCurAutoScrollDistance(dt);
            if (curDis <= 0){
                curDis = 0;
                this.stopAutoScrollChildren();
            }
            if (!this.scrollChildren(curDis)){
                this.stopAutoScrollChildren();
            }
            break;
        }
        break;
        case 1:
        switch (this._nMoveDirection){
            case 0:
            var curDis = this.getCurAutoScrollDistance(dt);
            if (curDis <= 0){
                curDis = 0;
                this.stopAutoScrollChildren();
            }
            if (!this.scrollChildren(-curDis)){
                this.stopAutoScrollChildren();
            }
            break;
            case 1:
            var curDis = this.getCurAutoScrollDistance(dt);
            if (curDis <= 0){
                curDis = 0;
                this.stopAutoScrollChildren();
            }
            if (!this.scrollChildren(curDis)){
                this.stopAutoScrollChildren();
            }
            break;
        }
        break;
    }
 };

ScrollView.prototype.startAutoScrollChildren = function(v){
    this._fAutoScrollOriginalSpeed = v;
    this._bAutoScroll = true;
 };

ScrollView.prototype.stopAutoScrollChildren = function(){
    this._bAutoScroll = false;
    this._fAutoScrollOriginalSpeed = 0.0;
 };

ScrollView.prototype.getCurAutoScrollDistance = function(time){
    var dt = time;
    dt /= 1000;
    this._fAutoScrollOriginalSpeed -= this._fAutoScrollAcceleration*dt;
    var distance = this._fAutoScrollOriginalSpeed*dt;
    return distance;
 };

ScrollView.prototype.setDirection = function(direction){
    if (this._nDirection == direction){
        return;
    }
    this._nDirection = direction;
 };

ScrollView.prototype.setBerthDirection = function(direction) {
    if (this._nBerthDirection == direction) {
        return;
    }
    this._nBerthDirection = direction;
};
    
ScrollView.prototype.scrollChildren = function(touchOffset){
    if (this._children.length <= 0) {
        return false;
    }
    this.moveChildren( touchOffset );
 };
                          
ScrollView.prototype.scrollToBottom = function(){
    this._nMoveDirection = 1;
    this.scrollChildren(this._fChildrenSizeHeight);
 };
                          
ScrollView.prototype.scrollToTop = function(){
    this._nMoveDirection = 0;
    this.scrollChildren(-this._fChildrenSizeHeight);
 };
 
ScrollView.prototype.scrollToTopEndEvent = function() {
    if (this.checkObjectUseable(this.events['onScrollToTop'])) {
        this.events['onScrollToTop'].apply(this, [this]);
    }
};
                          
ScrollView.prototype.scrollToBottomEndEvent = function() {
    if (this.checkObjectUseable(this.events['onScrollToBottom'])) {
        this.events['onScrollToBottom'].apply(this, [this]);
    }
};
                          
ScrollView.prototype.scrollToLeftEndEvent = function() {
    if (this.checkObjectUseable(this.events['onScrollToLeft'])) {
        this.events['onScrollToLeft'].apply(this, [this]);
    }
};
                          
ScrollView.prototype.scrollToRightEndEvent = function() {
    if (this.checkObjectUseable(this.events['onScrollToRight'])) {
        this.events['onScrollToRight'].apply(this, [this]);
    }
};

ScrollView.prototype.startRecordSlidAction = function(){
    if (this._bAutoScroll){
        this.stopAutoScrollChildren();
    }
    this._bBePressed = true;
    this._fSlidTime = 0.0;
 };

ScrollView.prototype.endRecordSlidAction = function(){
    switch (this._nDirection) {
        case 0: // vertical   
        {
            if (this._nTopPos < this._fTopBoundary) {
                this._fAutoRollbackSpeed = this._fTopBoundary - this._nTopPos ;
                this._bAutoRollback = true;
                this._nMoveDirection = 1;

                return false;
            }
            if (this._fChildrenSizeHeight < this._fHeight) {
                if (this._nTopPos > this._fTopBoundary) {
                    this._fAutoRollbackSpeed = this._fTopBoundary - this._nTopPos ;
                    this._bAutoRollback = true;
                    this._nMoveDirection = 0;

                    return false;
                }
            }
            else{
                if (this._nBottomPos >= this._fBottomBoundary) {
                    this._fAutoRollbackSpeed = this._fBottomBoundary - this._nBottomPos;
                    this._bAutoRollback = true;
                    this._nMoveDirection = 0;
                    return false;
                }
            }
        }break;
        case 1: // horizontal
        {
            if (this._fChildrenSizeWidth < this._fWidth) {
                if (this._nLeftPos < this._fLeftBoundary) {
                    this._fAutoRollbackSpeed = this._fLeftBoundary - this._nLeftPos;
                    this._bAutoRollback = true;
                    this._nMoveDirection = 1;
                    return false;
                }
            }
            else{
                if (this._nRightPos < this._fRightBoundary) {
                    this._fAutoRollbackSpeed = this._fRightBoundary - this._nRightPos;
                    this._bAutoRollback = true;
                    this._nMoveDirection = 1;
                    return false;
                }
            }
            if (this._nLeftPos > this._fLeftBoundary) {
                this._fAutoRollbackSpeed = this._fLeftBoundary - this._nLeftPos;
                this._bAutoRollback = true;
                this._nMoveDirection = 0;
                return false;
            }
        }break;
    }
//    var totalDis = 0;
//    totalDis = this._fTouchEndLocation-this._fTouchStartLocation;
//    var orSpeed = Math.abs(totalDis)/(this._fSlidTime/1000);
//    log( '_fSlidTime ' + this._fSlidTime );
//    log( 'totalDis ' + totalDis );
//    log( 'orSpeed ' + orSpeed );
//    this.startAutoScrollChildren(orSpeed);
 };

ScrollView.prototype.handlePressLogic = function(touchPoint){
    switch (this._nDirection){
        case 0:
        this._fTouchMoveStartLocation = touchPoint.y;
        this._fTouchStartLocation = touchPoint.y;
        break;
        case 1:
        this._fTouchMoveStartLocation = touchPoint.x;
        this._fTouchStartLocation = touchPoint.x;
        break;
    }
    this.startRecordSlidAction();
 };

ScrollView.prototype.handleMoveLogic = function(touchPoint){
    switch (this._nDirection)
        {
        case 0:
        {
            var moveY = touchPoint.y;
            var offset = moveY - this._fTouchMoveStartLocation;
            this._fTouchMoveStartLocation = moveY;
            if (offset < 0){
                this._nMoveDirection = 0;
            }else if (offset > 0){
                this._nMoveDirection = 1;
            }
            this.scrollChildren(offset);
        }break;
        case 1:
        {
            var moveX = touchPoint.x;
            var offset = moveX - this._fTouchMoveStartLocation;
            this._fTouchMoveStartLocation = moveX;
            if (offset < 0){
                this._nMoveDirection = 0;
            }else if (offset > 0){
                this._nMoveDirection = 1;
            }
            this.scrollChildren(offset);
        }break;
    }
 };

ScrollView.prototype.handleReleaseLogic = function(touchPoint){
    switch (this._nDirection){
        case 0:
        this._fTouchEndLocation = touchPoint.y;
        break;
        case 1:
        this._fTouchEndLocation = touchPoint.x;
        break;
    }
    this.endRecordSlidAction();
 };

ScrollView.prototype.onTouchPressed = function(touchPoint){
    Panel.prototype.onTouchPressed.call( this, touchPoint );
    this.handlePressLogic(touchPoint);
 };

ScrollView.prototype.onTouchMoved = function(touchPoint){
    Panel.prototype.onTouchMoved.call( this, touchPoint );
    this.handleMoveLogic(touchPoint);
 };

ScrollView.prototype.onTouchReleased = function(touchPoint){
    Panel.prototype.onTouchReleased.call( this, touchPoint );
    this.handleReleaseLogic(touchPoint);
 };

ScrollView.prototype.onTouchCanceled = function(touchPoint){
    Panel.prototype.onTouchCanceled.call( this, touchPoint );
 };

ScrollView.prototype.update = function(dt){
    if( this._bAutoRollback ){
        this.autoRollbackChildren(dt);
    }
    else if (this._bAutoScroll){
        this.autoScrollChildren(dt);
    }
    this.recordSlidTime(dt);
 };

ScrollView.prototype.recordSlidTime = function(dt){
    if (this._bBePressed){
        this._fSlidTime += dt;
    }
 };

ScrollView.prototype.checkChildInfo = function(handleState,sender,touchPoint){
    switch (handleState){
        case 0:
        this.handlePressLogic(touchPoint);
        break;
        case 1:
        sender.setBeFocus(false);
        this.handleMoveLogic(touchPoint);
        break;
        case 2:
        this.handleReleaseLogic(touchPoint);
        break;
        case 3:
        break;
    }
};


/**
 * @fileOverview Radio Group
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var ScrollView = require( 'libs/uiSystem/ScrollView.js' );
var WrapContentPanel = require( 'libs/uiSystem/WrapContentPanel.js' );
var RadioButton = require( 'libs/uiSystem/RadioButton.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description RadioGroup widget
 * @extends ScrollView
 */
var RadioGroup = function(options){
    ScrollView.call( this, options );

    this._nIntervalX = options.intervalX || 0;
    this._nIntervalY = options.intervalY || 0; 

    this._radios = [];
    if( options.scriptJS ){
        this.events = {
        onSelected: options.scriptJS[options.onSelected]
        };
    }
    else{
        this.events = {};
    }

 };

util.inherits(RadioGroup, ScrollView);
module.exports = RadioGroup;

RadioGroup.prototype.addChild = function(widget){

    widget.setPositionXY(this.getPushLocationX(widget),this.getPushLocationY(widget));
    ScrollView.prototype.addChild.call( this, widget );
    this._radios.push( widget );
};
                             
RadioGroup.prototype.getPushLocationX = function(widget){
    
    switch( this._nDirection )
    {
        case 0:
        {
            return this._fWidth/2;
        }break;
        case 1:
        {
             if (this._children.length <= 0){
                return (widget.getValidNode().getContentSizeWidth()/2) + this._nIntervalX;
            }else{

                var lastChildX = this._nRightPos;
                var widgetWidthHalf = widget.getValidNode().getContentSizeWidth()/2;
                return (lastChildX + widgetWidthHalf + this._nIntervalX);
            }
        }break;
    }
 };

RadioGroup.prototype.getPushLocationY = function(widget){
    
    switch( this._nDirection )
    {
        case 0:
        {
            if (this._children.length <= 0){

                return (this._fHeight-widget.getValidNode().getContentSizeHeight()/2) + this._nIntervalY;
            }else{

                var lastChildY = this._nBottomPos;
                var widgetHeightHalf = widget.getValidNode().getContentSizeHeight()/2;
                return (lastChildY-widgetHeightHalf + this._nIntervalY);
            }
        }break;
        case 1:
        {
            return this._fHeight/2;
        }break;
    }
 };


RadioGroup.prototype.onSelectedRadio = function( widget ){

    log( 'onSelectedRadio' );
    for( var i in this._radios )
    {
        if( this._radios[ i ] != widget )
        {
            this._radios[ i ].setSelectedState( false );
        } 
    }
    
    if ( typeof this.events['onSelected'] === 'function' ){
        this.events['onSelected'].call(this, widget);
    }
};

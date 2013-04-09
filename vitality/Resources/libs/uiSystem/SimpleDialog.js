
/**
 * @fileOverview SimpleDialog
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var Panel = require( 'libs/uiSystem/Widget.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description SimpleDialog widget
 * @extends Widget
 */
var SimpleDialog = function(pos){
    Panel.call( this, pos );
};

util.inherits(SimpleDialog, Panel);
module.exports = SimpleDialog;

SimpleDialog.prototype.init = function(){
    Panel.prototype.init.call( this );
    return this;
};


s
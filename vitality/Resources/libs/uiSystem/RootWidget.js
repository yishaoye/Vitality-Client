
/**
 * @fileOverview RootWidget
 * @author <a href="www.sweetpome.com">SPII</a>
 * @version 0.1.10
 */
var util = require( 'libs/util/util.js' );
var ContainerWidget = require( 'libs/uiSystem/ContainerWidget.js' );
/**
 * @author SPII
 * @constructor onCreate
 * @description the root widget of ui scene
 * @extends ContainerWidget
 */
var RootWidget = function(options){
    ContainerWidget.call(options);
    this.uiScene = null;
};

util.inherits(RootWidget, ContainerWidget);
module.exports = RootWidget;


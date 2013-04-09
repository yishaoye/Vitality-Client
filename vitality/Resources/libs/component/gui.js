
var uiSystem = require( 'libs/uiSystem/UISystem.js' );

/**
 * GUI 组件.
 * 
 * @memberOf uiComponent
 */
var ui = module.exports = {};

// UI系统控制
//ui.uiSystem = uiSystem;

/**
 * 初始化GUI组件
 *
 * @param {Object} opts 加载文字数据
 * 
 * @api private
 * @memberOf uiComponent
 */
ui.init = function( opts ){

	var target = this;
	target[ opts.name ] = uiSystem.createWidget(null, opts.widgettree );

	this.layer.addChild( target[ opts.name ].getRenderNode() );


};

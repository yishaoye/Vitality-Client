
var winSize = require( 'libs/util/director.js' ).winSize;

/**
 * 文字标签组件.
 * 
 * @memberOf label
 */
var label = module.exports = {};

// 显示文字
label.showText = null;

/**
 * 初始化文字标签组件
 *
 * @param {Object} opts 加载文字数据
 * 
 * @api private
 * @memberOf label
 */
label.init = function( opts ){
	if( opts.type && opts.type === 1 ){
		if( !opts.file )
		{
			print( 'create LabelBMFont ERROR! file = ' + opts.file );
			return;
		}
		this.showText = cc.LabelBMFont.create( opts.labeltext, opts.file );
	}
	else if( opts.type && opts.type === 2 ){
		if( !opts.file )
		{
			print( 'create LabelBMFont ERROR! file = ' + opts.file );
			return;
		}
		this.showText = cc.LabelAtlas.create( opts.labeltext, opts.file );
	}
	else{
		this.showText = cc.LabelTTF.create( opts.labeltext, opts.fontname, opts.fontsize );	
	}
	// 设置锚点
	//this.showText.setAnchorPoint(cc.p(0.5, 0.5));
	// 设置颜色
	//this.showText.setColor(cc.c3b(255,0,0));
	// 设置位置
	this.showText.setPosition( opts.x, opts.y );
	this.layer.addChild( this.showText );
};

/**
 * 设置label文字
 *
 * @param {String} string 文字
 *
 * @api private
 * @memberOf label
 */
label.setLabelString = function( string ){
	this.showText.setString( string );
};


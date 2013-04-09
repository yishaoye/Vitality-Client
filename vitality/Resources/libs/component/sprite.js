



/**
 * 精灵组件.
 * 
 * @memberOf sprite
 */
var sprite = module.exports = {};

// 精灵
sprite.sprite = null;

/**
 * 初始化精灵组件
 *
 * @param {Object} opts 加载精灵数据
 * 
 * @api private
 * @memberOf sprite
 */
 sprite.init = function( opts ){
	if( !opts.file )
	{
		print( 'create sprite ERROR! file = ' + opts.file );
		return;
	}
	opts.scale = opts.scale || 1;

	this.sprite = cc.Sprite.create( opts.file );
	this.sprite.setPosition(cc.p( opts.x, opts.y ));
	this.sprite.setScale( opts.scale );
	this.layer.addChild( this.sprite );
 };

/**
 * 设置精灵位置
 *
 * @param {Object} position 坐标
 * 
 * @memberOf sprite
 */
sprite.setSpritePosition = function( position ){

	this.sprite.setPosition( position );
};


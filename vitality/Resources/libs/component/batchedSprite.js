



/**
 * 批量精灵组件.
 * 
 * @memberOf batchedSprite
 */
var batchedSprite = module.exports = {};

// 批量精灵
batchedSprite.batchedSprite = null;

/**
 * 初始化批量精灵组件
 *
 * @param {Object} opts 加载批量精灵数据
 * 
 * @api private
 * @memberOf batchedSprite
 */
 batchedSprite.init = function( opts ){
	if( !opts.file )
	{
		print( 'create batchedSprite ERROR! file = ' + opts.file );
		return;
	}
	opts.scale = opts.scale || 1;

	var spriteFrameCache = cc.SpriteFrameCache.getInstance();
	if( opts.plist )
	{
		 spriteFrameCache.addSpriteFrames( opts.plist );
	}

	this.batchedSprite = cc.SpriteBatchNode.create( opts.file );
	this.batchedSprite.setPosition(cc.p( opts.x, opts.y ));
	this.batchedSprite.setScale( opts.scale );
	this.layer.addChild( this.batchedSprite );
	this.childSprite = [];
 };

/**
 * 设置批量精灵位置
 *
 * @param {Object} position 坐标
 * 
 * @memberOf batchedSprite
 */
batchedSprite.setSpritePosition = function( position ){

	this.batchedSprite.setPosition( position );
};

/**
 * 添加一个新的精灵
 *
 * @param {Object} opt 配置信息
 * 
 * @memberOf batchedSprite
 */
batchedSprite.addNewSprite = function( opt ){

	var sprite = null;
	if( opt.file )
	{
		sprite = cc.Sprite.createWithSpriteFrameName( opt.file );
	}
	else
	{
		sprite = cc.Sprite.createWithTexture( this.batchedSprite.getTexture() );
	}
	sprite.setPosition( cc.p( opt.x, opt.y ) );
	opt.scale = opt.scale || 1;
	sprite.setScale( opt.scale );
	
	this.batchedSprite.addChild( sprite );
	this.childSprite.push( sprite );
	return sprite;
};


/**
 * 删除精灵
 *
 * @param {Object} sprite 精灵
 * 
 * @memberOf batchedSprite
 */
batchedSprite.deleteSprite = function( sprite, cleanup ){

	cleanup = cleanup || true;
	this.batchedSprite.removeChild( sprite, cleanup );
};




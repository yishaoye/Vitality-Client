


/**
 * 骨骼动画组件.
 * 
 * @memberOf animations
 */
var animations = module.exports = {};

/**
 * 初始化骨骼动画组件
 *
 * @param {Object} opts 加载骨骼动画数据
 * 
 * @api private
 * @memberOf animations
 */
animations.init = function( opts ){
	if( !opts.file )
	{
		print( 'create animations ERROR! file = ' + opts.file );
		return;
	}
	var reader = cc._Reader.create();
	reader.setCCBRootPath( 'samples/qiuheti/res/' );
	this.animationManager = reader.getActionManager();

	this.animation = reader.load( opts.file );
	this.animation.setPosition(cc.p( opts.x, opts.y ));
	this.layer.addChild( this.animation );
};

/**
 * 运行动画
 *
 * @param {String} name 动画名字
 * @param {Number} fTweenDuration 延迟执行时间
 * 
 * @memberOf animations
 */
animations.runAnimations = function( name, fTweenDuration ){
	fTweenDuration = fTweenDuration || 0;
	this.animationManager.runAnimationsForSequenceNamedTweenDuration( name, fTweenDuration );
};

/**
 * 设置动画位置
 *
 * @param {Object} position 坐标
 * 
 * @memberOf animations
 */
animations.setAnimationPosition = function( position ){

	this.animation.setPosition( position );
};




/**
 * 绘图组件.
 * 
 * @memberOf draw
 */
var draw = module.exports = {};

// 精灵
draw.draw = null;

/**
 * 初始化绘图组件
 *
 * @param {Object} opts 加载精灵数据
 * 
 * @api private
 * @memberOf draw
 */
 draw.init = function( opts ){

	this.draw = cc.DrawNode.create();

	for( var i in opts.patterns )
	{
		var pattern = opts.patterns[ i ];
		switch( pattern.type )
		 {
			case 1:
			 {
				this.draw.drawDot();
			 }break;
			case 2:
			 {
				this.draw.drawSegment( pattern.from, pattern.to, pattern.radius, pattern.color );
			 }break;
			case 3:
			 {
				this.draw.drawPolygon();
			 }break;
		 }
	}

	this.draw.setPosition(cc.p( opts.x, opts.y ));
	this.layer.addChild( this.draw );
 };

/**
 * 设置绘图位置
 *
 * @param {Object} position 坐标
 * 
 * @memberOf draw
 */
draw.setDrawPosition = function( position ){

	this.draw.setPosition( position );
};


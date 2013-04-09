
var winSize = require( 'libs/util/director.js' ).winSize;


var TAG_TILE_MAP = 1;
/**
 * tiled 地图组件.
 * 
 * @memberOf tiledMap
 */
var tiledMap = module.exports = {};


// 地图
tiledMap.map = null;
// 比例尺
tiledMap.scale = 1;
// 标记
tiledMap.mapTag = TAG_TILE_MAP;
// 坐标
tiledMap.mapX = 0;
tiledMap.mapY = 0;
// 区域
tiledMap.mapW = 0;
tiledMap.mapH = 0;


/**
 * 初始化tiled 地图组件
 *
 * @param {Object} opts 加载地图数据
 * 
 * @api private
 * @memberOf tiledMap
 */
tiledMap.init = function( opts ){
	if( !opts.file )
	{
		print( 'create map ERROR! file = ' + opts.file );
		return;
	}
	var self = this;
	// 设置比例尺
	this.scale = opts.scale || 1;
	// 设置标记
	this.mapTag = opts.objecttag || TAG_TILE_MAP;
	// 创建地图
	this.map = cc.TMXTiledMap.create( opts.file );
	// 设置比例尺
	this.map.setScale( this.scale );
	// 设置坐标系
	var ms = this.getMapSize();
	var ts = this.getTileSize();
	this.mapW = ms.width * ts.width;
	this.mapH = ms.height * ts.height;
	var ps = { x: 0, y: 0 };
	ps.x = -this.mapX;
	ps.y = this.mapY + winSize.height - this.mapH;
	this.map.setPosition( ps.x, ps.y );

	this.layer.addChild( this.map );
	this.renderLayer = this.map;

};

/**
 *  移动地图
 *
 * @param {Object} position 移动坐标点
 * 
 * @memberOf MapObject
 */
tiledMap.onMapMoved = function( position ){

	// 判断是否超出边界
	if ( position. x > 0 ){
		//position.x = 0;
	}
	else if( position.x < winSize.width - this.mapW ){
		//position.x = winSize.width - this.mapW;
	}

	if ( position.y > 0 ){
		//position.y = 0;
	}
	else if( position.y < winSize.height - this.mapH ){
		//position.y = winSize.height - this.mapH;
	}
	this.map.setPosition(position);
	// 转换坐标
	this.mapX = -position.x;
	this.mapY = position.y - ( winSize.height - this.mapH );
};

/**
 * 获取地图尺寸
 * 
 * @memberOf tiledMap
 */
tiledMap.getMapSize = function(){
	if( !this.map ){
		log( 'map not load' );
		return { width: 0, height: 0 };
	}
	return this.map.getMapSize();
};

/**
 * 获取地图区域大小
 * 
 * @memberOf tiledMap
 */
tiledMap.getMapRect = function(){
	if( !this.map ){
		log( 'map not load' );
		return { width: 0, height: 0 };
	}
	return { width: this.width, height: this.height };
};

/**
 * 获取地图块尺寸
 * 
 * @memberOf tiledMap
 */
tiledMap.getTileSize = function(){
	if( !this.map ){
		log( 'map not load' );
		return { width: 0, height: 0 };
	}
	return this.map.getTileSize();
};
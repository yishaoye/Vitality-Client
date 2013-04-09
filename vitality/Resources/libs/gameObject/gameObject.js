

var gameObject = module.exports = {};

var components = {};

var GameObject = function( opts, node ){

	// 底层面板
	this.layer = null;
	
	// 渲染层
	this.renderLayer = null;

	// 挂载Object
	this.gameObjects = {};

	// 扩展脚本
	this.scriptJS = null;

	// component 循环函数
	this.updateAry = [];

	// 名字
	this.name = opts.name || 'object';
	
	this.init( opts, node );
};

gameObject.GameObject = GameObject;

/**
 * 初始化 GameObject
 *
 * @param {Object} opts 数据
 *
 * @api private
 * @memberOf GameObject
 */
GameObject.prototype.init = function( opts, node ){
	
	// 加载扩展脚本
	if( opts.scriptJS ){
		this.scriptJS = require( opts.scriptJS );
	}

	this.layer = cc.Layer.create();
	// 测试代码 带颜色背景的图层
	//this.layer = cc.LayerColor.create( cc.c4b( 255, 0, 0, 128 ), 100, 100 );
	this.layer.setPosition(cc.p( opts.x, opts.y ));
	
	// 默认layer 作为渲染层
	this.renderLayer = this.layer;

	// 遍历所有的组件
	for( var comp in opts.components ){
		
		this.addComponent( opts.components[ comp ] );
	}

	// 遍历所有的gameObject
	for( var obj in opts.gameobjects ){
		
		this.createGameObject( opts.gameobjects[ obj ] );
	}
	if( node ){
		node.addChild( this.layer, 1 );
	}
};

/**
 *  获取渲染节点.
 * 
 * @api private
 * @memberOf GameObject
 */
GameObject.prototype.getRenderNode = function(){
	
    return this.renderLayer;
};

/**
 *  设置渲染节点.
 *
 * @param {Object} node 渲染节点
 * 
 * @api private
 * @memberOf GameObject
 */
GameObject.prototype.setRenderNode = function( node ){
	if( node ){
		node.addChild( this.layer, 1 );
	}
};


/**
 *  添加component.
 *
 * @param {Object} opts 数据
 * 
 * @memberOf GameObject
 */
GameObject.prototype.addComponent = function( opt ){
	var comp = getComponent( opt.classname );
	if( !comp ){
		log( 'get component ERROR!' );
		return;
	}
	var target = this, key;
	for (key in comp) {
		if( key === 'init' ){
			continue;
		}
		else if( key === 'update' ){
			target.updateAry.push( comp[key] );
			continue;
		}
		target[key] = comp[key];
	}
	if (comp && "init" in comp) {
		comp.init.call( this, opt );
	}
};

/**
 *  添加gameObject.
 *
 * @param {Object} object 对象
 * 
 * @memberOf GameObject
 */
GameObject.prototype.addGameObject = function( object ){
	this.gameObjects[ object.name ] = object;
	object.setRenderNode( this.renderLayer );
	var target = this;
	target[ object.name ] = object;
};

/**
 *  创建gameObject.
 *
 * @param {Object} opts 数据
 * 
 * @memberOf GameObject
 */
GameObject.prototype.createGameObject = function( opt ){
	var object = gameObject.createObjectWithOpts( opt, this.renderLayer );
	this.gameObjects[ object.name ] = object;
	var target = this;
	target[ object.name ] = object;
	return object;
};

/**
 *  GameObject主循环
 *
 * @param {Object} dt 两帧之间的时间差
 *
 * @api private
 * @memberOf GameScene
 */
GameObject.prototype.update = function( dt ){

	for( key in this.updateAry ){
		if( 'function' === typeof this.updateAry[ key ] ){
			this.updateAry[ key ].call( this, dt );
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.update )
		{
			this.scriptJS.update( dt );
		}
	}
};

/**
 *  GameObject 设置隐藏
 *
 * @memberOf GameScene
 */
GameObject.prototype.setVisible = function( visble ){

    if( this.layer )
    {
        this.layer.setVisible( visble );
    }
};

/**
 *  GameObject 设置位置
 *
 * @memberOf GameScene
 */
GameObject.prototype.setPosition = function( position ){

    if( this.layer )
    {
        this.layer.setPosition( position );
    }
};

/**
 *  获取component.
 */
var getComponent = function( id ){
	if( components[ id ] )
	{
		return components[ id ];
	}
	components[ id ] = require( 'libs/component/' + id + '.js' );
	return components[ id ];
};


/**
 *  通过模版创建 object.
 *
 * @memberOf GameObject
 */
gameObject.createObjectWithTemplate = function( path, node ){
	var opts = require( path );
	var object = new GameObject( opts, node );
	return object;
};

/**
 *  通过配置信息创建 object.
 *
 * @memberOf GameObject
 */
gameObject.createObjectWithOpts = function( opts, node ){

	var object = new GameObject( opts, node );
	return object;
};
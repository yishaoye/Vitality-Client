
var winSize = require( 'libs/util/director.js' ).winSize;
var gameObject = require( 'libs/gameObject/gameObject.js' );
var ObjectType = require( 'libs/util/consts.js' ).ObjectType;
var EventType = require( 'libs/util/consts.js' ).EventType;
var uiSystem = require( 'libs/uiSystem/UISystem.js' );
var transitionsScene = require( 'libs/gameScene/transitionsScene.js' );


/**
 * 使用'opts'来创建一个场景对象.
 *
 * @param {Object} opts { scenename,  }
 * 
 * @memberOf GameScene
 */
var GameScene = function( opts ){

	// 当前场景
	this.scene = null;

	// 场景切换特效
	this.transition = null;

	// 事件响应层
	this.layer = null;

	// 场景名字
	this.sceneName = opts.scenename;

	// 切换场景时不删除
	this.retain = false;
	
	// 挂载Object
	this.gameObjects = {};

	// 逻辑控制
	this.scriptJS = null;
};

module.exports = GameScene;

/**
 * 初始化游戏场景
 *
 * @param {Object} opts 
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.init = function( opts ){

	var self = this;
	if( opts.scriptJS ){
		this.scriptJS = require( opts.scriptJS );
	}

	// 创建场景
	this.scene = cc.Scene.create();
	
	this.scene.onEnter = function(){
		self.onEnter();
	};
	this.scene.onExit = function(){
		self.onExit();
	};

	this.scene.scheduleUpdate();

	// 主循环
	this.scene.update = function( dt ){
		self.update( dt );
	};

	// 创建Touches事件层
	this.layer = cc.Layer.create();
	this.layer.setTouchEnabled( true );

	// 拖动事件响应
	this.layer.onTouchesMoved = function(touches, event) {
		self.onTouchesMoved(touches,event);
    };

	// 按下事件响应
	this.layer.onTouchesBegan = function(touches, event) {
		self.onTouchesBegan(touches, event);
	};

	// 抬起事件响应
	this.layer.onTouchesEnded = function(touches, event) {
		self.onTouchesEnded(touches, event);
	};

	// 取消事件响应
	this.layer.onTouchesCancelled = function(touches, event) {
		self.onTouchesCancelled(touches, event);
	};

	for( var obj in opts.gameobjects ){

		this.createGameObject( opts.gameobjects[ obj ] );
	}

	this.scene.addChild( this.layer, 0 );

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.init )
		{
			this.scriptJS.init.call( this, opts );
		}
	}
	// 创建切换特效
	if( opts.transition ){
		this.transition = transitionsScene.createTransition[ opts.transition ]( opts.transitionTime, this.scene);
	}
};

/**
 *  场景主循环
 *
 * @param {Object} dt 两帧之间的时间差
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.update = function( dt ){
	// UI 事件
	uiSystem.update( dt );

	for( var key in this.gameObjects ){
		if( 'function' === typeof this.gameObjects[ key ].update ){
			this.gameObjects[key].update( dt );
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.update )
		{
			this.scriptJS.update.call( this, dt );
		}
	}
};

/**
 *  拖动事件响应
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onTouchesMoved = function(touches, event){
	// UI 事件
	if( uiSystem.onTouchMoved_COCOS( touches ) ){
		return;
	}
	
	// gameObject 事件
	for( var key in this.gameObjects ){
		if( 'function' === typeof this.gameObjects[ key ].onTouchesMoved ){
			this.gameObjects[key].onTouchesMoved(touches, event);
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesMoved )
		{
			this.scriptJS.onTouchesMoved(touches, event);
		}
	}
};

/**
 *  按下事件响应
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onTouchesBegan = function(touches, event){
	// UI 事件
	if( uiSystem.onTouchPressed_COCOS( touches ) ){
		return;
	}

	// gameObject 事件
	for( var key in this.gameObjects ){
		if( 'function' === typeof this.gameObjects[ key ].onTouchesBegan ){
			this.gameObjects[key].onTouchesBegan(touches, event);
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesBegan )
		{
			this.scriptJS.onTouchesBegan.call(this,touches, event);
		}
	}
};

/**
 *  抬起事件响应
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onTouchesEnded = function(touches, event){
	// UI 事件
	if( uiSystem.onTouchReleased_COCOS( touches ) ){
		return;
	}

	// gameObject 事件
	for( var key in this.gameObjects ){
		if( 'function' === typeof this.gameObjects[ key ].onTouchesEnded ){
			this.gameObjects[key].onTouchesEnded(touches, event);
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesEnded )
		{
			this.scriptJS.onTouchesEnded.call( this, touches, event );
		}
	}
};

/**
 *  取消事件响应
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onTouchesCancelled = function(touches, event){
	// UI 事件
	if( uiSystem.onTouchCanceled_COCOS( touches ) ){
		return;
	}
	
	// gameObject 事件
	for( var key in this.gameObjects ){
		if( 'function' === typeof this.gameObjects[ key ].onTouchesCancelled ){
			this.gameObjects[key].onTouchesCancelled(touches, event);
		}
	}

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onTouchesCancelled )
		{
			this.scriptJS.onTouchesCancelled.call( this, touches, event );
		}
	}
};

/**
 *  进入场景事件
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onEnter = function(){

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onEnter )
		{
			this.scriptJS.onEnter.call( this );
		}
	}
};

/**
 *  退出场景事件
 *
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.onExit = function(){

	if( this.scriptJS )
	{
		if( 'function' === typeof this.scriptJS.onExit )
		{
			this.scriptJS.onExit.call( this );
		}
	}
};

/**
 *  添加gameObject.
 *
 * @param {Object} object 对象
 * 
 * @memberOf GameScene
 */
GameScene.prototype.addGameObject = function( object ){
	this.gameObjects[ object.name ] = object;
	object.setRenderNode( this.scene );
	var target = this;
	target[ object.name ] = object;
};

/**
 *  创建gameObject.
 *
 * @param {Object} opts 数据
 * 
 * @memberOf GameScene
 */
GameScene.prototype.createGameObject = function( opt ){
	var object = gameObject.createObjectWithOpts( opt, this.scene );
	this.gameObjects[ object.name ] = object;
	var target = this;
	target[ object.name ] = object;
	return object;
};

/**
 *  创建gameObject.
 *
 * @param {Object} opts 数据
 * 
 * @api private
 * @memberOf GameScene
 */
GameScene.prototype.getScene = function(){
	if( this.transition ){
		return this.transition;
	}
	return this.scene;
};
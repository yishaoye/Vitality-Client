
var GameScene = require( 'libs/gameScene/gameScene.js' );
var director = require( 'libs/util/director.js' ).director;
var uiSystem = require( 'libs/uiSystem/UISystem.js' );


/**
 * game prototype.
 *
 * @module
 */
var game = module.exports = {};

/**
 * 场景管理器.
 */
var gameScenes = {};
/**
 * 场景配置信息管理器.
 */
var sceneOptsAry = {};
/**
 * 游戏当前场景.
 */
var curScene = null;


/**
 * 初始化游戏框架.
 *
 * @memberOf game
 */
game.init = function(){
	uiSystem.init();
};

/**
 * 启动游戏框架.
 *
 * @memberOf game
 */
game.start = function(){
	if( !curScene ){
		for( var key in sceneOptsAry ){
			curScene = key;
			break;
		}
	}
	this.replaceScene( curScene );
};

/**
 * Load Configure json file to settings.
 *
 * @param {String} type 类型. 'json' 'opts'
 * @param {String|Object} val json文件路径 或者 配置信息
 * @param {Boolean} main 第一个启动场景.
 * 
 * @memberOf game
 */
game.configure = function( type, val, main ){
	var opts = {};
	switch( type )
	{
		case 'json':
		{
			opts = require( val );
		}break;
		case 'opts':
		{
			opts = val;
		}break;
		default:
			print( 'configure type ERROR [' + type + ']' );
		return;
	}
	if( opts.scenename ){
		sceneOptsAry[ opts.scenename ] = opts;
		if( main ){
			curScene = opts.scenename;
			this.createSceneWithOpts( opts );	
		}
	}
	else{
		print( 'configure scene name ERROR! ' + opts.scenename );
	}
};

/**
 * 通过json文件创建场景.
 *
 * @param {String} json json文件路径.
 * @return {String} sceneName.
 * 
 * @memberOf game
 */
game.createSceneWithJson = function( json ){
	var opts = require( json );
	var scene = new GameScene( opts );
	game.addScene( scene );
	scene.init( opts );
	return opts.scenename;
};

/**
 * 通过配置信息创建场景
 *
 * @param {Object} opts 配置信息.
 * @return {String} sceneName.
 * 
 * @memberOf game
 */
game.createSceneWithOpts = function( opts ){
	var scene = new GameScene( opts );
	game.addScene( scene );
	scene.init( opts );
	return opts.scenename;
};

/**
 * 添加场景到管理器中.
 *
 * @api private
 * @memberOf game
 */
game.addScene = function( scene ){
	if( scene && scene.sceneName ){
		gameScenes[ scene.sceneName ] = scene;
	}
};

/**
 * 切换游戏场景
 *
 * @param {String} sceneName 场景名字.
 * 
 * @memberOf game
 */
game.replaceScene = function( sceneName ){
	// 查找场景管理器中是否存在此场景
	if ( !gameScenes.hasOwnProperty( sceneName ) )
	{
		// 查找场景配置信息中是否存在此场景信息
		if( sceneOptsAry.hasOwnProperty( sceneName ) ){
			var opts = sceneOptsAry[ sceneName ];
			this.createSceneWithOpts( opts );
		}
		else{
			print( 'replaceScene error! [' + sceneName + '] scene undefined' );
		}
	}
	var scene = gameScenes[ sceneName ];
	if( scene ){
		var runningScene = director.getRunningScene();
		if (runningScene === null){
			director.runWithScene( scene.scene );
		}
		else{
			director.replaceScene( scene.getScene() );
		}
		curScene = sceneName;
	}
};

/**
 * 获取场景控制器
 *
 * @memberOf game
 */
game.scenes = function(){
	return gameScenes;
};

/**
 * 获取当前场景控制器
 *
 * @memberOf game
 */
game.getCurScene = function(){
	return gameScenes[ curScene ];
};



var director = require( 'libs/util/director.js' ).director;
var game = require( 'libs/game.js' );
var STGame = require( 'samples/standardTetris/js/stGame.js' );

var stScene = module.exports = {};

var mSTGame = null;
/**
 * Scene初始化
 * 
 * @memberOf stScene
 */
stScene.init = function( opts ){
	mSTGame = new STGame();
	mSTGame.setObject( this.board );
};

var percent = 0;
/**
 * Scene循环
 * 
 * @memberOf stScene
 */
stScene.update = function( dt ){
	
	mSTGame.conditionalAdvanceGameTimeByDelta( dt );


	var gameSpeed = 0;
	gameSpeed = mSTGame.getGameSpeedAdjustment();

	if (gameSpeed <= 2)
	{
		// Perform any unforced game iteration.
		mSTGame.conditionalAdvanceGameIteration( 0 );
	}
	else
	{
		var totalIncrements = 8 * gameSpeed;
		var incrementCounter = 0;
		for ( incrementCounter = 0;
			incrementCounter < totalIncrements;
			incrementCounter++ )
		{
			mSTGame.conditionalAdvanceGameIteration( 1 );
		}
	}
};

/**
 * 进入场景
 * 
 * @memberOf stScene
 */
stScene.onEnter = function(){
	
};

/**
 * 退出场景
 * 
 * @memberOf stScene
 */
stScene.onExit = function(){

};

/**
 * ←按钮
 * 
 * @memberOf stScene
 */
stScene.leftButtonDown = function( wiget ){

	log( 'left button' );
	mSTGame.inputEvent_Left();
};

/**
 * →按钮
 * 
 * @memberOf stScene
 */
stScene.rightButtonDown = function( wiget ){

	log( 'right button' );
	mSTGame.inputEvent_Right();
};

/**
 * ↑按钮
 * 
 * @memberOf stScene
 */
stScene.upButtonDown = function( wiget ){

	log( 'up button' );
	mSTGame.inputEvent_Rotate();
};

/**
 * ↓按钮
 * 
 * @memberOf stScene
 */
stScene.downButtonDown = function( wiget ){

	log( 'down button' );
	mSTGame.inputEvent_Drop();
};

/**
 * 重置按钮
 * 
 * @memberOf stScene
 */
stScene.resetButtonDown = function( wiget ){

	log( 'reset button' );
	mSTGame.inputEvent_Reset();
};

/**
 * ai 选中
 * 
 * @memberOf stScene
 */
stScene.aiSelected = function( wiget ){

	log( 'aiSelected' );
    mSTGame.inputEvent_AIStart();
};

/**
 * ai 取消
 * 
 * @memberOf stScene
 */
stScene.aiUnSelected = function( wiget ){

	log( 'aiUnSelected' );
    mSTGame.inputEvent_AIStop();
};
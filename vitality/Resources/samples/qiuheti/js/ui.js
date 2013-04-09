


var curScene = require( 'libs/game.js' ).getCurScene();

var uiEvent = module.exports = {};


/**
 * arrow 按钮 按下事件
 * 
 * @memberOf uiEvent
 */
uiEvent.arrowButtonDown = function( wigt ){


};

var animations = [
	'None',
	'run',
	'ag',
	'nt',
	'ty',
	'yh'
];

var slot = 0;
/**
 * arrow 按钮 抬起事件
 * 
 * @memberOf uiEvent
 */
uiEvent.arrowButtonUp = function( wigt ){
	log( '1111' );
	slot++;
	if ( slot >= animations.length )
	{
		slot = 0;
	}
	var maoSprite = curScene.mao;
	maoSprite.runAnimations( animations[ slot ] );

};

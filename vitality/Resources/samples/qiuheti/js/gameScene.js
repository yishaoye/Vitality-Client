

var director = require( 'libs/util/director.js' ).director;
var game = require( 'libs/game.js' );

var qiuheti = module.exports = {};

var curScene = null;
var maoSprite = null;


/**
 * arrow 按钮 按下事件
 * 
 * @memberOf loginScene
 */
qiuheti.init = function( opts ){
	curScene = this;
	maoSprite = this.mao;
};


qiuheti.onTouchesBegan = function(touches, event){

	log( touches[0].getLocation().x );
	log( touches[0].getLocation().y );

	maoSprite.setAnimationPosition( touches[0].getLocation() );
};




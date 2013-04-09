
var curScene = require( 'libs/game.js' ).getCurScene();
var GUIScene = require( 'samples/GUI/js/GUIScene.js' );

/**
 * 主界面 UI 事件响应
 * 
 * @memberOf mainUI
 */
var mainUI = module.exports = {};



/**
 * 地图按钮
 * 
 * @memberOf mainUI
 */

 mainUI.mapButtonUp = function( widget ){

    log( ' 主界面 地图' );
    GUIScene.changeUI( 'mapObject', 'mainObject' );
 };

 /**
 * 好友按钮
 * 
 * @memberOf mainUI
 */

 mainUI.friendButtonUp = function( widget ){

    log( ' 主界面 好友' );
    GUIScene.changeUI( 'friendObject', 'mainObject' );
 };

 /**
 * 卡片按钮
 * 
 * @memberOf mainUI
 */

 mainUI.cardButtonUp = function( widget ){

    log( ' 主界面 卡片' );

 };

 /**
 * 商城按钮
 * 
 * @memberOf mainUI
 */

 mainUI.shopButtonUp = function( widget ){

    log( ' 主界面 商城' );

 };

 /**
 * 菜单按钮
 * 
 * @memberOf mainUI
 */

 mainUI.menuButtonUp = function( widget ){

    log( ' 主界面 菜单' );

 };
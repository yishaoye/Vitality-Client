var uiSystem = require( 'libs/uiSystem/UISystem.js' );
var curScene = require( 'libs/game.js' ).getCurScene();
var GUIScene = require( 'samples/GUI/js/GUIScene.js' );

/**
 * 地图界面 UI 事件响应
 * 
 * @memberOf mapUI
 */
 var mapUI = module.exports = {};

 /**
 * 返回按钮
 * 
 * @memberOf mapUI
 */

 mapUI.returnButtonUp = function( widget ){

    log( ' 地图界面 返回' );
    GUIScene.changeUI( 'mainObject', 'mapObject' );
 };



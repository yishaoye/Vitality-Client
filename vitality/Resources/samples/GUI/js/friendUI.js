
var uiSystem = require( 'libs/uiSystem/UISystem.js' );
var curScene = require( 'libs/game.js' ).getCurScene();
var GUIScene = require( 'samples/GUI/js/GUIScene.js' );
var friendInfo = require( 'samples/GUI/json/friendInfo.json' );

/**
 * 好友界面 UI 事件响应
 * 
 * @memberOf friendUI
 */
var friendUI = module.exports = {};

var friendObject = null;

friendUI.addFriendInfo = function( info ){
    if( !friendObject )
    {
        friendObject = curScene.friendObject;
        //log( JSON.stringify( curScene ) );
    }
    var widget = uiSystem.createWidget(friendObject.friendList, friendInfo );
//    friendObject.friendList.pushItem( widget );

};


/**
 * 返回按钮
 * 
 * @memberOf friendUI
 */

 friendUI.returnButtonUp = function( widget ){

    log( ' 好友界面 返回' );
    GUIScene.changeUI( 'mainObject', 'friendObject' );
 };

 /**
 * 邀请按钮
 * 
 * @memberOf friendUI
 */

 friendUI.inviteButtonUp = function( widget ){

    log( ' 好友界面 邀请' );
    friendObject.friendList.removeAllChildrenAndCleanUp();
 };

 /**
 * 添加按钮
 * 
 * @memberOf friendUI
 */

 friendUI.addButtonUp = function( widget ){

    log( ' 好友界面 添加' );
    friendUI.addFriendInfo();
 };

 /**
 * 通知按钮
 * 
 * @memberOf friendUI
 */

 friendUI.informButtonUp = function( widget ){

    log( ' 好友界面 通知' );
 };

 /**
 * 解除按钮
 * 
 * @memberOf friendUI
 */ 

 friendUI.deleteButtonUp = function( widget ){

    log( ' 好友界面 解除' );
 };


var winSize = require( 'libs/util/director.js' ).winSize;

var GUIScene = module.exports = {};

var curScne = null;

/**
 * Scene初始化
 * 
 * @memberOf GUIScene
 */
GUIScene.init = function( opts ){

    curScene = this;

    // 初始化main界面
    var mainUIJson = require( 'samples/GUI/json/mainUI.json' );
    var mainObject = this.createGameObject( mainUIJson );
    mainObject.setPosition( { x: winSize.width / 2, y: winSize.height / 2 } );


    // 初始化好友界面
    var friendUIJson = require( 'samples/GUI/json/friendUI.json' );
    var friendObject = this.createGameObject( friendUIJson );
    friendObject.setPosition( { x: winSize.width / 2, y: winSize.height / 2 + winSize.height } );
    friendObject.setVisible( false );

    // 初始化地图界面
    var mapUIJson = require( 'samples/GUI/json/mapUI.json' );
    var mapObject = this.createGameObject( mapUIJson );
    mapObject.setPosition( { x: winSize.width / 2, y: winSize.height / 2 + winSize.height } );
    mapObject.setVisible( false );


    //GUIScene.changeUI( 'mapObject', 'mainObject' );
};


/**
 * Scene循环
 * 
 * @memberOf GUIScene
 */
GUIScene.update = function( dt ){


};

/**
 * 切换UI界面
 * 
 * @memberOf GUIScene
 */
GUIScene.changeUI = function( ui, current ){

    curScene[ ui ].setVisible( true );
    curScene[ ui ].setPosition( { x: winSize.width / 2, y: winSize.height / 2 } );

    curScene[ current ].setVisible( false );
    curScene[ current ].setPosition( { x: winSize.width / 2, y: winSize.height / 2 + winSize.height } );
};


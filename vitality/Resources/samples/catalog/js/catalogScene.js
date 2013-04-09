
var director = require( 'libs/util/director.js' ).director;
var game = require( 'libs/game.js' );

var catalogScene = module.exports = {};

/**
 * Scene初始化
 * 
 * @memberOf catalogScene
 */
catalogScene.init = function( opts ){
    var catalogs = require( 'samples/catalog/json/catalog.json' );
    var iconButton = require( 'samples/catalog/json/iconButton.json' );
    var count = 0;
    var pos_x = 100;
    var pos_y = 820;
    for( var i in catalogs )
    {
        var catalog = catalogs[ i ];
        iconButton.name = catalog.name;
        iconButton.x = pos_x + parseInt( count % 4 ) * 145;
        iconButton.y = pos_y - parseInt( count / 4 ) * 230;
        var object = this.createGameObject( iconButton );
        object.button.setTextures( catalog.normal, catalog.pressed, catalog.disabled );
        object.label.setText( catalog.text );
        count++;
        game.configure( 'json', catalog.sceneJson );
        object.button.scene = catalog.scene;
    }
    log( ' catalogScene.init ' );
};




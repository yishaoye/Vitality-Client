
require( 'jsb/jsb.js' );
var game = require( 'libs/game.js' );


game.init();

game.configure( 'json', 'samples/catalog/json/catalogScene.json', true );

//game.configure( 'json', 'samples/qiuheti/json/qiuheti.json' );
//
//game.configure( 'json', 'samples/standardTetris/json/standardTetris.json' );

//game.configure( 'json', 'samples/GUI/json/GUIScene.json', true );

game.configure( 'json', 'samples/tileMaps/json/city_Scene.json', true );


game.start();



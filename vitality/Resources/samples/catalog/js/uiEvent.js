
var game = require( 'libs/game.js' );



var uiEvent = module.exports = {};


uiEvent.buttonDown = function( wiget ){


};

uiEvent.buttonUp = function( wiget ){
    log( 'Button up  ' + wiget.scene );
    game.replaceScene( wiget.scene );
};

